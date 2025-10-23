from packages.help.help import help

class mail_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {
            'sendmail' : '''Send a mail to sendtomail\nUsage : ( "sendtomail" ... ) SENDMAIL ( ... )''',
            'initmailer' : '''Initialize predefined mails and mail config variables\nUsage : ( ... ) INITMAILER ( ... )''',
            'preparemail' : '''Preformats a multilingual email with dynamic parameters\nUsage : ( mailname maillang { dynamic_parameter1 , ... }... ) PREPAREMAIL ( { preparedmail } ... )'''
        }
