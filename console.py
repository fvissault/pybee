from interpreter_v2 import interpreter
from packages.termcolors import termcolors
from datetime import datetime

class console:
    def __init__(self):
        '''
        console class constructor
        usage : c = console()
        '''
        self.prompt = 'Beetle> '
        self.response = ''
        self.i = interpreter()
        self.version = 'v1.0.6'

    def launch(self, with_greetings = True):
        if with_greetings:
            self.greetings()
        while str(self.i.instr).lower() != 'bye':
            self.response = self.input_line_treatment()
            split = self.response.split(' ')
            if self.response != '':
                self.i.string_treatment(split)

            # clean de l'interprète
            self.i.sequences.clear()
            self.i.locals.clear()
            self.i.lastseqnumber = -1
            self.i.currentseqnumber = 0

            # affectation de la nouvelle séquence
            self.i.set_sequence(self.i.instructions.copy())
            self.i.interpret()
            self.i.instructions.clear()
            if str(self.i.instr).lower() != 'bye':
                print(termcolors.GREEN + 'ok' + termcolors.NORMAL)
            else:
                print(termcolors.GREEN + 'Have a good day! See you later...' + termcolors.NORMAL, end='')

    def input_line_treatment(self):
        line = input(self.prompt).strip()
        return line

    def greetings(self):
        now = datetime.now()
        print(termcolors.BLUE, end='')
        print('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        print('ooooooooooooooooooooo .----   .-----  .-----  ---.---  .         .----- ooooooooooooooooooo')
        print('oooooooooooooooooooo //   /  //      //         //    //        //     oooooooooooooooooooo')
        print('ooooooooooooooooooo //---   //---   //---      //    //        //---  ooooooooooooooooooooo')
        print('oooooooooooooooooo //   /  //      //         //    //        //     oooooooooooooooooooooo')
        print('ooooooooooooooooo //___/  //____  //____     //    //_____   //____ ooooooooooooooooooooooo')
        print('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        print('oooo Interpreter version : ' + self.i.version + ' -- Console version : ' + self.version + ' -- Core version : ' + self.i.core_instr.version + ' oooo')
        print('oooo Current date : ' + now.strftime("%m/%d/%Y %H:%M:%S") + ' ---------------------------------------------- oooo')
        print('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' + termcolors.NORMAL)

    def set_prompt(self, prompt):
        if prompt != '':
            self.prompt = prompt
