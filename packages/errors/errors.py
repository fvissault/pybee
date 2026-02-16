from packages.termcolors import termcolors

class error:
    def __init__(self, type, message):
        self.type = 'none'
        if type == 'warning' or type == 'error' or type == 'fatal':
            self.type = type
        self.message = ''
        if message != '':
            self.message = message

    def print_error(self, prefix, interpreter):
        msg = prefix + ' ' + self.type + ' : ' + self.message

        if interpreter.output == 'console':
            if self.type == 'warning':
                print(termcolors.WARNING + msg + termcolors.NORMAL)
                if interpreter.activelog:
                    interpreter.core_instr.logwarn(msg)
            elif self.type == 'error':
                print(termcolors.ERROR + msg + termcolors.NORMAL)
                if interpreter.activelog:
                    interpreter.core_instr.logerr(msg)
            elif self.type == 'fatal':
                print(termcolors.FATAL + msg + termcolors.NORMAL)
                if interpreter.activelog:
                    interpreter.core_instr.logerr(msg)
            else:
                print(msg)
                if interpreter.activelog:
                    interpreter.core_instr.loginfo(msg)

        if interpreter.output == 'web':
            print("Content-type: text/html;charset=UTF-8\n")
            print(msg, end='<br>')
            if interpreter.activelog:
                if self.type == 'warning':
                    interpreter.core_instr.logwarn(msg)
                elif self.type == 'error':
                    interpreter.core_instr.logerr(msg)
                elif self.type == 'fatal':
                    interpreter.core_instr.logerr(msg)
                else:
                    interpreter.core_instr.loginfo(msg)


        return 'break' if self.type == 'fatal' else 'nobreak'
