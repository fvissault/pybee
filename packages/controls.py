import re
from collections import deque

class Controls:
    
    '''
    Instruction ( : marque le début d'un commentaire 
    '''
    def bcomment_instr(self):
        self.loginfo('Exec controls ( ... ) instruction')
        instr = self.pop_sequence()
        while instr != ')':
            if self.interpreter.isemptylastsequence():
                return self.err('error_comment_invalid', '( ... )')
            instr = self.pop_sequence()
        return 'nobreak'

    '''
    Instruction ) : marque la fin d'un commentaire. ne peut pas être utilisé sans ( 
    '''
    def ecomment_instr(self):
        return self.err('error_comment_invalid', '( ... )')

    '''
    Instruction load : inclut le contenu d'un fichier Beetle dans le dictionnaire principal
    '''
    def load_instr(self):
        self.loginfo('Exec controls load instruction')
        if self.interpreter.isemptylastsequence():
            return self.err('error_filename_missing', 'load')
        filename = str(self.interpreter.sequences[self.interpreter.lastseqnumber][0])
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        filename = '{0}/{1}.btl'.format(self.dictionary['path'], filename)
        try:
            f = open(filename, encoding="utf-8")
        except(FileNotFoundError):
            return self.err('error_no_such_file', 'load' + filename)
        content = f.read()
        content = content.replace('"', '\\"')
        content = '"' + content + '" .'
        content = content.replace('\\"', '"')
        content = content.replace('<?btl', '" . ')
        content = content.replace('?>', ' "')
        content = content.replace('"" .', '')
        content = re.sub(r'\s+', ' ', content)
        sp = content.split(' ')
        self.interpreter.string_treatment(sp)
        self.interpreter.set_sequence(self.interpreter.instructions.copy())
        ret = self.interpreter.interpret('last_sequence')
        self.interpreter.decreaselastseqnumber()

        self.interpreter.instructions.clear()
        f.close()
        return 'nobreak'

    '''
    Instruction IF : Conditionnelle
    '''
    def cond_instr(self):
        self.loginfo('Exec controls conditional instruction')
        truezone = deque()
        falsezone = deque()
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if self.require_stack(1, 'conditional') == None:
            flag = self.pop_work()
            instr = self.search_conditional_sequence_for(truezone)
            if not instr:
                return self.err('error_conditional_invalid', 'conditional')
            if instr == 'else':
                instr = self.search_conditional_sequence_for(falsezone)
                if not instr:
                    return self.err('error_conditional_invalid', 'conditional')
            if flag == True:
                truezone.reverse()
                seq.extendleft(truezone.copy())
            else:
                falsezone.reverse()
                seq.extendleft(falsezone.copy())
            return 'nobreak'

    '''
    Instruction ELSE : Conditionnelle
    '''
    def else_instr(self):
        return self.err('error_conditional_invalid', 'else')

    '''
    Instruction THEN : Conditionnelle
    '''
    def then_instr(self):
        return self.err('error_conditional_invalid', 'then')

    def search_conditional_sequence_for(self, zone):
        depth = 0
        instr = self.pop_sequence()
        while depth >= 0:
            if str(instr).lower() == 'if':
                depth += 1
                zone.append(instr)
                instr = self.pop_sequence()
            elif str(instr).lower() == 'then' and depth == 0:
                break
            elif str(instr).lower() == 'then' and depth > 0:
                depth -= 1
                zone.append(instr)
                instr = self.pop_sequence()
            elif str(instr).lower() == 'else' and depth == 0:
                break
            else:
                zone.append(instr)
                if self.interpreter.isemptylastsequence():
                    return False
                instr = self.pop_sequence()
        return instr

    '''
    Instruction do : exécute une boucle DO ... LOOP | +LOOP
    '''
    def do_instr(self):
        self.loginfo('Exec controls do ... loop | +loop instruction')
        instructions = deque()
        if self.require_stack(2, 'do ... loop | +loop') == None:
            instr = self.search_do_loop(instructions)
            # lire le nom de la variable
            varname = self.interpreter.work[0]
            if varname in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                self.interpreter.work.popleft()
                begin = self.interpreter.locals[self.interpreter.lastseqnumber][varname]
            elif varname in self.variables:
                self.interpreter.work.popleft()
                # begin = Récupérer la valeur de la variable
                begin = self.dictionary[varname]
            else:
                return self.err('error_not_a_variable_or_constant', 'do ... loop begin')
            # limit = lire la limite de la boucle sur la pile work
            limit = self.pop_work()
            if not isinstance(begin, int) and not isinstance(begin, float):
                return self.err('error_integer_expected', 'do ... loop begin')
            if not isinstance(limit, int) and not isinstance(limit, float):
                return self.err('error_integer_expected', 'do ... loop limit')
            if instr == 'loop':
                for compteur in range(begin, limit):
                    if varname in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                        self.interpreter.locals[self.interpreter.lastseqnumber][varname] = compteur
                    else:
                        self.dictionary[varname] = compteur
                    self.interpreter.set_sequence(instructions.copy())
                    ret = self.interpreter.interpret('last_sequence')
                    if ret == 'break':
                        return 'break'
                    for key, value in self.interpreter.locals[self.interpreter.lastseqnumber].items():
                        if key in self.interpreter.locals[self.interpreter.lastseqnumber - 1]:
                            self.interpreter.locals[self.interpreter.lastseqnumber - 1][key] = value

                    self.interpreter.decreaselastseqnumber()
                    if ret == 'leave':
                        break
                instructions.clear()
            if instr == '+loop':
                compteur = begin
                while compteur < limit:
                    self.interpreter.set_sequence(instructions.copy())
                    ret = self.interpreter.interpret('last_sequence')

                    for key, value in self.interpreter.locals[self.interpreter.lastseqnumber].items():
                        if key in self.interpreter.locals[self.interpreter.lastseqnumber - 1]:
                            self.interpreter.locals[self.interpreter.lastseqnumber - 1][key] = value

                    self.interpreter.decreaselastseqnumber()
                    if ret == 'leave':
                        instructions.clear()
                        break
                    increment = self.pop_work()
                    compteur += increment
                    if varname in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                        self.interpreter.locals[self.interpreter.lastseqnumber][varname] = compteur
                    else:
                        self.dictionary[varname] = compteur
            instructions.clear()
            return 'nobreak'

    '''
    Instruction loop : exécute une boucle DO ... LOOP | +LOOP
    '''
    def loop_instr(self):
        return self.err('error_loop_invalid', 'loop')

    '''
    Instruction +loop : exécute une boucle DO ... LOOP | +LOOP
    '''
    def plusloop_instr(self):
        return self.err('error_loop_invalid', '+loop')

    '''
    Instruction begin : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def begin_instr(self):
        self.loginfo('Exec controls begin ... again | until ... while ... repeat instruction')
        firstzone = deque()
        secondzone = deque()
        instr = self.search_begin_loop(firstzone)
        if str(instr).lower() == 'while':
            instr = self.search_begin_loop(secondzone)
        if str(instr).lower() == 'again':
            while True:
                self.interpreter.set_sequence(firstzone.copy())
                ret = self.interpreter.interpret('last_sequence')

                for key, value in self.interpreter.locals[self.interpreter.lastseqnumber].items():
                    if key in self.interpreter.locals[self.interpreter.lastseqnumber - 1]:
                        self.interpreter.locals[self.interpreter.lastseqnumber - 1][key] = value

                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    break
        elif str(instr).lower() == 'until':
            flag = False
            while True:
                self.interpreter.set_sequence(firstzone.copy())
                ret = self.interpreter.interpret('last_sequence')

                for key, value in self.interpreter.locals[self.interpreter.lastseqnumber].items():
                    if key in self.interpreter.locals[self.interpreter.lastseqnumber - 1]:
                        self.interpreter.locals[self.interpreter.lastseqnumber - 1][key] = value

                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    break
                flag = self.pop_work()
                if not isinstance(flag, int):
                    return self.err('error_condition_invalid', 'begin ... until')
                if flag != 0:
                    firstzone.clear()
                    break
        elif str(instr).lower() == 'repeat':
            flag = True
            while True:
                self.interpreter.set_sequence(firstzone.copy())
                ret = self.interpreter.interpret('last_sequence')

                for key, value in self.interpreter.locals[self.interpreter.lastseqnumber].items():
                    if key in self.interpreter.locals[self.interpreter.lastseqnumber - 1]:
                        self.interpreter.locals[self.interpreter.lastseqnumber - 1][key] = value

                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    secondzone.clear()
                    break
                flag = self.pop_work()
                if not isinstance(flag, int):
                    return self.err('error_condition_invalid', 'begin ... while ... repeat')
                if flag == 0:
                    firstzone.clear()
                    secondzone.clear()
                    break
                self.interpreter.set_sequence(secondzone.copy())
                ret = self.interpreter.interpret('last_sequence')

                for key, value in self.interpreter.locals[self.interpreter.lastseqnumber].items():
                    if key in self.interpreter.locals[self.interpreter.lastseqnumber - 1]:
                        self.interpreter.locals[self.interpreter.lastseqnumber - 1][key] = value

                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    secondzone.clear()
                    break
        firstzone.clear()
        secondzone.clear()

    '''
    Instruction until : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def until_instr(self):
        return self.err('error_loop_invalid', 'until')

    '''
    Instruction again : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def again_instr(self):
        return self.err('error_loop_invalid', 'again')

    '''
    Instruction while : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def while_instr(self):
        return self.err('error_loop_invalid', 'while')

    '''
    Instruction repeat : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def repeat_instr(self):
        return self.err('error_loop_invalid', 'repeat')

    '''
    Regroupe les instructions contenues entre les instructions BEGIN ... UNTIL | AGAIN | WHILE ... REPEAT dans le paramètre zone
    '''
    def search_begin_loop(self, zone:deque):
        depth = 0
        instr = self.pop_sequence()
        while depth >= 0:
            if instr == 'begin':
                depth += 1
                zone.append(instr)
                instr = self.pop_sequence()
            elif instr == 'again' and depth == 0:
                break
            elif instr == 'again' and depth > 0:
                depth -= 1
                zone.append(instr)
                instr = self.pop_sequence()
            elif instr == 'until' and depth == 0:
                break
            elif instr == 'until' and depth > 0:
                depth -= 1
                zone.append(instr)
                instr = self.pop_sequence()
            elif instr == 'repeat' and depth == 0:
                break
            elif instr == 'repeat' and depth > 0:
                depth -= 1
                zone.append(instr)
                instr = self.pop_sequence()
            elif instr == 'while' and depth == 0:
                break
            else:
                zone.append(instr)
                instr = self.pop_sequence()
        return instr

    '''
    Regroupe les instructions contenues entre les instructions DO ... LOOP | +LOOP dans le paramètre zone
    '''
    def search_do_loop(self, zone:deque):
        depth = 0
        instr = self.pop_sequence()
        while depth >= 0:
            if instr == 'do':
                depth += 1
            elif (instr == 'loop' or instr == '+loop') and depth == 0:
                break
            elif (instr == 'loop' or instr == '+loop') and depth > 0:
                depth -= 1
            zone.append(instr)
            instr = self.pop_sequence()
        return instr

    def case_instr(self):
        temp_zone = deque()
        if self.require_stack(1, 'case ... endcase') == None:
            cond_zone = deque()
            of_zone = deque()
            def_zone = deque()
            op1 = self.pop_work()
            instr = ''
            while str(instr).lower() != 'endcase':
                cond_zone.clear()
                of_zone.clear()
                def_zone.clear()
                instr = self.search_case_sequence_for(cond_zone)
                if str(instr).lower() == 'endcase':
                    of_zone = cond_zone
                    break
                elif str(instr).lower() == 'of':
                    # executer cond_zone
                    i = self.exec_interpreter(list(cond_zone))
                    op2 = i.core_instr.pop_work()
                    if op1 == op2:
                        instr = self.search_case_sequence_for(of_zone)
                        self.get_case_sequence(temp_zone)
                        break
                    else:
                        instr = self.search_case_sequence_for(of_zone)
            of_zone.reverse()
            self.interpreter.sequences[self.interpreter.lastseqnumber].extendleft(of_zone)
            return 'nobreak'

    def search_case_sequence_for(self, zone:deque):
        instr = self.pop_sequence()
        while True:
            if str(instr).lower() == 'of' or str(instr).lower() == 'endof' or str(instr).lower() == 'endcase':
                break
            else:
                zone.append(instr)
                if str(instr).lower() == 'case':
                    self.get_case_sequence(zone)
                if self.interpreter.isemptylastsequence():
                    return False
                instr = self.pop_sequence()
        return str(instr).lower()

    def get_case_sequence(self, zone:deque):
        if not self.interpreter.isemptylastsequence():
            instr = self.pop_sequence()
            while str(instr).lower() != 'endcase':
                zone.append(instr)
                if str(instr).lower() == 'case':
                    self.get_case_sequence(zone)
                if self.interpreter.isemptylastsequence():
                    break
                instr = self.pop_sequence()

    '''
    Instruction endcase : fin du case : ne peut pas être utilisée seule
    '''
    def endcase_instr(self):
        return self.err('error_invalid_instruction', 'endcase alone')

    '''
    Instruction of : marque le début d'un cas de case : ne peut pas être utilisée seule
    '''
    def of_instr(self):
        return self.err('error_invalid_instruction', 'of alone')

    '''
    Instruction endof : marque la fin d'un cas de case : ne peut pas être utilisée seule
    '''
    def endof_instr(self):
        return self.err('error_invalid_instruction', 'endof alone')
