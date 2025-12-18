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
        self.dictionary = {
            'cos' : self.cos_instr,
            'sin' : self.sin_instr,
            'tan' : self.tan_instr,
            'comb' : self.comb_instr,
            'perm' : self.perm_instr,
            'fact' : self.fact_instr,
            'random' : self.random_instr,
            'intrand' : self.intrand_instr,
            'floatrand' : self.floatrand_instr,
            #****************************************
            'fib' : '''    2 local i 
    dup 1 >= 
    if 
        dup 1 = 
        if 
            0 .cr drop 
        else 
            1 0 2dup . bl . bl 
            reverse i 
            do 
                2dup + dup . bl rot drop 
            loop 
            2drop cr 
        then 
    else 
        "Usage : n FIB with n > 0" .cr 
    then''',
            #****************************************
            '#fib' : '''    2 local i 
    dup 1 >= 
    if 
        dup 1 = 
        if 
            0 .cr drop 
        else 
            1 0 reverse i 
            do 
                2dup + rot drop 
            loop 
            .cr drop 
        then 
    else 
        "Usage : n #FIB with n > 0" .cr 
    then''',
            #****************************************
            'square' : '''    dup *''',
            #****************************************
            'cube' : '''    dup square *''',
            #****************************************
            'pow' : '''    2 local i 
    swap dup dup * rot i 
    do 
        over * 
    loop nip''', 
            'abs' : self.abs_instr,
            'sqrt' : self.sqrt_instr,
            'log10' : self.log10_instr,
            'log2' : self.log2_instr,
            'log1p' : self.log1p_instr,
            'log' : self.log_instr,
            #****************************************
            'exp' : '''    e swap pow''',
            #****************************************
            'exp2' : '''    2 swap pow''',
            #****************************************
            'expm1' : '''    exp 1-''',
            'cbrt' : self.cbrt_instr,
            'ceil' : self.ceil_instr,
            'floor' : self.floor_instr,
            'remainder' : self.remainder_instr,
            #****************************************
            'mod' : '''    2dup / floor * -''',
            'round' : self.round_instr,
            #****************************************
            'f.' : '''    12 round''',
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
            #****************************************
            'hypot' : '''    ( donne le rayon du cercle qui est représenté par l'hypothénuse d'un triangle rectangle ) 
    square swap square + sqrt''',
            #****************************************
            'sum' : '''    ( somme d'une suite de nombres )
    local suite
    0 local r
    0 local i
    suite @ cells i
    do
        r @ suite @ i @ cell@ + r !
    loop
    r @''',
            #****************************************
            'prod' : '''    ( produit d'une suite de nombres )
    local suite
    1 local r
    0 local i
    suite @ cells i
    do
        r @ suite @ i @ cell@ * r !
    loop
    r @''',
            #****************************************
            'closed' : self.closed_instr,
            #****************************************
            'matrix.' : '''    ( formate les aij d'une matrice pour supprimer l'erreur introduite par python )
    local m
    0 local i
    0 local j
    [ ] local row
    m @ cells i 
    do 
        0 j !
        m @ i @ cell@ row !
        row @ cells j 
        do 
            row @ j @ cell@ ?array
            if
                row @ j @ cell@ cells 2 = 
                if
                    [ row @ j @ cell@ 0 cell@ f. row @ j @ cell@ 1 cell@ f. ] 
                else 
                    "matrix. : complex are only expected" .cr abort
                then  
            else
                row @ j @ cell@ f. 
            then
            j @ row cell! drop
        loop
    loop
    m @''',
            #****************************************
            'mminor' : '''    local m
    local col_index
    local row_index
    [ ] local r
    0 local i
    0 local j
    [ ] local row 
    m @ cells i  
    do
        i @ row_index @ <> 
        if
            [ ] row !
            0 j !
            m @ i @ cell@ cells j 
            do
                j @ col_index @ <> 
                if
                    m @ i @ cell@ j @ cell@ row @ cell+ drop
                then
            loop
            row @ r @ cell+ drop
        then
    loop
    r @''',
            #****************************************
            'mcofactor' : '''    local m
    local j
    local i
    i @ j @ m @ mminor 
    mdet 
    i @ j @ + 2 mod 1 = 
    if
        -1 * 
    then''',
            #****************************************
            'mdet' : '''    ( calcul du déterminant d'une matrice )
    local m 
    m @ cells local n 
    n @ 1 = if 
        m @ 0 cell@ 0 cell@ 
    else 
        n @ 2 = 
        if 
            m @ 0 cell@ 0 cell@ m @ 1 cell@ 1 cell@ * 
            m @ 0 cell@ 1 cell@ m @ 1 cell@ 0 cell@ * 
            - 
        else 
            0 local det 
            0 local j 
            n @ j 
            do 
                0 j @ m @ mcofactor det @ + det ! 
            loop 
            det @ 
        then
    then''',
            #****************************************
            'id2' : '''    [ [ 1 0 ] 
    [ 0 1 ] ]''',
            #****************************************
            'id3' : '''    [ [ 1 0 0 ] 
    [ 0 1 0 ] 
    [ 0 0 1 ] ]''',
            #****************************************
            'id4' : '''    [ [ 1 0 0 0 ] 
    [ 0 1 0 0 ] 
    [ 0 0 1 0 ] 
    [ 0 0 0 1 ] ]''',
            #****************************************
            'norm' : '''    ( norme d'un vecteur ) 
    local v 
    0 local res 
    0 local i 
    v @ cells i 
    do 
        v @ i @ cell@ 2 pow res @ + res ! 
    loop 
    res @ sqrt''',
            #****************************************
            'm+' : '''    ( somme de 2 matrices )
    local b
    local a
    [ ] local r
    [ ] local rowr
    [ ] local rowa
    [ ] local rowb
    0 local i
    0 local j
    0 local aleft
    0 local bright
    a @ cells i
    do
        a @ i @ cell@ rowa !
        b @ i @ cell@ rowb !
        [ ] rowr !
        0 j !
        rowa @ cells j
        do
            rowa @ j @ cell@ aleft !
            rowb @ j @ cell@ bright !
            aleft @ ?array
            if
                aleft @ bright @ c+
            else
                aleft @ bright @ +
            then
            rowr cell+ drop
        loop
        rowr @ r cell+ drop
    loop
    r @''',
            #****************************************
            'm-' : '''    ( différence de 2 matrices )
    local b
    local a
    [ ] local r
    [ ] local rowr
    [ ] local rowa
    [ ] local rowb
    0 local i
    0 local j
    0 local aleft
    0 local bright
    a @ cells i
    do
        a @ i @ cell@ rowa !
        b @ i @ cell@ rowb !
        [ ] rowr !
        0 j !
        rowa @ cells j
        do
            rowa @ j @ cell@ aleft !
            rowb @ j @ cell@ bright !
            aleft @ ?array
            if
                aleft @ bright @ c-
            else
                aleft @ bright @ -
            then
            rowr cell+ drop
        loop
        rowr @ r cell+ drop
    loop
    r @''',
            #****************************************
            'm*' : '''    ( produit de 2 matrices )
    local b 
    local a 
    a @ 0 cell@ cells local a_cols 
    a_cols @ b @ cells <> 
    if 
        "Fatal error : incompatible matrix" .cr abort 
    then
    [ ] local r
    0 local row
    0 local i
    0 local j
    0 local k
    0 local aleft
    0 local bright
    a @ cells i 
    do
        [ ] row !
        0 j !
        b @ 0 cell@ cells j 
        do
            0 >r
            0 k !
            a_cols @ k 
            do
                a @ i @ cell@ k @ cell@ aleft !
                b @ k @ cell@ j @ cell@ bright !
                k @ 0 =
                if
                    aleft @ ?array bright @ ?array and
                    if
                        aleft @ bright @ c*
                    else
                        aleft @ bright @ *
                    then
                    >r
                else
                    aleft @ ?array bright @ ?array and
                    if
                        aleft @ bright @ c* r> c+ >r
                    else
                        aleft @ bright @ * r> + >r
                    then
                then
            loop
            r> row cell+ drop
        loop
        row @ r cell+ drop
    loop
    r @''',
            #****************************************
            'mscalar*' : '''    ( produit d'un scalaire et d'une matrice ) 
    local s 
    local a 
    a @ cells local a_rows 
    a @ 0 cell@ cells local a_cols 
    [ ] local r
    0 local row
    0 local i
    0 local j
    0 local aleft
    a_rows @ i 
    do
        [ ] row !
        0 j !
        a_cols @ j 
        do
            a @ i @ cell@ j @ cell@ aleft ! 
            aleft @ ?array
            if
                aleft @ s @ cscalar*
            else
                aleft @ s @ *
            then
            row cell+ drop
        loop
        row @ r cell+ drop
    loop
    r @''',
            #****************************************
            'mscalar+' : '''    ( somme d'un scalaire et une matrice ) 
    local s
    local a
    a @ cells local a_rows
    a @ 0 cell@ cells local a_cols
    [ ] local r
    0 local row
    0 local i
    0 local j
    0 local aleft
    a_rows @ i 
    do
        [ ] row !
        0 j !
        a_cols @ j 
        do
            a @ i @ cell@ j @ cell@ aleft ! 
            aleft @ ?array
            if
                aleft @ s @ cscalar+
            else
                aleft @ s @ +
            then
            row cell+ drop
        loop
        row @ r cell+ drop
    loop
    r @''',
            #****************************************
            'mscalar-' : '''    ( difference entre un scalaire et une matrice ) 
    negate mscalar+''',
            #****************************************
            'msub' : '''    ( sous-matrice ) 
    local params
    local a
    params @ 0 cell@ local col
    params @ 1 cell@ local row
    params @ 2 cell@ local dist
    a @ cells local a_rows
    a @ 0 cell@ cells local a_cols
    dist @ col @ + a_cols @ <= dist @ row @ + a_rows @ <= or invert
    if
        "Fatal error : matrix extraction not allowed" .cr abort 
    then 
    [ ] local r
    0 local new_row_i
    0 local new_col_j
    dist @ new_row_i 
    do
        [ ] local new_row
        0 new_col_j !
        dist @ new_col_j 
        do
            a @ row @ new_row_i @ + cell@ col @ new_col_j @ + cell@ new_row cell+ drop
        loop
        new_row @ r cell+ drop
    loop
    r @''',
            #****************************************
            'mtrans' : '''   ( transposée d'un matrice ) 
    local m
    m @ cells local m_rows
    m @ 0 cell@ cells local m_cols
    [ ] local r
    0 local i
    0 local j
    [ ] local row
    m_cols @ i 
    do
        [ ] row !
        0 j !
        m_rows @ j 
        do
            m @ j @ cell@ i @ cell@ row cell+ drop
        loop
        row @ r cell+ drop
    loop
    r @''',
            #****************************************
            'mcofactor-matrix' : '''    ( matrice de cofactor )
    local m
    m @ cells local n
    [ ] local r
    0 local i
    0 local j
    [ ] local row
    n @ i do
        [ ] row !
        0 j !
        n @ j do
            i @ j @ m @ mcofactor row cell+ drop
        loop
        row @ r cell+ drop
    loop
    r @''',
            #****************************************
            'madjucate' : '''    ( transposée de la matrice des cofacteurs )
    local m
    m @ mcofactor-matrix mtrans''',
            #****************************************
            'minv' : '''        ( inverse d'une matrice )
    local m
    m @ mdet local d
    d @ 0 = 
    if
        "Fatal error : matrix not invertible" .cr
    else
        m @ madjucate 1 d @ / mscalar* matrix.
    then''',
            #****************************************
            'complex' : '''    ( création d'un nombre complexe ) 
    local im
    local re
    [ re @ im @ ]''',
            #****************************************
            're' : '''    ( partie rélle d'un complexe ) 
    0 cell@''',
            #****************************************
            'im' : '''    ( partie imaginaire d'un complexe )
    1 cell@''',
            #****************************************
            'c+' : '''    ( somme de complexes ) 
    local z2
    local z1
    [ z1 @ re z2 @ re + z1 @ im z2 @ im + ]''',
            #****************************************
            'c-' : '''    ( difference de complexes ) 
    local z2
    local z1
    [ z1 @ re z2 @ re - z1 @ im z2 @ im - ]''',
            #****************************************
            'c*' : '''    ( produit de complexes )
    local z2
    local z1
    [ z1 @ re z2 @ re * z1 @ im z2 @ im * - f. z1 @ re z2 @ im * z1 @ im z2 @ re * + f. ]''',
            #****************************************
            'cscalar*' : '''    ( produit d'un scalaire avec un complexe )
    local s
    local c
    [ c @ 0 cell@ s @ * c @ 1 cell@ s @ * ]''',
            #****************************************
            'cscalar+' : '''    ( somme d'un scalaire avec un complexe )
    local s
    local c
    [ c @ 0 cell@ s @ + c @ 1 cell@ ]''',
            #****************************************
            'cconj' : '''    ( complexe conjuguée )
    dup re 
    swap im negate 
    complex''',
            #****************************************
            'mconj' : '''    ( matrice conjuguée )
    local m
    m @ cells local m_rows 
    m @ 0 cell@ cells local m_cols 
    [ ] local r
    0 local i
    0 local j
    [ ] local row
    m_rows @ i
    do
        [ ] row !
        0 j !
        m_cols @ j
        do
            m @ i @ cell@ j @ cell@ cconj row @ cell+ drop
        loop
        row @ r @ cell+ drop
    loop
    r @''',
            #****************************************
            'madjoint' : '''    ( matrice adjointe )
    mconj
    mtrans''',
            'pi' : 3.141592653589793, 
            'pi>deg' : '''    pi >deg ceil''', 
            'pi/2' : 1.570796326794895, 
            'pi/2>deg' : '''    pi/2 >deg ceil''', 
            'pi/3' : 1.047197551196596, 
            'pi/3>deg' : '''    pi/3 >deg ceil''', 
            'pi/4' : 0.785398163397447, 
            'pi/4>deg' : '''    pi/4 >deg ceil''', 
            '3pi/2' : 4.712388980384685, 
            '3pi/2>deg' : '''    3pi/2 >deg ceil''', 
            '3pi/4' : 2.356194490192342, 
            '3pi/4>deg' : '''    3pi/4 >deg ceil''', 
            't' : 6.28318530717958, 
            'c' : 299792458, 
            'e' : 2.7182818284,
            'h' : '6.62607015e−34', 
            'g' : '6.67430e−11'
        }
        self.help = math_help(interpreter.output)

        interpreter.userdefinitions['pi'] = deque(['@'])
        interpreter.userdefinitions['c'] = deque(['@'])
        interpreter.userdefinitions['h'] = deque(['@'])
        interpreter.userdefinitions['g'] = deque(['@'])
        interpreter.userdefinitions['e'] = deque(['@'])
        interpreter.userdefinitions['t'] = deque(['@'])
        interpreter.userdefinitions['pi/2'] = deque(['@'])
        interpreter.userdefinitions['pi/3'] = deque(['@'])
        interpreter.userdefinitions['pi/4'] = deque(['@'])
        interpreter.userdefinitions['3pi/2'] = deque(['@'])
        interpreter.userdefinitions['3pi/4'] = deque(['@'])

        self.version = 'v1.3.2'

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
            if number < -1 or number > 1:
                return math_errors.error_number_between_minus_1_and_1.print_error('acos', self.interpreter.output)
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
            if number < -1 or number > 1:
                return math_errors.error_number_between_minus_1_and_1.print_error('asin', self.interpreter.output)
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
            if number < 1:
                return math_errors.error_number_greater_than_1.print_error('acosh', self.interpreter.output)
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
            if number <= -1 or number >= 1:
                return math_errors.error_number_between_minus_1_and_1.print_error('atanh', self.interpreter.output)
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
            ret = round(float(number), precision)
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

    def closed_instr(self):
        if len(self.work) > 1:
            b = self.pop_work()
            a = self.pop_work()
            if not self.isfloat(a) or not self.isfloat(b):
                return math_errors.error_float_expected.print_error('closed', self.interpreter.output)
            if isclose(a, b):
                self.work.appendleft(1)
            else:
                self.work.appendleft(0)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('closed', self.interpreter.output)
