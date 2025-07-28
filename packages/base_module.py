from collections import deque
from copy import deepcopy

class base_module:
    def __init__(self, interpreter):
        self.work = deque()
        self.altwork = deque()
        self.interpreter = interpreter
        #print(interpreter.params)
        self.variables = []

    def set_work_stack(self, work):
        self.work = work

    def get_work_stack(self):
        return self.work

    def set_altwork_stack(self, work):
        self.altwork = work

    def get_altwork_stack(self):
        return self.altwork

    def pop_work(self):
        topwork = self.work[0]
        self.work.popleft()
        return topwork

    def pop_altwork(self):
        topaltwork = self.altwork[0]
        self.altwork.popleft()
        return topaltwork

    def pop_sequence(self):
        topseq = self.interpreter.sequences[self.interpreter.lastseqnumber][0]
        self.interpreter.sequences[self.interpreter.lastseqnumber].popleft()
        return topseq

    def seq_next(self):
        if len(self.interpreter.sequences[self.interpreter.lastseqnumber]) == 0:
            return None
        element = self.pop_sequence()
        return element

    def isfloat(self, element: any) -> bool:
        #If you expect None to be passed:
        if element is None: 
            return False
        try:
            float(element)
            return True
        except ValueError:
            return False

    def isstr(self, element: any) -> bool:
        #If you expect None to be passed:
        if element is None: 
            return False
        try:
            str(element)
            return True
        except ValueError:
            return False

    def isinteger(self, element: any) -> bool:
        #If you expect None to be passed:
        if element is None: 
            return False
        try:
            int(element)
            return True
        except ValueError:
            return False
        
    def prepare_interpreter(self, sequence):
        i = deepcopy(self.interpreter)
        i.core_instr.dictionary.pop(':')
        i.core_instr.dictionary.pop('words')
        i.core_instr.dictionary.pop('dump')
        i.core_instr.dictionary.pop('bye')
        i.core_instr.dictionary.pop('emit')
        i.core_instr.dictionary.pop('rdump')
        i.core_instr.dictionary.pop('!')
        i.core_instr.dictionary.pop('+!')
        i.core_instr.dictionary.pop('*!')
        i.core_instr.dictionary.pop('see')
        i.core_instr.dictionary.pop('cls')
        i.core_instr.dictionary.pop('clt')
        i.core_instr.dictionary.pop('load')
        i.core_instr.dictionary.pop('list')
        i.core_instr.dictionary.pop('create')
        i.core_instr.dictionary.pop('does>')
        i.core_instr.dictionary.pop('packages')
        i.core_instr.dictionary.pop('constants')
        i.core_instr.dictionary.pop('variables')
        i.core_instr.dictionary.pop('var')
        i.core_instr.dictionary.pop('help')
        i.core_instr.dictionary.pop('?')
        i.sequences = []
        i.lastseqnumber = -1
        i.work.clear()
        i.locals.clear()
        #sequence.reverse()
        i.set_sequence(sequence)
        i.locals[0] = self.interpreter.locals[self.interpreter.lastseqnumber].copy()
        i.interpret()
        return i
        
    def exec_interpreter(self, sequence):
        i = deepcopy(self.interpreter)
        i.sequences = []
        i.lastseqnumber = -1
        i.work.clear()
        i.locals.clear()
        i.set_sequence(sequence)
        i.locals[0] = self.interpreter.locals[self.interpreter.lastseqnumber].copy()
        i.interpret()
        return i
