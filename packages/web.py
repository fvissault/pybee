from packages.errors.core_errors import core_errors
from packages.errors.web_errors import web_errors
from packages.base_module import base_module
from packages.help.web_help import web_help

class web(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'generate' : ''}
        self.help = web_help(self.interpreter.output)
        self.version = 'v1.0.0'

