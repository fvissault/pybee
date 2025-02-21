from packages.help.help import help

class file_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {'wof' : 'Open file in writing mode. If file doesn\'t exists, it will be created\nUsage : ( filename ... ) WOF descriptor_name ( ... )',
                          'rof' : 'Open file in reading mode. If file doesn\'t exists, an error will be raised\nUsage : ( filename ... ) ROF descriptor_name ( ... )',
                          'cf' : 'Close file\nUsage : ( descriptor_name ... ) CF ( ... )',
                          'b>f' : 'Begin of block\nUsage : ( descriptor_name ... ) B>F content >B ( ... )',
                          'f>' : 'File entire reading\nUsage : ( descriptor_name ... ) F> ( content ... )',
                          'l>' : 'File reading by line\nUsage : ( descriptor_name ... ) L> ( content ... )',
                          'c>' : 'File reading by character\nUsage : ( descriptor_name ... ) C> ( content ... )',
                          '>b' : 'End of block\nUsage : ( descriptor_name ... ) B>F content >B ( ... )'}
