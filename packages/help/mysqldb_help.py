from packages.help.help import help

class mysqldb_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {'?connect' : '',
                          'connect' : '',
                          'disconnect' : '',
                          '?close' : '',
                          'close' : '',
                          'hostname' : '',
                          'dbname' : '',
                          'username' : '',
                          'userpass' : '',
                          'dbparam' : '',
                          'use' : '',
                          '|create>' : '',
                          '|show>' : '',
                          '|select>' : '',
                          '|insert>' : '',
                          '|update>' : '',
                          '|delete>' : '',
                          '|drop>' : '',
                          '|truncate>' : '',
                          '|alter>' : '',
                          '>|' : ''}
