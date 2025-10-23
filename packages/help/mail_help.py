from packages.help.help import help

class mail_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {
            'sendmail' : '''Send a mail\nUsage : ( ... ) SENDMAIL ( ... )''',
            'initmailer' : '''''',
            'preparemail' : ''''''
        }
