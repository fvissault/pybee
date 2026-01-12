from packages.errors.core_errors import core_errors
from packages.errors.db_errors import db_errors
from packages.base_module import base_module
from packages.help.db_help import db_help
import mysql.connector
import psycopg2
from psycopg2 import sql

class db(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            '?connect' : self.isconnect_instr,
            'connect' : self.connect_instr,
            'disconnect' : self.disconnect_instr,
            '?close' : self.isclose_instr,
            'close' : self.close_instr,
            'hostname' : 'localhost',
            'dbname' : '',
            'username' : 'root',
            'userpass' : '',
            'dbconf' : self.param_instr,
            'use' : self.use_instr,
            '|create>' : self.create_instr,
            '|show>' : self.show_instr,
            '|select>' : self.select_instr,
            '|insert>' : self.insert_instr,
            '|update>' : self.update_instr,
            '|delete>' : self.delete_instr,
            '|drop>' : self.drop_instr,
            '|truncate>' : self.truncate_instr,
            '|alter>' : self.alter_instr,
            '>|' : self.endreq_instr,
            'chooseengine' : self.chooseeng_instr,
            'engine?' : self.eng_instr,
            #*********************************
            # "hostname" "username" "userpass" dbcred
            'dbcred' : '''    userpass ! username ! hostname !''',
            #*********************************
            'createdb' : '''    local dbname 
    "|create> database <#0#> charset utf8mb3 >|" [ dbname @ ] format evaluate''',
            #*********************************
            'dropdb' : '''    local dbname 
    "|drop> database <#0#> >|" [ dbname @ ] format evaluate''',
            #*********************************
            'createtab' : '''    local tabname 
    "|create> table <#0#> charset utf8mb3 engine InnoDB >|" [ tabname @ ] format evaluate''',
            #*********************************
            # "tablename" [ "`colname1` coldef1" "`colname2` coldef2" ... ] addcolumns
            'addcolumns' : '''    local columns 
    local tabname 
    "|alter> table <#0#> " [ tabname @ ] format local req 
    0 local i 
    0 local col 
    columns @ cells i 
    do 
        i @ 0 > 
        if 
            req @ ", " s+ req ! 
        then 
        columns @ i @ cell@ col ! 
        tabname @ desctab col @ 1 cell@ fexists invert 
        if 
            req @ "add `<#0#>` <#1#>" [ col @ 0 cell@ col @ 1 cell@ ] format s+ req ! 
        then 
    loop 
    req @ " >|" s+ req ! 
    req @ "add" scan 
    if 
        req @ evaluate 
    then''',
            #*********************************
            'addforeignkey' : '''    local cascade 
    local origtabname 
    local desttabname 
    "|alter> table <#0#> add constraint fk_<#0#>_<#1#> foreign key (id_<#1#>) references <#1#>(id)" [ desttabname @ origtabname @ ] format local req 
    "delete" cascade @ scan 
    if 
        req @ " on delete cascade" s+ req ! 
    then 
    "update" cascade @ scan 
    if 
        req @ " on update cascade" s+ req ! 
    then 
    req @ " >|" s+ req ! 
    req @ evaluate''',
            #*********************************
            # "tablename" "index" [ "nomindex" "columnsindex" ] addkey
            # "tablename" "key|unique" "columnname" addkey
            'addkey' : '''    local columns 
    local type 
    local tabname 
    "|alter> table <#0#> add " [ tabname @ ] format local req 
    "index" type @ = 
    if 
        columns @ 0 cell@ local indexname 
        columns @ 1 cell@ local cols 
        req @ "index <#0#> (<#1#>) >|" [ indexname @ cols @ ] format s+ req ! 
        req @ evaluate 
    then 
    "key" type @ = 
    if 
        req @ "primary key (<#0#>) >|" [ columns @ ] format s+ req ! 
        req @ evaluate 
    then 
    "unique" type @ = 
    if 
        req @ "unique (<#0#>) >|" [ columns @ ] format s+ req ! 
        req @ evaluate 
    then''',
            #*********************************
            # "tablename" "oldcolumnname" "newcolumnname" "newcolumndef" changecol
            'changecol' : '''    local newtype 
    local newname 
    local oldname 
    local tabname 
    "|alter> table <#0#> change <#1#> <#2#> <#3#> >|" [ tabname @ oldname @ newname @ newtype @ ] format evaluate''',
            'desctab' : '''    local tabname 
    "|show> fields from <#0#> >|" [ tabname @ ] format evaluate''',
            'fexists' : '''    local field 
    local fieldslist 
    0 local i 
    0 local rep 
    fieldslist @ cells i 
    do 
        fieldslist @ i @ cell@ "Field" cell@ field @ = 
        if 
            1 rep ! 
        then 
    loop 
    rep @''',
            #*********************************
            'descdb' : '''    local dbname 
    "|show> tables from <#0#> >|" [ dbname @ ] format evaluate''',
            #*********************************
            # "tablename" desctab flist -> [ 'id', 'field1', ... ]
            'flist' : '''    local fieldslist 
    0 local ifl 
    [ ] local rep 
    fieldslist @ cells ifl 
    do 
        fieldslist @ ifl @ cell@ "Field" cell@ rep cell+ 
    loop 
    rep @''',
            #*********************************
            # "tablename" desctab flist fjoin -> "(field1,field2,...)"
            'fjoin' : '''    local fieldslist
    0 local ifj 
    "(" local rep 
    0 local tmp 
    fieldslist @ cells ifj 
    do 
        fieldslist @ ifj @ cell@ tmp ! 
        "id" tmp @ <> 
        if 
            ifj @ 1 > 
            if 
                rep @ "," s+ rep ! 
            then 
            rep @ tmp @ s+ rep !
        then 
    loop 
    rep @ ")" s+''',
            #*********************************
            'add1record' : '''    local record 
    local tabname 
    0 local tmp 
    tabname @ desctab flist fjoin local fieldsnamelist 
    "|insert> <#0#> <#1#> values (" [ tabname @ fieldsnamelist @ ] format local req 
    0 local i 
    record @ cells i 
    do 
        i @ 0 > 
        if 
            req @ "," s+ req ! 
        then 
        record @ i @ cell@ tmp ! 
        tmp @ ?int 
        if 
            req @ tmp @ s+ req ! 
        else 
            req @ "'" tmp @ s+ "'" s+ s+ req ! 
        then 
    loop 
    req @ ") >|" s+ req ! 
    req @ evaluate''',
            #*********************************
            'addrecords' : '''    local records 
    local tabname 
    [ ] local rec 
    0 local tmp 
    tabname @ desctab flist fjoin local fieldsnamelist
    "|insert> <#0#> <#1#> values " [ tabname @ fieldsnamelist @ ] format local req 
    0 local i 
    0 local j 
    records @ cells i 
    do 
        i @ 0 > 
        if 
            req @ "," s+ req ! 
        then 
        req @ "(" s+ req ! 
        records @ i @ cell@ rec ! 
        0 j ! 
        rec @ cells j 
        do 
            j @ 0 > 
            if 
                req @ "," s+ req ! 
            then 
            rec @ j @ cell@ tmp ! 
            tmp @ ?int 
            if 
                req @ tmp @ s+ req ! 
            else 
                req @ "'" tmp @ s+ "'" s+ s+ req ! 
            then 
        loop 
        req @ ")" s+ req ! 
    loop 
    req @ " >|" s+ req ! 
    req @ evaluate''',
            #*********************************
            'updaterecord' : '''    local wherecond 
    local coltoupdate 
    local tablename
    "|update> <#0#> set <#1#> where <#2#> >|" [ tablename @ coltoupdate @ wherecond @ ] format evaluate''',
            #*********************************
            'deleterecord' : '''    local wherecond
    local tablename
    "|delete> <#0#> where <#1#> >|" [ tablename @ wherecond @ ] format evaluate''',
            #*********************************
            'selectrecord' : '''    local wherecond
    local coltoselect
    local tablename
    "|select> <#0#> from <#1#> where <#2#> >|" [ coltoselect @ tablename @ wherecond @ ] format evaluate''',
            #*********************************
            'droptable' : '''    local tablename 
    "|drop> table <#0#> >|" [ tablename @ ] format evaluate''',
            #*********************************
            'dropuser' : '''    local username 
    "|drop> user <#0#> >|" [ username @ ] format evaluate''',
            #*********************************
            'trunctable' : '''   local tablename 
    "|truncate> <#0#> >|" [ tablename @ ] format evaluate'''
        }

        self.engine = 'mysql'
        self.db = None
        self.cursor = None
        self.help = db_help(interpreter.output)
        self.interpreter.core_instr.variables.append('hostname')
        self.interpreter.core_instr.variables.append('dbname')
        self.interpreter.core_instr.variables.append('username')
        self.interpreter.core_instr.variables.append('userpass')
        self.version = 'v0.7.5'

    def err(self, code, context):
        return db_errors.__dict__[code].print_error(context, self.interpreter.output)

    def request_malformed(self, context):
        return self.err('error_request_malformed', context)

    def request_dont_work(self, context):
        return self.err('error_request_dont_work', context)

    def ensure_connection(self):
        """S'assure que self.db et self.cursor sont valides"""
        if self.db is None or self.cursor is None:
            try:
                if self.engine == 'mysql':
                    self.db = mysql.connector.connect(
                        host=self.dictionary['hostname'],
                        user=self.dictionary['username'],
                        password=self.dictionary['userpass']
                    )
                    self.cursor = self.db.cursor(dictionary=True)
                elif self.engine == 'postgresql':
                    self.db = psycopg2.connect(
                        host=self.dictionary['hostname'],
                        user=self.dictionary['username'],
                        password=self.dictionary['userpass'],
                        dbname=self.dictionary['dbname']
                    )
                    self.cursor = self.db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            except:
                self.cursor = None
                self.db = None
                return db_errors.error_connection_failed.print_error('connect', self.interpreter.output)

    def auto_connect(func):
        def wrapper(self, *args, **kwargs):
            self.ensure_connection()
            return func(self, *args, **kwargs)
        return wrapper

    '''
    Instruction dbconf : affiche les paramètres de connection : DBCONF
    '''
    def param_instr(self):
        print('Engine                     = ' + self.engine)
        print('Database server (hostname) = ' + self.dictionary['hostname'])
        print('Database name     (dbname) = ' + self.dictionary['dbname'])
        print('User name       (username) = ' + self.dictionary['username'])
        print('User password   (userpass) = ' + self.dictionary['userpass'])

    '''
    Instruction connect : se connecte à une base de données : CONNECT
    '''
    def connect_instr(self):
        hostname = self.dictionary['hostname']
        username = self.dictionary['username']
        userpass = self.dictionary['userpass']
        databasename = self.dictionary['dbname']
        try:
            if self.engine == 'mysql':
                self.db = mysql.connector.connect(host = hostname, user = username, password = userpass)
                self.cursor = self.db.cursor(dictionary=True)
            elif self.engine == 'postgresql':
                self.db = psycopg2.connect(host = hostname, user = username, password = userpass, dbname = databasename)
                self.cursor = self.db.cursor()            
            self.work.appendleft(1)
            return 'nobreak'
        except:
            self.cursor = None
            self.db = None
            self.work.appendleft(0)
            return db_errors.error_connection_failed.print_error('connect', self.interpreter.output)

    '''
    Instruction ?connect : permet de savoir si la connection est effective : ( ... ) ?CONNECT ( 0|1 ... )
    '''
    def isconnect_instr(self):
        self.work.appendleft(1 if self.db else 0)
        return 'nobreak'

    '''
    Instruction ?close : permet de savoir si le curseur est effectif : ( ... ) ?CLOSE ( 0|1 ... )
    '''
    def isclose_instr(self):
        self.work.appendleft(0 if self.cursor else 1)
        return 'nobreak'
    
    '''
    Instruction disconnect : ferme le lien entre beetle et la base de données : DISCONNECT
    '''
    @auto_connect
    def disconnect_instr(self):
        if self.db != None:
            if self.cursor != None:
                self.cursor.close()
                self.cursor = None
            self.db.close()
            self.db = None
        return 'nobreak'

    '''
    Instruction close : ferme le lien entre beetle et la base de données : CLOSE
    '''
    @auto_connect
    def close_instr(self):
        if self.cursor != None:
            self.cursor.close()
            self.cursor = None
        return 'nobreak'
    
    '''
    Instruction |create> : action de création : |create> (DATABASE|TABLE) name [option] >|
    '''
    @auto_connect
    def create_instr(self):
        sql = 'create'
        type = self.seq_next()
        if type == None:
            return db_errors.error_action_type.print_error('|create>', self.interpreter.output)
        type = type.lower()
        if type != 'database' and type != 'table':
            return db_errors.error_action_type.print_error('|create>', self.interpreter.output)
        sql += ' ' + type
        name = self.seq_next()
        if name == None:
            return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
        name = name.strip().strip('"').strip("'")
        if type == 'database':
            if self.engine == 'mysql':
                sql += f' if not exists {name}'
            else:
                sql += f' {name}'
        else:
            if self.engine == 'mysql':
                sql += f' if not exists `{name}` (`id` int(11) not null auto_increment, primary key (`id`))'
            else:
                sql += f'table if not exists {name} (id integer generated by default as identity primary key)'
        # options sequence
        next = self.seq_next()
        next = next.lower()
        if next == 'like' and type == 'table':
            if self.engine == 'mysql':
                sql += ' like '
            else:
                sql += ' (like '
            old_table = self.seq_next()
            if old_table == None:
                return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
            sql += old_table
            if self.engine == 'postgresql':
                sql += ')'
        else:
            if self.engine == 'mysql':
                if next != None:
                    while next != '>|':
                        if next == 'charset':
                            cs = self.seq_next()
                            if cs == None:
                                return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
                            sql += f" CHARACTER SET={cs}"
                        elif next == 'collate' and type == 'database':
                            co = self.seq_next()
                            if co == None:
                                return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
                            sql += f" COLLATE={co}"
                        elif next == 'encryption' and type == 'database':
                            encrypt = self.seq_next()
                            if encrypt == None:
                                return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
                            sql += f" encryption='{encrypt}'"
                        elif next == 'ai' and type == 'table':
                            ai = self.seq_next()
                            if ai == None:
                                return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
                            if not self.isinteger(ai):
                                return core_errors.error_integer_expected.print_error('|create>', self.interpreter.output)
                            if int(ai) < 0:
                                return db_errors.error_integer_superior_to_0.print_error('|create> auto_increment', self.interpreter.output)
                            sql += f' auto_increment={ai}'
                        next = self.seq_next()
                        if next == None:
                            return db_errors.error_name_expected.print_error('|create>', self.interpreter.output)
                        next = next.lower()
                else:
                    return self.request_malformed(sql)
            else:
                if next != '>|':
                    return self.request_malformed(sql)
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return self.request_dont_work(sql)
        return 'nobreak'



    '''
    Instruction use : précise la base qui doit être utilisée pour la suite : USE dbname
    '''
    @auto_connect
    def use_instr(self):
        name = self.seq_next()
        if name == None:
            return db_errors.error_name_expected.print_error('use', self.interpreter.output)
        self.dictionary['dbname'] = name
        if self.engine == 'mysql':
            try:
                self.cursor.execute('use ' + name)
            except:
                return self.request_dont_work('use ' + name + ' in mysql')
            return 'nobreak'
        elif self.engine == "postgresql":
            try:
                if self.cursor:
                    self.cursor.close()
                if self.db:
                    self.db.close()

                self.db = psycopg2.connect(
                    host=self.dictionary['hostname'],
                    user=self.dictionary['username'],
                    password=self.dictionary['userpass'],
                    dbname=name
                )
                self.cursor = self.db.cursor()
            except Exception:
                return self.request_dont_work('use ' + name + ' in postgresql')
            return 'nobreak'            

    '''
    Instruction |show> : |SHOW> [databases|tables from dbname|fields from database.tablename|status|global status] >|

    show databases
    show tables from dbname
    show fields from dbname.tablename
    show status
    show global status
    '''
    @auto_connect
    def show_instr(self):
        what = self.seq_next()
        if what is None:
            return self.request_malformed("|show>")
        what = what.lower()

        # 1. SHOW DATABASES
        if what == "databases":
            if self.engine == "mysql":
                sql = "show databases;"
            else:  # postgresql
                sql = "select datname as Database from pg_database where datistemplate = false;"

            end = self.seq_next()
            if end != ">|":
                return self.request_malformed("|show>")

            try:
                self.cursor.execute(sql)
                self.work.appendleft(self.cursor.fetchall())
            except:
                return self.request_dont_work(sql)
            return "nobreak"

        # 2. SHOW TABLES FROM db
        if what == "tables":
            from_kw = self.seq_next()
            if from_kw != "from":
                return self.request_malformed("|show>")

            dbname = self.seq_next()
            if dbname == None:
                return self.request_malformed("|show>")

            if self.engine == "mysql":
                sql = f"show tables from {dbname};"
            else:
                # PostgreSQL → déjà connecté sur la bonne base
                sql = "select tablename from pg_tables where schemaname='public';"

            end = self.seq_next()
            if end != ">|":
                return self.request_malformed("|show>")

            try:
                self.cursor.execute(sql)
                self.work.appendleft(self.cursor.fetchall())
            except:
                return self.request_dont_work(sql)
            return "nobreak"

        # 3. SHOW FIELDS FROM db.table
        if what == "fields":
            from_kw = self.seq_next()
            if from_kw != "from":
                return self.request_malformed("|show>")

            full = self.seq_next()
            if full == None:
                return self.request_malformed("|show>")

            if self.engine == "mysql":
                sql = f"show fields from {full};"
            else:
                # full = db.table → on garde seulement table
                table = full.split(".")[-1]
                sql = f"""
                    select column_name as Field,
                        data_type as Type,
                        is_nullable as Null
                    from information_schema.columns
                    where table_name = '{table}';
                """

            end = self.seq_next()
            if end != ">|":
                return self.request_malformed("|show>")

            try:
                self.cursor.execute(sql)
                self.work.appendleft(self.cursor.fetchall())
            except:
                return self.request_dont_work(sql)
            return "nobreak"

        # 4. SHOW INDEX / KEYS FROM db.table
        if what in ("index", "keys"):
            from_kw = self.seq_next()
            if from_kw != "from":
                return self.request_malformed("|show>")

            full = self.seq_next()
            table = full.split(".")[-1]

            if self.engine == "mysql":
                sql = f"SHOW INDEX FROM {full};"
            else:
                sql = f"""
                    SELECT indexname, indexdef
                    FROM pg_indexes
                    WHERE tablename='{table}';
                """

            end = self.seq_next()
            if end != ">|":
                return self.request_malformed("|show>")

            try:
                self.cursor.execute(sql)
                self.work.appendleft(self.cursor.fetchall())
            except:
                return self.request_dont_work(sql)
            return "nobreak"

        # 5. unsupported things on PostgreSQL
        if what in ("privileges", "status", "global"):
            if self.engine == "mysql":
                sql += ' ' + what
                if what == 'global':
                    status = self.seq_next()
                    if status.lower() != 'status':
                        return self.request_malformed('|show>')
                    sql += ' ' + status
                end = self.seq_next()
                if end == None or end != '>|':
                    return self.request_malformed('|show>')
                try:
                    self.cursor.execute(sql)
                    self.work.appendleft(self.cursor.fetchall())
                except:
                    return self.request_dont_work(sql)
                return 'nobreak'
            else:
                return self.error_pg_not_supported("|show>")
        return self.request_malformed("|show>")

    '''
    Instruction |select> : |SELECT> * FROM table WHERE clause >|

    select selector_list from table_list where clause_where
    '''
    @auto_connect
    def select_instr(self):
        sql = 'select'
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|select>')
        if next != None:
            while next.lower() != 'from':
                sql += ' ' + next
                next = self.seq_next()
                if next == None:
                    break
        sql += ' from'
        next = self.seq_next()
        if next != None:
            while next.lower() != 'where' :
                if next == '>|':
                    break
                sql += ' ' + next
                next = self.seq_next()
                if next == None:
                    # on sort de la boucle car il n'y a pas de clause where
                    break
        if next.lower() == 'where':
            while next.lower() != '>|' :
                sql += ' ' + next
                next = self.seq_next()
                if next == None:
                    return self.request_malformed('|select>')
        if next == None or next != '>|':
            return self.request_malformed('|select>')
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchall()
            self.work.appendleft(result)
        except:
            return self.request_dont_work(sql)
        return 'nobreak'

    '''
    Instruction |insert> : |INSERT> tablename ( col1, col2, ... ) VALUES ( value1, value2, ... ) >|

    insert into tablename ( col1, col2, ... ) values ( value1, value2, ... ), ( ... )
    '''
    @auto_connect
    def insert_instr(self):
        sql = 'insert into'
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|insert>')
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|insert>')
        while next.lower() != 'values' :
            sql += ' ' + next
            next = self.seq_next()
            if next == None:
                return self.request_malformed('|insert>')
        sql += ' values '
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|insert>')
        while next != '>|' :
            sql += ' ' + next
            next = self.seq_next()
            if next == None:
                return self.request_malformed('|insert>')
        try:
            self.cursor.execute(sql)
            self.work.appendleft(self.cursor.lastrowid)
            self.db.commit()
        except:
            return self.request_dont_work(sql)
        return 'nobreak'

    '''
    Instruction |update> : |update> tablename set col1=value1, col2=value2, ... [where where_condition] >|
    '''
    @auto_connect
    def update_instr(self):
        sql = 'update'
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|update>')
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next == None and next.lower() != 'set':
            return self.request_malformed('|update>')
        # contenu du set
        while next.lower() != 'where' and next != '>|':
            sql += ' ' + next
            next = self.seq_next()
            if next == None:
                return self.request_malformed('|update>')
        if next.lower() == 'where':
            sql += ' where'
            next = self.seq_next()
            if next == None:
                return self.request_malformed('|update>')
            while next != '>|' :
                sql += ' ' + next
                next = self.seq_next()
                if next == None:
                    return self.request_malformed('|update>')
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return self.request_dont_work(sql)
        return 'nobreak'

    '''
    Instruction |delete> : |DELETE> tablename [ WHERE where_condition ] >| 

    delete from tablename
    delete from tablename where where_condition
    '''
    @auto_connect
    def delete_instr(self):
        sql = 'delete from'
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|delete>')
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next != '>|':
            if next.lower() == 'where':
                sql += ' where'
                next = self.seq_next()
                if next == None:
                    return self.request_malformed('|delete>')
                while next != '>|' :
                    sql += ' ' + next
                    next = self.seq_next()
                    if next == None:
                        return self.request_malformed('|delete>')
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return self.request_dont_work(sql)
        return 'nobreak'

    '''
    Instruction |truncate> : |TRUNCATE> tablename >| 

    truncate table tablename
    '''
    @auto_connect
    def truncate_instr(self):
        sql = 'truncate table'
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|truncate>')
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next == None or next != '>|':
            return self.request_malformed('|truncate>')
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return self.request_dont_work(sql)

    '''
    Instruction |drop> : |drop> table { tablename { restrict | cascade } |database dbname }
    '''
    @auto_connect
    def drop_instr(self):
        sql = 'drop'
        type = self.seq_next()
        if type == None:
            return db_errors.error_action_type.print_error('|drop>', self.interpreter.output)
        type = type.lower()
        if type != 'database' and type != 'table' and type != 'procedure' and type != 'function' and type != 'trigger' and type != 'event' and type != 'user':
            return db_errors.error_action_type.print_error('|drop>', self.interpreter.output)
        sql += ' ' + type
        name = self.seq_next()
        if name == None:
            return db_errors.error_name_expected.print_error('|drop>', self.interpreter.output)
        if type == 'table':
            sql += ' if exists ' + name
        else:
            sql += ' ' + name
        next = self.seq_next()
        if next == None:
            return self.request_malformed('|drop>')
        if next == '>|':
            try:
                self.cursor.execute(sql)
                self.db.commit()
            except:
                return self.request_dont_work(sql)
        else:
            return self.request_malformed(sql)
        return 'nobreak'

    '''
    Instruction >| : fin de requête
    '''
    def endreq_instr(self):
        core_errors.error_invalid_instruction.print_error('>|', self.interpreter.output)

    '''
    Instruction alter : |alter> ... >|

    ALTER TABLE tablename ADD `col_name1` col_def1 , ... [ FIRST | AFTER col_name ]
    ALTER TABLE tablename ADD {INDEX | KEY} ( col_name col_def , ... ) [ FIRST | AFTER col_name ]
    ALTER TABLE tablename ADD CONSTRAINT nom_cle_etrangere FOREIGN KEY(nom_de_la_cle) REFERENCES nom_de_la_table_origine(nom_de_la_cle)
    ALTER TABLE tablename ALTER col_name { SET DEFAULT ... | SET VISIBLE | INVISIBLE | DROP DEFAULT }
    ALTER TABLE tablename CHANGE old_col_name new_col_name col_def [ FIRST | AFTER col_name ]
    ALTER TABLE tablename DROP col_name
    ALTER TABLE tablename DROP { INDEX | KEY } index_name
    ALTER TABLE tablename DROP PRIMARY KEY
    ALTER TABLE tablename MODIFY col_name col_def [ FIRST | AFTER col_name ]
    ALTER TABLE tablename RENAME COLUMN old_col_name TO new_col_name
    ALTER TABLE tablename RENAME { INDEX | KEY } old_index_name TO new_index_name
    ALTER TABLE tablename RENAME new_tbl_name

    ALTER DATABASE dbname { CHARACTER SET charset_name | COLLATE collation_name | ENCRYPTION { 'Y' | 'N' } | ... }
    '''
    @auto_connect
    def alter_instr(self):
        sql = 'alter'
        next = self.seq_next()
        if next.lower() != 'table' and next.lower() != 'database':
            return self.request_malformed('|alter>')
        sql += ' ' + next.lower()
        if next.lower() == 'table':
            next = self.seq_next()
            sql += ' `' + next.lower() + '`'
            next = self.seq_next()
            if next.lower() == 'add' or next.lower() == 'alter' or next.lower() == 'change' or next.lower() == 'drop' or next.lower() == 'modify' or next.lower() == 'rename':
                # action
                sql += ' ' + next.lower()
                # et la suite
                next = self.seq_next()
                while next != '>|' :
                    sql += ' ' + next
                    next = self.seq_next()
                    if next == None:
                        return self.request_malformed('|alter>')
        if next.lower() == 'database':
            # nom de la base
            next = self.seq_next()
            sql += ' ' + next.lower()
            # et la suite
            next = self.seq_next()
            while next != '>|' :
                sql += ' ' + next
                next = self.seq_next()
                if next == None:
                    return self.request_malformed('|alter>')
        if next == '>|':
            try:
                self.cursor.execute(sql)
                self.db.commit()
            except:
                return self.request_dont_work(sql)
        else:
            return self.request_malformed(sql)
        return 'nobreak'

    '''
    Instruction chooseengine : permet de sélectionner le type de base de données utilisé
    '''
    def chooseeng_instr(self):
        next = self.seq_next()
        if next == None:
            return db_errors.error_engine_expected.print_error('chooseengine', self.interpreter.output)
        if next.lower() not in ['mysql', 'postgresql']:
            return db_errors.error_engine_expected.print_error('chooseengine', self.interpreter.output)
        self.engine = next
        return 'nobreak'

    '''
    Instruction : engine? : permet de savoir quelle base de données est utilisée
    Par défaut, engine = mysql
    '''
    def eng_instr(self):
        self.work.appendleft(self.engine)
        return 'nobreak'