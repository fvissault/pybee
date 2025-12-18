from collections import deque

class Definitions:
        
    '''
    Instruction words : affiche la liste des mots du dictionnaire
    '''
    def words_instr(self):
        mystr = ''
        for p in self.interpreter.packages.keys():
            mystr += '-------/' + p + '/ (' + str(len(self.interpreter.packages[p].dictionary)) + ' words)'
            if self.interpreter.output == 'web':
                mystr += '<br>'
            else:
                mystr += '\n'
            for word in sorted(self.interpreter.packages[p].dictionary.keys()):
                mystr += word + ' '
            if self.interpreter.output == 'web':
                mystr += '<br><br>'
            else:
                mystr += '\n\n'
        if self.interpreter.output == 'web':
            print(mystr, end='')
        else:
            print(mystr.strip())
        return 'nobreak'

    '''
    Instruction : ... ; : permet de créer de nouveaux mots et d'enrichir le dictionaire 
    '''
    def begin_def_instr(self):
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if self.interpreter.isemptylastsequence():
            return self.err('error_def_name_missing', 'definition')
        defname = seq[0]
        if defname in self.dictionary.keys():
            return self.err('error_def_name_already_exists', 'definition')
        if defname == ':':
            return self.err('error_twopoints_invalid', 'definition')
        for p in self.interpreter.packages.keys():
            if defname in self.interpreter.packages[p].dictionary.keys():
                return self.err('error_def_name_already_exists', 'definition')
        seq.popleft()
        if self.interpreter.isemptylastsequence():
            return self.err('error_def_end_missing', 'definition')
        instr = self.pop_sequence()
        if instr == ':':
            return self.err('error_twopoints_invalid', 'definition')
        comment = ''
        if instr == '(':
            # traitement du commentaire
            while instr != ')':
                if self.interpreter.isemptylastsequence():
                    return self.err('error_def_end_missing', 'definition')
                instr = self.pop_sequence()
                if instr != ')':
                    comment = comment + ' ' + instr
        # commentaire ou pas : traitement du corps de la définition
        defbody = ''
        if comment == '':
            # si l'instruction est immediate, on l'exécute tout de suite et on ne l'ajoute pas dans le corps du mot
            if str(instr).lower() in self.interpreter.immediate:
                imm = deque()

                dictinstr = self.interpreter.get_instr_content(str(instr).lower())
                if dictinstr == None:
                    return self.err('error_definition_dont_exists', 'definition')
                if isinstance(dictinstr, str):
                    splitdictinstr = dictinstr.split()
                    postponefound = False
                    stringfound = False
                    string = ''
                    for el in splitdictinstr:
                        if el[-1] == '"':
                            string += ' ' + el
                            stringfound = False
                            imm.append(string.strip(' '))
                            continue
                        if el[0] == '"':
                            stringfound = True
                            string += ' ' + el
                            continue
                        if stringfound:
                            string += ' ' + el
                            continue
                        if postponefound:
                            defbody = defbody + ' ' + str(el)
                        if str(el).lower() == 'postpone':
                            postponefound = True
                            continue
                        else:
                            if postponefound == False:
                                imm.append(el)
                            else:
                                postponefound = False
                else:
                    imm.append(instr)


                self.interpreter.set_sequence(imm)
                self.interpreter.interpret('last_sequence')
            else:
                if instr != ';':
                    defbody = defbody + ' ' + str(instr)
        while instr != ';' and str(instr).lower() != 'does>':
            self.interpreter.decreaselastseqnumber()
            if self.interpreter.isemptylastsequence():
                return self.err('error_def_end_missing', 'definition')
            instr = self.pop_sequence()
            # si l'instruction est immediate, on l'exécute tout de suite et on ne l'ajoute pas dans le corps du mot
            if str(self.interpreter.instr).lower() in self.interpreter.immediate:
                imm = deque()

                dictinstr = self.interpreter.get_instr_content(str(instr).lower())
                if dictinstr == None:
                    return self.err('error_definition_dont_exists', 'definition')
                if isinstance(dictinstr, str):
                    splitdictinstr = dictinstr.split()
                    postponefound = False
                    for el in splitdictinstr:
                        if el[-1] == '"':
                            string += ' ' + el
                            stringfound = False
                            imm.append(string.strip(' '))
                            continue
                        if el[0] == '"':
                            stringfound = True
                            string += ' ' + el
                            continue
                        if stringfound:
                            string += ' ' + el
                            continue
                        if postponefound:
                            defbody = defbody + ' ' + str(el)
                        if str(el).lower() == 'postpone':
                            postponefound = True
                            continue
                        else:
                            if postponefound == False:
                                imm.append(el)
                            else:
                                postponefound = False
                else:
                    imm.append(instr)

                self.interpreter.set_sequence(imm)
                self.interpreter.interpret('last_sequence')
            else:
                if instr != ';':
                    defbody = defbody + ' ' + str(instr)
        self.dictionary[defname] = defbody.strip()

        # traitement de la section does>
        does = deque()
        if str(instr).lower() == 'does>':
            while instr != ';':
                if self.interpreter.isemptylastsequence():
                    return self.err('error_def_end_missing', 'does>')
                instr = self.pop_sequence()
                if instr == ':':
                    return self.err('error_twopoints_invalid', 'does>')
                if instr != ';':
                    does.append(str(instr))
            self.interpreter.compile[defname] = does.copy()

        self.interpreter.recentWord = defname

        if comment.strip() != '':
            self.help.set_help(defname, comment.strip())
        
        self.interpreter.userdefinitions[defname] = deque()
        return 'nobreak'
    
    '''
    Instruction : ... ; : cloture la création d'une définition 
    '''
    def pointvirg_instr(self):
        return self.err('error_definition_end_invalid', ';')

    '''
    Instruction const : permet de créer une constante et l'ajoute au dictionnaire
    '''
    def const_instr(self):
        if self.require_stack(1, 'const') == None:
            if self.interpreter.isemptylastsequence():
                return self.err('error_name_missing', 'const')
            const_name = self.interpreter.sequences[self.interpreter.lastseqnumber][0]
            if const_name in self.dictionary.keys():
                return self.err('error_name_already_exists', 'const')
            self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
            value = self.pop_work()
            self.dictionary[const_name] = value
            return 'nobreak'

    '''
    Instruction forget : supprime une variable ou un mot défini par l'utilisateur dans le dictionnaire
    '''
    def forget_instr(self):
        if self.interpreter.isemptylastsequence():
            return self.err('error_variable_or_definition_name_missing', 'forget')
        name = self.pop_sequence()
        if name not in self.variables and name not in self.interpreter.userdefinitions.keys():
            return self.err('error_not_a_variable_or_definition', 'forget')
        if name in self.variables:
            self.variables.remove(name)
        if name in self.interpreter.userdefinitions.keys():
            self.interpreter.userdefinitions.pop(name)
        self.dictionary.pop(name)
        return 'nobreak'

    '''
    Instruction create : création d'une variable
    '''
    def create_instr(self):
        # self.interpreter.sequences[self.interpreter.lastseqnumber]
        if self.interpreter.lastseqnumber > 0:
            # faire une boucle pour récupérer le bon var_name
            var_name = ''
            for i in range(self.interpreter.lastseqnumber - 1, -1, -1):
                if len(self.interpreter.sequences[i]) > 0:
                    var_name = str(self.interpreter.sequences[i][0])
                    self.interpreter.sequences[i].popleft()
                    break
            if var_name == '':
                return self.err('error_not_a_variable', 'create')
        else:
            var_name = str(self.interpreter.sequences[self.interpreter.lastseqnumber][0])
            self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        if var_name in list(self.dictionary.keys()):
            return self.err('error_name_already_exists', 'create')
        self.dictionary[var_name] = None
        if self.interpreter.from_instr in self.interpreter.compile.keys():
            self.interpreter.userdefinitions[var_name] = self.interpreter.compile[self.interpreter.from_instr].copy()
        else:
            self.variables.append(var_name)
        self.work.appendleft(var_name)
        self.interpreter.recentWord = var_name
        return 'nobreak'

    '''
    Instruction does> : définition de l'exécution d'instructions automatiques
    '''
    def does_instr(self):
        return self.err('error_does_invalid', 'does>')

    '''
    Instruction immediate : définition de l'exécution d'instructions immediate
    '''
    def immediate_instr(self):
        self.interpreter.immediate.append(self.interpreter.recentWord)
        return "nobreak"

    '''
    Instruction postpone : sorte d'alias de mots
    '''
    def postpone_instr(self):
        if len(self.interpreter.sequences[self.interpreter.lastseqnumber]) == 0:
            return self.err('error_variable_or_definition_name_missing', 'postpone')
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        return "nobreak"
    
    '''
    Instruction recurse : applique la récursivité dans un mot
    '''
    def recurse_instr(self):
        if self.interpreter.from_instr != '':
            self.interpreter.sequences[self.interpreter.lastseqnumber].extendleft(self.interpreter.from_instr)
        return 'nobreak'

    '''
    Instruction defer : permet de créer un mot dans le dictionnaire sans instruction
    exemple :
        defer print
    '''
    def defer_instr(self):
        name = self.pop_sequence()
        for p in self.interpreter.packages.keys():
            if name in self.interpreter.packages[p].dictionary.keys():
                return self.err('error_name_already_exists', 'defer')
        self.dictionary[name] = ''
        self.interpreter.defer.append(name)
        return 'nobreak'

    '''
    Instruction is : affecte un mot à un autre mot déferré
    exemple : 
        : test .cr ; 
        defer print 
        ' test is print
    '''
    def is_instr(self):
        if self.require_stack(1, 'is') == None:
            wordname = self.pop_work()
            defername = self.pop_sequence()
            if defername in self.interpreter.defer:
                self.dictionary[defername] = str(wordname)
                self.interpreter.userdefinitions[defername] = deque()
                return 'nobreak'
            else:
                return self.err('error_not_a_defer_action', 'is')
    
    '''
    Instruction :noname : permet de créer une définition qui n'a pas de nom et l'insère sur la pile de travail
    exemple : 
        :noname . cr ;
    '''
    def noname_instr(self):
        if self.interpreter.isemptylastsequence():
            return self.err('error_def_end_missing', ':noname')
        instr = self.pop_sequence()
        if instr == ':':
            return self.err('error_twopoints_invalid', ':noname')
        comment = ''
        if instr == '(':
            # traitement du commentaire
            while instr != ')':
                if self.interpreter.isemptylastsequence():
                    return self.err('error_def_end_missing', ':noname')
                instr = self.pop_sequence()
                if instr != ')':
                    comment = comment + ' ' + instr
        # commentaire ou pas : traitement du corps de la définition
        defbody = ''
        if comment == '':
            defbody = defbody + ' ' + str(instr)
        while instr != ';':
            if self.interpreter.isemptylastsequence():
                return self.err('error_def_end_missing', ':noname')
            instr = self.pop_sequence()
            if instr == ':':
                return self.err('error_twopoints_invalid', ':noname')
            if instr != ';':
                defbody = defbody + ' ' + str(instr)
        self.work.appendleft(defbody.strip())
        return 'nobreak'
    
    '''
    Instruction local : création d'une variable locale à un mot
    exemple : 
        val local a => créé une variable locale a = val
    '''
    def local_instr(self):
        if self.interpreter.lastseqnumber == 0:
            return self.err('error_local_var_only_in_def', 'local')
        if self.require_stack(1, 'local') == None:
            val = self.pop_work()
            if self.interpreter.isemptylastsequence():
                return self.err('error_local_var_name_missing', 'local')
            localname = self.pop_sequence()
            self.interpreter.locals[self.interpreter.lastseqnumber][localname] = val
            return 'nobreak'

    '''
    Instruction abort : arrête le programme complètement à l'endroit ou abort est écrit
    '''
    def abort_instr(self):
        self.work.clear()
        self.altwork.clear()
        self.interpreter.sequences.clear()
        self.interpreter.locals.clear()
        return 'break'
        
    '''
    Instruction ?def : indique si le haut de la pile de travail est un mot du dictionnaire
    '''
    def isdef_instr(self):
        if self.require_stack(1, '?def') == None:
            name = self.pop_work()
            for p in self.interpreter.packages.keys():
                if name in self.interpreter.packages[p].dictionary.keys():
                    self.work.appendleft(1)
                    return 'nobreak'
            self.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?var : indique si le haut de la pile de travail est une variable
    '''
    def isvar_instr(self):
        if self.require_stack(1, '?var') == None:
            name = self.pop_work()
            for p in self.interpreter.packages.keys():
                if name in self.interpreter.packages[p].variables:
                    self.work.appendleft(1)
                    return 'nobreak'
            self.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?const : indique si le haut de la pile de travail est une constante
    Attention : Usage : ' const_name ?const if ... then
    '''
    def isconst_instr(self):
        if self.require_stack(1, '?const') == None:
            name = self.pop_work()
            if name in self.interpreter.userdefinitions:
                self.work.appendleft(1)
                return 'nobreak'
            self.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?local : indique si le nombre de la pile de travail est une variable locale
    '''
    def islocal_instr(self):
        if self.require_stack(1, '?local') == None:
            name = self.pop_work()
            if name in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
