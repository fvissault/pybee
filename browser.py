#!C:\Users\a648326\AppData\Local\Programs\Python\Python312\python.exe
# On windows -> #! python3
# On OS X -> #! usr/bin/env python3
# On Linux -> #! usr/bin/python3

# -*- coding: utf8 -*-
print("Content-type: text/html\n")

import cgi
from interpreter_v2 import interpreter
from packages.errors.core_errors import core_errors
sess = cgi.FieldStorage()
filename = sess.getvalue('file')
path = ''
i = interpreter('web')
if sess.getvalue('path') != None:
    path = sess.getvalue('path')
if path != '' and path != 'default':
    dir = path
    i.core_instr.dictionary['path'] = path
else:
    dir = i.core_instr.dictionary['path']

filename = '{0}/{1}.btl'.format(dir, filename)
#print(filename)
try:
    f = open(filename)
except(FileNotFoundError):
    core_errors.error_no_such_file.print_error('load ' + filename, i.output)
content = f.read().encode('mbcs').decode()
content = content.replace('"', '\\"')
content = '"' + content + '" .'
content = content.replace('\\"', '"')
content = content.replace('<?btl', '" . ')
content = content.replace('?>', ' "')
content = content.replace('"" .', '')
content = ' '.join(content.split())

#print(content)

split = content.split(' ')
i.string_treatment_for_load_file(split)
i.set_sequence(i.instructions.copy())
#print(i.print_sequence_numbers())
i.interpret()
i.instructions.clear()
f.close()
