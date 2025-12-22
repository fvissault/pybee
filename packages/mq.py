from collections import deque
from packages.errors.core_errors import core_errors
from packages.errors.mq_errors import mq_errors
from packages.base_module import base_module
from packages.help.mq_help import mq_help
from math import *

class mq(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            #****************************************
            'σx' : '''    ( matrice de Pauli sur x : ne comporte que des nombres complexes )
    [ [ 0 0 complex 1 0 complex ]
    [ 1 0 complex 0 0 complex ] ]''',
            #****************************************
            'σy' : '''    ( matrice de Pauli sur y : ne comporte que des nombres complexes )
    [ [ 0 0 complex  0 -1 complex ]
    [ 0 1 complex 0 0 complex ] ]''',
            #****************************************
            'σz' : '''    ( matrice de Pauli sur z : ne comporte que des nombres complexes )
    [ [ 1 0 complex 0 0 complex ]
    [ 0 0 complex -1 0 complex ] ]''',
            #****************************************
            'phi' : '''    966 stemit''',
            #****************************************
            'psi' : '''    968 stemit''',
            #****************************************
            'sigma' : '''    963 stemit''',
            #****************************************
            'alpha' : '''    945 stemit''',
            #****************************************
            'beta' : '''    946 stemit''',
            #****************************************
            'delta' : '''    948 stemit''',
            #****************************************
            'epsilon' : '''    949 stemit''',
            #****************************************
            'lambda' : '''    955 stemit''',
            #****************************************
            'mu' : '''    956 stemit''',
            #****************************************
            'omega' : '''    937 stemit''',
            #****************************************
            'nu' : '''    957 stemit''',
            #****************************************
            'tau' : '''    964 stemit''',
            #****************************************
            'omicron' : '''    959 stemit''',
            #****************************************
            'theta' : '''    952 stemit''',
            #****************************************
            'ket' : '''    ( |ψ> = [ [ a ] [ b ] [ c ] ] ou a, b, c sont des nombres complexes a = [ re(a) im(a) ], idem pour b et c )
    local state
    local content
    content @ "const |<#0#>>" [ state @ ] format evaluate''',
            #****************************************
            'bra' : '''    ( <ψ| = [ a* b* c* ] ou a, b, c sont des nombres complexes a = [ re(a) im(a) ], idem pour b et c )
    local state
    local content
    content @ "const <<#0#>|" [ state @ ] format evaluate''',
            #****************************************
            'braket' : '''    local brastate
    local ketstate
    local content
    content @ "const <<#0#>|<#1#>>" [ brastate @ ketstate @ ] format evaluate''',
            #****************************************
            '>bra' : '''    ( transformation d'un ket en bra )
    local mket
    mket @ madjoint''',
            #****************************************
            '>ket' : '''    ( transformation d'un bra en ket )
    local mbra
    mbra @ madjoint''',
            #****************************************
            'braket*' : '''    ( produit scalaire de bra et ket -> fournit un scalaire )
    local k
    local b
    b @ k @ m*
    0 cell@ matrix. 0 cell@''',
            #****************************************
            'ktensor' : '''    ( a b -- a ⊗ b )
    local b
    local a
    [ ] local r
    [ ] local rowa
    [ ] local rowb
    [ ] local rowr
    0 local i
    0 local j
    0 local k
    0 local l
    0 local aleft
    0 local bright
    a @ cells i
    do
        0 k !
        a @ i @ cell@ rowa !
        b @ cells k
        do
            0 j !
            b @ k @ cell@ rowb !
            [ ] rowr !
            rowa @ cells j
            do
                0 l !
                rowb @ cells l
                do
                    rowa @ j @ cell@ aleft !
                    rowb @ l @ cell@ bright !
                    aleft @ ?array
                    if
                        aleft @ bright @ c*
                    else
                        aleft @ bright @ *
                    then
                    rowr cell+ drop 
                loop
            loop
            rowr @ r cell+ drop
        loop
    loop
    r @''',
            #****************************************
            '|0>' : '''    [ [ 1 0 complex ] [ 0 0 complex ] ]''',
            #****************************************
            '|1>' : '''    [ [ 0 0 complex ] [ 1 0 complex ] ]''',
            #****************************************
            '<0|' : '''    |0> madjoint''',
            #****************************************
            '<1|' : '''    |1> madjoint''',
            #****************************************
            '|+>' : '''    |0> |1> m+ 1 2 sqrt / mscalar*''',
            #****************************************
            '|->' : '''    |0> |1> m- 1 2 sqrt / mscalar*''',
            #****************************************
            '<+|' : '''    |+> madjoint''',
            #****************************************
            '<-|' : '''    |-> madjoint''',
            #****************************************
            'hgate' : '''    ( porte Hadamard )
    [ [ 1 0 complex 1 0 complex ] [ 1 0 complex -1 0 complex ] ] 
    1 2 sqrt / mscalar*''',
            #****************************************
            'hmeasure' : '''    hgate |0> m* local state 
    "État après Hadamard :" .cr 
    state @ matrix. .cr 
    0 local amp0 
    0 local amp1 
    <0| state @ m* amp0 ! 
    <1| state @ m* amp1 ! 
    0 local p0 
    0 local p1 
    amp0 @ 0 cell@ 0 cell@ norm 2 pow p0 ! 
    amp1 @ 0 cell@ 0 cell@ norm 2 pow p1 ! 
    "Probabilité de mesurer |0> :" .cr 
    p0 @ f. .cr 
    "Probabilité de mesurer |1> :" .cr 
    p1 @ f. .cr''',
            #****************************************
            'igate' : '''    ( porte identité )
    [ [ 1 0 complex 0 0 complex ] [ 0 0 complex 1 0 complex ] ]''',
            #****************************************
            'sgate' : '''    ( porte phase )
    [ [ 1 0 complex 0 0 complex ] [ 0 0 complex 0 1 complex ] ]''',
            #****************************************
            'tgate' : '''    ( porte T (pi/8) )
    [ [ 1 0 complex 0 0 complex ] [ 0 0 complex pi/4 cos pi/4 sin complex ] ]''',
            #****************************************
            'cnot' : '''    ( porte CNOT )
    [ [ 1 0 complex 0 0 complex 0 0 complex 0 0 complex ] 
      [ 0 0 complex 1 0 complex 0 0 complex 0 0 complex ] 
      [ 0 0 complex 0 0 complex 0 0 complex 1 0 complex ] 
      [ 0 0 complex 0 0 complex 1 0 complex 0 0 complex ] ]''',
            #****************************************
            'nqubits' : '''    ( str -- ket : exemple : "010101" nqubits -> |010101> )
    local squbit
    squbit @ chars local size
    size @ 1 > size @ 6 < and
    if
        2 local i
        squbit @ 0 char? local first
        squbit @ 1 char? local second
        "|<#0#>> |<#1#>> ktensor" [ first @ second @ ] format evaluate
        size @ i
        do
            "|<#0#>> ktensor" [ squbit @ i @ char? ] format evaluate
        loop
        squbit @ ket
    else
        "nqubits : n must be greater than 1 and lesser then 9" .cr abort
    then''',
            #****************************************
            'allnqubits' : '''    ( créer tous les nqubits - Usage : n -- allqubits_constants )
    local n
    2 n @ pow local limit
    0 local i
    limit @ i
    do
        i @ 2 >base n @ "0" lpad nqubits
    loop''',
            #****************************************
            'p0' : '''    
    |0> dup >bra m*''',
            #****************************************
            'p1' : '''    
    |1> dup >bra m*''',
            #****************************************
            'proj&prob' : '''    ( P |ψ> -- p |φ> )
    m* dup norm square''',
            #****************************************
            'normalize-measure' : '''    ( |φ> p -- |ψ> p )
    dup sqrt
    1 swap / swap rot rot
    mscalar* swap''',
            #****************************************
            'measure' : '''    ( P |ψ> --|ψ_post> p )
    proj&prob
    dup 0=
    if
        abort
    then
    normalize-measure''',
            #****************************************
            'random-measure' : '''    ( |ψ> -- k |ψ_post> )
    dup 
    p0 swap measure 
    local p0v
    local psi0
    dup
    p1 swap measure 
    local p1v 
    local psi1
    drop
    0 1 floatrand p0v @ <
    if
        psi0 @
        0

    else
        psi1 @
        1
    then''',
            #****************************************
            'partial-proj' : '''    ( n k P -- Pn )
    local p
    local k
    local n
    1 local i
    0 k @ =
    if
        p @ local acc
    else
        igate local acc
    then
    n @ i
    do
        i @ k @ =
        if
            acc @ p @ ktensor acc !
        else
            acc @ igate ktensor acc !
        then
    loop
    acc @''',
            #****************************************
            'random-measure-qubit' : '''    ( |ψ> n k -- bit |ψ_post> )
    local k
    local n
    local psi
    psi @
    n @ k @ p0 partial-proj
    swap measure
    local p0v local psi0 
    psi @
    n @ k @ p1 partial-proj
    swap measure
    local p1v local psi1 
    0 1 floatrand p0v @ <
    if
        psi0 @ 0 
    else
        psi1 @ 1
    then'''
        }
        self.help = mq_help(interpreter.output)

        self.version = 'v1.2.5'
        self.packuse = ['math']
