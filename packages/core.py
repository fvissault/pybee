import importlib
import os
import getpass
import keyboard
from collections import deque
from packages.errors.core_errors import core_errors
from packages.base_module import base_module
from packages.help.core_help import core_help

class core(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'dup' : '0 pick', 
                           '2dup' : 'over over', 
                           'drop' : self.drop_instr, 
                           '2drop' : 'drop drop', 
                           'nip' : 'swap drop', 
                           '2nip' : '2swap 2drop', 
                           'swap' : '1 roll', 
                           '2swap' : 'rot >r rot r>',
                           'reverse' : 'swap rot',
                           'roll' : self.roll_instr, 
                           'pick' : self.pick_instr, 
                           'over' : 'swap dup rot rot',
                           '2over' : '2>r 2dup 2r> 2swap', 
                           'rot' : '2 roll', 
                           '.' : self.point_instr, 
                           '.s' : 'dup .', 
                           '2.s' : '2dup . .', 
                           '.cr' : '. cr',
                           '.scr' : '.s cr',
                           '.2cr' : '.cr cr',
                           '.bl' : 'space emit',
                           'words' : self.words_instr, 
                           'dump' : self.dump_instr, 
                           'bye' : self.bye_instr, 
                           ':' : self.begin_def_instr,
                           ';' : self.pointvirg_instr, 
                           '(' : self.bcomment_instr, 
                           ')' : self.ecomment_instr, 
                           '1+' : '1 +', 
                           '2+' : '2 +', 
                           '2*' : '2 *', 
                           '1-' : '1 -', 
                           '2-' : '2 -', 
                           'true' : 1,
                           'false' : 0, 
                           '0=' : '0 =', 
                           '0>' : '0 >', 
                           '0<' : '0 <', 
                           '0>=' : '0 >=', 
                           '0<=' : '0 <=', 
                           'invert' : '0=', 
                           '2>r' : ' swap >r >r',
                           '2r>' : 'r> r> swap', 
                           'import' : self.import_instr, 
                           'help' : self.help_instr, 
                           'emit' : self.emit_instr,
                           'cr' : self.cr_instr, 
                           'input' : self.input_instr, 
                           'secinput' : self.secinput_instr, 
                           'var' : 'create ,', 
                           '2var' : 'create , ,', 
                           'const' : 'create ,',
                           '2const' : 'create , ,',
                           '@' : self.arobase_instr,
                           '?' : '@ .', 
                           '*' : self.prod_instr, 
                           '+' : self.plus_instr,
                           '-' : self.minus_instr,
                           '/' : self.div_instr,
                           'negate' : '-1 *',
                           'min' : '2dup <= if drop else nip then',
                           'max' : '2dup >= if drop else nip then',
                           '*/' : 'rot rot * swap /',
                           '%' : '100 */',
                           'packages' : self.packages_instr,
                           'variables' : self.variables_instr,
                           'constants' : self.constants_instr,
                           '=' : self.equal_instr, 
                           '<>' : '= invert',
                           '>' : self.sup_instr, 
                           '<' : self.inf_instr, 
                           '>=' : self.supequal_instr, 
                           '<=' : self.infequal_instr,
                           'if' : self.cond_instr, 
                           'else' : self.else_instr, 
                           'then' : self.then_instr,
                           '>r' : self.tor_instr, 
                           'r>' : self.fromr_instr,
                           'r@' : self.rarobase_instr, 
                           '@r' : self.arobaser_instr, 
                           'rdrop' : self.rdrop_instr, 
                           '2rdrop' : 'rdrop rdrop',
                           'rswap' : self.rswap_instr,
                           'rdup' : self.rdup_instr,
                           '2rdup' : 'rover rover',
                           'rover' : self.rover_instr, 
                           'rdump' : self.rdump_instr,
                           'do' : self.do_instr, 
                           'loop' : self.loop_instr, 
                           '+loop' : self.plusloop_instr,
                           'begin' : self.begin_instr,
                           'until' : self.until_instr, 
                           'again' : self.again_instr, 
                           'while' : self.while_instr,
                           'repeat' : self.repeat_instr, 
                           '!' : self.exclam_instr,
                           '+!' : 'dup @ rot + swap !',
                           '*!' : 'dup @ rot * swap !',
                           'and' : self.and_instr,
                           'or' : self.or_instr,
                           'xor' : self.xor_instr,
                           'forget' : self.forget_instr,
                           'cls' : self.clearstack_instr,
                           'leave' : '',
                           'see' : self.see_instr,
                           'create' : self.create_instr,
                           'does>' : self.does_instr,
                           'immediate' : self.immediate_instr,
                           'postpone' : self.postpone_instr,
                           'array' : self.array_instr,
                           '[' : self.bbraket_instr,
                           ']' : self.ebraket_instr,
                           '{' : self.bbrace_instr,
                           '}' : self.ebrace_instr,
                           'cells' : self.cells_instr,
                           'cell@' : self.cellarobase_instr,
                           'cell!' : self.cellexclam_instr,
                           'cell+' : self.addcell_instr,
                           'cell-' : self.delcell_instr,
                           'cell=' : self.cellequal_instr,
                           'cell?' : 'cell@ .',
                           'cells?' : 'cells .',
                           'clt' : self.clt_instr,
                           ',' : self.forceexclam_instr,
                           'load' : self.load_instr,
                           'list' : self.list_instr,
                           'char' : self.char_instr,
                           'chars' : self.chars_instr,
                           'bl' : 'decimal 32',
                           'path' : 'userarea',
                           'recurse' : self.recurse_instr,
                           'format' : self.format_instr,
                           'base' : 10,
                           'decimal' : self.decimal_instr,
                           'octal' : self.octal_instr,
                           'hex' : self.hex_instr,
                           'base!' : self.baseexclam_instr,
                           '>base' : self.tobase_instr,
                           '>decimal' : self.todecimal_instr,
                           '?int' : self.isint_instr,
                           '?float' : self.isfloat_instr,
                           '?str' : self.isstr_instr,
                           '?char' : self.ischar_instr,
                           '?array' : self.isarray_instr,
                           '?pack' : self.ispackloaded_instr,
                           '?exists' : self.isexists_instr,
                           'wp?' : self.workstackpointer_instr,
                           'sp?' : self.seqpointer_instr,
                           'vp?' : self.dictpointer_instr,
                           'kpress' : self.keypress_instr,
                           'readk' : self.readkey_instr,
                           'space' : 'bl emit',
                           'arget' : 'rot rot swap cell@ cell@',
                           'arrow' : 'swap cell@',
                           'arcol' : 'swap cell@',
                           't{' : self.begintest_instr,
                           '}t' : self.endtest_instr,
                           '->' : self.test_instr,
                           'case' : self.case_instr,
                           'endcase' : self.endcase_instr,
                           'of' : self.of_instr,
                           'endof' : self.endof_instr,
                           'defer' : self.defer_instr,
                           'is' : self.is_instr,
                           "'" : self.tick_instr,
                           'evaluate' : self.evaluate_instr,
                           'execute' : self.execute_instr,
                           ':noname' : self.noname_instr,
                           'testcond' : '50 = if "égal" . else "pas egal" . then',
                           'testloop' : '1500 1000 var #i do #i @ emit loop forget #i cr',
                           'testfib' : '1 0 2.s reverse 2 var fib#i do 2dup + .s rot drop loop 2drop forget fib#i',
                           'test' : '123'}
        self.variables = ['path']
        self.interpreter.immediate.append('test')
        self.interpreter.userdefinitions['true'] = deque(['@'])
        self.interpreter.userdefinitions['false'] = deque(['@'])
        self.interpreter.userdefinitions['base'] = deque(['@'])
        self.interpreter.compile['const'] = deque(['@'])
        self.interpreter.compile['2const'] = deque(['@'])
        self.help = core_help(self.interpreter.output)
        self.version = 'v1.5.5'

    '''
    Instruction bye : quitte l'interpreteur Beetle
    '''
    def bye_instr(self):
        return 'break'

    '''
    Instruction dump : affiche l'ensemble des éléments de la pile de travail
    '''
    def dump_instr(self):
        if len(self.work) > 0:
            for temp in self.work:
                print(temp, end=' ')
            print('')
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('dump', self.interpreter.output)
        
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
            print(mystr.strip(), end='\n')
        return 'nobreak'
           
    '''
    Instruction . : affiche et détruit le haut de la pile 
    '''
    def point_instr(self):
        if len(self.work) > 0:
            temp = self.pop_work()
            temp = str(temp).replace('\\"', '"')
            print(temp, end=' ')
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('.', self.interpreter.output)

    '''
    Instruction : ... ; : permet de créer de nouveaux mots et d'enrichir le dictionaire 
    '''
    def begin_def_instr(self):
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if self.interpreter.isemptylastsequence():
            return core_errors.error_def_name_missing.print_error('definition', self.interpreter.output)
        defname = seq[0]
        if defname in self.dictionary.keys():
            return core_errors.error_def_name_already_exists.print_error('definition', self.interpreter.output)
        if defname == ':':
            return core_errors.error_twopoints_invalid.print_error('definition', self.interpreter.output)
        for p in self.interpreter.packages.keys():
            if defname in self.interpreter.packages[p].dictionary.keys():
                return core_errors.error_def_name_already_exists.print_error('definition', self.interpreter.output)
        seq.popleft()
        if self.interpreter.isemptylastsequence():
            return core_errors.error_def_end_missing.print_error('definition', self.interpreter.output)
        instr = self.pop_sequence()
        if instr == ':':
            return core_errors.error_twopoints_invalid.print_error('definition', self.interpreter.output)
        comment = ''
        if instr == '(':
            # traitement du commentaire
            while instr != ')':
                if self.interpreter.isemptylastsequence():
                    return core_errors.error_def_end_missing.print_error('definition', self.interpreter.output)
                instr = self.pop_sequence()
                if instr != ')':
                    comment = comment + ' ' + instr
        # commentaire ou pas : traitement du corps de la définition
        defbody = ''
        if comment == '':
            # si l'instruction est immediate, on l'exécute tout de suite et on ne l'ajoute pas dans le corps du mot
            if str(instr).lower() in self.interpreter.immediate:
                imm = deque()
                imm.append(str(instr).lower())
                self.interpreter.set_sequence(imm)
                ret = self.interpreter.interpret('last_sequence')
            else:
                if instr != ';':
                    defbody = defbody + ' ' + str(instr)
        while instr != ';' and str(instr).lower() != 'does>':
            self.interpreter.decreaselastseqnumber()
            if self.interpreter.isemptylastsequence():
                return core_errors.error_def_end_missing.print_error('definition', self.interpreter.output)
            instr = self.pop_sequence()
            if instr == ':':
                return core_errors.error_twopoints_invalid.print_error('definition', self.interpreter.output)
            if instr != ';' and str(instr).lower() != 'does>':
                # si l'instruction est immediate, on l'exécute tout de suite et on ne l'ajoute pas dans le corps du mot
                if str(self.interpreter.instr).lower() in self.interpreter.immediate:
                    imm = deque()
                    imm.append(str(instr).lower())
                    self.interpreter.set_sequence(imm)
                    ret = self.interpreter.interpret('last_sequence')
                else:
                    if instr != ';':
                        defbody = defbody + ' ' + str(instr)
        self.dictionary[defname] = defbody.strip()

        # traitement de la section does>
        does = deque()
        if str(instr).lower() == 'does>':
            while instr != ';':
                if self.interpreter.isemptylastsequence():
                    return core_errors.error_def_end_missing.print_error('does>', self.interpreter.output)
                instr = self.pop_sequence()
                if instr == ':':
                    return core_errors.error_twopoints_invalid.print_error('does>', self.interpreter.output)
                if instr != ';':
                    does.append(str(instr))
            self.interpreter.compile[defname] = does.copy()

        # traitement de la section immediate
        if len(seq) > 0:
            immediate = seq[0]
            if str(immediate).lower() == 'immediate':
                self.pop_sequence()
                self.interpreter.immediate.append(defname)

        if comment.strip() != '':
            self.help.set_help(defname, comment.strip())
        
        self.interpreter.userdefinitions[defname] = deque()
        return 'nobreak'
    
    '''
    Instruction : ... ; : cloture la création d'une définition 
    '''
    def pointvirg_instr(self):
        return core_errors.error_definition_end_invalid.print_error(';', self.interpreter.output)

    '''
    Instruction ( : marque le début d'un commentaire 
    '''
    def bcomment_instr(self):
        instr = self.pop_sequence()
        while instr != ')':
            if self.interpreter.isemptylastsequence():
                return core_errors.error_comment_invalid.print_error('( ... )', self.interpreter.output)
            instr = self.pop_sequence()
        return 'nobreak'

    '''
    Instruction ) : marque la fin d'un commentaire. ne peut pas être utilisé sans ( 
    '''
    def ecomment_instr(self):
        return core_errors.error_comment_invalid.print_error('( ... )', self.interpreter.output)

    '''
    Instruction import : importe le dictionnaire d'un package dans le dictionnaire principal 
    '''
    def import_instr(self):
        if len(self.interpreter.sequences[self.interpreter.lastseqnumber]) == 0:
            return core_errors.error_import_name_missing.print_error('import', self.interpreter.output)
        packname = self.pop_sequence()
        if packname in self.interpreter.packages.keys():
            return core_errors.error_package_already_loaded.print_error(packname + ' import package', self.interpreter.output)
        # import du package contenu dans packname dans le répertoire packpath
        if packname not in self.interpreter.packages.keys():
            packpath = 'packages.'
            try:
                module = importlib.import_module(packpath + packname, package=None)
                # we subscribe the class in globals class
                self.interpreter.packages[packname] = eval('module.' + packname)(self.interpreter)
            except AttributeError:
                return core_errors.error_package_dont_exists.print_error(packname, self.interpreter.output)
            except ModuleNotFoundError:
                return core_errors.error_package_dont_exists.print_error(packname, self.interpreter.output)
        return 'nobreak'

    '''
    Instruction drop : supprime l'élément qui se trouve en haut de la pile de travail
    '''
    def drop_instr(self):
        if len(self.work) > 0:
            self.pop_work()
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('drop', self.interpreter.output)

    '''
    Instruction help : permet d'obtenir de l'aide sur un mot
    '''
    def help_instr(self):
        instr = self.pop_sequence()
        if str(instr).lower() == 'all':
            for p in self.interpreter.packages.keys():
                mystr = 'Package ' + p + ' :\n----------------------------\n'
                if self.interpreter.output == 'web':
                    mystr = mystr.replace('\n', '<br>')
                print(mystr, end='')
                for i in self.interpreter.packages[p].help.help_dict:
                    mystr = i + ' :\n' + str(self.interpreter.packages[p].help.get_help(i, self.interpreter.packages[p].dictionary)) + '\n\n'
                    if self.interpreter.output == 'web':
                        mystr = mystr.replace('\n', '<br>')
                    print(mystr, end='')
        else:
            for p in self.interpreter.packages.keys():
                help_str = self.interpreter.packages[p].help.get_help(str(instr).lower(), self.interpreter.packages[p].dictionary)
                if help_str != None:
                    if self.interpreter.output == 'web':
                        help_str = help_str.replace('\n', '<br>')
                    print(help_str)
                    break
        return 'nobreak'

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
                return core_errors.error_integer_expected.print_error('emit', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('emit', self.interpreter.output)

    '''
    Instruction char : met sur la pile de travail le code du premier caractère d'une chaine de caractères
    '''
    def char_instr(self):
        if len(self.work) > 0:
            temp = self.pop_work()
            self.work.appendleft(ord(temp[0]))
        else:
            return core_errors.error_nothing_in_work_stack.print_error('char', self.interpreter.output)


    '''
    Instruction chars : ajoute sur la pile de travail le nombre de caractère d'une chaine
    '''
    def chars_instr(self):
        if len(self.work) > 0:
            temp = self.pop_work()
            self.work.appendleft(len(temp))
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('chars', self.interpreter.output)

    '''
    Instruction cr : permet d'afficher un retour chariot dans la console
    '''
    def cr_instr(self):
        if self.interpreter.output == 'web':
            print('<br>')
        else:
            print('')
        return 'nobreak'


    '''
    Instruction load : inclut le contenu d'un fichier Beetle dans le dictionnaire principal
    '''
    def load_instr(self):
        if self.interpreter.isemptylastsequence():
            return core_errors.error_filename_missing.print_error('load', self.interpreter.output)
        filename = str(self.interpreter.sequences[self.interpreter.lastseqnumber][0])
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        filename = '{0}/{1}.btl'.format(self.dictionary['path'], filename)
        try:
            f = open(filename)
        except(FileNotFoundError):
            return core_errors.error_no_such_file.print_error('load ' + filename, self.interpreter.output)
        content = f.read().encode('mbcs').decode()
        content = content.replace('"', '\\"')
        content = '"' + content + '" .'
        content = content.replace('\\"', '"')
        content = content.replace('<?btl', '" . ')
        content = content.replace('?>', ' "')
        content = content.replace('\n', ' ')
        content = content.replace('"" .', '')
        content = ' '.join(content.split())

        split = content.split(' ')
        self.interpreter.string_treatment_for_load_file(split)
        self.interpreter.sequences[self.interpreter.lastseqnumber] = self.interpreter.instructions.copy()
        self.interpreter.instructions.clear()
        f.close()
        return 'nobreak'

    '''
    Instruction list : affiche le contenu d'un fichier Beetle
    '''
    def list_instr(self):
        if self.interpreter.isemptylastsequence():
            return core_errors.error_filename_missing.print_error('list', self.interpreter.output)
        filename = str(self.interpreter.sequences[self.interpreter.lastseqnumber][0])
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        filename = '{0}/{1}.btl'.format(self.dictionary['path'], filename)
        try:
            f = open(filename)
        except(FileNotFoundError):
            return core_errors.error_no_such_file.print_error('list ' + filename, self.interpreter.output)
        content = f.read().encode('mbcs').decode()
        if self.interpreter.output == 'web':
            content = content.replace('\n', '<br>')
            content = content.replace(' ', '&nbsp;')
        print(content)
        f.close()
        return 'nobreak'

    '''
    Instruction const : permet de créer une constante et l'ajoute au dictionnaire
    '''
    def const_instr(self):
        if len(self.work) > 0:
            if self.interpreter.isemptylastsequence():
                return core_errors.error_name_missing.print_error('const', self.interpreter.output)
            const_name = self.interpreter.sequences[self.interpreter.lastseqnumber][0]
            if const_name in self.dictionary.keys():
                return core_errors.error_name_already_exists.print_error('const', self.interpreter.output)
            self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
            value = self.pop_work()
            self.dictionary[const_name] = value
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('const', self.interpreter.output)

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
            return core_errors.error_nothing_in_work_stack.print_error('const', self.interpreter.output)

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
            return core_errors.error_nothing_in_work_stack.print_error('secinput', self.interpreter.output)

    '''
    Instruction @ : insère dans la pile de travail la valeur d'une variable ou d'une constante
    '''
    def arobase_instr(self):
        if len(self.work) > 0:
            name = str(self.work[0])
            if name in self.variables:
                self.work.popleft()
                pack = self.interpreter.search_in_pack(name)
                if pack != False:
                    d = self.interpreter.packages[pack].dictionary[name]
                try:
                    self.work.appendleft(d)
                except TypeError:
                    return core_errors.error_integer_and_float_expected.print_error('@', self.interpreter.output)
                return 'nobreak'
            else:
                return core_errors.error_not_a_variable_or_constant.print_error('@', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('@', self.interpreter.output)

    '''
    Instruction * : Fait la multiplication entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    '''
    def prod_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            op2 = self.pop_work()
            if isinstance(op1, list) or isinstance(op2, list):
                if isinstance(op1, list) and not isinstance(op2, list):
                    if isinstance(op2, int) or isinstance(op2, float):
                        self.work.appendleft([op1[i]*op2 for i in range(0, len(op1))])
                        return 'nobreak'
                    else:
                        return core_errors.error_invalid_litteral.print_error('+', self.interpreter.output) 
                elif not isinstance(op1, list) and isinstance(op2, list):
                    if isinstance(op1, int) or isinstance(op1, float):
                        self.work.appendleft([op2[i]*op1 for i in range(0, len(op2))])
                        return 'nobreak'
                    else:
                        return core_errors.error_invalid_litteral.print_error('+', self.interpreter.output) 
                elif isinstance(op1, list) and isinstance(op2, list):
                    self.work.appendleft([op1[i]*op2[i] for i in range(min(len(op1),len(op2)))]+max(op1,op2,key=len)[min(len(op1),len(op2)):])
                    return 'nobreak'
            if base == 10:
                if isinstance(op1, str):
                    op1 = float(op1)
                if isinstance(op2, str):
                    op2 = float(op2)
                result = op1 * op2
                self.work.appendleft(result)
                return 'nobreak'
            else:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('*', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('*', self.interpreter.output)
            result = op1 * op2
            self.work.appendleft(self.to_base(result, base))
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('*', self.interpreter.output)

    def to_base(self, number, base):
        base_string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        result = ""
        while number:
            result += base_string[number % base]
            number //= base
        return result[::-1] or "0"

    '''
    Instruction + : Fait l'addition entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    '''
    def plus(self, op1, op2):
        base = self.dictionary['base']
        # si op1 est une liste OU op2 est une liste
        if isinstance(op1, list) or isinstance(op2, list):
            # si op1 est une liste ET op2 n'est pas une liste
            if isinstance(op1, list) and not isinstance(op2, list):
                # si op2 est un entier OU op2 est un float
                if isinstance(op2, int) or isinstance(op2, float):
                    op3 = []
                    for i in range(0, len(op1)):
                        if isinstance(op1[i], list):
                            temp = self.plus(op1[i], op2)
                            op3.append(temp)
                        else:
                            op3.append(op1[i]+op2)
                    return op3
                else:
                    return core_errors.error_invalid_litteral.print_error('+', self.interpreter.output) 
            elif not isinstance(op1, list) and isinstance(op2, list):
                if isinstance(op1, int) or isinstance(op1, float):
                    op3 = []
                    for i in range(0, len(op2)):
                        if isinstance(op2[i], list):
                            temp = self.plus(op2[i], op1)
                            op3.append(temp)
                        else:
                            op3.append(op2[i]+op1)
                    return op3
                else:
                    return core_errors.error_invalid_litteral.print_error('+', self.interpreter.output) 
            elif isinstance(op1, list) and isinstance(op2, list):
                op3 = []
                for i in range(min(len(op1),len(op2))):
                    temp = self.plus(op2[i], op1[i])
                    op3.append(temp)
                op3 = op3 + max(op1,op2,key=len)[min(len(op1),len(op2)):]
                return op3
        else:
            if base == 10:
                if isinstance(op1, str):
                    op1 = float(op1)
                if isinstance(op2, str):
                    op2 = float(op2)
                return op1 + op2
            else:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('+', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('+', self.interpreter.output)
            result = self.to_base(op1 + op2, base)
            return result

    def plus_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            op3 = self.plus(op1, op2)
            self.work.appendleft(op3)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('+', self.interpreter.output)

    '''
    Instruction - : Fait la différence entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    '''
    def minus(self, op1, op2):
        base = self.dictionary['base']
        # si op1 est une liste OU op2 est une liste
        if isinstance(op1, list) or isinstance(op2, list):
            # si op1 est une liste ET op2 n'est pas une liste
            if isinstance(op1, list) and not isinstance(op2, list):
                # si op2 est un entier OU op2 est un float
                if isinstance(op2, int) or isinstance(op2, float):
                    op3 = []
                    for i in range(0, len(op1)):
                        if isinstance(op1[i], list):
                            temp = self.minus(op1[i], op2)
                            op3.append(temp)
                        else:
                            op3.append(op1[i] - op2)
                    return op3
                else:
                    return core_errors.error_invalid_litteral.print_error('-', self.interpreter.output) 
            elif not isinstance(op1, list) and isinstance(op2, list):
                if isinstance(op1, int) or isinstance(op1, float):
                    op3 = []
                    for i in range(0, len(op2)):
                        if isinstance(op2[i], list):
                            temp = self.minus(op2[i], op1)
                            op3.append(temp)
                        else:
                            op3.append(op2[i] - op1)
                    return op3
                else:
                    return core_errors.error_invalid_litteral.print_error('-', self.interpreter.output) 
            elif isinstance(op1, list) and isinstance(op2, list):
                op3 = []
                for i in range(min(len(op1),len(op2))):
                    temp = self.minus(op2[i], op1[i])
                    op3.append(temp)
                op3 = op3 + max(op1,op2,key=len)[min(len(op1),len(op2)):]
                return op3
        else:
            if base == 10:
                if isinstance(op1, str):
                    op1 = float(op1)
                if isinstance(op2, str):
                    op2 = float(op2)
                return op1 - op2
            else:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('-', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('-', self.interpreter.output)
            result = self.to_base(op1 - op2, base)
            return result


    def minus_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            op3 = self.minus(op1, op2)
            self.work.appendleft(op3)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('-', self.interpreter.output)

    '''
    Instruction / : Division entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    La division dans une autre base que 10 n'est pas possible
    '''
    def div_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            if op1 == 0:
                op2 = self.pop_work()
                return core_errors.error_division_by_zero_invalid.print_error('/', self.interpreter.output)
            op2 = self.pop_work()
            if isinstance(op1, list) or isinstance(op2, list):
                return core_errors.error_invalid_litteral.print_error('/', self.interpreter.output)
            if base == 10:
                if isinstance(op1, str):
                    op1 = float(op1)
                if isinstance(op2, str):
                    op2 = float(op2)
            else:
                return core_errors.error_invalid_litteral.print_error('/', self.interpreter.output)
            result = op2 / op1
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('/', self.interpreter.output)

    '''
    Instruction packages : Affiche la liste des packages qui ont été importés
    '''
    def packages_instr(self):
        mystr = ''
        for pack in self.interpreter.packages.keys():
            try:
                version = ' : version = ' + self.interpreter.packages[pack].version
            except:
                version = ''
            mystr = pack + version
            if self.interpreter.output == 'web':
                print(mystr, end='<br>')
            else:
                print(mystr)
        return 'nobreak'

    '''
    Instruction = : Egalité
    '''
    def equal_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            op2 = self.pop_work()
            if base != 10:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('=', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('=', self.interpreter.output)
            if op2 == op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return core_errors.error_nothing_in_work_stack.print_error('=', self.interpreter.output)

    '''
    Instruction > : Supérieur
    '''
    def sup_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            op2 = self.pop_work()
            if base != 10:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('>', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('>', self.interpreter.output)
            if op2 > op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return core_errors.error_nothing_in_work_stack.print_error('>', self.interpreter.output)

    '''
    Instruction < : Inférieur
    '''
    def inf_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            op2 = self.pop_work()
            if base != 10:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('<', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('<', self.interpreter.output)
            if op2 < op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return core_errors.error_nothing_in_work_stack.print_error('<', self.interpreter.output)

    '''
    Instruction >= : Supérieur ou égal
    '''
    def supequal_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            op2 = self.pop_work()
            if base != 10:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('>=', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('>=', self.interpreter.output)
            if op2 >= op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return core_errors.error_nothing_in_work_stack.print_error('>=', self.interpreter.output)

    '''
    Instruction <= : Inférieur ou égal
    '''
    def infequal_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            op2 = self.pop_work()
            if base != 10:
                if isinstance(op1, str):
                    try:
                        op1 = int(op1, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('<=', self.interpreter.output)
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return core_errors.error_invalid_litteral.print_error('<=', self.interpreter.output)
            if op2 <= op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return core_errors.error_nothing_in_work_stack.print_error('<=', self.interpreter.output)

    '''
    Instruction IF : Conditionnelle
    '''
    def cond_instr(self):
        truezone = deque()
        falsezone = deque()
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if len(self.work) > 0:
            flag = self.pop_work()
            instr = self.search_conditional_sequence_for(truezone)
            if not instr:
                return core_errors.error_conditional_invalid.print_error('conditional', self.interpreter.output)
            if instr == 'else':
                instr = self.search_conditional_sequence_for(falsezone)
                if not instr:
                    return core_errors.error_conditional_invalid.print_error('conditional', self.interpreter.output)
            if flag == True:
                truezone.reverse()
                seq.extendleft(truezone.copy())
            else:
                falsezone.reverse()
                seq.extendleft(falsezone.copy())
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('conditional', self.interpreter.output)

    '''
    Instruction ELSE : Conditionnelle
    '''
    def else_instr(self):
        return core_errors.error_conditional_invalid.print_error('else', self.interpreter.output)

    '''
    Instruction THEN : Conditionnelle
    '''
    def then_instr(self):
        return core_errors.error_conditional_invalid.print_error('then', self.interpreter.output)

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
                return core_errors.error_index_on_workstack_invalid.print_error('roll', self.interpreter.output)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('roll', self.interpreter.output)

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
                return core_errors.error_index_on_workstack_invalid.print_error('pick', self.interpreter.output)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('pick', self.interpreter.output)

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
            return core_errors.error_nothing_in_work_stack.print_error('over', self.interpreter.output)

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
            return core_errors.error_nothing_in_work_stack.print_error('>r', self.interpreter.output)

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
            return core_errors.error_nothing_in_return_stack.print_error('@r', self.interpreter.output)

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
            return core_errors.error_nothing_in_return_stack.print_error('>r', self.interpreter.output)

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
            return core_errors.error_nothing_in_return_stack.print_error('r@', self.interpreter.output)

    '''
    Instruction rdrop : supprime l'élément qui se trouve en haut de la pile de retour
    '''
    def rdrop_instr(self):
        if len(self.altwork) > 0:
            self.altwork.popleft()
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_return_stack.print_error('rdrop', self.interpreter.output)

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
            return core_errors.error_nothing_in_return_stack.print_error('rswap', self.interpreter.output)

    '''
    Instruction rdup : dupplique l'élément qui se trouve en haut de la pile de travail alternative et l'ajoute en haut de la pile
    '''
    def rdup_instr(self):
        if len(self.altwork) > 0:
            temp = self.altwork[0]
            self.altwork.appendleft(temp)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_return_stack.print_error('rdup', self.interpreter.output)

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
            return core_errors.error_nothing_in_return_stack.print_error('rover', self.interpreter.output)

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
            return core_errors.error_nothing_in_return_stack.print_error('rdump', self.interpreter.output)

    '''
    Instruction ! : affecte la valeur d'une variable uniquement
    '''
    def exclam_instr(self):
        if len(self.work) > 1:
            name = self.pop_work()
            if name in self.interpreter.userdefinitions.keys():
                return core_errors.error_invalid_update_constant.print_error('!', self.interpreter.output)
            if name not in self.variables:
                return core_errors.error_not_a_variable.print_error('!', self.interpreter.output)
            value = self.pop_work()
            for pack in self.interpreter.packages:
                if name in self.interpreter.packages[pack].dictionary.keys() and name in self.variables:
                    self.interpreter.packages[pack].dictionary[name][0] = value
                    break
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('!', self.interpreter.output)

    '''
    Instruction force! : affecte la valeur d'une variable et d'une constante : A UTILISER AVEC PRUDENCE
    '''
    def forceexclam_instr(self):
        if len(self.work) > 1:
            name = self.work[0]
            self.work.popleft()
            value = self.pop_work()
            for pack in self.interpreter.packages:
                if name in self.interpreter.packages[pack].dictionary.keys() and name in self.variables:
                    if self.interpreter.packages[pack].dictionary[name] == None:
                        self.interpreter.packages[pack].dictionary[name] = value
                    elif self.isfloat(self.interpreter.packages[pack].dictionary[name]) or self.isinteger(self.interpreter.packages[pack].dictionary[name]) or isinstance(self.isfloat(self.interpreter.packages[pack].dictionary[name]), str):
                        self.interpreter.packages[pack].dictionary[name] = [self.interpreter.packages[pack].dictionary[name]]
                        self.interpreter.packages[pack].dictionary[name].append(value)
                    elif isinstance(self.interpreter.packages[pack].dictionary[name], list):
                        self.interpreter.packages[pack].dictionary[name].append(value)
                    self.work.appendleft(name)
                    break
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('force!', self.interpreter.output)

    '''
    Instruction do : exécute une boucle DO ... LOOP | +LOOP
    '''
    def do_instr(self):
        instructions = deque()
        if len(self.work) > 1:
            instr = self.search_do_loop(instructions)
            # lire le nom de la variable
            varname = self.work[0]
            if varname in self.variables:
                # begin = Récupérer la valeur de la variable
                self.work.popleft()
                # begin = Récupérer la valeur de la variable
                begin = self.dictionary[varname][0]
            else:
                return core_errors.error_not_a_variable_or_constant.print_error('do ... loop begin', self.interpreter.output)
            # limit = lire la limite de la boucle sur la pile work
            limit = self.pop_work()
            if not isinstance(begin, int) and not isinstance(begin, float):
                return core_errors.error_integer_expected.print_error('do ... loop begin', self.interpreter.output)
            if not isinstance(limit, int) and not isinstance(limit, float):
                return core_errors.error_integer_expected.print_error('do ... loop limit', self.interpreter.output)
            if instr == 'loop':
                for compteur in range(begin, limit):
                    #print('varname = ' + varname)
                    #print(self.variables)
                    #self.interpreter.print_sequence_numbers()
                    self.dictionary[varname][0] = compteur
                    self.interpreter.set_sequence(instructions.copy())
                    ret = self.interpreter.interpret('last_sequence')
                    self.interpreter.decreaselastseqnumber()
                    if ret == 'leave':
                        instructions.clear()
                        break
            if instr == '+loop':
                compteur = begin
                while compteur < limit:
                    self.interpreter.set_sequence(instructions.copy())
                    ret = self.interpreter.interpret('last_sequence')
                    self.interpreter.decreaselastseqnumber()
                    if ret == 'leave':
                        instructions.clear()
                        break
                    increment = self.pop_work()
                    compteur += increment
                    self.dictionary[varname][0] = compteur
            instructions.clear()
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('do ... loop | +loop', self.interpreter.output)

    '''
    Instruction loop : exécute une boucle DO ... LOOP | +LOOP
    '''
    def loop_instr(self):
        return core_errors.error_loop_invalid.print_error('loop', self.interpreter.output)

    '''
    Instruction +loop : exécute une boucle DO ... LOOP | +LOOP
    '''
    def plusloop_instr(self):
        return core_errors.error_loop_invalid.print_error('+loop', self.interpreter.output)

    '''
    Instruction begin : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def begin_instr(self):
        firstzone = deque()
        secondzone = deque()
        instr = self.search_begin_loop(firstzone)
        if instr == 'while':
            instr = self.search_begin_loop(secondzone)
        if instr == 'again':
            while True:
                self.interpreter.set_sequence(firstzone.copy())
                ret = self.interpreter.interpret('last_sequence')
                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    break
        elif instr == 'until':
            flag = False
            while True:
                self.interpreter.set_sequence(firstzone.copy())
                ret = self.interpreter.interpret('last_sequence')
                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    break
                flag = self.pop_work()
                if not isinstance(flag, int):
                    return core_errors.error_condition_invalid.print_error('begin ... until', self.interpreter.output)
                if flag != 0:
                    firstzone.clear()
                    break
        elif instr == 'repeat':
            flag = True
            while True:
                self.interpreter.set_sequence(firstzone.copy())
                ret = self.interpreter.interpret('last_sequence')
                self.interpreter.decreaselastseqnumber()
                if ret == 'leave':
                    firstzone.clear()
                    secondzone.clear()
                    break
                flag = self.pop_work()
                if not isinstance(flag, int):
                    return core_errors.error_condition_invalid.print_error('begin ... while ... repeat', self.interpreter.output)
                if flag == 0:
                    firstzone.clear()
                    secondzone.clear()
                    break
                self.interpreter.set_sequence(secondzone.copy())
                ret = self.interpreter.interpret('last_sequence')
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
        return core_errors.error_loop_invalid.print_error('until', self.interpreter.output)

    '''
    Instruction again : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def again_instr(self):
        return core_errors.error_loop_invalid.print_error('again', self.interpreter.output)

    '''
    Instruction while : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def while_instr(self):
        return core_errors.error_loop_invalid.print_error('while', self.interpreter.output)

    '''
    Instruction repeat : exécute une boucle BEGIN ... AGAIN | UNTIL ... WHILE ... REPEAT
    '''
    def repeat_instr(self):
        return core_errors.error_loop_invalid.print_error('repeat', self.interpreter.output)

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

    '''
    Instruction variables : affiche la liste des variables
    '''
    def variables_instr(self):
        mystr = ''
        for var in self.variables:
            if self.interpreter.search_in_core(var):
                mystr += var + ' = ' + str(self.dictionary[var]) + ' ; '
            else:
                pack = self.interpreter.search_in_pack(var)
                if pack != False:
                    mystr += var + ' = ' + str(self.interpreter.packages[pack].dictionary[var]) + ' ; '
        if mystr != '':
            print(mystr)
        return 'nobreak'

    '''
    Instruction constants : affiche la liste des constantes
    '''
    def constants_instr(self):
        mystr = ''
        for const in self.interpreter.userdefinitions.keys():
            if self.interpreter.userdefinitions[const] == deque(['@']):
                pack = self.interpreter.search_in_pack(const)
                if pack != False:
                    mystr += const + ' = ' + str(self.interpreter.packages[pack].dictionary[const]) + ' ; '
        print(mystr)
        return 'nobreak'

    '''
    Instruction and : et logique
    '''
    def and_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            result = op1 and op2
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('and', self.interpreter.output)

    '''
    Instruction ou : ou logique
    '''
    def or_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            result = op1 or op2
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('or', self.interpreter.output)

    '''
    Instruction xor : ou exclusif logique
    '''
    def xor_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            result = op1 ^ op2
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('xor', self.interpreter.output)

    '''
    Instruction forget : supprime une variable ou un mot défini par l'utilisateur dans le dictionnaire
    '''
    def forget_instr(self):
        if self.interpreter.isemptylastsequence():
            return core_errors.error_variable_or_definition_name_missing.print_error('forget', self.interpreter.output)
        name = self.pop_sequence()
        if name not in self.variables and name not in self.interpreter.userdefinitions.keys():
            return core_errors.error_not_a_variable_or_definition.print_error('forget', self.interpreter.output)
        if name in self.variables:
            self.variables.remove(name)
        if name in self.interpreter.userdefinitions.keys():
            self.interpreter.userdefinitions.pop(name)
        self.dictionary.pop(name)
        return 'nobreak'

    '''
    Instruction cls : vide les éléments de la pile de travail (clear stack)
    '''
    def clearstack_instr(self):
        self.work.clear()
        return 'nobreak'

    '''
    Instruction see : affiche le contenu d'une définition quand il le peut
    '''
    def see_instr(self):
        ret = '\n'
        tab = '\t'
        rettab = ret + tab
        if self.interpreter.isemptylastsequence():
            return core_errors.error_def_name_missing.print_error('see', self.interpreter.output)
        def_name = self.interpreter.sequences[self.interpreter.lastseqnumber][0]
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        if def_name not in self.variables:
            for p in self.interpreter.packages.keys():
                if def_name in self.interpreter.packages[p].dictionary.keys():
                    if isinstance(self.interpreter.packages[p].dictionary[def_name], str):
                        print(': ' + def_name)
                        if str(self.interpreter.packages[p].dictionary[def_name]) != '':
                            definition = str(self.interpreter.packages[p].dictionary[def_name])
                            definition = definition.replace('if ', rettab + 'if' + rettab + tab)
                            definition = definition.replace('else ', rettab + 'else' + rettab + tab)
                            definition = definition.replace('then', rettab + 'then')
                            definition = definition.replace('do ', rettab + 'do' + rettab + tab)
                            definition = definition.replace('loop ', rettab + 'loop' + rettab)
                            definition = definition.replace('+loop ', rettab + '+loop' + rettab)
                            print(tab + definition)
                        if def_name in self.interpreter.immediate:
                            print('; immediate')
                        else:
                            print(';')
                        return 'nobreak'
            core_errors.error_native_definition.print_error('see ' + def_name, self.interpreter.output)
        else:
            core_errors.error_definition_only.print_error('see', self.interpreter.output)

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
                return core_errors.error_not_a_variable.print_error('create', self.interpreter.output)
        else:
            var_name = str(self.interpreter.sequences[self.interpreter.lastseqnumber][0])
            self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        if var_name in self.dictionary.keys():
            return core_errors.error_name_already_exists.print_error('create', self.interpreter.output)
        #self.dictionary[var_name] = []
        self.dictionary[var_name] = None
        self.variables.append(var_name)
        if self.interpreter.from_instr in self.interpreter.compile:
            self.interpreter.userdefinitions[var_name] = self.interpreter.compile[self.interpreter.from_instr].copy()

        self.work.appendleft(var_name)
        return 'nobreak'

    '''
    Instruction does> : définition de l'exécution d'instructions automatiques
    '''
    def does_instr(self):
        return core_errors.error_does_invalid.print_error('does>', self.interpreter.output)

    '''
    Instruction immediate : définition de l'exécution d'instructions immediate
    '''
    def immediate_instr(self):
        return core_errors.error_immediate_only_in_definition.print_error('immediate', self.interpreter.output)

    '''
    Instruction postpone : sorte d'alias de mots
    '''
    def postpone_instr(self):
        pass

    '''
    Instruction array : créé un tableau : n1 n2 n3 ... size array
    '''
    def array_instr(self):
        if len(self.work) > 0:
            size = self.pop_work()
            if len(self.work) >= size:
                result = []
                for i in range(0, size):
                    value = self.pop_work()
                    result.append(value)
                result.reverse()
                self.work.appendleft(result)
                return 'nobreak'
            else:
                return core_errors.error_nothing_in_work_stack.print_error('array', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('array', self.interpreter.output)

    '''
    { name1 : value1 , name2 : [ 1 , 2 ] }  ==> {'name1':value1, 'name2':[1, 2]}
    [ { name1 : value1 , name2 : [ 1 , 2 ] } ]  ==> [{'name1':value1, 'name2':[1, 2]}]
    '''
    def bbrace_instr(self):
        result = self.search_braces()
        if len(result) > 0:
            #result.reverse()
            self.work.appendleft(result)
        return 'nobreak'

    def ebrace_instr(self):
        pass

    def search_braces(self):
        result = {}
        if self.interpreter.isemptylastsequence():
            return core_errors.error_array_invalid.print_error('hash', self.interpreter.output)
        instr = str(self.pop_sequence())
        while instr != '}':
            elname = instr
            if self.interpreter.isemptylastsequence():
                return core_errors.error_array_invalid.print_error('hash', self.interpreter.output)
            instr = str(self.pop_sequence())
            if instr != ':':
                # error
                pass
            else:
                instr = str(self.pop_sequence())
                elseq = []
                while instr != ',' and instr != '}':
                    if instr == '[':
                        elseq.append(self.search_brakets())
                        if self.interpreter.isemptylastsequence():
                            return core_errors.error_array_invalid.print_error('hash', self.interpreter.output)
                        instr = str(self.pop_sequence())
                        continue
                    if instr == '{':
                        elseq.append(self.search_braces())
                        if self.interpreter.isemptylastsequence():
                            return core_errors.error_array_invalid.print_error('hash', self.interpreter.output)
                        instr = str(self.pop_sequence())
                        continue
                    elif self.isinteger(instr):
                        elseq.append(int(instr))
                        if self.interpreter.isemptylastsequence():                    
                            return core_errors.error_array_invalid.print_error('hash', self.interpreter.output)
                        instr = str(self.pop_sequence())
                        continue
                    elif self.isfloat(instr):
                        elseq.append(float(instr))
                        if self.interpreter.isemptylastsequence():
                            return core_errors.error_array_invalid.print_error('hash', self.interpreter.output)
                        instr = str(self.pop_sequence())
                        continue
                    elseq.append(instr)
                    instr = str(self.pop_sequence())
                i = self.prepare_interpreter(deque(elseq))
                result[elname] = i.work[0]
            if instr == ',':
                instr = str(self.pop_sequence())
                continue
        return result

    '''
    Instruction [ : créé un tableau : [ n1 , n2 , n3 ]

    [ number , ... ]            -> isinteger, isfloat
    [ "azeaze" , ... ]          -> isstring
    [ [        ... ] ]          -> search_brakets
    [ instructions , ... ]      -> other things
    [ ]                         -> empty

    '''
    def bbraket_instr(self):
        result = self.search_brakets()
        if len(result) > 0:
            result.reverse()
            self.work.appendleft(result)
        return 'nobreak'

    '''
    Instruction ] : ferme la séquence de création d'un tableau : [ n1 , n2 , n3 ]
    '''
    def ebraket_instr(self):
        return core_errors.error_array_invalid.print_error('array', self.interpreter.output)

    def search_brakets(self):
        result = []
        if self.interpreter.isemptylastsequence():
            return core_errors.error_array_invalid.print_error('array', self.interpreter.output)
        instr = str(self.pop_sequence())
        while instr != ']':
            if instr == '[':
                result.append(self.search_brakets())
                if self.interpreter.isemptylastsequence():
                    return core_errors.error_array_invalid.print_error('array', self.interpreter.output)
                instr = str(self.pop_sequence())
                continue
            elif instr == '{':
                result.append(self.search_braces())
                if self.interpreter.isemptylastsequence():
                    return core_errors.error_array_invalid.print_error('array', self.interpreter.output)
                instr = str(self.pop_sequence())
                continue
            elif instr == ',':
                instr = str(self.pop_sequence())
                continue
            elif instr == ']':
                break
            elif self.isinteger(instr):
                result.append(int(instr))
                if self.interpreter.isemptylastsequence():                    
                    return core_errors.error_array_invalid.print_error('array', self.interpreter.output)
                instr = str(self.pop_sequence())
                continue
            elif self.isfloat(instr):
                result.append(float(instr))
                if self.interpreter.isemptylastsequence():
                    return core_errors.error_array_invalid.print_error('array', self.interpreter.output)
                instr = str(self.pop_sequence())
                continue
            '''elif instr[0] == '"' and instr[-1] == '"':
                instr = instr[1:-1]'''
            result.append(instr)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_array_invalid.print_error('array', self.interpreter.output)
            instr = str(self.pop_sequence())
        i = self.prepare_interpreter(deque(result))
        return list(i.work)

    '''
    Instruction cells : écrit la taille d'un tableau sur la pile de travail
    '''
    def cells_instr(self):
        if len(self.work) > 0:
            tab = self.pop_work()
            if tab in self.variables:
                tab = self.dictionary[tab]
                if not isinstance(tab, list) and not isinstance(tab , dict):
                    return core_errors.error_get_cell_on_array_invalid.print_error('cells', self.interpreter.output)
            if not isinstance(tab, list) and not isinstance(tab , dict):
                return core_errors.error_get_cell_on_array_invalid.print_error('cells', self.interpreter.output)
            self.work.appendleft(len(tab))
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cells', self.interpreter.output)

    '''
    Instruction cell@ : écrit le contenu d'une cellule d'un tableau sur la pile de travail : (array|var_name|const_name) position CELL@
    '''
    def cellarobase_instr(self):
        if len(self.work) > 1:
            position = self.pop_work()
            tab = self.pop_work()
            if not isinstance(position, int) or position < 0 or position >= len(tab):
                return core_errors.error_index_on_array_invalid.print_error('cell@', self.interpreter.output)
            if isinstance(tab, dict) and position not in tab.keys():
                return core_errors.error_index_on_array_invalid.print_error('cell@', self.interpreter.output)
            if isinstance(tab, str):
                if tab in self.variables:
                    tab = self.dictionary[tab]
                    if not isinstance(tab, list) and not isinstance(tab , dict):
                        return core_errors.error_get_cell_on_array_invalid.print_error('cell@', self.interpreter.output)
                if not isinstance(tab, list) and not isinstance(tab , dict):
                    return core_errors.error_get_cell_on_array_invalid.print_error('cell@', self.interpreter.output)
            elif not isinstance(tab, list) and not isinstance(tab , dict):
                return core_errors.error_get_cell_on_array_invalid.print_error('cell@', self.interpreter.output)
            result = tab[position]
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cell@', self.interpreter.output)

    '''
    Instruction cell! : écrit dans le contenu d'une cellule d'un tableau : value position array CELL!
    '''
    def cellexclam_instr(self):
        if len(self.work) > 2:
            tab = self.pop_work()
            if not isinstance(tab, list) and not isinstance(tab , dict):
                return core_errors.error_get_cell_on_array_invalid.print_error('cell!', self.interpreter.output)
            position = self.pop_work()
            if isinstance(tab, list):
                if not isinstance(position, int) or position < 0 or position >= len(tab):
                    return core_errors.error_index_on_array_invalid.print_error('cell!', self.interpreter.output)
            if isinstance(tab, dict) and position not in tab.keys():
                return core_errors.error_index_on_array_invalid.print_error('cell!', self.interpreter.output)
            value = self.pop_work()
            tab[position] = value
            self.work.appendleft(tab)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cell!', self.interpreter.output)

    '''
    Instruction cell+ : crée nombre cellules dans un tableau : index value var_name CELL+
    '''
    def addcell_instr(self):
        if len(self.work) > 1:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    if len(self.dictionary[tab]) == 1:
                        tab = self.dictionary[tab][0]
                    else:
                        tab = self.dictionary[tab]
                    if not isinstance(tab, list) and not isinstance(tab , dict):
                        return core_errors.error_get_cell_on_array_invalid.print_error('cell+', self.interpreter.output)
                if not isinstance(tab, list) and not isinstance(tab , dict):
                    return core_errors.error_get_cell_on_array_invalid.print_error('cell+', self.interpreter.output)
            elif not isinstance(tab, list) and not isinstance(tab , dict):
                return core_errors.error_get_cell_on_array_invalid.print_error('cell+', self.interpreter.output)
            if isinstance(tab, list) or isinstance(tab, dict):
                value = self.pop_work()
                if not isinstance(value, int) and not isinstance(value, float) and not self.isfloat(value) and  not isinstance(value, list) and  not isinstance(value, dict):
                    return core_errors.error_bad_type.print_error('cell+', self.interpreter.output)
            if isinstance(tab, dict):
                index = self.pop_work()
                if not isinstance(index, str):
                    return core_errors.error_index_on_array_invalid.print_error('cell+', self.interpreter.output)
            if isinstance(tab, dict):
                tab[index] = value
            if isinstance(tab, list):
                tab.append(value)
            self.work.appendleft(tab)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cell+', self.interpreter.output)

    '''
    Instruction cell- : détruit une cellule d'un tableau à la position position : index (array|var_name) CELL-
    '''
    def delcell_instr(self):
        if len(self.work) > 1:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    if len(self.dictionary[tab]) == 1:
                        tab = self.dictionary[tab][0]
                    else:
                        tab = self.dictionary[tab]
                    if not isinstance(tab, list) and not isinstance(tab , dict):
                        return core_errors.error_get_cell_on_array_invalid.print_error('cell-', self.interpreter.output)
                if not isinstance(tab, list) and not isinstance(tab , dict):
                    return core_errors.error_get_cell_on_array_invalid.print_error('cell-', self.interpreter.output)
            elif not isinstance(tab, list) and not isinstance(tab , dict):
                return core_errors.error_get_cell_on_array_invalid.print_error('cell-', self.interpreter.output)
            index = self.pop_work()
            if isinstance(tab, list):
                if not isinstance(index, int) or index < 0 or index >= len(tab):
                    return core_errors.error_index_on_array_invalid.print_error('cell-', self.interpreter.output)
            if isinstance(tab, dict):
                if index not in tab.keys():
                    return core_errors.error_index_on_array_invalid.print_error('cell-', self.interpreter.output)
            tab.pop(index)
            #self.work.appendleft(tab)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cell-', self.interpreter.output)

    '''
    Instruction cell= : teste l'existence d'un contenu d'une cellule d'un tableau : content array CELL= --> True or False
    '''
    def cellequal_instr(self):
        if len(self.work) > 1:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    tab = self.dictionary[tab]
                    if not isinstance(tab, list) and not isinstance(tab , dict):
                        return core_errors.error_get_cell_on_array_invalid.print_error('cell=', self.interpreter.output)
                if not isinstance(tab, list) and not isinstance(tab , dict):
                    return core_errors.error_get_cell_on_array_invalid.print_error('cell=', self.interpreter.output)
            elif not isinstance(tab, list) and not isinstance(tab , dict):
                return core_errors.error_get_cell_on_array_invalid.print_error('cell=', self.interpreter.output)
            content = self.pop_work()
            if isinstance(tab, list):
                if content in tab:
                    self.work.appendleft(1)
                else:
                    self.work.appendleft(0)
            if isinstance(tab, dict):
                if content in tab.values():
                    self.work.appendleft(1)
                else:
                    self.work.appendleft(0)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cell=', self.interpreter.output)

    '''
    Instruction clt : efface le contenu de la console
    '''
    def clt_instr(self):
        os.system('cls||clear')
        return 'nobreak'
    
    '''
    Instruction recurse : applique la récursivité dans un mot
    '''
    def recurse_instr(self):
        if self.interpreter.from_instr != '':
            self.interpreter.sequences[self.interpreter.lastseqnumber].extendleft(self.interpreter.from_instr)
        return 'nobreak'
    
    '''
    Instruction format : formatte une chaine de caractères
    string array FORMAT --> formatted string with array on work stack
    marqueur dans la chaine de caractères <!!>
    '''
    def format_instr(self):
        if len(self.work) > 1:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    tab = self.dictionary[tab]
                    if not isinstance(tab, list):
                        return core_errors.error_get_cell_on_array_invalid.print_error('format', self.interpreter.output)
                if not isinstance(tab, list):
                    return core_errors.error_get_cell_on_array_invalid.print_error('format', self.interpreter.output)
            elif not isinstance(tab, list):
                return core_errors.error_get_cell_on_array_invalid.print_error('format', self.interpreter.output)
            content = self.pop_work()
            content = content.replace('<!', '{')
            content = content.replace('!>', '}')
            try:
                content = content.format(*tab)
            except(IndexError):
                return core_errors.error_index_on_array_invalid.print_error('format', self.interpreter.output)
            except(ValueError):
                return core_errors.error_string_invalid.print_error('format', self.interpreter.output)
            except(KeyError):
                return core_errors.error_string_invalid.print_error('format', self.interpreter.output)
            self.work.appendleft(content)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('format', self.interpreter.output)

    '''
    Instruction decimal : positionne la constante base à 10
    '''
    def decimal_instr(self):
        self.dictionary['base'] = 10
        return 'nobreak'
    
    '''
    Instruction hex : positionne la constante base à 16
    '''
    def hex_instr(self):
        self.dictionary['base'] = 16
        return 'nobreak' 
       
    '''
    Instruction octal : positionne la constante base à 8
    '''
    def octal_instr(self):
        self.dictionary['base'] = 8
        return 'nobreak'
    
    '''
    Instruction base! : positionne la constante base à une base comprise entre 2 et 36
    '''
    def baseexclam_instr(self):
        if len(self.work) > 0:
            base = self.pop_work()
            if base < 2 or base > 36:
                return core_errors.error_basenumber_invalid.print_error('base!', self.interpreter.output)
            self.dictionary['base'] = base
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('base!', self.interpreter.output)

    '''
    Instruction >base : convertit un nombre en base 10 en un nombre en base n 2 <= n <= 36 : number_in_base_10 newbase >BASE
    '''
    def tobase_instr(self):
        if len(self.work) > 1:
            base = self.pop_work()
            if base < 2 or base > 36 or base == 10:
                number = self.pop_work()
                return core_errors.error_basenumber_invalid.print_error('tobase', self.interpreter.output)
            number = self.pop_work()
            if not isinstance(number, int):
                return core_errors.error_integer_expected.print_error('tobase', self.interpreter.output)
            self.work.appendleft(self.to_base(number, base))
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('tobase', self.interpreter.output)

    '''
    Instruction >decimal : convertit un nombre en base n != 10 en un nombre en base 10 : str base >DECIMAL
    '''
    def todecimal_instr(self):
        if len(self.work) > 1:
            base = self.pop_work()
            if base < 2 or base > 36:
                number = self.pop_work()
                return core_errors.error_basenumber_invalid.print_error('todecimal', self.interpreter.output)
            number = self.pop_work()
            if not isinstance(number, str):
                return core_errors.error_integer_expected.print_error('todecimal', self.interpreter.output)
            self.work.appendleft(int(str(number), base))
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('todecimal', self.interpreter.output)

    '''
    Instruction ?int : indique si le nombre de la pile de travail est un entier
    '''
    def isint_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            if self.isinteger(o):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('?int', self.interpreter.output)

    '''
    Instruction ?float : indique si le nombre de la pile de travail est un float
    '''
    def isfloat_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            if self.isfloat(o):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('?float', self.interpreter.output)

    '''
    Instruction ?str : indique si le nombre de la pile de travail est une chaine de caractères
    '''
    def isstr_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            if isinstance(o, str):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('?str', self.interpreter.output)

    '''
    Instruction ?char : indique si le nombre de la pile de travail est un caractère
    '''
    def ischar_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            if isinstance(o, str) and len(o) == 1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('?char', self.interpreter.output)

    '''
    Instruction ?array : indique si l'élément de la pile de travail est un tableau
    '''
    def isarray_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            if isinstance(o, list):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('?array', self.interpreter.output)

    '''
    Instruction ?pack : indique si l'élément de la pile de travail est un package
    '''
    def ispackloaded_instr(self):
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if len(seq) == 0:
            return core_errors.error_import_name_missing.print_error('?pack', self.interpreter.output)
        packname = self.pop_sequence()
        if packname in self.interpreter.packages.keys():
            self.work.appendleft(1)
        else:
            self.work.appendleft(0)
        return 'nobreak'

    '''
    Instruction wp? : indique l'adresse du prochain élément de la pile de travail
    '''
    def workstackpointer_instr(self):
        self.work.appendleft(len(self.work))
        return 'nobreak'

    '''
    Instruction sp? : indique l'adresse de la prochaine séquence
    '''
    def seqpointer_instr(self):
        self.work.appendleft(len(self.interpreter.sequences))
        return 'nobreak'

    '''
    Instruction vp? : indique l'adresse du prochain élément du dictionnaire
    '''
    def dictpointer_instr(self):
        pointer = 0
        for pack in self.interpreter.packages:
            pointer += len(self.interpreter.packages[pack].dictionary)
        self.work.appendleft(pointer)
        return 'nobreak'

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
            return core_errors.error_nothing_in_work_stack.print_error('kpress', self.interpreter.output)

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
            return core_errors.error_nothing_in_work_stack.print_error('readk', self.interpreter.output)

    '''
    Instruction ?exists : teste l'existence d'une variable ou d'une constante
    '''
    def isexists_instr(self):
        if self.interpreter.isemptylastsequence():
            return core_errors.error_instruction_expected.print_error('?exists', self.interpreter.output)
        obj_name = str(self.pop_sequence())
        if obj_name in self.variables:
            self.work.appendleft(1)
        else:
            self.work.appendleft(0)
        return 'nobreak'

    def begintest_instr(self):
        pass

    def endtest_instr(self):
        pass

    def test_instr(self):
        pass

    def case_instr(self):
        temp_zone = deque()
        if len(self.work) > 0:
            cond_zone = deque()
            of_zone = deque()
            def_zone = deque()
            op1 = self.pop_work()
            instr = ''
            while instr != 'endcase':
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
        else:
            self.get_case_sequence(temp_zone)
            return core_errors.error_nothing_in_work_stack.print_error('case ... endcase', self.interpreter.output)

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
        return core_errors.error_invalid_instruction.print_error('endcase alone', self.interpreter.output)

    '''
    Instruction of : marque le début d'un cas de case : ne peut pas être utilisée seule
    '''
    def of_instr(self):
        return core_errors.error_invalid_instruction.print_error('of alone', self.interpreter.output)

    '''
    Instruction endof : marque la fin d'un cas de case : ne peut pas être utilisée seule
    '''
    def endof_instr(self):
        return core_errors.error_invalid_instruction.print_error('endof alone', self.interpreter.output)

    '''
    Instruction defer : permet de créer un mot dans le dictionnaire sans instruction
    exemple :
        defer print
    '''
    def defer_instr(self):
        name = self.pop_sequence()
        for p in self.interpreter.packages.keys():
            if name in self.interpreter.packages[p].dictionary.keys():
                return core_errors.error_name_already_exists.print_error('defer', self.interpreter.output)
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
        if len(self.work) > 0:
            wordname = self.pop_work()
            defername = self.pop_sequence()
            if defername in self.interpreter.defer:
                self.dictionary[defername] = str(wordname)
                return 'nobreak'
            else:
                return core_errors.error_not_a_defer_action.print_error("is", self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('is', self.interpreter.output)

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
        return core_errors.error_not_a_variable_or_definition.print_error("' (tick)", self.interpreter.output)
    
    '''
    Instruction :noname : permet de créer une définition qui n'a pas de nom et l'insère sur la pile de travail
    exemple : 
        :noname . cr ;
    '''
    def noname_instr(self):
        if self.interpreter.isemptylastsequence():
            return core_errors.error_def_end_missing.print_error('definition', self.interpreter.output)
        instr = self.pop_sequence()
        if instr == ':':
            return core_errors.error_twopoints_invalid.print_error('definition', self.interpreter.output)
        comment = ''
        if instr == '(':
            # traitement du commentaire
            while instr != ')':
                if self.interpreter.isemptylastsequence():
                    return core_errors.error_def_end_missing.print_error('definition', self.interpreter.output)
                instr = self.pop_sequence()
                if instr != ')':
                    comment = comment + ' ' + instr
        # commentaire ou pas : traitement du corps de la définition
        defbody = ''
        if comment == '':
            defbody = defbody + ' ' + str(instr)
        while instr != ';':
            if self.interpreter.isemptylastsequence():
                return core_errors.error_def_end_missing.print_error('definition', self.interpreter.output)
            instr = self.pop_sequence()
            if instr == ':':
                return core_errors.error_twopoints_invalid.print_error('definition', self.interpreter.output)
            if instr != ';':
                defbody = defbody + ' ' + str(instr)
        self.work.appendleft(defbody.strip())
        return 'nobreak'

    '''
    Instruction evaluate : évalue une chaine de caractères dans Beetle
    exemple : 
        "2 dup" evaluate dump => 2 2
    '''
    def evaluate_instr(self):
        if len(self.work) > 0:
            instrs = self.pop_work()
            if instrs != '':
                split = instrs.split(' ')
                self.interpreter.string_treatment_for_load_file(split)
                self.interpreter.set_sequence(self.interpreter.instructions.copy())
                ret = self.interpreter.interpret('last_sequence')
                if ret == 'break':
                    return 'break'
                else:
                    return 'nobreak'
            else:
                return core_errors.error_nothing_to_evaluate.print_error('evaluate', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('evaluate', self.interpreter.output)

    '''
    Instruction execute : execute une instruction dans Beetle. Ne peut pas exécuter un mot qui lit un mot dans la suite de la séquence
    exemple : 
        2 ' dup execute dump => 2 2
    '''
    def execute_instr(self):
        if len(self.work) > 0:
            word = self.pop_work()
            for p in self.interpreter.packages.keys():
                if word in self.interpreter.packages[p].dictionary:
                    instructions = deque()
                    instructions.append(word)
                    self.interpreter.set_sequence(instructions.copy())
                    ret = self.interpreter.interpret('last_sequence')
                    self.interpreter.decreaselastseqnumber()
                    if ret == 'break':
                        return 'break'
                    else:
                        return 'nobreak'
            return core_errors.error_not_a_variable_or_definition.print_error("execute", self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('execute', self.interpreter.output)
