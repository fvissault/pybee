from collections import deque
from packages.errors.core_errors import core_errors
from packages.errors.math_errors import math_errors
from packages.base_module import base_module
from packages.help.math_help import math_help
from math import *
import random

class math(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'cos' : self.cos_instr,
                           'sin' : self.sin_instr,
                           'tan' : self.tan_instr,
                           'comb' : self.comb_instr,
                           'perm' : self.perm_instr,
                           'fact' : self.fact_instr,
                           'random' : self.random_instr,
                           'intrand' : self.intrand_instr,
                           'floatrand' : self.floatrand_instr,
                           'fib' : 'dup 1 >= if dup 1 = if 0 .cr drop else 1 0 2dup . . reverse 2 var fib#i do 2dup + dup . rot drop loop 2drop forget fib#i cr then else "Usage : n FIB with n > 0" .cr then',
                           '#fib' : 'dup 1 >= if dup 1 = if 0 .cr drop else 1 0 reverse 2 var fib#i do 2dup + rot drop loop .cr drop forget fib#i then else "Usage : n #FIB with n > 0" .cr then',
                           'square' : 'dup *',
                           'cube' : 'dup square *',
                           'pow' : '2 var pow#i swap dup dup * rot pow#i do over * loop nip forget pow#i', 
                           'abs' : self.abs_instr,
                           'sqrt' : self.sqrt_instr,
                           'log10' : self.log10_instr,
                           'log2' : self.log2_instr,
                           'log1p' : self.log1p_instr,
                           'log' : self.log_instr,
                           'exp' : 'e swap pow',
                           'exp2' : '2 swap pow',
                           'expm1' : 'exp 1-',
                           'cbrt' : self.cbrt_instr,
                           'ceil' : self.ceil_instr,
                           'floor' : self.floor_instr,
                           'remainder' : self.remainder_instr,
                           'mod' : '/ floor',
                           'round' : self.round_instr,
                           'trunc' : self.trunc_instr,
                           '>deg' : self.deg_instr,
                           '>rad' : self.rad_instr,
                           'acos' : self.acos_instr,
                           'asin' : self.asin_instr,
                           'atan' : self.atan_instr,
                           'atan2' : '/ atan',
                           'acosh' : self.acosh_instr,
                           'asinh' : self.asinh_instr,
                           'atanh' : self.atanh_instr,
                           'cosh' : self.cosh_instr,
                           'sinh' : self.sinh_instr,
                           'tanh' : self.tanh_instr,
                           '2dpoint' : '2var',
                           '3dpoint' : 'create , , ,',
                           '2dvector' : '2var',
                           '3dvector' : 'create , , ,',
                           '2dmatrix' : '2var',
                           '3dmatrix' : 'create , , ,',
                           'x' : '',
                           'det' : '',
                           'id2d' : '[ [ 1 0 ] [ 0 1 ] ]',
                           'id3d' : '[ [ 1 0 0 ] [ 0 1 0 ] [ 0 0 1 ] ]',
                           'id4d' : '[ [ 1 0 0 0 ] [ 0 1 0 0 ] [ 0 0 1 0 ] [ 0 0 0 1 ] ]',
                           'norm' : '0 var norm#res 0 var norm#i dup cells norm#i do dup norm#i @ swap cell@ 2 pow norm#res +! loop drop norm#res @ sqrt forget norm#res forget norm#i',
                           'pi' : 3.141592653589793, 
                           'pi>deg' : 'pi >deg ceil', 
                           'pi/2' : 1.570796326794895, 
                           'pi/2>deg' : 'pi/2 >deg ceil', 
                           'pi/3' : 1.047197551196596, 
                           'pi/3>deg' : 'pi/3 >deg ceil', 
                           'pi/4' : 0.785398163397447, 
                           'pi/4>deg' : 'pi/4 >deg ceil', 
                           '3pi/2' : 4.712388980384685, 
                           '3pi/2>deg' : '3pi/2 >deg ceil', 
                           '3pi/4' : 2.356194490192342, 
                           '3pi/4>deg' : '3pi/4 >deg ceil', 
                           'tau' : 6.28318530717958, 
                           'c' : 299792458, 
                           'e' : 2.7182818284,
                           'h' : '6.62607015e−34', 
                           'g' : '6.67430e−11'}
        self.help = math_help(interpreter.output)

        interpreter.userdefinitions['pi'] = deque(['@'])
        interpreter.userdefinitions['c'] = deque(['@'])
        interpreter.userdefinitions['h'] = deque(['@'])
        interpreter.userdefinitions['g'] = deque(['@'])
        interpreter.userdefinitions['e'] = deque(['@'])
        interpreter.userdefinitions['tau'] = deque(['@'])
        interpreter.userdefinitions['pi/2'] = deque(['@'])
        interpreter.userdefinitions['pi/3'] = deque(['@'])
        interpreter.userdefinitions['pi/4'] = deque(['@'])
        interpreter.userdefinitions['3pi/2'] = deque(['@'])
        interpreter.userdefinitions['3pi/4'] = deque(['@'])

        self.version = 'v0.2.9'

    '''
    Instruction cos : cosinus 
    '''
    def cos_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            ret = cos(number)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cos', self.interpreter.output)

    '''
    Instruction sin : sinus 
    '''
    def sin_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            ret = sin(number)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('sin', self.interpreter.output)

    '''
    Instruction tan : tangente 
    '''
    def tan_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            ret = tan(number)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('tan', self.interpreter.output)

    '''
    Instruction comb : combinaison 
    '''
    def comb_instr(self):
        if len(self.work) > 1:
            k = self.pop_work()
            if not self.isinteger(k):
                return math_errors.error_integer_expected.print_error('comb', self.interpreter.output)
            if k < 0:
                return math_errors.error_positive_number_expected.print_error('comb', self.interpreter.output)
            n = self.pop_work()
            if not self.isinteger(n):
                return math_errors.error_integer_expected.print_error('comb', self.interpreter.output)
            if n < 0:
                return math_errors.error_positive_number_expected.print_error('comb', self.interpreter.output)
            ret = comb(n, k)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('comb', self.interpreter.output)

    '''
    Instruction perm : nombre de permutations 
    '''
    def perm_instr(self):
        if len(self.work) > 1:
            k = self.pop_work()
            if not self.isinteger(k):
                return math_errors.error_integer_expected.print_error('comb', self.interpreter.output)
            if k < 0:
                return math_errors.error_positive_number_expected.print_error('comb', self.interpreter.output)
            n = self.pop_work()
            if not self.isinteger(n):
                return math_errors.error_integer_expected.print_error('comb', self.interpreter.output)
            if n < 0:
                return math_errors.error_positive_number_expected.print_error('comb', self.interpreter.output)
            ret = perm(n, k)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('comb', self.interpreter.output)

    '''
    Instruction fact : factorielle 
    '''
    def fact_instr(self):
        if len(self.work) > 0:
            n = self.pop_work()
            if not self.isinteger(n):
                return math_errors.error_integer_expected.print_error('fact', self.interpreter.output)
            if n < 0:
                return math_errors.error_positive_number_expected.print_error('fact', self.interpreter.output)
            ret = factorial(n)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('fact', self.interpreter.output)
    
    '''
    Instruction abs : renvoie la valeur absolue d'un entier ou d'un float
    '''
    def abs_instr(self):
        if len(self.work) > 0:
            op = self.pop_work()
            if not isinstance(op, int) and not isinstance(op, float):
                return core_errors.error_integer_and_float_expected.print_error('abs', self.interpreter.output)
            result = abs(op)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('abs', self.interpreter.output)

    def sqrt_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('sqrt', self.interpreter.output)
            if number < 0:
                return math_errors.error_positive_number_expected.print_error('sqrt', self.interpreter.output)
            result = sqrt(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('sqrt', self.interpreter.output)

    def log10_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('log10', self.interpreter.output)
            result = log10(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('log10', self.interpreter.output)

    def log2_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('log2', self.interpreter.output)
            result = log2(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('log2', self.interpreter.output)

    def log1p_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('log1p', self.interpreter.output)
            result = log1p(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('log1p', self.interpreter.output)

    def log_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('log', self.interpreter.output)
            result = log(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('log', self.interpreter.output)

    def cbrt_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('cbrt', self.interpreter.output)
            result = cbrt(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cbrt', self.interpreter.output)

    def ceil_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('cbrt', self.interpreter.output)
            result = ceil(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cbrt', self.interpreter.output)

    def floor_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('cbrt', self.interpreter.output)
            result = floor(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cbrt', self.interpreter.output)

    '''
    Instruction remainder : combinaison 
    '''
    def remainder_instr(self):
        if len(self.work) > 1:
            y = self.pop_work()
            if y < 0:
                return math_errors.error_positive_number_expected.print_error('remainder', self.interpreter.output)
            x = self.pop_work()
            if x < 0:
                return math_errors.error_positive_number_expected.print_error('remainder', self.interpreter.output)
            ret = remainder(x, y)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('remainder', self.interpreter.output)

    def trunc_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('trunc', self.interpreter.output)
            result = trunc(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('trunc', self.interpreter.output)

    def deg_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('deg', self.interpreter.output)
            result = degrees(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('deg', self.interpreter.output)

    def rad_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('rad', self.interpreter.output)
            result = radians(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('rad', self.interpreter.output)

    def acos_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('acos', self.interpreter.output)
            result = acos(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('acos', self.interpreter.output)

    def asin_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('asin', self.interpreter.output)
            result = asin(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('asin', self.interpreter.output)

    def atan_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('atan', self.interpreter.output)
            result = atan(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('atan', self.interpreter.output)

    def acosh_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('acosh', self.interpreter.output)
            result = acosh(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('acosh', self.interpreter.output)

    def asinh_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('asinh', self.interpreter.output)
            result = asinh(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('asinh', self.interpreter.output)

    def atanh_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('atanh', self.interpreter.output)
            result = atanh(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('atanh', self.interpreter.output)

    def cosh_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('cosh', self.interpreter.output)
            result = cosh(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cosh', self.interpreter.output)

    def sinh_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('sinh', self.interpreter.output)
            result = sinh(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('sinh', self.interpreter.output)

    def tanh_instr(self):
        if len(self.work) > 0:
            number = self.pop_work()
            if not isinstance(number, int) and not isinstance(number, float):
                return core_errors.error_integer_and_float_expected.print_error('tanh', self.interpreter.output)
            result = tanh(number)
            self.work.appendleft(result)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('tanh', self.interpreter.output)

    def round_instr(self):
        if len(self.work) > 1:
            precision = self.pop_work()
            if precision < 0:
                return math_errors.error_precision_sup_0.print_error('round', self.interpreter.output)
            number = self.pop_work()
            ret = round(number, precision)
            self.interpreter.work.appendleft(ret)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('round', self.interpreter.output)

    def random_instr(self):
        rand = random.random()
        self.work.appendleft(rand)
        return 'nobreak'

    def floatrand_instr(self):
        if len(self.work) > 1:
            b = self.pop_work()
            a = self.pop_work()
            if not self.isfloat(a) or not self.isfloat(b):
                return math_errors.error_float_expected.print_error('floatrand', self.interpreter.output)
            if a < 0 or b < 0:
                return math_errors.error_positive_number_expected.print_error('floatrand', self.interpreter.output)
            if a >= b:
                return math_errors.error_a_must_be_inferior_to_b.print_error('floatrand', self.interpreter.output)
            rand = random.uniform(a, b)
            self.work.appendleft(rand)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('floatrand', self.interpreter.output)

    def intrand_instr(self):
        if len(self.work) > 1:
            b = self.pop_work()
            a = self.pop_work()
            if not self.isinteger(a) or not self.isinteger(b):
                return math_errors.error_integer_expected.print_error('intrand', self.interpreter.output)
            if a < 0 or b < 0:
                return math_errors.error_positive_number_expected.print_error('intrand', self.interpreter.output)
            if a >= b:
                return math_errors.error_a_must_be_inferior_to_b.print_error('intrand', self.interpreter.output)
            rand = random.randint(a, b)
            self.work.appendleft(rand)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('intrand', self.interpreter.output)
