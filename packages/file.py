from packages.errors.core_errors import core_errors
from packages.errors.file_errors import file_errors
from packages.base_module import base_module
from packages.help.file_help import file_help
from io import TextIOWrapper
from collections import deque

class file(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'appendtofile' : self.openappendwritefile_instr,
                           'overwritetofile' : self.openoverdwritefile_instr,
                           'readingfile' : self.openreadfile_instr,
                           'closefile' : self.closefile_instr,
                           'writein' : self.writefile_instr,
                           'readfile' : self.readfile_instr,
                           'readline' : self.readline_instr,
                           'readchar' : self.readchar_instr}
        self.help = file_help(self.interpreter.output)
        self.version = 'v1.0.3'

    '''
    Instruction writein : content nom_du_descripteur WRITEIN -> écrit content dans le fichier 
    '''
    def writefile_instr(self):
        if len(self.work) > 1:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('b>f', self.interpreter.output)
            content = self.pop_work()
            fdescriptor = self.interpreter.core_instr.dictionary[descriptor_name]
            fdescriptor.write(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('b>f', self.interpreter.output)

    '''
    Instruction readfile : nom_du_descripteur READFILE -> met le contenu lu sur la pile de travail
    '''
    def readfile_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('readfile', self.interpreter.output)
            content = self.interpreter.core_instr.dictionary[descriptor_name].read()
            self.interpreter.work.appendleft(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('readfile', self.interpreter.output)

    '''
    Instruction readline : nom_du_descripteur READLINE -> met le contenu lu ligne par ligne sur la pile de travail
    '''
    def readline_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('readline', self.interpreter.output)
            content = self.interpreter.core_instr.dictionary[descriptor_name].readline()
            self.interpreter.work.appendleft(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('readline', self.interpreter.output)

    '''
    Instruction readchar : nom_du_descripteur READCHAR -> met le contenu lu caractère par caractère sur la pile de travail
    '''
    def readchar_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('readchar', self.interpreter.output)
            content = self.interpreter.core_instr.dictionary[descriptor_name].read(1)
            self.interpreter.work.appendleft(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('readchar', self.interpreter.output)

    '''
    Instruction appendtofile : nom_du_descripteur filename APPENDTOFILE  -> créé une variable nom_du_descripteur et ouvre le fichier en mode 'a'
    '''
    def openappendwritefile_instr(self):
        if len(self.work) > 1:
            filename = self.pop_work()
            filename = '{0}/{1}'.format(self.interpreter.core_instr.dictionary['path'], filename)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_name_missing.print_error('appendtofile', self.interpreter.output)
            descriptor_name = self.pop_work()
            try:
                f = open(filename, 'a')
            except OSError:
                return file_errors.error_open_file_failed.print_error('appendtofile', self.interpreter.output)
            self.interpreter.userdefinitions[descriptor_name] = deque(['@'])
            self.interpreter.core_instr.dictionary[descriptor_name] = f
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('appendtofile', self.interpreter.output)

    '''
    Instruction overwritetofile : nom_du_descripteur filename OVERWRITEOFILE -> créé une variable nom_du_descripteur et ouvre le fichier en mode 'w'
    '''
    def openoverdwritefile_instr(self):
        if len(self.work) > 0:
            filename = self.pop_work()
            filename = '{0}/{1}'.format(self.interpreter.core_instr.dictionary['path'], filename)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_name_missing.print_error('overwritetofile', self.interpreter.output)
            descriptor_name = self.pop_work()
            try:
                f = open(filename, 'w')
            except OSError:
                return file_errors.error_open_file_failed.print_error('overwritetofile', self.interpreter.output)
            self.interpreter.userdefinitions[descriptor_name] = deque(['@'])
            self.interpreter.core_instr.dictionary[descriptor_name] = f
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('overwritetofile', self.interpreter.output)

    '''
    Instruction readingfile : nom_du_descripteur filename READINGFILE -> créé une variable nom_du_descripteur et ouvre le fichier en mode 'r'
    '''
    def openreadfile_instr(self):
        if len(self.work) > 0:
            filename = self.pop_work()
            filename = '{0}/{1}'.format(self.interpreter.core_instr.dictionary['path'], filename)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_name_missing.print_error('readingfile', self.interpreter.output)
            descriptor_name = self.pop_work()
            try:
                f = open(filename, 'r')
            except OSError:
                return file_errors.error_open_file_failed.print_error('readingfile', self.interpreter.output)
            self.interpreter.userdefinitions[descriptor_name] = deque(['@'])
            self.interpreter.core_instr.dictionary[descriptor_name] = f
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('readingfile', self.interpreter.output)

    '''
    Instruction closefile : nom_du_descripteur CLOSEFILE -> ferme le fichier et détruit la variable du descripteur
    '''
    def closefile_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('closefile', self.interpreter.output)
            self.interpreter.core_instr.dictionary[descriptor_name].close()
            del(self.interpreter.userdefinitions[descriptor_name])
            self.interpreter.core_instr.dictionary.pop(descriptor_name)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('closefile', self.interpreter.output)
