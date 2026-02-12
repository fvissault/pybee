import importlib
import os
import hashlib
import json
import locale
from collections import deque
from packages.errors.core_errors import core_errors

class Utils:

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
            try:
                module = importlib.import_module('packages.' + packname, package=None)
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
            content = content.replace('\n', '<br>').replace(' ', '&nbsp;')
        print(content)
        f.close()
        return 'nobreak'

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
                            print(';')
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
        if self.require_stack(1, 'base!') == None:
            base = self.pop_work()
            if base < 2 or base > 36:
                return self.err('error_basenumber_invalid', 'base!')
            self.dictionary['base'] = base
            return 'nobreak'

    '''
    Instruction >base : convertit un nombre en base 10 en un nombre en base n 2 <= n <= 36 : number_in_base_10 newbase >BASE
    '''
    def tobase_instr(self):
        if self.require_stack(2, '>base') == None:
            base = self.pop_work()
            if base < 2 or base > 36 or base == 10:
                return self.err('error_basenumber_invalid', '>base')
            number = self.pop_work()
            if not isinstance(number, int):
                return self.err('error_integer_expected', '>base')
            self.interpreter.work.appendleft(self.to_base(number, base))
            return 'nobreak'

    '''
    Instruction >decimal : convertit un nombre en base n != 10 en un nombre en base 10 : str base >DECIMAL
    '''
    def todecimal_instr(self):
        if self.require_stack(2, '>decimal') == None:
            base = self.pop_work()
            if base < 2 or base > 36:
                return self.err('error_basenumber_invalid', '>decimal')
            number = self.pop_work()
            if not isinstance(number, str):
                return self.err('error_integer_expected', '>decimal')
            self.interpreter.work.appendleft(int(str(number), base))
            return 'nobreak'

    '''
    Instruction ?int : indique si le nombre de la pile de travail est un entier
    '''
    def isint_instr(self):
        if self.require_stack(1, '?int') == None:
            o = self.pop_work()
            if self.isinteger(o):
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?float : indique si le nombre de la pile de travail est un float
    '''
    def isfloat_instr(self):
        if self.require_stack(1, '?float') == None:
            o = self.pop_work()
            if self.isfloat(o):
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?str : indique si le haut de la pile de travail est une chaine de caractères
    '''
    def isstr_instr(self):
        if self.require_stack(1, '?str') == None:
            o = self.pop_work()
            if isinstance(o, str):
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?char : indique si le haut de la pile de travail est un caractère
    '''
    def ischar_instr(self):
        if self.require_stack(1, '?char') == None:
            o = self.pop_work()
            if isinstance(o, str) and len(o) == 1:
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?pack : indique si l'élément de la pile de travail est un package
    '''
    def ispackloaded_instr(self):
        seq = self.interpreter.sequences[self.interpreter.lastseqnumber]
        if len(seq) == 0:
            return self.err('error_import_name_missing', '?pack')
        packname = self.pop_sequence()
        if packname in self.interpreter.packages.keys():
            self.interpreter.work.appendleft(1)
        else:
            self.interpreter.work.appendleft(0)
        return 'nobreak'

    '''
    Instruction sp? : indique l'adresse de la prochaine séquence
    '''
    def seqpointer_instr(self):
        self.interpreter.work.appendleft(len(self.interpreter.sequences))
        return 'nobreak'

    '''
    Instruction vp? : indique l'adresse du prochain élément du dictionnaire
    '''
    def dictpointer_instr(self):
        pointer = 0
        for pack in self.interpreter.packages:
            pointer += len(self.interpreter.packages[pack].dictionary)
        self.interpreter.work.appendleft(pointer)
        return 'nobreak'

    '''
    Instruction ?exists : teste l'existence d'une variable ou d'une constante
    '''
    def isexists_instr(self):
        if self.interpreter.isemptylastsequence():
            return self.err('error_instruction_expected', '?exists')
        obj_name = self.pop_work()
        if obj_name in self.variables or obj_name in self.interpreter.userdefinitions:
            self.interpreter.work.appendleft(1)
        else:
            self.interpreter.work.appendleft(0)
        return 'nobreak'

    def here_instr(self):
        if self.interpreter.recentWord != None:
            self.interpreter.work.appendleft(self.interpreter.recentWord)
        else:
            self.interpreter.work.appendleft('here')
        return 'nobreak'

    '''
    Instruction >md5 : écrit sur le haut de la pile de données le md5 du haut de la pile de données
    '''
    def md5_instr(self):
        if self.require_stack(1, '>md5') == None:
            val = self.pop_work()
            md5 = hashlib.md5(val.encode())
            self.interpreter.work.appendleft(md5.hexdigest())
            return 'nobreak'

    '''
    Instruction jsonencode : transforme une structure dict et list en une chaine de caractères
    '''
    def jsonencode_instr(self):
        if self.require_stack(1, '>json') == None:
            val = self.pop_work()
            self.interpreter.work.appendleft(json.dumps(val))
            return 'nobreak'

    '''
    Instruction jsondecode : transforme une chaine de caractères en une structure dict et list
    '''
    def jsondecode_instr(self):
        if self.require_stack(1, 'json>') == None:
            val = self.pop_work()
            self.interpreter.work.appendleft(json.loads(val))
            return 'nobreak'

    '''
    Instruction lang? : détection automatique de la langue utilisée
    '''
    def locale_instr(self):
        lang = locale.getdefaultlocale()
        if not lang:
            self.interpreter.work.appendleft('en')
        else:
            self.interpreter.work.appendleft(lang[0].split('_')[0])
        return 'nobreak'

    '''
    Instruction evaluate : évalue une chaine de caractères dans Beetle
    exemple : 
        "2 dup" evaluate dump => 2 2
    '''
    def evaluate_instr(self):
        if self.require_stack(1, 'evaluate') == None:
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

    '''
    Instruction execute : execute une instruction dans Beetle. Ne peut pas exécuter un mot qui lit un mot dans la suite de la séquence
    exemple : 
        2 ' dup execute dump => 2 2
    '''
    def execute_instr(self):
        if self.require_stack(1, 'execute') == None:
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

    '''
    Instruction ! : affecte la valeur d'une variable uniquement
    '''
    def exclam_instr(self):
        if self.require_stack(2, '!') == None:
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

    '''
    Instruction force! : affecte la valeur d'une variable et d'une constante : A UTILISER AVEC PRUDENCE
    '''
    def forceexclam_instr(self):
        if self.require_stack(2, 'force!') == None:
            name = self.interpreter.work[0]
            self.interpreter.work.popleft()
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
                    self.interpreter.work.appendleft(name)
                    break
            return 'nobreak'
    
    '''
    Instruction format : formatte une chaine de caractères
    string array FORMAT --> formatted string with array on work stack
    marqueur dans la chaine de caractères <#...#>
    '''
    def format_instr(self):
        if self.require_stack(2, 'format') == None:
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

            content = content.replace('{', '<<').replace('}', '>>').replace('<#', '{').replace('#>', '}')
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
            self.interpreter.work.appendleft(content)
            return 'nobreak'

    '''
    Instruction s+ : concatène 2 chaines de caractères
    '''
    def concat_instr(self):
        if self.require_stack(2, 's+') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            if isinstance(op1, str) and (isinstance(op2, int) or isinstance(op2, float)):
                self.interpreter.work.appendleft(str(op2) + op1)
                return 'nobreak'
            if isinstance(op2, str) and (isinstance(op1, int) or isinstance(op1, float)):
                self.interpreter.work.appendleft(op2 + str(op1)) 
                return 'nobreak'
            if isinstance(op1, str) and isinstance(op2, str):
                self.interpreter.work.appendleft(op2 + op1)
                return 'nobreak'
            else:
                return self.err('error_strings_expected', 's+')

    '''
    Instruction scan : savoir si une chaine de caractères est contenu dans une autre chaine de caractères
    '''
    def scan_instr(self):
        if self.require_stack(2, 'scan') == None:
            str1 = self.pop_work()
            str2 = self.pop_work()
            if isinstance(str1, str) and isinstance(str2, str):
                if str1 in str2:
                    self.interpreter.work.appendleft(1)
                else:
                    self.interpreter.work.appendleft(0)
                return 'nobreak'
            else:
                return self.err('error_strings_expected', 'scan')

    def ljust_instr(self):
        if self.require_stack(3, 'rpad') == None:
            c = self.pop_work()
            if len(c) == 1:
                n = self.pop_work()
                if isinstance(n, int):
                    s = self.pop_work()
                    if isinstance(s, str):
                        self.interpreter.work.appendleft(s.ljust(n, c))
                        return 'nobreak'
                    else:
                        return self.err('error_strings_expected', 'rpad')
                else:
                    return self.err('error_integer_expected', 'rpad')
            else:
                return self.err('error_char_expected', 'rpad')

    def rjust_instr(self):
        if self.require_stack(3, 'lpad') == None:
            c = self.pop_work()
            if len(c) == 1:
                n = self.pop_work()
                if isinstance(n, int):
                    s = self.pop_work()
                    if isinstance(s, str):
                        self.interpreter.work.appendleft(s.rjust(n, c))
                        return 'nobreak'
                    else:
                        return self.err('error_strings_expected', 'lpad')
                else:
                    return self.err('error_integer_expected', 'lpad')
            else:
                return self.err('error_char_expected', 'lpad')
