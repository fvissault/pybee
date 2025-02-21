from packages.termcolors import termcolors

class help:
    def __init__(self, output):
        self.output = output

    def get_help(self, instr, dictionary):
        if instr in dictionary.keys():
            if self.output == 'console':
                return termcolors.BLUE + self.help_dict[instr] + termcolors.NORMAL
            elif self.output == 'web':
                content = self.help_dict[instr]
                content = content.replace('\n', '<br>')
                return content
            else:
                return None
        else:
            return None

    def set_help(self, instr, helptext):
        self.help_dict[instr] = helptext