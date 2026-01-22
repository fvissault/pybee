from packages.errors.core_errors import core_errors
from packages.errors.nnet_errors import nnet_errors
from packages.base_module import base_module
from packages.help.nnet_help import nnet_help

class nnet(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            'space-new' : '''    ( Creates the global neural space )
    var space-h drop
    var space-w drop
    [ ] var space-neurons drop
    [ ] var space-synapses drop
    [ ] var space-zones drop
    [ ] var space-events drop
    0 var space-time drop''',
            #****************************************
            'space-clear' : '''    ( Resets the global space while preserving its dimensions )
    "space-neurons" ?var 
    if
        [ ] space-neurons !
    then
    "space-synapses" ?var
    if
        [ ] space-synapses !
    then
    "space-zones" ?var
    if
        [ ] space-zones !
    then
    "space-events" ?var
    if
        [ ] space-events !
    then
    "space-time" ?var
    if
        0 space-time !
    then''',
            #****************************************
            'space-size' : '''    ( Returns the size of the neural space )
    space-w @
    space-h @'''
        }
        self.help = nnet_help(self.interpreter.output)
        self.version = 'v0.0.1'
