import getpass

class Io:
               
    '''
    Instruction . : affiche et détruit le haut de la pile 
    '''
    def point_instr(self):
        if len(self.work) > 0:
            temp = self.pop_work()
            temp = str(temp).replace('\\"', '"')
            print(temp, end='')
            return 'nobreak'
        else:
            return self.nothing_in_work('.')

    '''
    Instruction emit : affiche le caractère correpondant à son code
    '''
    def emit_instr(self):
        if len(self.work) > 0:
            temp = self.work[0]
            if isinstance(temp, int):
                self.work.popleft()
                print(chr(temp), end='')
                return 'nobreak'
            else:
                return self.err('error_integer_expected', 'emit')
        else:
            return self.nothing_in_work('emit')

    '''
    Instruction cr : permet d'afficher un retour chariot dans la console
    '''
    def cr_instr(self):
        print('')
        return 'nobreak'


    '''
    Instruction input : met en attente la console pour permettre à l'utilisateur de rentrer de l'information
    '''
    def input_instr(self):
        if len(self.work) > 0:
            prompt = self.pop_work()
            ret = input(prompt)
            if self.isinteger(ret):
                self.work.appendleft(int(ret))
            elif self.isfloat(ret):
                self.work.appendleft(float(ret))
            else:
                self.work.appendleft(str(ret))
            return 'nobreak'
        else:
            return self.nothing_in_work('input')

    '''
    Instruction secinput : met en attente la console pour permettre à l'utilisateur de rentrer de l'information de manière sécurisée
    '''
    def secinput_instr(self):
        if len(self.work) > 0:
            prompt = self.pop_work()
            ret = getpass.getpass(prompt)
            if self.isinteger(ret):
                self.work.appendleft(int(ret))
            elif self.isfloat(ret):
                self.work.appendleft(float(ret))
            else:
                self.work.appendleft(str(ret))
            return 'nobreak'
        else:
            return self.nothing_in_work('secinput')

    '''
    Instruction kpress : permet à l'uilisateur de controler le clavier
    '''
    def keypress_instr(self):
        if len(self.work) > 0:
            key = self.pop_work()
            if keyboard.is_pressed(key):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return self.nothing_in_work('kpress')

    '''
    Instruction readk : permet à l'uilisateur de controler le clavier
    '''
    def readkey_instr(self):
        if len(self.work) > 0:
            key = self.pop_work()
            if keyboard.read_key(suppress=True) == key:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return self.nothing_in_work('readk')
