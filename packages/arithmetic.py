class Arithmetic:

    '''
    Instruction * : Fait la multiplication entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    '''
    def prod_instr(self):
        if self.require_stack(2, '*') == None:
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
        if self.require_stack(2, '+') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            op3 = self.plus(op1, op2)
            if op3 != "nobreak":
                self.work.appendleft(op3)
            return 'nobreak'

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
        if self.require_stack(2, '-') == None:
            op1 = self.pop_work()
            op2 = self.pop_work()
            op3 = self.minus(op1, op2)
            self.work.appendleft(op3)
            return 'nobreak'

    '''
    Instruction / : Division entre 2 nombres du haut de la pile de travail et ajoute le résultat en haut de la pile
    La division dans une autre base que 10 n'est pas possible
    '''
    def div_instr(self):
        if self.require_stack(2, '/') == None:
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
