import getpass
import keyboard
import traceback

class Io:
               
    '''
    Instruction . : affiche et détruit le haut de la pile 
    '''
    def point_instr(self):
        try:
            if self.require_stack(1, '.') == None:
                temp = self.pop_work()
                temp = str(temp).replace('\\"', '"')
                print(temp, end='')
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction emit : affiche le caractère correpondant à son code
    '''
    def emit_instr(self):
        try:
            if self.require_stack(1, 'emit') == None:
                temp = self.interpreter.work[0]
                if isinstance(temp, int):
                    self.interpreter.work.popleft()
                    print(chr(temp), end='')
                    return 'nobreak'
                else:
                    return self.err('error_integer_expected', 'emit')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction stemit : positionne sur la pile de travail le caractère correpondant à son code
    '''
    def stackemit_instr(self):
        try:
            if self.require_stack(1, 'stemit') == None:
                temp = self.pop_work()
                if isinstance(temp, int):
                    self.interpreter.work.appendleft(chr(temp))
                    return 'nobreak'
                else:
                    return self.err('error_char_expected', 'stemit')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction input : met en attente la console pour permettre à l'utilisateur de rentrer de l'information
    '''
    def input_instr(self):
        try:
            if self.require_stack(1, 'input') == None:
                prompt = self.pop_work()
                ret = input(prompt)
                if self.isinteger(ret):
                    self.interpreter.work.appendleft(int(ret))
                elif self.isfloat(ret):
                    self.interpreter.work.appendleft(float(ret))
                else:
                    self.interpreter.work.appendleft(str(ret))
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction secinput : met en attente la console pour permettre à l'utilisateur de rentrer de l'information de manière sécurisée
    '''
    def secinput_instr(self):
        try:
            if self.require_stack(1, 'secinput') == None:
                prompt = self.pop_work()
                ret = getpass.getpass(prompt)
                if self.isinteger(ret):
                    self.interpreter.work.appendleft(int(ret))
                elif self.isfloat(ret):
                    self.interpreter.work.appendleft(float(ret))
                else:
                    self.interpreter.work.appendleft(str(ret))
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction kpress : permet à l'uilisateur de controler le clavier
    '''
    def keypress_instr(self):
        try:
            if self.require_stack(1, 'kpress') == None:
                key = self.pop_work()
                if keyboard.is_pressed(key):
                    self.interpreter.work.appendleft(1)
                else:
                    self.interpreter.work.appendleft(0)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction readk : permet à l'uilisateur de controler le clavier
    '''
    def readkey_instr(self):
        try:
            if self.require_stack(1, 'readk') == None:
                key = self.pop_work()
                if keyboard.read_key(suppress=True) == key:
                    self.interpreter.work.appendleft(1)
                else:
                    self.interpreter.work.appendleft(0)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"
