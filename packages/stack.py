import traceback

class StackInstructions:

    '''
    Instruction dump : affiche l'ensemble des éléments de la pile de travail
    '''
    def dump_instr(self):
        try:
            if self.require_stack(1, 'dump') == None:
                for temp in self.interpreter.work:
                    print(temp, end=' ')
                print()
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction drop : supprime l'élément qui se trouve en haut de la pile de travail
    '''
    def drop_instr(self):
        try:
            if self.require_stack(1, 'drop') == None:
                self.pop_work()
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction roll : effectue une rotation avec le nième élément qui se trouve en haut de la pile de travail
    ( # n1 n2 ... n# ... ) ROLL ( n# n1 n2 ... )

    1 roll ==> swap
    2 roll ==> rot
    '''
    def roll_instr(self):
        try:
            if self.require_stack(1, 'roll') == None:
                number = self.pop_work()
                if number < len(self.interpreter.work):
                    for i in range(len(self.interpreter.work)):
                        value = self.interpreter.work[i]
                        if i == number:
                            del(self.interpreter.work[i])
                            self.interpreter.work.appendleft(value)
                            break                    
                else:
                    return self.err('error_index_on_workstack_invalid', 'roll')
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction pick : copie le nième élément qui se trouve en haut de la pile de travail en haut de la pile de travail
    ( # n1 n2 ... n# ... ) PICK ( n# n1 n2 ... n# ... )
    '''
    def pick_instr(self):
        try:
            if self.require_stack(1, 'pick') == None:
                number = self.pop_work()
                if number < len(self.interpreter.work):
                    value = self.interpreter.work[number]
                    self.interpreter.work.appendleft(value)
                else:
                    return self.err('error_index_on_workstack_invalid', 'pick')
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction over : copie le 2ième élément qui se trouve en haut de la pile de travail en haut de la pile de travail
    '''
    def over_instr(self):
        try:
            if self.require_stack(2, 'over') == None:
                op1 = self.pop_work()
                op2 = self.pop_work()
                self.interpreter.work.appendleft(op2)
                self.interpreter.work.appendleft(op1)
                self.interpreter.work.appendleft(op2)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction >r : supprime l'élément qui se trouve en haut de la pile de travail pour le positionner en haut de la pile de retour
    Si l'élément est une variable, ce qui est positionné sur la pile de retour est le nom de cette variable
    '''
    def tor_instr(self):
        try:
            if self.require_stack(1, '>r') == None:
                op = self.pop_work()
                self.interpreter.altwork.appendleft(op)
                return 'nobreak'   
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction @r : supprime l'élément qui se trouve en haut de la pile de travail pour le positionner en haut de la pile de retour
    Si l'élément est une variable, ce qui est positionné sur la pile de retour est la valeur de cette variable
    '''
    def arobaser_instr(self):
        try:
            if self.require_stack(1, '@r') == None:
                op = self.pop_work()
                if op in self.variables:
                    self.interpreter.altwork.appendleft(self.dictionary[op])
                else:
                    self.interpreter.altwork.appendleft(op)
                return 'nobreak'   
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction r> : supprime l'élément qui se trouve en haut de la pile de retour pour le positionner en haut de la pile de travail
    Si l'élément est une variable, ce qui est positionné sur la pile de travail est le nom de cette variable
    '''
    def fromr_instr(self):
        try:
            if self.require_altstack(1, 'r>') == None:
                op = self.pop_altwork()
                self.interpreter.work.appendleft(op)
                return 'nobreak'   
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction r@ : supprime l'élément qui se trouve en haut de la pile de retour pour le positionner en haut de la pile de travail
    Si l'élément est une variable, ce qui est positionné sur la pile de travail est la valeur de cette variable
    '''
    def rarobase_instr(self):
        try:
            if self.require_altstack(1, 'r@') == None:
                op = self.pop_altwork()
                if op in self.variables:
                    self.interpreter.work.appendleft(self.dictionary[op])
                else:
                    self.interpreter.work.appendleft(op)
                return 'nobreak'   
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction rdrop : supprime l'élément qui se trouve en haut de la pile de retour
    '''
    def rdrop_instr(self):
        try:
            if self.require_altstack(1, 'rdrop') == None:
                self.interpreter.altwork.popleft()
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction rswap : échange les 2 éléments qui se trouve en haut de la pile de retour
    '''
    def rswap_instr(self):
        try:
            if self.require_altstack(2, 'rswap') == None:
                op1 = self.pop_altwork()
                op2 = self.pop_altwork()
                self.interpreter.altwork.appendleft(op1)
                self.interpreter.altwork.appendleft(op2)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction rdup : dupplique l'élément qui se trouve en haut de la pile de travail alternative et l'ajoute en haut de la pile
    '''
    def rdup_instr(self):
        try:
            if self.require_altstack(1, 'rdup') == None:
                temp = self.interpreter.altwork[0]
                self.interpreter.altwork.appendleft(temp)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction rover : copie le 2ième élément qui se trouve en haut de la pile de travail alternative en haut de la pile de travail alternative
    '''
    def rover_instr(self):
        try:
            if self.require_altstack(2, 'rover') == None:
                op1 = self.pop_altwork()
                op2 = self.pop_altwork()
                self.interpreter.altwork.appendleft(op2)
                self.interpreter.altwork.appendleft(op1)
                self.interpreter.altwork.appendleft(op2)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction rdump : affiche le contenu de la pile de retour
    '''
    def rdump_instr(self):
        try:
            if self.require_altstack(1, 'rdump') == None:
                for temp in self.interpreter.altwork:
                    print(temp, end=' ')
                print('')
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction wp? : indique l'adresse du prochain élément de la pile de travail
    '''
    def workstackpointer_instr(self):
        try:
            self.interpreter.work.appendleft(len(self.interpreter.work))
            return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction ' : permet d'insérer un mot sur la pile de travail sans l'exécuter
    exemple : 
        : test .cr ; 
        defer print 
        ' test is print
    '''
    def tick_instr(self):
        try:
            name = self.pop_sequence()
            #for p in self.interpreter.packages.keys():
            #    if name in self.interpreter.packages[p].dictionary:
            self.interpreter.work.appendleft(name)
            return 'nobreak'
            #return self.err('error_not_a_variable_or_definition', '\' (tick)')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction @ : insère dans la pile de travail la valeur d'une variable ou d'une constante
    '''
    def arobase_instr(self):
        try:
            if self.require_stack(1, '@') == None:
                name = str(self.interpreter.work[0])
                if name in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                    self.interpreter.work.popleft()
                    self.interpreter.work.appendleft(self.interpreter.locals[self.interpreter.lastseqnumber][name])
                    return 'nobreak'
                elif name in self.variables:
                    self.interpreter.work.popleft()
                    pack = self.interpreter.search_in_pack(name)
                    if pack != False:
                        d = self.interpreter.packages[pack].dictionary[name]
                    try:
                        self.interpreter.work.appendleft(d)
                    except TypeError:
                        return self.err('error_integer_and_float_expected', '@')
                    return 'nobreak'
                else:
                    return self.err('error_not_a_variable_or_constant', '@')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction cls : vide les éléments de la pile de travail (clear stack)
    '''
    def clearstack_instr(self):
        try:
            self.interpreter.work.clear()
            return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction char : met sur la pile de travail le code du premier caractère d'une chaine de caractères
    '''
    def char_instr(self):
        try:
            if self.require_stack(1, 'char') == None:
                temp = self.pop_work()
                if isinstance(temp, str):
                    self.interpreter.work.appendleft(ord(temp[0]))
                    return 'nobreak'
                else:
                    return self.err('error_strings_expected', 'char')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    '''
    Instruction char? : met sur la pile de travail le nième caractère d'une chaine de caractères
    '''
    def getchar_instr(self):
        try:
            if self.require_stack(2, 'char?') == None:
                pos = self.pop_work()
                if isinstance(pos, int):
                    s = self.pop_work()
                    if isinstance(s, str):
                        self.interpreter.work.appendleft(s[pos])
                        return 'nobreak'
                    else:
                        return self.err('error_strings_expected', 'char? string parameter')
                else:
                    return self.err('error_integer_expected', 'char? position parameter')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"
            

    '''
    Instruction chars : ajoute sur la pile de travail le nombre de caractère d'une chaine
    '''
    def chars_instr(self):
        try:
            if self.require_stack(1, 'chars') == None:
                temp = self.pop_work()
                if isinstance(temp, str):
                    self.interpreter.work.appendleft(len(temp))
                    return 'nobreak'
                else:
                    return self.err('error_strings_expected', 'chars')
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"

    def maybeint_instr(self):
        try:
            if self.require_stack(1, 'maybe-int') == None:
                x = self.pop_work()
                if not isinstance(x, str):
                    self.interpreter.work.appendleft(x)
                    return 'nobreak'
                s = x.strip()
                if s == "":
                    self.interpreter.work.appendleft(x)
                    return 'nobreak'
                sign = 1
                if s[0] == '-':
                    sign = -1
                    s = s[1:]
                elif s[0] == '+':
                    s = s[1:]
                if not s.isdigit():
                    self.interpreter.work.appendleft(x)
                    return 'nobreak'
                n = 0
                for c in s:
                    n = n * 10 + (ord(c) - ord('0'))
                self.interpreter.work.appendleft(sign * n)
                return 'nobreak'
        except Exception as e:
            tb = traceback.TracebackException.from_exception(e)
            print("".join(tb.format()))
            self.logerr("".join(tb.format()))        
            return "break"
