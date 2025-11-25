import importlib
import os
import getpass
import keyboard
import hashlib
import json
import locale
import re
from collections import deque
from packages.errors.core_errors import core_errors
from packages.base_module import base_module
from packages.help.core_help import core_help
from packages.termcolors import termcolors
from .stack import StackInstructions
from .definitions import Definitions
from .controls import Controls
from .structures import Structures

class core(base_module, StackInstructions, Definitions, Controls, Structures):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            'dup' : '''    0 pick''', 
            '2dup' : '''    over over''', 
            'drop' : self.drop_instr, 
            '2drop' : '''    drop drop''', 
            'nip' : '''    swap drop''', 
            '2nip' : '''    2swap 2drop''', 
            'swap' : '''    1 roll''', 
            '2swap' : '''    rot >r rot r>''',
            'reverse' : '''    swap rot''',
            'roll' : self.roll_instr, 
            'pick' : self.pick_instr, 
            'over' : '''    swap dup rot rot''',
            '2over' : '''    2>r 2dup 2r> 2swap''', 
            'rot' : '''    2 roll''', 
            'rotonall' : '''    wp 1- roll''', 
            '.' : self.point_instr, 
            '.s' : '''    dup .''', 
            '2.s' : '''    2dup . bl . bl''', 
            '.cr' : '''    . cr''',
            '.scr' : '''    .s cr''',
            '.2cr' : '''    .cr cr''',
            '.bl' : '''    space emit''',
            'words' : self.words_instr, 
            'dump' : self.dump_instr, 
            'bye' : self.bye_instr, 
            ':' : self.begin_def_instr,
            ';' : self.pointvirg_instr, 
            '(' : self.bcomment_instr, 
            ')' : self.ecomment_instr, 
            '1+' : '''    1 +''', 
            '2+' : '''    2 +''', 
            '2*' : '''    2 *''', 
            '1-' : '''    1 swap -''', 
            '2-' : '''    2 swap -''', 
            'true' : 1,
            'false' : 0, 
            '0=' : '''    0 =''', 
            '0>' : '''    0 >''', 
            '0<' : '''    0 <''', 
            '0>=' : '''    0 >=''', 
            '0<=' : '''    0 <=''', 
            'invert' : '''    0=''', 
            '2>r' : '''    swap >r >r''',
            '2r>' : '''    r> r> swap''', 
            'import' : self.import_instr, 
            'detach' : self.detach_instr, 
            'help' : self.help_instr, 
            'emit' : self.emit_instr,
            'cr' : self.cr_instr, 
            'input' : self.input_instr, 
            'secinput' : self.secinput_instr, 
            'var' : '''    create ,''', 
            '2var' : '''    create , ,''', 
            'const' : '''    create , drop''',
            '2const' : '''    create , , drop''',
            '@' : self.arobase_instr,
            '?' : '''    @ .''', 
            '*' : self.prod_instr, 
            '+' : self.plus_instr,
            '-' : self.minus_instr,
            '/' : self.div_instr,
            'negate' : '''    -1 *''',
            'min' : '''    2dup <= 
    if 
        drop 
    else 
        nip 
    then''',
            'max' : '''    2dup >= 
    if 
        drop 
    else 
        nip 
    then''',
            '*/' : '''    rot rot * swap /''',
            '%' : '''    100 */''',
            'packages' : self.packages_instr,
            'variables' : self.variables_instr,
            'constants' : self.constants_instr,
            '=' : self.equal_instr, 
            '<>' : '''    = invert''',
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
            '2rdrop' : '''    rdrop rdrop''',
            'rswap' : self.rswap_instr,
            'rdup' : self.rdup_instr,
            '2rdup' : '''    rover rover''',
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
            '+!' : '''    dup @ rot + swap !''',
            '*!' : '''    dup @ rot * swap !''',
            'and' : self.and_instr,
            'or' : self.or_instr,
            'xor' : self.xor_instr,
            'forget' : self.forget_instr,
            'cls' : self.clearstack_instr,
            'leave' : '',
            'abort' : self.abort_instr,
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
            'cell?' : '''    cell@ .''',
            'cells?' : '''    cells .''',
            'clt' : self.clt_instr,
            ',' : self.forceexclam_instr,
            'load' : self.load_instr,
            'list' : self.list_instr,
            'char' : self.char_instr,
            'chars' : self.chars_instr,
            'bl' : '''    decimal 32 emit''',
            'path' : 'userarea',
            'recurse' : self.recurse_instr,
            'format' : self.format_instr,
            's+' : self.concat_instr,
            'scan' : self.scan_instr,
            'base' : 10,
            'decimal' : self.decimal_instr,
            'octal' : self.octal_instr,
            'hex' : self.hex_instr,
            'base!' : self.baseexclam_instr,
            '>base' : self.tobase_instr,
            '>decimal' : self.todecimal_instr,
            '?int' : self.isint_instr,
            '?def' : self.isdef_instr,
            '?var' : self.isvar_instr,
            '?local' : self.islocal_instr,
            '?float' : self.isfloat_instr,
            '?str' : self.isstr_instr,
            '?char' : self.ischar_instr,
            '?array' : self.isarray_instr,
            '?pack' : self.ispackloaded_instr,
            '?exists' : self.isexists_instr,
            'wp' : self.workstackpointer_instr,
            'sp' : self.seqpointer_instr,
            'vp' : self.dictpointer_instr,
            'kpress' : self.keypress_instr,
            'readk' : self.readkey_instr,
            'space' : '''    bl''',
            'arget' : '''    rot rot swap cell@ cell@''',
            'arrow' : '''    swap cell@''',
            'arcol' : '''    swap cell@''',
            't{' : self.begintest_instr,
            '}t' : self.endtest_instr,
            '<=>' : self.test_instr,
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
            'here' : self.here_instr,
            'local' : self.local_instr,
            'keys' : self.keys_instr,
            'values' : self.values_instr,
            '>md5' : self.md5_instr,
            '>json' : self.jsonencode_instr,
            'json>' : self.jsondecode_instr,
            'lang?' : self.locale_instr
        }

        self.variables = ['path']
        self.interpreter.immediate.append('test')
        self.interpreter.userdefinitions['true'] = deque(['@'])
        self.interpreter.userdefinitions['false'] = deque(['@'])
        self.interpreter.userdefinitions['base'] = deque(['@'])
        self.interpreter.compile['const'] = deque(['@'])
        self.interpreter.compile['2const'] = deque(['@'])
        self.help = core_help(self.interpreter.output)
        self.version = 'v1.7.2'

    '''
    Error helpers
    '''
    def err(self, code, context):
        return core_errors.__dict__[code].print_error(context, self.interpreter.output)

    def nothing_in_work(self, context):
        return self.err('error_nothing_in_work_stack', context)

    def nothing_in_return(self, context):
        return self.err('error_nothing_in_return_stack', context)

    '''
    Instruction bye : quitte l'interpreteur Beetle
    '''
    def bye_instr(self):
        return 'break'
           
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
    Instruction import : importe le dictionnaire d'un package dans le dictionnaire principal 
    '''
    def import_instr(self):
        if len(self.interpreter.sequences[self.interpreter.lastseqnumber]) == 0:
            return self.err('error_import_name_missing', 'import')
        packname = self.pop_sequence()
        self.__import_recursive(packname)
        return 'nobreak'


    def __import_recursive(self, packname, imported=None):
        if imported is None:
            imported = set()
        if packname in imported:
            return
        imported.add(packname)
        result = self.__importonepack(packname)
        if isinstance(result, str) and result.startswith("error"):
            return result
        pack = self.interpreter.packages.get(packname)
        if not pack:
            return
        if hasattr(pack, 'packuse') and pack.packuse:
            for subpack in pack.packuse:
                self.__import_recursive(subpack, imported)

    def __importonepack(self, packname):
        if packname not in self.interpreter.packages.keys():
            if packname not in self.interpreter.packages.keys():
                packpath = 'packages.'
                try:
                    module = importlib.import_module(packpath + packname, package=None)
                    self.interpreter.packages[packname] = eval('module.' + packname)(self.interpreter)
                except (AttributeError, ModuleNotFoundError):
                    return self.err('error_package_dont_exists', packname)


    '''
    Instruction detach : détache le dictionnaire d'un package du dictionnaire principal 
    '''
    def detach_instr(self):
        if len(self.interpreter.sequences[self.interpreter.lastseqnumber]) == 0:
            return self.err('error_import_name_missing', 'detach')
        packname = self.pop_sequence()
        if packname in self.interpreter.packages.keys():
            del self.interpreter.packages[packname]
        return 'nobreak'

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
                return self.err('error_integer_expected', 'emit')
        else:
            return self.nothing_in_work('emit')

    '''
    Instruction char : met sur la pile de travail le code du premier caractère d'une chaine de caractères
    '''
    def char_instr(self):
        if len(self.work) > 0:
            temp = self.pop_work()
            self.work.appendleft(ord(temp[0]))
        else:
            return self.nothing_in_work('char')


    '''
    Instruction chars : ajoute sur la pile de travail le nombre de caractère d'une chaine
    '''
    def chars_instr(self):
        if len(self.work) > 0:
            temp = self.pop_work()
            self.work.appendleft(len(temp))
            return 'nobreak'
        else:
            return self.nothing_in_work('chars')

    '''
    Instruction cr : permet d'afficher un retour chariot dans la console
    '''
    def cr_instr(self):
        print('')
        return 'nobreak'


    '''
    Instruction list : affiche le contenu d'un fichier Beetle
    '''
    def list_instr(self):
        if self.interpreter.isemptylastsequence():
            return self.err('error_filename_missing', 'list')
        filename = str(self.interpreter.sequences[self.interpreter.lastseqnumber][0])
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        filename = '{0}/{1}.btl'.format(self.dictionary['path'], filename)
        try:
            f = open(filename, encoding="utf-8")
        except(FileNotFoundError):
            return self.err('error_no_such_file', 'list' + filename)
        content = f.read()
        if self.interpreter.output == 'web':
            content = content.replace('\n', '<br>')
            content = content.replace(' ', '&nbsp;')
        print(content, end='')
        f.close()
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
                        return self.err('error_invalid_litteral', '*')
                elif not isinstance(op1, list) and isinstance(op2, list):
                    if isinstance(op1, int) or isinstance(op1, float):
                        self.work.appendleft([op2[i]*op1 for i in range(0, len(op2))])
                        return 'nobreak'
                    else:
                        return self.err('error_invalid_litteral', '*')
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
                        return self.err('error_invalid_litteral', '*')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '*')
            result = op1 * op2
            self.work.appendleft(self.to_base(result, base))
            return 'nobreak'
        else:
            return self.nothing_in_work('*')

    def to_base(self, number, base):
        base_string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        result = ""
        while number:
            result += base_string[number % base]
            number //= base
        return result[::-1] or "0"

    '''
    Instruction + : Fait l'addition entre 2 nombres ou vecteurs ou matrices du haut de la pile de travail et ajoute le résultat en haut de la pile
    '''
    def plus(self, op1, op2):
        # si ce sont des vecteurs ou des matrices
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
                return self.err('error_invalid_litteral', '+')
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
                return self.err('error_invalid_litteral', '+')
        elif isinstance(op1, list) and isinstance(op2, list):
            op3 = []
            for i in range(min(len(op1),len(op2))):
                temp = self.plus(op2[i], op1[i])
                op3.append(temp)
            op3 = op3 + max(op1,op2,key=len)[min(len(op1),len(op2)):]
            return op3

        # Si ce ne sont que des nombres
        base = self.dictionary['base']
        if base == 10:
            try:
                if isinstance(op1, str):
                    op1 = float(op1)
                if isinstance(op2, str):
                    op2 = float(op2)
                return op1 + op2
            except ValueError:
                return self.err('error_invalid_litteral', '+')
        else:
            if not isinstance(op1, float) and not isinstance(op1, str):
                baselist = self.possiblebases(str(op1), False)
                if base not in baselist:
                    return self.err('error_invalid_litteral', '+ ' + str(op1))
            if not isinstance(op2, float) and not isinstance(op2, str):
                baselist = self.possiblebases(str(op2), False)
                if base not in baselist:
                    return self.err('error_invalid_litteral', '+ ' + str(op2))
            result = self.to_base(int(op1, base) + int(op2, base), base)
            return result
        return self.err('error_invalid_litteral', '+')    

    def plus_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            op3 = self.plus(op1, op2)
            if op3 != "nobreak":
                self.work.appendleft(op3)
            return 'nobreak'
        else:
            return self.nothing_in_work('+')

    def possiblebases(self, s: str, exclure10=True):
        bases = []
        for base in range(2, 37):
            if exclure10 and base == 10:
                continue
            try:
                int(s, base)
                bases.append(base)
            except ValueError:
                return self.err('error_invalid_litteral', '+')
        return bases

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
                    return self.err('error_invalid_litteral', '-')
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
                    return self.err('error_invalid_litteral', '-')
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
                        return self.err('error_invalid_litteral', '-')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '-')
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
            return self.nothing_in_work('-')

    '''
    Instruction / : Division entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    La division dans une autre base que 10 n'est pas possible
    '''
    def div_instr(self):
        if len(self.work) > 1:
            base = self.dictionary['base']
            op1 = self.pop_work()
            if op1 == 0:
                return self.err('error_division_by_zero_invalid', '/')
            op2 = self.pop_work()
            if isinstance(op1, list) or isinstance(op2, list):
                return self.err('error_invalid_litteral', '/')
            if base == 10:
                if isinstance(op1, str):
                    op1 = float(op1)
                if isinstance(op2, str):
                    op2 = float(op2)
            else:
                return self.err('error_invalid_litteral', '/')
            result = op2 / op1
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return self.nothing_in_work('/')

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
                        return self.err('error_invalid_litteral', '=')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '=')
            if op2 == op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return self.nothing_in_work('=')

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
                        return self.err('error_invalid_litteral', '>')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '>')
            if op2 > op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return self.nothing_in_work('>')

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
                        return self.err('error_invalid_litteral', '<')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '<')
            if op2 < op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return self.nothing_in_work('<')

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
                        return self.err('error_invalid_litteral', '>=')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '>=')
            if op2 >= op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return self.nothing_in_work('>=')

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
                        return self.err('error_invalid_litteral', '<=')
                if isinstance(op2, str):
                    try:
                        op2 = int(op2, base)
                    except(ValueError):
                        return self.err('error_invalid_litteral', '<=')
            if op2 <= op1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'   
        else:
            return self.nothing_in_work('<=')

    '''
    Instruction ! : affecte la valeur d'une variable uniquement
    '''
    def exclam_instr(self):
        if len(self.work) > 1:
            name = self.pop_work()
            if name in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                value = self.pop_work()
                self.interpreter.locals[self.interpreter.lastseqnumber][name] = value
            else:
                if name in self.interpreter.userdefinitions.keys():
                    return self.err('error_invalid_update_constant', '!')
                if name not in self.variables:
                    return self.err('error_not_a_variable', '!')
                value = self.pop_work()
                for pack in self.interpreter.packages.keys():
                    if name in self.interpreter.packages[pack].dictionary.keys() and name in self.variables:
                        self.interpreter.packages[pack].dictionary[name] = value
                        break
            return 'nobreak'
        else:
            return self.nothing_in_work('!')

    '''
    Instruction force! : affecte la valeur d'une variable et d'une constante : A UTILISER AVEC PRUDENCE
    '''
    def forceexclam_instr(self):
        if len(self.work) > 1:
            name = self.work[0]
            self.work.popleft()
            value = self.pop_work()
            for pack in self.interpreter.packages:
                if name in self.interpreter.packages[pack].dictionary.keys():
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
            return self.nothing_in_work('force!')

    '''
    Instruction variables : affiche la liste des variables
    '''
    def variables_instr(self):
        mystr = ''
        for var in self.variables:
            if mystr != '':
                mystr += '\n'
            pack = self.interpreter.search_in_pack(var)
            if pack != False:
                mystr += var + ' = ' + str(self.interpreter.packages[pack].dictionary[var]) + ' ;'
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
                    if mystr != '':
                        mystr += '\n'
                    mystr += const + ' = ' + str(self.interpreter.packages[pack].dictionary[const]) + ' ;'
        if mystr != '':
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
            return self.nothing_in_work('and')

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
            return self.nothing_in_work('or')

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
            return self.nothing_in_work('xor')

    '''
    Instruction see : affiche le contenu d'une définition quand il le peut
    '''
    def see_instr(self):
        if self.interpreter.isemptylastsequence():
            return self.err('error_def_name_missing', 'see')
        def_name = self.interpreter.sequences[self.interpreter.lastseqnumber][0]
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        if def_name not in self.variables:
            for p in self.interpreter.packages.keys():
                if def_name in self.interpreter.packages[p].dictionary.keys():
                    definition = self.interpreter.packages[p].dictionary[def_name]
                    if isinstance(definition, str):
                        print(': ' + def_name)
                        if definition != '':
                            print(definition)
                        if def_name in self.interpreter.compile.keys():
                            print('does> ' + list(self.interpreter.compile[def_name])[0])
                        if def_name in self.interpreter.immediate:
                            print('; immediate', end='')
                        else:
                            print(';', end='')
                        return 'nobreak'
                    else:
                        return self.err('error_native_definition', 'see ' + def_name)
        else:
            return self.err('error_definition_only', 'see')

    '''
    Instruction clt : efface le contenu de la console
    '''
    def clt_instr(self):
        os.system('cls||clear')
        return 'nobreak'
    
    '''
    Instruction format : formatte une chaine de caractères
    string array FORMAT --> formatted string with array on work stack
    marqueur dans la chaine de caractères <#...#>
    '''
    def format_instr(self):
        if len(self.work) > 1:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    tab = self.dictionary[tab]
                    if not isinstance(tab, list):
                        return self.err('error_get_cell_on_array_invalid', 'format')
                if not isinstance(tab, list):
                    return self.err('error_get_cell_on_array_invalid', 'format')
            elif not isinstance(tab, list):
                return self.err('error_get_cell_on_array_invalid', 'format')
            content = self.pop_work()

            content = content.replace('{', '<<')
            content = content.replace('}', '>>')
            content = content.replace('<#', '{')
            content = content.replace('#>', '}')
            try:
                content = content.format(*tab)
            except(IndexError):
                return self.err('error_index_on_array_invalid', 'format')
            except(ValueError):
                return self.err('error_string_invalid', 'format')
            except(KeyError):
                return self.err('error_string_invalid', 'format')
            content = content.replace('<<', '{')
            content = content.replace('>>', '}')
            self.work.appendleft(content)
            return 'nobreak'
        else:
            return self.nothing_in_work('format')

    '''
    Instruction s+ : concatène 2 chaines de caractères
    '''
    def concat_instr(self):
        if len(self.work) > 1:
            op1 = self.pop_work()
            op2 = self.pop_work()
            if isinstance(op1, str) and (isinstance(op2, int) or isinstance(op2, float)):
                self.work.appendleft(str(op2) + op1)
                return 'nobreak'
            if isinstance(op2, str) and (isinstance(op1, int) or isinstance(op1, float)):
                self.work.appendleft(op2 + str(op1)) 
                return 'nobreak'
            if isinstance(op1, str) and isinstance(op2, str):
                self.work.appendleft(op2 + op1)
                return 'nobreak'
            else:
                return self.err('error_strings_expected', 's+')
        else:
            return self.nothing_in_work('s+')

    '''
    Instruction scan : savoir si une chaine de caractères est contenu dans une autre chaine de caractères
    '''
    def scan_instr(self):
        if len(self.work) > 1:
            str1 = self.pop_work()
            str2 = self.pop_work()
            if isinstance(str1, str) and isinstance(str2, str):
                if str1 in str2:
                    self.work.appendleft(1)
                else:
                    self.work.appendleft(0)
                return 'nobreak'    
            else:
                return self.err('error_strings_expected', 'scan')
        else:
            return self.nothing_in_work('scan')

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
                return self.err('error_basenumber_invalid', 'base!')
            self.dictionary['base'] = base
            return 'nobreak'
        else:
            return self.nothing_in_work('base!')

    '''
    Instruction >base : convertit un nombre en base 10 en un nombre en base n 2 <= n <= 36 : number_in_base_10 newbase >BASE
    '''
    def tobase_instr(self):
        if len(self.work) > 1:
            base = self.pop_work()
            if base < 2 or base > 36 or base == 10:
                return self.err('error_basenumber_invalid', 'tobase')
            number = self.pop_work()
            if not isinstance(number, int):
                return self.err('error_integer_expected', 'tobase')
            self.work.appendleft(self.to_base(number, base))
            return 'nobreak'
        else:
            return self.nothing_in_work('tobase')

    '''
    Instruction >decimal : convertit un nombre en base n != 10 en un nombre en base 10 : str base >DECIMAL
    '''
    def todecimal_instr(self):
        if len(self.work) > 1:
            base = self.pop_work()
            if base < 2 or base > 36:
                return self.err('error_basenumber_invalid', 'todecimal')
            number = self.pop_work()
            if not isinstance(number, str):
                return self.err('error_integer_expected', 'todecimal')
            self.work.appendleft(int(str(number), base))
            return 'nobreak'
        else:
            return self.nothing_in_work('todecimal')

    '''
    Instruction ?int : indique si le nombre de la pile de travail est un entier
    '''
    def isint_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            #self.work.appendleft(o)
            if self.isinteger(o):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return self.nothing_in_work('?int')

    '''
    Instruction ?float : indique si le nombre de la pile de travail est un float
    '''
    def isfloat_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            #self.work.appendleft(o)
            if self.isfloat(o):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return self.nothing_in_work('?float')

    '''
    Instruction ?str : indique si le haut de la pile de travail est une chaine de caractères
    '''
    def isstr_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            #self.work.appendleft(o)
            if isinstance(o, str):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return self.nothing_in_work('?str')

    '''
    Instruction ?char : indique si le haut de la pile de travail est un caractère
    '''
    def ischar_instr(self):
        if len(self.work) > 0:
            o = self.pop_work()
            #self.work.appendleft(o)
            if isinstance(o, str) and len(o) == 1:
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return self.nothing_in_work('?char')

    '''
    Instruction ?pack : indique si l'élément de la pile de travail est un package
    '''
    def ispackloaded_instr(self):
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if len(seq) == 0:
            return self.err('error_import_name_missing', '?pack')
        packname = self.pop_sequence()
        if packname in self.interpreter.packages.keys():
            self.work.appendleft(1)
        else:
            self.work.appendleft(0)
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

    '''
    Instruction ?exists : teste l'existence d'une variable ou d'une constante
    '''
    def isexists_instr(self):
        if self.interpreter.isemptylastsequence():
            return self.err('error_instruction_expected', '?exists')
        obj_name = self.pop_work()
        if obj_name in self.variables or obj_name in self.interpreter.userdefinitions:
            self.work.appendleft(1)
        else:
            self.work.appendleft(0)
        return 'nobreak'

    def begintest_instr(self):
        left_instrs = deque()
        right_instrs = deque()
        instr = self.pop_sequence()
        while str(instr).lower() != '<=>':
            left_instrs.append(str(instr).lower())
            instr = self.pop_sequence()
            if str(instr).lower() == '}t':
                return self.err('error_invalid_instruction', 'tests - }t')
        instr = self.pop_sequence()
        while str(instr).lower() != '}t':
            right_instrs.append(str(instr).lower())
            instr = self.pop_sequence()
            if str(instr).lower() == '<=>':
                return self.err('error_invalid_instruction', 'tests - <=>')
            if str(instr).lower() == 't{':
                return self.err('error_invalid_instruction', 'tests - t{')
        ileft = self.exec_interpreter(left_instrs)
        iright = self.exec_interpreter(right_instrs)
        ileftwork = list(ileft.work)
        irightwork = list(iright.work)
        if ileftwork == irightwork:
            self.work.appendleft(1)
            print(termcolors.GREEN + "true test" + termcolors.NORMAL, end=' ')
        else:
            self.work.appendleft(0)
            print(termcolors.FATAL + "false test" + termcolors.NORMAL, end=' ')
        return 'nobreak'

    def endtest_instr(self):
        return self.err('error_array_invalid', '}t')

    def test_instr(self):
        return self.err('error_array_invalid', '<=>')

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
                self.interpreter.string_treatment(split)
                self.interpreter.set_sequence(self.interpreter.instructions.copy())
                ret = self.interpreter.interpret('last_sequence')
                self.interpreter.decreaselastseqnumber()
                if ret == 'break':
                    return 'break'
                else:
                    return 'nobreak'
            else:
                return self.err('error_nothing_to_evaluate', 'evaluate')
        else:
            return self.nothing_in_work('evaluate')

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
            return self.err('error_not_a_variable_or_definition', 'execute')
        else:
            return self.nothing_in_work('execute')

    def here_instr(self):
        if self.interpreter.recentWord != None:
            self.work.appendleft(self.interpreter.recentWord)
        else:
            self.work.appendleft('here')
        return 'nobreak'

    '''
    Instruction >md5 : écrit sur le haut de la pile de données le md5 du haut de la pile de données
    '''
    def md5_instr(self):
        if len(self.work) > 0:
            val = self.pop_work()
            md5 = hashlib.md5(val.encode())
            self.work.appendleft(md5.hexdigest())
            return 'nobreak'
        else:
            return self.nothing_in_work('>md5')

    '''
    Instruction jsonencode : transforme une structure dict et list en une chaine de caractères
    '''
    def jsonencode_instr(self):
        if len(self.work) > 0:
            val = self.pop_work()
            self.work.appendleft(json.dumps(val))
            return 'nobreak'
        else:
            return self.nothing_in_work('>json')

    '''
    Instruction jsondecode : transforme une chaine de caractères en une structure dict et list
    '''
    def jsondecode_instr(self):
        if len(self.work) > 0:
            val = self.pop_work()
            self.work.appendleft(json.loads(val))
            return 'nobreak'
        else:
            return self.nothing_in_work('json>')

    '''
    Instruction lang? : détection automatique de la langue utilisée
    '''
    def locale_instr(self):
        lang = locale.getdefaultlocale()
        if not lang:
            self.work.appendleft('en')
        else:
            self.work.appendleft(lang[0].split('_')[0])
        return 'nobreak'
