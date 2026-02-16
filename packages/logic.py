class Logic:
    
    '''
    Instruction = : Egalité
    '''
    def equal_instr(self):
        if self.require_stack(2, '=') == None:
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
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'   

    '''
    Instruction > : Supérieur
    '''
    def sup_instr(self):
        if self.require_stack(2, '>') == None:
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
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'   

    '''
    Instruction < : Inférieur
    '''
    def inf_instr(self):
        if self.require_stack(2, '<') == None:
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
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'   

    '''
    Instruction >= : Supérieur ou égal
    '''
    def supequal_instr(self):
        if self.require_stack(2, '>=') == None:
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
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'   

    '''
    Instruction <= : Inférieur ou égal
    '''
    def infequal_instr(self):
        if self.require_stack(2, '<=') == None:
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
                self.interpreter.work.appendleft(1)
            else:
                self.interpreter.work.appendleft(0)
            return 'nobreak'   

    '''
    Instruction and : et logique
    '''
    def and_instr(self):
        if self.require_stack(2, 'and') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            result = op1 and op2
            self.interpreter.work.appendleft(result)
            return 'nobreak'

    '''
    Instruction ou : ou logique
    '''
    def or_instr(self):
        if self.require_stack(2, 'or') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            result = op1 or op2
            self.interpreter.work.appendleft(result)
            return 'nobreak'

    '''
    Instruction xor : ou exclusif logique
    '''
    def xor_instr(self):
        if self.require_stack(2, 'xor') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            result = op1 ^ op2
            self.interpreter.work.appendleft(result)
            return 'nobreak'
