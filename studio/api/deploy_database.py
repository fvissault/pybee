"""Déploiement autonome du SQL généré par ModelStudio (MySQL / PostgreSQL)."""
import argparse
import json
import os
import re
from pathlib import Path


def prepare_schema(sql_text, type_db):
    import sqlparse
    if not isinstance(sql_text, str) or not sql_text.strip():
        raise ValueError("SQL vide")
    statements = sqlparse.split(sql_text.strip().lstrip("\ufeff"))
    token = r'`(?:``|[^`])+`' if type_db == "mysql" else r'"(?:""|[^"])+"'
    tables = []
    for statement in statements:
        match = re.match(r'^CREATE\s+TABLE\s+(' + token + r')\s*\(', statement, re.I)
        if match:
            quoted = match.group(1)
            tables.append(quoted[1:-1].replace(quoted[0] * 2, quoted[0]))
        elif not re.match(r'^(CREATE\s+INDEX|ALTER\s+TABLE|COMMENT\s+ON\s+COLUMN)\s', statement, re.I):
            raise ValueError("Utilisez uniquement le schéma produit par generationModel")
    if not tables or len(set(tables)) != len(tables):
        raise ValueError("Tables absentes ou dupliquées dans le SQL")
    return statements, tables


def execute_model_sql(type_db, connection_config, sql_text, mode="install"):
    """install : crée sans supprimer. rebuild : remplace les tables du SQL."""
    connection = None
    completed = 0
    database_created = False
    rolled_back = False
    step = "validation"
    mysql = False
    try:
        type_db = str(type_db).lower()
        if type_db not in ("mysql", "pgsql"):
            raise ValueError("Type attendu : mysql ou pgsql")
        mysql = type_db == "mysql"
        if mode not in ("install", "rebuild"):
            raise ValueError("Mode attendu : install ou rebuild")
        config = dict(connection_config)
        database = config["database"]
        protected = {"mysql", "sys", "information_schema", "performance_schema",
                     "postgres", "template0", "template1", "beetle_studio"}
        protected.update(str(n).lower() for n in config.get("protected_databases", []))
        if not isinstance(database, str) or database.lower() in protected:
            raise ValueError("Base cible invalide ou protégée")
        port = int(config.get("port", 3306 if mysql else 5432))
        if not 1 <= port <= 65535:
            raise ValueError("Port invalide")
        password = config.get("password", "")
        if config.get("password_env"):
            password = os.environ[config["password_env"]]
        common = dict(host=config["host"], port=port, user=config["user"], password=password)
        timeout = int(config.get("connect_timeout", 10))

        def quote(name):
            if not isinstance(name, str) or not name or any(ord(c) < 32 for c in name):
                raise ValueError("Identifiant invalide")
            if len(name.encode("utf8")) > (64 if mysql else 63):
                raise ValueError("Identifiant trop long : " + name)
            delimiter = "`" if mysql else '"'
            return delimiter + name.replace(delimiter, delimiter * 2) + delimiter

        quoted_database = quote(database)
        statements, tables = prepare_schema(sql_text, type_db)
        quoted_tables = [quote(name) for name in tables]
        step = "connexion"
        if mysql:
            import mysql.connector
            # Options natives du connecteur : ssl_ca, ssl_cert, ssl_key, etc.
            options = {key: config[key] for key in (
                "ssl_ca", "ssl_cert", "ssl_key", "ssl_verify_cert",
                "ssl_verify_identity", "ssl_disabled") if key in config}
            connection = mysql.connector.connect(
                **common, **options, charset="utf8mb4",
                connection_timeout=timeout, autocommit=True)
            with connection.cursor() as target:
                step = "création de la base"
                if config.get("create_database", True):
                    target.execute("SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=%s", (database,))
                    absent = target.fetchone() is None
                    target.execute("CREATE DATABASE IF NOT EXISTS " + quoted_database + " DEFAULT CHARACTER SET utf8mb4")
                    database_created = absent
                target.execute("USE " + quoted_database)
                # En installation, refuse toute table existante AVANT le premier CREATE.
                target.execute("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=%s", (database,))
                existing = {row[0].lower() for row in target.fetchall()}
                if mode == "install" and any(name.lower() in existing for name in tables):
                    raise ValueError("Des tables existent déjà. Utilisez une migration ou le mode rebuild.")
                if mode == "rebuild":
                    step = "suppression des tables"
                    target.execute("""SELECT TABLE_SCHEMA, TABLE_NAME, REFERENCED_TABLE_NAME
                        FROM information_schema.KEY_COLUMN_USAGE
                        WHERE REFERENCED_TABLE_SCHEMA=%s AND REFERENCED_TABLE_NAME IS NOT NULL""", (database,))
                    table_keys = {n.lower() for n in tables}
                    for schema, table, referenced in target.fetchall():
                        if referenced.lower() in table_keys and (schema.lower() != database.lower() or table.lower() not in table_keys):
                            raise ValueError("Une table extérieure au modèle référence " + referenced)
                    target.execute("SELECT @@SESSION.FOREIGN_KEY_CHECKS")
                    previous = int(target.fetchone()[0])
                    try:
                        target.execute("SET SESSION FOREIGN_KEY_CHECKS=0")
                        target.execute("DROP TABLE IF EXISTS " + ", ".join(quoted_tables))
                    finally:
                        target.execute("SET SESSION FOREIGN_KEY_CHECKS=" + str(previous))
                for number, statement in enumerate(statements, 1):
                    step = "requête " + str(number)
                    target.execute(statement)
                    completed += 1
        else:
            import psycopg
            from psycopg import sql
            options = {key: config[key] for key in (
                "sslmode", "sslrootcert", "sslcert", "sslkey") if key in config}
            step = "création de la base"
            if config.get("create_database", True):
                with psycopg.connect(**common, **options,
                                     dbname=config.get("maintenance_database", "postgres"),
                                     autocommit=True, connect_timeout=timeout) as admin:
                    with admin.cursor() as target:
                        target.execute("SELECT 1 FROM pg_database WHERE datname=%s", (database,))
                        if target.fetchone() is None:
                            try:
                                target.execute(sql.SQL("CREATE DATABASE {} TEMPLATE template0 ENCODING 'UTF8'").format(sql.Identifier(database)))
                                database_created = True
                            except psycopg.errors.DuplicateDatabase:
                                pass
            connection = psycopg.connect(**common, **options, dbname=database,
                                         connect_timeout=timeout, autocommit=True)
            schema = config.get("schema", "public")
            quote(schema)
            with connection.transaction():
                with connection.cursor() as target:
                    # Tous les noms non qualifiés du SQL ciblent ce schéma.
                    target.execute(sql.SQL("SET LOCAL search_path TO {}").format(sql.Identifier(schema)))
                    target.execute(sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(sql.Identifier(schema)))
                    if mode == "install":
                        target.execute("SELECT tablename FROM pg_tables WHERE schemaname=%s", (schema,))
                        existing = {row[0] for row in target.fetchall()}
                        if any(name in existing for name in tables):
                            raise ValueError("Des tables existent déjà. Utilisez une migration ou le mode rebuild.")
                    else:
                        step = "suppression des tables"
                        # Pas de CASCADE : les dépendances extérieures bloquent le DROP.
                        target.execute("DROP TABLE IF EXISTS " + ", ".join(quoted_tables))
                    for number, statement in enumerate(statements, 1):
                        step = "requête " + str(number)
                        target.execute(statement)
                        completed += 1
            # Transaction validée à la sortie du bloc.
        return {"status": "ok", "database": database, "mode": mode,
                "database_created": database_created, "executed": completed}
    except Exception as error:
        # Le contexte psycopg a déjà annulé la transaction sur exception.
        rolled_back = not mysql and connection is not None
        return {"status": "ko", "message": str(error), "step": step,
                "database_created": database_created,
                "executed_before_error": completed, "schema_rolled_back": rolled_back}
    finally:
        if connection is not None:
            connection.close()


def main():
    parser = argparse.ArgumentParser(description="Déployer un schéma ModelStudio")
    parser.add_argument("--config", required=True, help="Fichier JSON de connexion")
    parser.add_argument("--sql", required=True, help="SQL généré pour le moteur cible")
    parser.add_argument("--mode", choices=("install", "rebuild"), default="install")
    args = parser.parse_args()
    try:
        config = json.loads(Path(args.config).read_text(encoding="utf-8-sig"))
        sql_text = Path(args.sql).read_text(encoding="utf-8-sig")
        result = execute_model_sql(config["type"], config, sql_text, args.mode)
    except Exception as error:
        result = {"status": "ko", "message": str(error), "step": "lecture des fichiers"}
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result["status"] == "ok" else 1


if __name__ == "__main__":
    raise SystemExit(main())
