import getpass

class Io:
               
    '''
    Instruction . : affiche et détruit le haut de la pile 
    '''
    def point_instr(self):
        if self.require_stack(1, '?local') == None:
            temp = self.pop_work()
            temp = str(temp).replace('\\"', '"')
            print(temp, end='')
            return 'nobreak'

    '''
    Instruction emit : affiche le caractère correpondant à son code
    '''
    def emit_instr(self):
        if self.require_stack(1, 'emit') == None:
            temp = self.work[0]
            if isinstance(temp, int):
                self.work.popleft()
                print(chr(temp), end='')
                return 'nobreak'
            else:
                return self.err('error_integer_expected', 'emit')


    '''
    Instruction input : met en attente la console pour permettre à l'utilisateur de rentrer de l'information
    '''
    def input_instr(self):
        if self.require_stack(1, 'input') == None:
            prompt = self.pop_work()
            ret = input(prompt)
            if self.isinteger(ret):
                self.work.appendleft(int(ret))
            elif self.isfloat(ret):
                self.work.appendleft(float(ret))
            else:
                self.work.appendleft(str(ret))
            return 'nobreak'

    '''
    Instruction secinput : met en attente la console pour permettre à l'utilisateur de rentrer de l'information de manière sécurisée
    '''
    def secinput_instr(self):
        if self.require_stack(1, 'secinput') == None:
            prompt = self.pop_work()
            ret = getpass.getpass(prompt)
            if self.isinteger(ret):
                self.work.appendleft(int(ret))
            elif self.isfloat(ret):
                self.work.appendleft(float(ret))
            else:
                self.work.appendleft(str(ret))
            return 'nobreak'

    '''
    Instruction kpress : permet à l'uilisateur de controler le clavier
    '''
    def keypress_instr(self):
        if self.require_stack(1, 'kpress') == None:
            key = self.pop_work()
            if keyboard.is_pressed(key):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction readk : permet à l'uilisateur de controler le clavier
    '''
    def readkey_instr(self):
        if self.require_stack(1, 'readk') == None:
            key = self.pop_work()
            if keyboard.read_key(suppress=True) == key:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
