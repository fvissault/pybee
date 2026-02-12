from collections import deque
from copy import deepcopy

class base_module:
    def __init__(self, interpreter):
        self.interpreter = interpreter
        self.variables = []

    def require_altstack(self, n, word):
        if len(self.interpreter.altwork) < n:
            return self.nothing_in_return(word)
        return None

    def require_stack(self, n, word):
        if len(self.interpreter.work) < n:
            return self.nothing_in_work(word)
        return None

    #def set_work_stack(self, work):
    #    self.interpreter.work = work

    #def get_work_stack(self):
    #    return self.interpreter.work

    #def set_altwork_stack(self, work):
    #    self.interpreter.altwork = work

    #def get_altwork_stack(self):
    #    return self.interpreter.altwork

    def pop_work(self):
        topwork = self.interpreter.work[0]
        self.interpreter.work.popleft()
        return topwork

    def pop_altwork(self):
        topaltwork = self.interpreter.altwork[0]
        self.interpreter.altwork.popleft()
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
            float(str(element))
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
            int(str(element))
            return True
        except ValueError:
            return False
                
    def exec_interpreter(self, sequence):
        db = None
        cursor = None
        if 'db' in self.interpreter.packages:
            db = self.interpreter.packages['db'].db
            cursor = self.interpreter.packages['db'].cursor
            self.interpreter.packages['db'].db = None
            self.interpreter.packages['db'].cursor = None
        i = deepcopy(self.interpreter)
        if 'db' in self.interpreter.packages:
            self.interpreter.packages['db'].db = db
            self.interpreter.packages['db'].cursor = cursor
        i.sequences = []
        i.lastseqnumber = -1
        i.work.clear()
        i.locals.clear()
        i.set_sequence(sequence)
        i.locals[0] = self.interpreter.locals[self.interpreter.lastseqnumber].copy()
        i.interpret()
        return i

    def maybe_int(self, x):
        if not isinstance(x, str):
            return x
        s = x.strip()
        if s == "":
            return x
        sign = 1
        if s[0] == '-':
            sign = -1
            s = s[1:]
        elif s[0] == '+':
            s = s[1:]
        if not s.isdigit():
            return x
        n = 0
        for c in s:
            n = n * 10 + (ord(c) - ord('0'))
        return sign * n
    
    def normalize_stack(self, stack):
        return deque(self.maybe_int(x) for x in stack)