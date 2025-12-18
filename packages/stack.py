class StackInstructions:

    '''
    Instruction dump : affiche l'ensemble des éléments de la pile de travail
    '''
    def dump_instr(self):
        if self.require_stack(1, 'dump') == None:
            for temp in self.work:
                print(temp, end=' ')
            print()
            return 'nobreak'

    '''
    Instruction drop : supprime l'élément qui se trouve en haut de la pile de travail
    '''
    def drop_instr(self):
        if self.require_stack(1, 'drop') == None:
            self.pop_work()
            return 'nobreak'

    '''
    Instruction roll : effectue une rotation avec le nième élément qui se trouve en haut de la pile de travail
    ( # n1 n2 ... n# ... ) ROLL ( n# n1 n2 ... )

    1 roll ==> swap
    2 roll ==> rot
    '''
    def roll_instr(self):
        if self.require_stack(1, 'roll') == None:
            number = self.pop_work()
            if number < len(self.work):
                for i in range(len(self.work)):
                    value = self.work[i]
                    if i == number:
                        del(self.work[i])
                        self.work.appendleft(value)
                        break                    
            else:
                return self.err('error_index_on_workstack_invalid', 'roll')
            return 'nobreak'

    '''
    Instruction pick : copie le nième élément qui se trouve en haut de la pile de travail en haut de la pile de travail
    ( # n1 n2 ... n# ... ) PICK ( n# n1 n2 ... n# ... )
    '''
    def pick_instr(self):
        if self.require_stack(1, 'pick') == None:
            number = self.pop_work()
            if number < len(self.work):
                value = self.work[number]
                self.work.appendleft(value)
            else:
                return self.err('error_index_on_workstack_invalid', 'pick')
            return 'nobreak'

    '''
    Instruction over : copie le 2ième élément qui se trouve en haut de la pile de travail en haut de la pile de travail
    '''
    def over_instr(self):
        if self.require_stack(2, 'over') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            self.work.appendleft(op2)
            self.work.appendleft(op1)
            self.work.appendleft(op2)
            return 'nobreak'

    '''
    Instruction >r : supprime l'élément qui se trouve en haut de la pile de travail pour le positionner en haut de la pile de retour
    Si l'élément est une variable, ce qui est positionné sur la pile de retour est le nom de cette variable
    '''
    def tor_instr(self):
        if self.require_stack(1, '>r') == None:
            op = self.pop_work()
            self.altwork.appendleft(op)
            return 'nobreak'   

    '''
    Instruction @r : supprime l'élément qui se trouve en haut de la pile de travail pour le positionner en haut de la pile de retour
    Si l'élément est une variable, ce qui est positionné sur la pile de retour est la valeur de cette variable
    '''
    def arobaser_instr(self):
        if self.require_stack(1, '@r') == None:
            op = self.pop_work()
            if op in self.variables:
                self.altwork.appendleft(self.dictionary[op])
            else:
                self.altwork.appendleft(op)
            return 'nobreak'   

    '''
    Instruction r> : supprime l'élément qui se trouve en haut de la pile de retour pour le positionner en haut de la pile de travail
    Si l'élément est une variable, ce qui est positionné sur la pile de travail est le nom de cette variable
    '''
    def fromr_instr(self):
        if self.require_altstack(1, 'r>') == None:
            op = self.pop_altwork()
            self.work.appendleft(op)
            return 'nobreak'   

    '''
    Instruction r@ : supprime l'élément qui se trouve en haut de la pile de retour pour le positionner en haut de la pile de travail
    Si l'élément est une variable, ce qui est positionné sur la pile de travail est la valeur de cette variable
    '''
    def rarobase_instr(self):
        if self.require_altstack(1, 'r@') == None:
            op = self.pop_altwork()
            if op in self.variables:
                self.work.appendleft(self.dictionary[op])
            else:
                self.work.appendleft(op)
            return 'nobreak'   

    '''
    Instruction rdrop : supprime l'élément qui se trouve en haut de la pile de retour
    '''
    def rdrop_instr(self):
        if self.require_altstack(1, 'rdrop') == None:
            self.altwork.popleft()
            return 'nobreak'

    '''
    Instruction rswap : échange les 2 éléments qui se trouve en haut de la pile de retour
    '''
    def rswap_instr(self):
        if self.require_altstack(2, 'rswap') == None:
            op1 = self.pop_altwork()
            op2 = self.pop_altwork()
            self.altwork.appendleft(op1)
            self.altwork.appendleft(op2)
            return 'nobreak'

    '''
    Instruction rdup : dupplique l'élément qui se trouve en haut de la pile de travail alternative et l'ajoute en haut de la pile
    '''
    def rdup_instr(self):
        if self.require_altstack(1, 'rdup') == None:
            temp = self.altwork[0]
            self.altwork.appendleft(temp)
            return 'nobreak'

    '''
    Instruction rover : copie le 2ième élément qui se trouve en haut de la pile de travail alternative en haut de la pile de travail alternative
    '''
    def rover_instr(self):
        if self.require_altstack(2, 'rover') == None:
            op1 = self.pop_altwork()
            op2 = self.pop_altwork()
            self.altwork.appendleft(op2)
            self.altwork.appendleft(op1)
            self.altwork.appendleft(op2)
            return 'nobreak'

    '''
    Instruction rdump : affiche le contenu de la pile de retour
    '''
    def rdump_instr(self):
        if self.require_altstack(1, 'rdump') == None:
            for temp in self.altwork:
                print(temp, end=' ')
            print('')
            return 'nobreak'

    '''
    Instruction wp? : indique l'adresse du prochain élément de la pile de travail
    '''
    def workstackpointer_instr(self):
        self.work.appendleft(len(self.work))
        return 'nobreak'

    '''
    Instruction ' : permet d'insérer un mot sur la pile de travail sans l'exécuter
    exemple : 
        : test .cr ; 
        defer print 
        ' test is print
    '''
    def tick_instr(self):
        name = self.pop_sequence()
        #for p in self.interpreter.packages.keys():
        #    if name in self.interpreter.packages[p].dictionary:
        self.work.appendleft(name)
        return 'nobreak'
        #return self.err('error_not_a_variable_or_definition', '\' (tick)')

    '''
    Instruction @ : insère dans la pile de travail la valeur d'une variable ou d'une constante
    '''
    def arobase_instr(self):
        if self.require_stack(1, '@') == None:
            name = str(self.work[0])
            if name in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                self.work.popleft()
                self.work.appendleft(self.interpreter.locals[self.interpreter.lastseqnumber][name])
                return 'nobreak'
            elif name in self.variables:
                self.work.popleft()
                pack = self.interpreter.search_in_pack(name)
                if pack != False:
                    d = self.interpreter.packages[pack].dictionary[name]
                try:
                    self.work.appendleft(d)
                except TypeError:
                    return self.err('error_integer_and_float_expected', '@')
                return 'nobreak'
            else:
                return self.err('error_not_a_variable_or_constant', '@')

    '''
    Instruction cls : vide les éléments de la pile de travail (clear stack)
    '''
    def clearstack_instr(self):
        self.work.clear()
        return 'nobreak'

    '''
    Instruction char : met sur la pile de travail le code du premier caractère d'une chaine de caractères
    '''
    def char_instr(self):
        if self.require_stack(1, 'char') == None:
            temp = self.pop_work()
            if isinstance(temp, str):
                self.work.appendleft(ord(temp[0]))
                return 'nobreak'
            else:
                return self.err('error_strings_expected', 'char')

    '''
    Instruction chars : ajoute sur la pile de travail le nombre de caractère d'une chaine
    '''
    def chars_instr(self):
        if self.require_stack(1, 'chars') == None:
            temp = self.pop_work()
            if isinstance(temp, str):
                self.work.appendleft(len(temp))
                return 'nobreak'
            else:
                return self.err('error_strings_expected', 'chars')
