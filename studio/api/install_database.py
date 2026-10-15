import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Installer la base puis nettoyer deployment"
    )

    parser.add_argument(
        "--keep",
        action="store_true",
        help="Conserver le répertoire après installation"
    )

    args = parser.parse_args()

    deployment = Path(__file__).resolve().parent

    # Limite la suppression au répertoire prévu.
    if deployment.name != "deployment":
        print("Ce fichier doit être placé dans un dossier deployment.")
        return 1

    required_files = [
        "deploy_database.py",
        "database.json",
        "schema.sql"
    ]

    for filename in required_files:
        if not (deployment / filename).is_file():
            print(f"Fichier manquant : {filename}")
            return 1

    result = subprocess.run(
        [
            sys.executable,
            str(deployment / "deploy_database.py"),
            "--config",
            str(deployment / "database.json"),
            "--sql",
            str(deployment / "schema.sql"),
            "--mode",
            "install"
        ],
        cwd=deployment
    )

    if result.returncode != 0:
        print("Installation échouée : répertoire conservé.")
        return result.returncode

    if args.keep:
        print("Installation réussie : répertoire conservé.")
        return 0

    # Sort du dossier avant de le supprimer, notamment sous Windows.
    import os
    os.chdir(deployment.parent)

    try:
        shutil.rmtree(deployment)
    except OSError as error:
        print(
            "Installation réussie, mais nettoyage impossible : "
            + str(error)
        )
        return 2

    print("Installation réussie : répertoire deployment supprimé.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())