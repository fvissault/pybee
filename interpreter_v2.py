from collections import deque
from packages.errors.core_errors import core_errors
from packages.core import core
import os
import re

class interpreter:
    def __init__(self, output = 'console'):
        self.work = deque()
        self.altwork = deque()
        self.sequences = []
        self.locals = []
        self.lastseqnumber = -1
        self.currentseqnumber = 0
        self.from_instr = ''
        self.recentWord = None
        self.instructions = deque()
        self.instr = ''
        self.immediate = []
        self.compile = {}
        self.defer = []
        self.userdefinitions = {}
        self.does = deque()
        self.output = output
        self.params = None
        self.version = 'v2.4.4'
        self.core_instr = core(self)
        self.packages = {'core': self.core_instr}
        self.preload()

    def setparams(self, params):
        self.params = {}
        for key in params.keys():
            item = params[key]
            if isinstance(item, list):
                self.params[key] = [i.value for i in item]
            else:
                self.params[key] = item.value

    def preload(self):
        filename = '{0}/preload.btl'.format(self.core_instr.dictionary['path'])
        if os.path.exists(filename):
            f = open(filename, encoding="utf-8")
            content = f.read()
            content = content.replace('"', '\\"')
            content = '"' + content + '" .'
            content = content.replace('\\"', '"').replace('<?btl', '" . ').replace('?>', ' "').replace('\n', ' ').replace('"" .', '')
            content = re.sub(r'\s+', ' ', content)
            sp = content.split(' ')
            self.string_treatment(sp)
            self.set_sequence(self.instructions)
            self.instructions.clear()
            f.close()
            self.interpret()
        else:
            f = open(filename, "w")
            lignes = ["<?btl\n", "?>"]
            f.writelines(lignes)

    def set_sequence(self, sequence:deque):
        self.sequences.append(sequence.copy())
        if len(self.locals) == 0:
            self.locals.append({})
        else:
            self.locals.append(self.locals[len(self.locals) - 1].copy())
        self.lastseqnumber += 1

    def isemptysequence(self, sequence:deque):
        return not sequence

    def isemptysequences(self):
        return all(not s for s in self.sequences)

    def deleteemptysequences(self):
        kept = [(s, l) for s, l in zip(self.sequences, self.locals) if s]
        self.sequences, self.locals = map(list, zip(*kept)) if kept else ([], [])
        self.lastseqnumber = len(self.sequences)

    def decreaselastseqnumber(self):
        if self.sequences and not self.sequences[self.lastseqnumber]:
            del self.sequences[self.lastseqnumber]
            del self.locals[self.lastseqnumber]
            self.lastseqnumber -= 1

    def isemptylastsequence(self):
        return not self.sequences or not self.sequences[self.lastseqnumber]

    def setcurrentsequence(self):
        self.currentseqnumber = self.lastseqnumber

    def isemptycurrentsequence(self):
        return (not self.sequences or (self.currentseqnumber > self.lastseqnumber and not self.sequences[self.currentseqnumber]))

    '''
    Cette méthode est le coeur de l'interprete de Beetle
    '''
    def interpret(self, what = 'all_sequences'):
        type_seq = { 'all_sequences' : self.isemptysequences, 
                     'last_sequence' : self.isemptylastsequence, 
                     'current_sequence' : self.isemptycurrentsequence }
        while not type_seq[what]():
            self.instructions.clear()
            instr = self.instr = self.sequences[self.lastseqnumber][0]
            self.sequences[self.lastseqnumber].popleft()
            if instr == '':
                continue
            base = self.core_instr.dictionary['base']
            if isinstance(instr, str) and instr.lower() == 'abort':
                return 'break'
            if isinstance(instr, str) and instr.lower() == 'leave':
                self.from_instr = ''
                return 'leave'
            elif self.core_instr.isfloat(str(instr)) or self.core_instr.isinteger(str(instr)):
                self.work.appendleft(instr)
                continue
            elif isinstance(instr, list) or isinstance(instr, dict):
                # integer, float or list insert in work stack
                self.work.appendleft(instr)
                continue
            elif instr[0] == '"' and instr[-1] == '"':
                # string insert in work stack
                self.work.appendleft(instr[1:-1])
                continue
            elif instr in self.core_instr.variables or instr in self.locals[self.lastseqnumber].keys():
                self.work.appendleft(instr)
                continue
            elif instr in self.userdefinitions.keys() and len(self.userdefinitions[instr]) > 0:
                # constant name insert in work stack
                instr_content = self.get_instr_content(instr)
                if instr_content != None:
                    self.work.appendleft(instr_content)
            elif self.instr_search(str(instr).lower()) == False:
                # instr not in package dictionaries
                return core_errors.error_invalid_instruction.print_error(instr, self.output)
            elif self.instr_search(str(instr).lower()): 
                pack = self.search_in_pack(str(instr).lower())
                ret = self.package_search(str(instr).lower(), self.packages[pack])
                if ret == 'break':
                    return 'break'
                else:
                    continue
            else:
                return core_errors.error_invalid_instruction.print_error(instr, self.output)
            self.decreaselastseqnumber()
        self.from_instr = ''

    def search_in_pack(self, instr):
        for p in self.packages:
            if instr in self.packages[p].dictionary.keys():
                return p
        return False

    def instr_search(self, instr):
        for p in self.packages:
            if instr in self.packages[p].dictionary.keys():
                return True
        return False

    def get_instr_content(self, instr):
        for p in self.packages:
            if instr in self.packages[p].dictionary.keys():
                return self.packages[p].dictionary[instr]
        return None
            

    def package_search(self, instr, package):
        if instr.lower() in package.dictionary.keys():
            if instr.lower() not in self.core_instr.variables: # and instr.lower() not in self.core_instr.constants:
                if isinstance(package.dictionary[instr.lower()], str):
                    # instructions dans la définition
                    instr_body = package.dictionary[instr.lower()]
                    instr_body = instr_body.replace('\t', ' ').replace('\n', ' ')
                    split = instr_body.split(' ')
                    if instr_body != '':
                        self.string_treatment(split)
                    self.from_instr = instr
                    self.set_sequence(self.instructions)
                    ret = self.interpret('last_sequence')
                    if ret == 'break':
                        return 'break'

                    self.instructions.clear()
                    self.decreaselastseqnumber()
                    return 'nobreak'
                else:
                    # instructions qui ne sont pas dans la définition
                    package.set_work_stack(self.work)
                    package.set_altwork_stack(self.altwork)

                    ret = package.dictionary[instr.lower()]()
                    self.from_instr = ''
                    return ret

    def string_treatment(self, split):
        s = ''
        sbfound = False
        self.instructions.clear()
        for item in split:
            if item == '':
                continue
            if sbfound and item == '': # au mileu de la chaine item vide
                s += ' '
                continue
            if sbfound and self.valide(item):
                s += ' ' + item
                continue
            if sbfound and item.endswith('"'): # fin de la chaine
                #if not item.endswith('\\"'):
                s += ' ' + item[:-1]
                self.instructions.append('"' + s + '"')
                sbfound = False
                s = ''
                continue
            elif sbfound:
                s += ' ' + item
                continue  
            if not sbfound and item[0] == '"': # le début de la chaine
                sbfound = True
                if item[-1] == '"' and len(item) > 1:
                    self.instructions.append(item.replace('\\"', '"'))
                    sbfound = False
                    s = ''
                else:
                    s += item[1:]
                continue
            if self.core_instr.isinteger(item):
                self.instructions.append(int(item))
                continue
            if self.core_instr.isfloat(item):
                self.instructions.append(float(item))
                continue
            self.instructions.append(item)
        if sbfound == True:
            core_errors.error_string_invalid.print_error('string ' +s, self.output)
            self.instructions.clear()
        else:
            sbfound = False
            s = ''

    def valide(self, s: str) -> bool:
        # ^ début de chaîne, $ fin de chaîne
        # (?:\\.|[^"]) : soit un caractère échappé (\.), soit un caractère qui n’est pas "
        pattern = r'^(?:\\.|[^"])*$'
        return re.match(pattern, s) is not None