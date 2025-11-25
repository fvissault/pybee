class StackInstructions:

    '''
    Instruction dump : affiche l'ensemble des éléments de la pile de travail
    '''
    def dump_instr(self):
        if len(self.work) > 0:
            for temp in self.work:
                print(temp, end=' ')
            return 'nobreak'
        else:
            return self.nothing_in_work('dump')

    '''
    Instruction drop : supprime l'élément qui se trouve en haut de la pile de travail
    '''
    def drop_instr(self):
        if len(self.work) > 0:
            self.pop_work()
            return 'nobreak'
        else:
            return self.nothing_in_work('drop')

    '''
    Instruction roll : effectue une rotation avec le nième élément qui se trouve en haut de la pile de travail
    ( # n1 n2 ... n# ... ) ROLL ( n# n1 n2 ... )

    1 roll ==> swap
    2 roll ==> rot
    '''
    def roll_instr(self):
        if len(self.work) > 0:
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
        else:
            return self.nothing_in_work('roll')

    '''
    Instruction pick : copie le nième élément qui se trouve en haut de la pile de travail en haut de la pile de travail
    ( # n1 n2 ... n# ... ) PICK ( n# n1 n2 ... n# ... )
    '''
    def pick_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if number < len(self.work):
                value = self.work[number]
                self.work.appendleft(value)
            else:
                return self.err('error_index_on_workstack_invalid', 'pick')
            return 'nobreak'
        else:
            return self.nothing_in_work('pick')

    '''
    Instruction over : copie le 2ième élément qui se trouve en haut de la pile de travail en haut de la pile de travail
    '''
    def over_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            self.work.appendleft(op2)
            self.work.appendleft(op1)
            self.work.appendleft(op2)
            return 'nobreak'
        else:
            return self.nothing_in_work('over')

    '''
    Instruction >r : supprime l'élément qui se trouve en haut de la pile de travail pour le positionner en haut de la pile de retour
    Si l'élément est une variable, ce qui est positionné sur la pile de retour est le nom de cette variable
    '''
    def tor_instr(self):
        if len(self.work) > 0:
            op = self.pop_work()
            self.altwork.appendleft(op)
            return 'nobreak'   
        else:
            return self.nothing_in_work('>r')

    '''
    Instruction @r : supprime l'élément qui se trouve en haut de la pile de travail pour le positionner en haut de la pile de retour
    Si l'élément est une variable, ce qui est positionné sur la pile de retour est la valeur de cette variable
    '''
    def arobaser_instr(self):
        if len(self.work) > 0:
            op = self.pop_work()
            if op in self.variables:
                self.altwork.appendleft(self.dictionary[op])
            else:
                self.altwork.appendleft(op)
            return 'nobreak'   
        else:
            return self.nothing_in_work('@r')

    '''
    Instruction r> : supprime l'élément qui se trouve en haut de la pile de retour pour le positionner en haut de la pile de travail
    Si l'élément est une variable, ce qui est positionné sur la pile de travail est le nom de cette variable
    '''
    def fromr_instr(self):
        if len(self.altwork) > 0:
            op = self.pop_altwork()
            self.work.appendleft(op)
            return 'nobreak'   
        else:
            return self.nothing_in_return('r>')

    '''
    Instruction r@ : supprime l'élément qui se trouve en haut de la pile de retour pour le positionner en haut de la pile de travail
    Si l'élément est une variable, ce qui est positionné sur la pile de travail est la valeur de cette variable
    '''
    def rarobase_instr(self):
        if len(self.altwork) > 0:
            op = self.pop_altwork()
            if op in self.variables:
                self.work.appendleft(self.dictionary[op])
            else:
                self.work.appendleft(op)
            return 'nobreak'   
        else:
            return self.nothing_in_return('r@')

    '''
    Instruction rdrop : supprime l'élément qui se trouve en haut de la pile de retour
    '''
    def rdrop_instr(self):
        if len(self.altwork) > 0:
            self.altwork.popleft()
            return 'nobreak'
        else:
            return self.nothing_in_return('rdrop')

    '''
    Instruction rswap : échange les 2 éléments qui se trouve en haut de la pile de retour
    '''
    def rswap_instr(self):
        if len(self.altwork) > 1:
            op1 = self.pop_altwork()
            op2 = self.pop_altwork()
            self.altwork.appendleft(op1)
            self.altwork.appendleft(op2)
            return 'nobreak'
        else:
            return self.nothing_in_return('rswap')

    '''
    Instruction rdup : dupplique l'élément qui se trouve en haut de la pile de travail alternative et l'ajoute en haut de la pile
    '''
    def rdup_instr(self):
        if len(self.altwork) > 0:
            temp = self.altwork[0]
            self.altwork.appendleft(temp)
            return 'nobreak'
        else:
            return self.nothing_in_return('rdup')

    '''
    Instruction rover : copie le 2ième élément qui se trouve en haut de la pile de travail alternative en haut de la pile de travail alternative
    '''
    def rover_instr(self):
        if len(self.altwork) > 1:
            op1 = self.pop_altwork()
            op2 = self.pop_altwork()
            self.altwork.appendleft(op2)
            self.altwork.appendleft(op1)
            self.altwork.appendleft(op2)
            return 'nobreak'
        else:
            return self.nothing_in_return('rover')

    '''
    Instruction rdump : affiche le contenu de la pile de retour
    '''
    def rdump_instr(self):
        if len(self.altwork) > 0:
            for temp in self.altwork:
                print(temp, end=' ')
            print('')
            return 'nobreak'
        else:
            return self.nothing_in_return('rdump')

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
        for p in self.interpreter.packages.keys():
            if name in self.interpreter.packages[p].dictionary:
                self.work.appendleft(name)
                return 'nobreak'
        return self.err('error_not_a_variable_or_definition', '\' (tick)')

    '''
    Instruction @ : insère dans la pile de travail la valeur d'une variable ou d'une constante
    '''
    def arobase_instr(self):
        if len(self.work) > 0:
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
        else:
            return self.nothing_in_work('@')

    '''
    Instruction cls : vide les éléments de la pile de travail (clear stack)
    '''
    def clearstack_instr(self):
        self.work.clear()
        return 'nobreak'
