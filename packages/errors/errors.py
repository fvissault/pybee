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
        msg = prefix + ' ' + self.type + ' : ' + self.message

        if output == 'console':
            if self.type == 'warning':
                print(termcolors.WARNING + msg + termcolors.NORMAL)
            elif self.type == 'error':
                print(termcolors.ERROR + msg + termcolors.NORMAL)
            elif self.type == 'fatal':
                print(termcolors.FATAL + msg + termcolors.NORMAL)
            else:
                print(msg)

        if output == 'web':
            print("Content-type: text/html;charset=UTF-8\n")
            print(msg, end='<br>')

        return 'break' if self.type == 'fatal' else 'nobreak'
