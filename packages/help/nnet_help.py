from packages.help.help import help

class nnet_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {
            'space-new' : '''Creates the global neural space\nUsage : ( w h ... ) SPACE-NEW ( ... )''',
            'space-clear' : '''Resets the global space while preserving its dimensions\nUsage : ( ... ) SPACE-CLEAR ( ... )''',
            'space-size' : '''Returns the size of the neural space\nUsage : ( ... ) SPACE-SIZE ( w h ... )'''
        }