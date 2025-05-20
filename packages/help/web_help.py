from packages.help.help import help

class web_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {'generate' : ''}