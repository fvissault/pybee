from collections import deque
from packages.errors.core_errors import core_errors
from packages.core import core

class interpreter:
    def __init__(self, output = 'console'):
        self.work = deque()
        self.altwork = deque()
        self.sequences = []
        self.lastseqnumber = -1
        self.currentseqnumber = 0
        self.from_instr = ''
        self.instructions = deque()
        self.instr = ''
        self.immediate = []
        self.compile = {}
        self.defer = []
        self.userdefinitions = {}
        self.does = deque()
        self.output = output
        self.version = 'v2.3.5'
        self.core_instr = core(self)
        self.packages = {'core': self.core_instr}

    def set_sequence(self, sequence:deque):
        self.sequences.append(sequence.copy())
        self.lastseqnumber += 1

    def isemptysequence(self, sequence:deque):
        if len(sequence) == 0:
            return True
        else:
            return False

    def isemptysequences(self):
        if len(self.sequences) == 0:
            return True
        for s in self.sequences:
            if not self.isemptysequence(s):
                return False
        return True

    def deleteemptysequences(self):
        for index, seq in enumerate(self.sequences):
            if len(seq) == 0:
                del(self.sequences[index])
                self.lastseqnumber -= 1

    def decreaselastseqnumber(self):
        if self.isemptysequence(self.sequences[self.lastseqnumber]):
            del(self.sequences[self.lastseqnumber])
            self.lastseqnumber -= 1

    def isemptylastsequence(self):
        if len(self.sequences[self.lastseqnumber]) == 0:
            return True
        else:
            return False

    def setcurrentsequence(self):
        self.currentseqnumber = self.lastseqnumber

    def isemptycurrentsequence(self):
        if len(self.sequences) == 0:
            return True
        if len(self.sequences[self.currentseqnumber]) == 0 and self.currentseqnumber > self.lastseqnumber:
            return True
        else:
            return False

    def print_sequence_numbers(self):
        print('lastseqnumber = ' + str(self.lastseqnumber))
        print('sequences = ', self.sequences)
        print('work = ', self.work)

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
            if isinstance(instr, str) and instr.lower() == 'leave':
                self.from_instr = ''
                return 'leave'
            elif isinstance(instr, int) or isinstance(instr, float) or isinstance(instr, list) or isinstance(instr, dict) or self.core_instr.isfloat(str(instr)) or self.core_instr.isinteger(str(instr)):
                # integer, float or list insert in work stack
                self.work.appendleft(instr)
            elif base != 10 and self.instr_search(str(instr).lower()) == False:
                try:
                    temp = int(str(instr), base)
                except(ValueError):
                    core_errors.error_invalid_instruction.print_error(instr, self.output)
                    break
                self.work.appendleft(str(instr))
                continue
            elif instr[0] == '"' and instr[-1] == '"':
                # string insert in work stack
                self.work.appendleft(instr[1:-1])
            elif instr in self.core_instr.variables:
                # variable insert in work stack
                self.work.appendleft(instr)
            elif instr in self.userdefinitions.keys() and len(self.userdefinitions[instr]) > 0:
                # constant name insert in work stack
                instr_content = self.get_instr_content(instr)
                if instr_content != None:
                    self.work.appendleft(instr_content)
            elif self.instr_search(instr.lower()) == False:
                # instr not in package dictionaries
                return core_errors.error_invalid_instruction.print_error(instr, self.output)
            elif self.instr_search(instr): 
                pack = self.search_in_pack(instr)
                ret = self.package_search(instr, self.packages[pack])
                if ret == 'nobreak':
                    continue
                else: 
                    break
            else:
                return core_errors.error_invalid_instruction.print_error(instr, self.output)
            self.decreaselastseqnumber()
        self.from_instr = ''

    def search_in_core(self, instr):
        if instr in self.core_instr.dictionary.keys():
            return True
        else:
            return False

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
                    split = package.dictionary[instr.lower()].split(' ')
                    if package.dictionary[instr.lower()] != '':
                        self.string_treatment_for_load_file(split)
                    self.from_instr = instr
                    self.set_sequence(self.instructions)
                    ret = self.interpret('last_sequence')
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

    def string_treatment_for_load_file(self, split):
        s = ''
        sbfound = False
        sefound = False
        self.instructions.clear()
        for item in split:
            if sbfound and not sefound and item == '':
                s += ' '
                continue
            if item == '"':
                if sbfound:
                    self.instructions.append('"' + s + '"')
                    sbfound = False
                    sefound = False
                    s = ''
                else:
                    sbfound = True
                    s += ' '
                continue  
            if len(item) > 0 and item[0] == '"':
                sbfound = True
                if item[-1] == '"' and len(item) > 1:
                    s += item[1:-1]
                    self.instructions.append('"' + s + '"')
                    sbfound = False
                    sefound = False
                    s = ''
                    continue
                else:
                    s += item[1:] + ' '
                    continue
            if sbfound and not sefound and item[-1] == '"' and item[-2:] != '\\"':
                s += item[:-1]
                self.instructions.append('"' + s + '"')
                sbfound = False
                sefound = False
                s = ''
                continue
            if sbfound and not sefound:
                s += item + ' '
                continue
            if self.core_instr.isinteger(item):
                self.instructions.append(int(item))
                continue
            if self.core_instr.isfloat(item):
                self.instructions.append(float(item))
                continue
            self.instructions.append(item)
        if sbfound != sefound:
            core_errors.error_string_invalid.print_error('string', self.output)
            self.instructions.clear()
        else:
            sbfound = False
            sefound = False
            s = ''
