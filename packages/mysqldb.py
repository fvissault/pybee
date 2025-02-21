from packages.errors.core_errors import core_errors
from packages.errors.mysqldb_errors import mysqldb_errors
from packages.base_module import base_module
from packages.help.mysqldb_help import mysqldb_help
import mysql.connector


class mysqldb(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'?connect' : self.isconnect_instr,
                           'connect' : self.connect_instr,
                           'disconnect' : self.disconnect_instr,
                           '?close' : self.isclose_instr,
                           'close' : self.close_instr,
                           'hostname' : 'localhost',
                           'dbname' : '',
                           'username' : 'root',
                           'userpass' : '',
                           'dbparam' : self.param_instr,
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
                           '>|' : self.endreq_instr}
        self.db = None
        self.cursor = None
        self.help = mysqldb_help(interpreter.output)
        self.interpreter.core_instr.variables.append('hostname')
        self.interpreter.core_instr.variables.append('dbname')
        self.interpreter.core_instr.variables.append('username')
        self.interpreter.core_instr.variables.append('userpass')
        self.version = 'v0.3.9'

    '''
    Instruction dbparam : affiche les paramètres de connection : DBPARAM
    '''
    def param_instr(self):
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
        try:
            self.db = mysql.connector.connect(host = hostname, user = username, password = userpass)
            self.cursor = self.db.cursor(dictionary=True)
            self.work.appendleft(1)
            return 'nobreak'
        except:
            self.cursor = ''
            self.db = ''
            self.work.appendleft(0)
            return mysqldb_errors.error_connection_failed.print_error('connect', self.interpreter.output)

    '''
    Instruction ?connect : permet de savoir si la connection est effective : ( ... ) ?CONNECT ( 0|1 ... )
    '''
    def isconnect_instr(self):
        if self.db != None:
            self.work.appendleft(1)
        else:
            self.work.appendleft(0)
        return 'nobreak'

    '''
    Instruction ?close : permet de savoir si le curseur est effectif : ( ... ) ?CLOSE ( 0|1 ... )
    '''
    def isclose_instr(self):
        if self.cursor != None:
            self.work.appendleft(0)
        else:
            self.work.appendleft(1)
        return 'nobreak'
    
    '''
    Instruction disconnect : ferme le lien entre beetle et la base de données : DISCONNECT
    '''
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
    def close_instr(self):
        if self.cursor != None:
            self.cursor.close()
            self.cursor = None
        return 'nobreak'
    
    '''
    Instruction |<create : action de création : |<CREATE (DATABASE|TABLE) name [option] >|
    '''
    def create_instr(self):
        sql = 'create'
        type = self.seq_next()
        if type == None:
            return mysqldb_errors.error_action_type.print_error('create', self.interpreter.output)
        type = type.lower()
        if type != 'database' and type != 'table':
            return mysqldb_errors.error_action_type.print_error('create', self.interpreter.output)
        sql += ' ' + type
        name = self.seq_next()
        if name == None:
            return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
        if type == 'database':
            sql += ' if not exists ' + name
        else:
            sql += ' if not exists ' + name + ' (`id` int(11) not null auto_increment, primary key (`id`))'
        # options sequence
        next = self.seq_next()
        next = next.lower()
        if next == 'like' and type == 'table':
            sql += ' like'
            old_table = self.seq_next()
            if old_table == None:
                return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
            sql += old_table
        else:
            if next != None:
                while next != '>|':
                    if next == 'charset':
                        sql += ' character set'
                        cs = self.seq_next()
                        if cs == None:
                            return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
                        sql += '=' + cs
                    elif next == 'collate' and type == 'database':
                        sql += ' collate'
                        co = self.seq_next()
                        if co == None:
                            return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
                        sql += '=' + co
                    elif next == 'encryption' and type == 'database':
                        sql += ' encryption'
                        encrypt = self.seq_next()
                        if encrypt == None:
                            return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
                        sql += '=' + encrypt
                    elif next == 'ai' and type == 'table':
                        sql += ' auto_increment'
                        ai = self.seq_next()
                        if ai == None:
                            return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
                        if not self.isinteger(ai):
                            return core_errors.error_integer_expected.print_error('create', self.interpreter.output)
                        if int(ai) < 0:
                            return mysqldb_errors.error_integer_superior_to_0.print_error('create auto_increment', self.interpreter.output)
                        sql += '=' + str(ai)
                    elif next == 'engine' and type == 'table':
                        sql += ' engine'
                        engine = self.seq_next()
                        if engine == None:
                            return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
                        sql += '=' + engine
                    next = self.seq_next()
                    if next == None:
                        return mysqldb_errors.error_name_expected.print_error('create', self.interpreter.output)
                    next = next.lower()
            else:
                return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return mysqldb_errors.error_request_dont_work.print_error(sql, self.interpreter.output)
        return 'nobreak'



    '''
    Instruction use : précise la base qui doit être utilisée pour la suite : USE dbname
    '''
    def use_instr(self):
        name = self.seq_next()
        if name == None:
            return mysqldb_errors.error_name_expected.print_error('use', self.interpreter.output)
        self.dictionary['dbname'] = name
        try:
            self.cursor.execute('use ' + name)
        except:
            return mysqldb_errors.error_request_dont_work.print_error('use ' + name, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction |<show : |<SHOW [databases|tables from dbname|fields from database.tablename|status|global status] >|

    show databases
    show tables from dbname
    show fields from dbname.tablename
    show status
    show global status
    '''
    def show_instr(self):
        sql = 'show'
        what = self.seq_next()
        if what == None:
            return mysqldb_errors.error_name_expected.print_error('show', self.interpreter.output)
        what = what.lower()
        if what == 'databases' or what == 'tables' or what == 'fields' or what == 'status' or what == 'global':
            sql += ' ' + what
            if what == 'tables':
                from_instr = self.seq_next()
                if from_instr.lower() != 'from':
                    return mysqldb_errors.error_request_malformed.print_error('show', self.interpreter.output)
                sql += ' ' + from_instr
                dbname = self.seq_next()
                sql += ' ' + dbname
            if what == 'fields':
                from_instr = self.seq_next()
                if from_instr.lower() != 'from':
                    return mysqldb_errors.error_request_malformed.print_error('show', self.interpreter.output)
                sql += ' ' + from_instr
                field_name = self.seq_next()
                sql += ' ' + field_name
            if what == 'global':
                status = self.seq_next()
                if status.lower() != 'status':
                    return mysqldb_errors.error_request_malformed.print_error('show', self.interpreter.output)
                sql += ' ' + status
            endreq = self.seq_next()
            if endreq == None or endreq != '>|':
                return mysqldb_errors.error_request_malformed.print_error('show', self.interpreter.output)
            try:
                self.cursor.execute(sql)
                result = self.cursor.fetchall()
                self.work.appendleft(result)
            except:
                return mysqldb_errors.error_request_dont_work.print_error(sql, self.interpreter.output)
        else:
            return mysqldb_errors.error_action_type.print_error('show', self.interpreter.output)
        return 'nobreak'

    '''
    Instruction |<select : |<SELECT * FROM table WHERE clause >|

    select selector_list from table_list where clause_where
    '''
    def select_instr(self):
        sql = 'select'
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<select', self.interpreter.output)
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
                    return mysqldb_errors.error_request_malformed.print_error('|<select', self.interpreter.output)
        if next == None or next != '>|':
            return mysqldb_errors.error_request_malformed.print_error('|<select', self.interpreter.output)
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchall()
            self.work.appendleft(result)
        except:
            return mysqldb_errors.error_request_dont_work.print_error(sql, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction |<insert : |<INSERT tablename ( col1, col2, ... ) VALUES ( value1, value2, ... ) >|

    insert into tablename ( col1, col2, ... ) values ( value1, value2, ... ), ( ... )
    '''
    def insert_instr(self):
        sql = 'insert into'
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<insert', self.interpreter.output)
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<insert', self.interpreter.output)
        while next.lower() != 'values' :
            sql += ' ' + next
            next = self.seq_next()
            if next == None:
                return mysqldb_errors.error_request_malformed.print_error('|<insert', self.interpreter.output)
        sql += ' values'
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<insert', self.interpreter.output)
        while next != '>|' :
            sql += ' ' + next
            next = self.seq_next()
            if next == None:
                return mysqldb_errors.error_request_malformed.print_error('|<insert', self.interpreter.output)
        try:
            self.cursor.execute(sql)
            self.work.appendleft(self.cursor.lastrowid)
            self.db.commit()
        except:
            return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction |<update : |<update tablename set col1=value1, col2=value2, ... [where where_condition] >|
    '''
    def update_instr(self):
        sql = 'update'
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<update', self.interpreter.output)
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next == None and next.lower() != 'set':
            return mysqldb_errors.error_request_malformed.print_error('|<update', self.interpreter.output)
        # contenu du set
        while next.lower() != 'where' and next != '>|':
            sql += ' ' + next
            next = self.seq_next()
            if next == None:
                return mysqldb_errors.error_request_malformed.print_error('|<update', self.interpreter.output)
        if next.lower() == 'where':
            sql += ' where'
            next = self.seq_next()
            if next == None:
                return mysqldb_errors.error_request_malformed.print_error('|<update', self.interpreter.output)
            while next != '>|' :
                sql += ' ' + next
                next = self.seq_next()
                if next == None:
                    return mysqldb_errors.error_request_malformed.print_error('|<update', self.interpreter.output)
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction |<delete : |<DELETE tablename [ WHERE where_condition ] >| 

    delete from tablename
    delete from tablename where where_condition
    '''
    def delete_instr(self):
        sql = 'delete from'
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<delete', self.interpreter.output)
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next != '>|':
            if next.lower() == 'where':
                sql += ' where'
                next = self.seq_next()
                if next == None:
                    return mysqldb_errors.error_request_malformed.print_error('|<delete', self.interpreter.output)
                while next != '>|' :
                    sql += ' ' + next
                    next = self.seq_next()
                    if next == None:
                        return mysqldb_errors.error_request_malformed.print_error('|<delete', self.interpreter.output)
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction |<truncate : |<TRUNCATE tablename >| 

    truncate table tablename
    '''
    def truncate_instr(self):
        sql = 'truncate table'
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_request_malformed.print_error('|<truncate', self.interpreter.output)
        # tablename
        sql += ' ' + next
        next = self.seq_next()
        if next == None or next != '>|':
            return mysqldb_errors.error_request_malformed.print_error('|<truncate', self.interpreter.output)
        try:
            self.cursor.execute(sql)
            self.db.commit()
        except:
            return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)

    '''
    Instruction |<drop : |<drop table { tablename { restrict | cascade } |database dbname }
    '''
    def drop_instr(self):
        sql = 'drop'
        type = self.seq_next()
        if type == None:
            return mysqldb_errors.error_action_type.print_error('drop', self.interpreter.output)
        type = type.lower()
        if type != 'database' and type != 'table':
            return mysqldb_errors.error_action_type.print_error('drop', self.interpreter.output)
        sql += ' ' + type
        name = self.seq_next()
        if name == None:
            return mysqldb_errors.error_name_expected.print_error('drop', self.interpreter.output)
        sql += ' if exists ' + name
        # options sequence
        next = self.seq_next()
        if next == None:
            return mysqldb_errors.error_name_expected.print_error('drop', self.interpreter.output)
        if type == 'table': 
            next = next.lower()
            if next == 'restrict' or next == 'cascade':
                sql += ' ' + next
                next = self.seq_next()
            elif next != '>|':
                return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        if next == '>|':
            try:
                self.cursor.execute(sql)
                self.db.commit()
            except:
                return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        else:
            return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction >| : fin de requête
    '''
    def endreq_instr(self):
        core_errors.error_invalid_instruction.print_error('>|', self.interpreter.output)

    '''
    Instruction alter : |<alter ... >|

    ALTER TABLE tablename ADD ( col_name col_def , ... ) [ FIRST | AFTER col_name ]
    ALTER TABLE tablename ADD {INDEX | KEY} ( col_name col_def , ... ) [ FIRST | AFTER col_name ]
    ALTER TABLE tablename ALTER col_name { SET DEFAULT ... | SET VISIBLE | INVISIBLE | DROP DEFAULT }
    ALTER TABLE tablename CHANGE old_col_name new_col_name col_def [ FIRST | AFTER col_name ]
    ALTER TABLE tablename DROP col_name
    ALTER TABLE tablename DROP { INDEX | KEY } index_name
    ALTER TABLE tablename DROP PRIMARY KEY
    ALTER TABLE tablename MODIFY col_name col_def [ FIRST | AFTER col_name ]
    ALTER TABLE tablename RENAME COLUMN old_col_name TO new_col_name
    ALTER TABLE tablename RENAME { INDEX | KEY } old_index_name TO new_index_name
    ALTER TABLE tablename RENAME new_tbl_name

    ALTER DATABASE dbname { CHARACTER SET charset_name | COLLATE ollation_name | ENCRYPTION { 'Y' | 'N' } | ... }
    '''
    def alter_instr(self):
        sql = 'alter'
        next = self.seq_next()
        if next.lower() != 'table' and next.lower() != 'database':
            return mysqldb_errors.error_request_malformed.print_error('|<alter', self.interpreter.output)
        sql += ' ' + next.lower()
        if next.lower() == 'table':
            next = self.seq_next()
            sql += ' ' + next.lower()
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
                        return mysqldb_errors.error_request_malformed.print_error('|<alter', self.interpreter.output)
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
                    return mysqldb_errors.error_request_malformed.print_error('|<alter', self.interpreter.output)
        if next == '>|':
            try:
                self.cursor.execute(sql)
                self.db.commit()
            except:
                return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        else:
            return mysqldb_errors.error_request_malformed.print_error(sql, self.interpreter.output)
        return 'nobreak'
