from packages.help.help import help

class file_help(help):
    def __init__(self, output):
        super().__init__(output)
        self.help_dict = {'appendtofile' : 'Open file in writing mode append. If file doesn\'t exists, it will be created\nUsage : ( descriptor_name filename ... ) APPENDTOFILE ( ... )',
                          'overwritetofile' : 'Open file in writing mode write. If file doesn\'t exists, it will be created\nUsage : ( descriptor_name filename ... ) OVERWRITETOFILE ( ... )',
                          'readingfile' : 'Open file in reading mode. If file doesn\'t exists, an error will be raised\nUsage : ( descriptor_name filename ... ) READINDFILE ( ... )',
                          'closefile' : 'Close file\nUsage : ( descriptor_name ... ) CLOSEFILE ( ... )',
                          'writein' : 'Write something in a file\nUsage : ( descriptor_name content ... ) WRITEIN ( ... )',
                          'readfile' : 'File entire reading and put it in the top of data stack\nUsage : ( descriptor_name ... ) READFILE ( content ... )',
                          'readline' : 'File reading by line and put it in the top of data stack\nUsage : ( descriptor_name ... ) READLINE ( content ... )',
                          'readchar' : 'File reading by character and put it in the top of data stack\nUsage : ( descriptor_name ... ) READCHAR ( content ... )'}
