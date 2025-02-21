from packages.errors.core_errors import core_errors
from packages.errors.file_errors import file_errors
from packages.base_module import base_module
from packages.help.file_help import file_help
from io import TextIOWrapper

class file(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {'wof' : self.openwritefile_instr,
                           'rof' : self.openreadfile_instr,
                           'cf' : self.closefile_instr,
                           'b>f' : self.writefile_instr,
                           'f>' : self.readfile_instr,
                           'l>' : self.readline_instr,
                           'c>' : self.readchar_instr,
                           '>b' : self.endwritefile_instr}
        self.help = file_help(self.interpreter.output)
        self.version = 'v1.0.0'

    '''
    Instruction b>f : nom_du_descripteur B>F content >B -> écrit content dans le fichier 
    '''
    def writefile_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('b>f', self.interpreter.output)
            content = ''
            if len(self.interpreter.sequences[self.interpreter.lastseqnumber]) > 0:
                seq = self.interpreter.sequences[self.interpreter.lastseqnumber][0]
                if seq.lower() != '>b':
                    content += seq + ' '
                    seq = self.pop_sequence()
                while len(self.interpreter.sequences[self.interpreter.lastseqnumber]) > 0 or seq.lower() != '>b':
                    content += seq + ' '
                    seq = self.pop_sequence()
                if seq.lower() == '>b':
                    self.interpreter.core_instr.dictionary[descriptor_name].write(content)
                else:
                    return file_errors.error_end_of_content_missing.print_error('b>f', self.interpreter.output)
            else:
                return file_errors.error_end_of_content_missing.print_error('b>f', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('b>f', self.interpreter.output)

    '''
    Instruction >b : fin de la zone B>F
    '''
    def endwritefile_instr(self):
        return file_errors.error_end_of_content_work_with_begin_of_content.print_error('>b', self.interpreter.output)

    '''
    Instruction f> : nom_du_descripteur F> -> met le contenu lu sur la pile de travail
    '''
    def readfile_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('f>', self.interpreter.output)
            content = self.interpreter.core_instr.dictionary[descriptor_name].read()
            self.interpreter.work.appendleft(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('f>', self.interpreter.output)

    '''
    Instruction l> : nom_du_descripteur L> -> met le contenu lu ligne par ligne sur la pile de travail
    '''
    def readline_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('l>', self.interpreter.output)
            content = self.interpreter.core_instr.dictionary[descriptor_name].readline()
            self.interpreter.work.appendleft(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('l>', self.interpreter.output)

    '''
    Instruction c> : nom_du_descripteur C> -> met le contenu lu caractère par caractère sur la pile de travail
    '''
    def readchar_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('c>', self.interpreter.output)
            content = self.interpreter.core_instr.dictionary[descriptor_name].read(1)
            self.interpreter.work.appendleft(content)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('c>', self.interpreter.output)

    '''
    Instruction wof : filename WOF nom_du_descripteur -> créé une variable nom_du_descripteur et ouvre le fichier en mode 'a'
    '''
    def openwritefile_instr(self):
        if len(self.work) > 0:
            filename = self.pop_work()
            filename = '{0}/{1}'.format(self.interpreter.core_instr.dictionary['path'], filename)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_name_missing.print_error('wof', self.interpreter.output)
            descriptor_name = self.pop_sequence()
            try:
                f = open(filename, 'a')
            except OSError:
                return file_errors.error_open_file_failed.print_error('wof', self.interpreter.output)
            self.interpreter.core_instr.constants.append(descriptor_name)
            self.interpreter.core_instr.dictionary[descriptor_name] = f
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('wof', self.interpreter.output)

    '''
    Instruction rof : filename ROF nom_du_descripteur -> créé une variable nom_du_descripteur et ouvre le fichier en mode 'r'
    '''
    def openreadfile_instr(self):
        if len(self.work) > 0:
            filename = self.pop_work()
            filename = '{0}/{1}'.format(self.interpreter.core_instr.dictionary['path'], filename)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_name_missing.print_error('rof', self.interpreter.output)
            descriptor_name = self.pop_sequence()
            try:
                f = open(filename, 'r')
            except OSError:
                return file_errors.error_open_file_failed.print_error('rof', self.interpreter.output)
            self.interpreter.core_instr.constants.append(descriptor_name)
            self.interpreter.core_instr.dictionary[descriptor_name] = f
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('rof', self.interpreter.output)

    '''
    Instruction cf : nom_du_descripteur CF -> ferme le fichier et détruit la variable du descripteur
    '''
    def closefile_instr(self):
        if len(self.work) > 0:
            descriptor_name = self.pop_work()
            if not isinstance(self.interpreter.core_instr.dictionary[descriptor_name], TextIOWrapper):
                return file_errors.error_not_a_file_descriptor.print_error('cf', self.interpreter.output)
            self.interpreter.core_instr.dictionary[descriptor_name].close()
            self.interpreter.core_instr.constants.remove(descriptor_name)
            self.interpreter.core_instr.dictionary.pop(descriptor_name)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('cf', self.interpreter.output)
