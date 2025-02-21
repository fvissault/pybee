from packages.termcolors import termcolors

class error:
    def __init__(self, type, message):
        self.type = 'none'
        if type == 'warning' or type == 'error' or type == 'fatal':
            self.type = type
        self.message = ''
        if message != '':
            self.message = message

    def print_error(self, prefix, output):
        if output == 'console':
            if self.type == 'warning':
                print(termcolors.WARNING + prefix + ' ' + self.type + ' : ' + self.message + termcolors.NORMAL)
            if self.type == 'error':
                print(termcolors.ERROR + prefix + ' ' + self.type + ' : ' + self.message + termcolors.NORMAL)
            if self.type == 'fatal':
                print(termcolors.FATAL + prefix + ' ' + self.type + ' : ' + self.message + termcolors.NORMAL)
            if self.type == 'fatal':
                return 'break'
            else:
                return 'nobreak'
        if output == 'web':
            if self.type == 'warning':
                print(prefix + ' ' + self.type + ' : ' + self.message)
            if self.type == 'error':
                print(prefix + ' ' + self.type + ' : ' + self.message)
            if self.type == 'fatal':
                print(prefix + ' ' + self.type + ' : ' + self.message)
            if self.type == 'fatal':
                return 'break'
            else:
                return 'nobreak'
