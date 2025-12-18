from packages.help.help import help

class mq_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {
            'σx' : '''''',
            'σy' : '''''',
            'σz' : '''''',
            'phi' : '''''',
            'psi' : '''''',
            'sigma' : '''''',
            'alpha' : '''''',
            'beta' : '''''',
            'delta' : '''''',
            'epsilon' : '''''',
            'lambda' : '''''',
            'mu' : '''''',
            'omega' : '''''',
            'nu' : '''''',
            'tau' : '''''',
            'omicron' : '''''',
            'theta' : '''''',
            'ket' : '''''',
            'bra' : '''''',
            'braket' : '''''',
            '>bra' : '''''',
            '>ket' : '''''',
            'braket*' : '''''',
            'ktensor' : '''''',
            '|0>' : '''''',
            '|1>' : '''''',
            '<0|' : '''''',
            '<1|' : '''''',
            '|+>' : '''''',
            '|->' : '''''',
            '<+|' : '''''',
            '<-|' : '''''',
            'hgate' : '''''',
            'hmeasure' : ''''''
        }
