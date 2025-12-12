from collections import deque

class Structures:

    '''
    Instruction array : créé un tableau : n1 n2 n3 ... size array
    '''
    def array_instr(self):
        if self.require_stack(1, 'array') == None:
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
                return self.nothing_in_work('array')

    '''
    { name1 : value1 , name2 : [ 1 , 2 ] }  ==> {'name1':value1, 'name2':[1, 2]}
    [ { name1 : value1 , name2 : [ 1 , 2 ] } ]  ==> [{'name1':value1, 'name2':[1, 2]}]
    '''
    def bbrace_instr(self):
        result = self.search_braces()
        #if len(result) > 0:
            #result.reverse()
        self.work.appendleft(result)
        return 'nobreak'

    def ebrace_instr(self):
        return self.err('error_array_invalid', '}')

    def search_braces(self):
        result = {}
        if self.interpreter.isemptylastsequence():
            return self.err('error_array_invalid', 'hash')
        instr = str(self.pop_sequence())
        while instr != '}':
            elname = instr
            if self.interpreter.isemptylastsequence():
                return self.err('error_array_invalid', 'hash')
            instr = str(self.pop_sequence())
            if instr != ':':
                return self.err('error_array_invalid', 'hash')
            else:
                instr = str(self.pop_sequence())
                elseq = []
                while instr != ',' and instr != '}':
                    if instr == '[':
                        elseq.append(self.search_brakets())
                        if self.interpreter.isemptylastsequence():
                            return self.err('error_array_invalid', 'hash')
                        instr = str(self.pop_sequence())
                        continue
                    if instr == '{':
                        elseq.append(self.search_braces())
                        if self.interpreter.isemptylastsequence():
                            return self.err('error_array_invalid', 'hash')
                        instr = str(self.pop_sequence())
                        continue
                    elif self.isinteger(instr):
                        elseq.append(int(instr))
                        if self.interpreter.isemptylastsequence():
                            return self.err('error_array_invalid', 'hash')                    
                        instr = str(self.pop_sequence())
                        continue
                    elif self.isfloat(instr):
                        elseq.append(float(instr))
                        if self.interpreter.isemptylastsequence():
                            return self.err('error_array_invalid', 'hash')
                        instr = str(self.pop_sequence())
                        continue
                    elseq.append(instr)
                    instr = str(self.pop_sequence())
                i = self.exec_interpreter(deque(elseq))
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
        else:
            self.work.appendleft(result)
        return 'nobreak'

    '''
    Instruction ] : ferme la séquence de création d'un tableau : [ n1 , n2 , n3 ]
    '''
    def ebraket_instr(self):
        return self.err('error_array_invalid', ']')

    def search_brakets(self):
        result = []
        if self.interpreter.isemptylastsequence():
            return self.err('error_array_invalid', 'array')
        instr = str(self.pop_sequence())
        while instr != ']':
            if instr == '[':
                ret = self.search_brakets()
                ret.reverse()
                result.append(ret)
                if self.interpreter.isemptylastsequence():
                    return self.err('error_array_invalid', 'array')
                instr = str(self.pop_sequence())
                continue
            elif instr == '{':
                result.append(self.search_braces())
                if self.interpreter.isemptylastsequence():
                    return self.err('error_array_invalid', 'array')
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
                    return self.err('error_array_invalid', 'array')                   
                instr = str(self.pop_sequence())
                continue
            elif self.isfloat(instr):
                result.append(float(instr))
                if self.interpreter.isemptylastsequence():
                    return self.err('error_array_invalid', 'array')
                instr = str(self.pop_sequence())
                continue
            result.append(instr)
            if self.interpreter.isemptylastsequence():
                return self.err('error_array_invalid', 'array')
            instr = str(self.pop_sequence())
        i = self.exec_interpreter(deque(result))
        return list(i.work)

    '''
    Instruction cells : écrit la taille d'un tableau sur la pile de travail
    '''
    def cells_instr(self):
        if self.require_stack(1, 'cells') == None:
            tab = self.pop_work()
            if tab in self.variables:
                tab = self.dictionary[tab]
                if not isinstance(tab, list) and not isinstance(tab , dict):
                    return self.err('error_get_cell_on_array_invalid', 'cells')
            if not isinstance(tab, list) and not isinstance(tab , dict):
                return self.err('error_get_cell_on_array_invalid', 'cells')
            self.work.appendleft(len(tab))
            return 'nobreak'

    '''
    Instruction cell@ : écrit le contenu d'une cellule d'un tableau sur la pile de travail : (array|var_name|const_name) position CELL@
    '''
    def cellarobase_instr(self):
        if self.require_stack(2, 'cell@') == None:
            position = self.pop_work()
            #print("position = ", position)
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    content = self.dictionary[tab]
                elif tab in list(self.interpreter.locals[self.interpreter.lastseqnumber].keys()):
                    content = self.interpreter.locals[self.interpreter.lastseqnumber][tab]
                else:
                    return self.err('error_not_a_variable', 'cell@')
            elif isinstance(tab, list) or isinstance(tab, dict):
                content = tab
            if not isinstance(content, list) and not isinstance(content , dict):
                return self.err('error_get_cell_on_array_invalid', '1cell@')
            if isinstance(content, dict) and position not in content.keys():
                return self.err('error_index_on_array_invalid', '2cell@')
            elif isinstance(position, int) and (position < 0 or position >= len(content)):
                #self.interpreter.print_sequence_numbers()
                return self.err('error_index_on_array_invalid', '3cell@')
            if isinstance(content, dict) and not isinstance(position, str):
                return self.err('error_index_on_array_invalid', '4cell@')
            elif isinstance(content, list) and not isinstance(position, int):
                return self.err('error_index_on_array_invalid', '5cell@')
            result = content[position]
            self.work.appendleft(result)
            return 'nobreak'

    '''
    Instruction cell! : écrit dans le contenu d'une cellule d'un tableau : value position array CELL!
    '''
    def cellexclam_instr(self):
        if self.require_stack(3, 'cell!') == None:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    content = self.dictionary[tab]
                elif tab in list(self.interpreter.locals[self.interpreter.lastseqnumber].keys()):
                    content = self.interpreter.locals[self.interpreter.lastseqnumber][tab]
                else:
                    return self.err('error_not_a_variable', 'cell@')
            elif isinstance(tab, list) or isinstance(tab, dict):
                content = tab
            position = self.pop_work()
            if isinstance(content, list):
                if not isinstance(position, int) or position < 0 or position >= len(content):
                    return self.err('error_index_on_array_invalid', 'cell!')
            if isinstance(content, dict) and position not in content.keys():
                return self.err('error_index_on_array_invalid', 'cell!')
            value = self.pop_work()
            content[position] = value
            self.work.appendleft(content)
            return 'nobreak'

    '''
    Instruction cell+ : crée nombre cellules dans un tableau : index value var_name CELL+
    '''
    def addcell_instr(self):
        if self.require_stack(2, 'cell+') == None:
            tab = self.pop_work()
            if tab in self.variables:
                content = self.dictionary[tab]
            elif tab in list(self.interpreter.locals[self.interpreter.lastseqnumber].keys()):
                content = self.interpreter.locals[self.interpreter.lastseqnumber][tab]
            elif isinstance(tab, list) or isinstance(tab, dict):
                content = tab
            else:
                return self.err('error_not_a_variable', 'cell+')
            value = self.pop_work()
            index = None
            if isinstance(content, dict):
                index = self.pop_work()
                if not isinstance(index, str):
                    return self.err('error_index_on_array_invalid', 'cell+')
            if not isinstance(content, dict) and not isinstance(content, list):
                content = [content, value]
            elif index is not None and index in content and isinstance(content[index], list):
                content[index].append(value)
            elif index is not None and isinstance(content, dict):
                content[index] = value
            elif isinstance(content, list):
                content.append(value)
            self.work.appendleft(content)
            return 'nobreak'

    '''
    Instruction cell- : détruit une cellule d'un tableau à la position position : index (array|var_name) CELL-
    '''
    def delcell_instr(self):
        if self.require_stack(2, 'cell-') == None:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    content = self.dictionary[tab]
                elif tab in list(self.interpreter.locals[self.interpreter.lastseqnumber].keys()):
                    content = self.interpreter.locals[self.interpreter.lastseqnumber][tab]
                else:
                    return self.err('error_not_a_variable', 'cell-')
            elif isinstance(tab, list) or isinstance(tab, dict):
                content = tab
            index = self.pop_work()
            if isinstance(content, list):
                if not isinstance(index, int) or index < 0 or index >= len(tab):
                    return self.err('error_index_on_array_invalid', 'cell-')
            if isinstance(content, dict):
                if index not in content.keys():
                    return self.err('error_index_on_array_invalid', 'cell-')
            content.pop(index)
            self.work.appendleft(content)
            return 'nobreak'

    '''
    Instruction cell= : teste l'existence d'un contenu d'une cellule d'un tableau : content array CELL= --> True or False
    '''
    def valequal_instr(self):
        if self.require_stack(2, 'cell=') == None:
            tab = self.pop_work()
            if isinstance(tab, str):
                if tab in self.variables:
                    arr = self.dictionary[tab]
                elif tab in list(self.interpreter.locals[self.interpreter.lastseqnumber].keys()):
                    content = self.interpreter.locals[self.interpreter.lastseqnumber][tab]
                else:
                    return self.err('error_not_a_variable', 'cell=')
            elif isinstance(tab, list) or isinstance(tab, dict):
                arr = tab
            content = self.pop_work()
            if isinstance(arr, list):
                if content in arr:
                    self.work.appendleft(1)
                else:
                    self.work.appendleft(0)
            if isinstance(arr, dict):
                if content in arr.values():
                    self.work.appendleft(1)
                else:
                    self.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction ?array : indique si l'élément de la pile de travail est un tableau
    '''
    def isarray_instr(self):
        if self.require_stack(1, '?array') == None:
            o = self.pop_work()
            #self.work.appendleft(o)
            if isinstance(o, list) or isinstance(o, dict):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'

    '''
    Instruction keys : écrit sur le haut de la pile de travail un tableau contenant les clés d'une table de hachage
    '''
    def keys_instr(self):
        if self.require_stack(1, 'keys') == None:
            content = None
            val = self.pop_work()
            if isinstance(val , str):
                for p in self.interpreter.packages.keys():
                    if val in self.interpreter.packages[p].variables:
                        content = self.interpreter.packages[p].dictionary[val]
                        break
                    elif val in self.interpreter.packages[p].userdefinitions.keys() and len(self.interpreter.packages[p].userdefinitions[val]) > 0:
                        content = self.interpreter.packages[p].dictionary[val]
                        break
                    elif val in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                        content = self.interpreter.locals[self.interpreter.lastseqnumber][val]
                        break
            if isinstance(val, dict) and content == None:
                content = val
            if content != None:
                if not isinstance(content, dict):
                    return self.err('error_array_invalid', 'keys')
                self.work.appendleft(list(content.keys()))
                return 'nobreak'
            else:
                return self.err('error_name_missing', 'keys')

    '''
    Instruction values : écrit sur le haut de la pile de travail un tableau contenant les valeurs d'une table de hachage
    '''
    def values_instr(self):
        if self.require_stack(1, 'values') == None:
            content = None
            val = self.pop_work()
            if isinstance(val , str):
                for p in self.interpreter.packages.keys():
                    if val in self.interpreter.packages[p].variables:
                        content = self.interpreter.packages[p].dictionary[val]
                        break
                    elif val in self.interpreter.packages[p].userdefinitions.keys() and len(self.interpreter.packages[p].userdefinitions[val]) > 0:
                        content = self.interpreter.packages[p].dictionary[val]
                        break
                    elif val in self.interpreter.locals[self.interpreter.lastseqnumber].keys():
                        content = self.interpreter.locals[self.interpreter.lastseqnumber][val]
                        break
            if isinstance(val, dict) and content == None:
                content = val
            
            # cas ou val est une liste, on retourne le tableau lui-même
            if isinstance(val, list) and content == None:
                self.work.appendleft(val)
                return 'nobreak'
            
            if content != None:
                if not isinstance(content, dict):
                    return self.err('error_array_invalid', 'values')
                self.work.appendleft(list(content.values()))
                return 'nobreak'
            else:
                return self.err('error_name_missing', 'values')
