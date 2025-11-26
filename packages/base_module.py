from collections import deque
from copy import deepcopy

class base_module:
    def __init__(self, interpreter):
        self.work = deque()
        self.altwork = deque()
        self.interpreter = interpreter
        #print(interpreter.params)
        self.variables = []

    def require_stack(self, n, word):
        if len(self.work) < n:
            return self.nothing_in_work(word)
        return None

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
                
    def exec_interpreter(self, sequence):
        db = None
        cursor = None
        if 'mysqldb' in self.interpreter.packages:
            db = self.interpreter.packages['mysqldb'].db
            cursor = self.interpreter.packages['mysqldb'].cursor
            self.interpreter.packages['mysqldb'].db = None
            self.interpreter.packages['mysqldb'].cursor = None
        i = deepcopy(self.interpreter)
        if 'mysqldb' in self.interpreter.packages:
            self.interpreter.packages['mysqldb'].db = db
            self.interpreter.packages['mysqldb'].cursor = cursor
        i.sequences = []
        i.lastseqnumber = -1
        i.work.clear()
        i.locals.clear()
        i.set_sequence(sequence)
        i.locals[0] = self.interpreter.locals[self.interpreter.lastseqnumber].copy()
        i.interpret()
        return i
