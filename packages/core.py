from collections import deque
from packages.errors.core_errors import core_errors
from packages.base_module import base_module
from packages.help.core_help import core_help
from packages.termcolors import termcolors
from .stack import StackInstructions
from .definitions import Definitions
from .controls import Controls
from .structures import Structures
from .arithmetic import Arithmetic
from .utils import Utils
from .logic import Logic
from .io import Io

class core(base_module, StackInstructions, Definitions, Controls, Structures, Arithmetic, Utils, Logic, Io):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            'dup' : '''    0 pick''', 
            '2dup' : '''    over over''', 
            'drop' : self.drop_instr, 
            '2drop' : '''    drop drop''', 
            'nip' : '''    swap drop''', 
            '2nip' : '''    2swap 2drop''', 
            'swap' : '''    1 roll''', 
            '2swap' : '''    rot >r rot r>''',
            'reverse' : '''    swap rot''',
            'roll' : self.roll_instr, 
            'pick' : self.pick_instr, 
            'over' : '''    swap dup rot rot''',
            '2over' : '''    2>r 2dup 2r> 2swap''', 
            'rot' : '''    2 roll''', 
            'rotonall' : '''    wp 1- roll''', 
            '.' : self.point_instr, 
            '.s' : '''    dup .''', 
            '2.s' : '''    2dup . bl . bl''', 
            'cr' : '''    ( "Warning: 'cr' is deprecated, use /nl instead" . ) 
    /nl''',
            '.cr' : '''    . /nl''',
            '.scr' : '''    .s /nl''',
            '.2cr' : '''    .cr /nl''',
            '.bl' : '''    space emit''',
            'words' : self.words_instr, 
            'dump' : self.dump_instr, 
            'bye' : self.bye_instr, 
            ':' : self.begin_def_instr,
            ';' : self.pointvirg_instr, 
            '(' : self.bcomment_instr, 
            ')' : self.ecomment_instr, 
            '1+' : '''    1 +''', 
            '2+' : '''    2 +''', 
            '2*' : '''    2 *''', 
            '1-' : '''    1 -''', 
            '2-' : '''    2 -''', 
            'true' : 1,
            'false' : 0, 
            '0=' : '''    0 =''', 
            '0>' : '''    0 >''', 
            '0<' : '''    0 <''', 
            '0>=' : '''    0 >=''', 
            '0<=' : '''    0 <=''', 
            'invert' : '''    0=''', 
            '2>r' : '''    swap >r >r''',
            '2r>' : '''    r> r> swap''', 
            'import' : self.import_instr, 
            'detach' : self.detach_instr, 
            'help' : self.help_instr, 
            'emit' : self.emit_instr,
            'stemit' : self.stackemit_instr,
            'input' : self.input_instr, 
            'secinput' : self.secinput_instr, 
            'var' : '''    create ,''', 
            '2var' : '''    create , ,''', 
            'const' : '''    create , drop''',
            '2const' : '''    create , , drop''',
            '@' : self.arobase_instr,
            '?' : '''    @ .''', 
            '*' : self.prod_instr, 
            '+' : self.plus_instr,
            '-' : self.minus_instr,
            '/' : self.div_instr,
            'negate' : '''    -1 *''',
            'min' : '''    2dup <= 
    if 
        drop 
    else 
        nip 
    then''',
            'max' : '''    2dup >= 
    if 
        drop 
    else 
        nip 
    then''',
            '*/' : '''    rot rot * swap /''',
            '%' : '''    100 */''',
            'packages' : self.packages_instr,
            'variables' : self.variables_instr,
            'constants' : self.constants_instr,
            '=' : self.equal_instr, 
            '<>' : '''    = invert''',
            '>' : self.sup_instr, 
            '<' : self.inf_instr, 
            '>=' : self.supequal_instr, 
            '<=' : self.infequal_instr,
            'if' : self.cond_instr, 
            'else' : self.else_instr, 
            'then' : self.then_instr,
            '>r' : self.tor_instr, 
            'r>' : self.fromr_instr,
            'r@' : self.rarobase_instr, 
            '@r' : self.arobaser_instr, 
            'rdrop' : self.rdrop_instr, 
            '2rdrop' : '''    rdrop rdrop''',
            'rswap' : self.rswap_instr,
            'rdup' : self.rdup_instr,
            '2rdup' : '''    rover rover''',
            'rover' : self.rover_instr, 
            'rdump' : self.rdump_instr,
            'do' : self.do_instr, 
            'loop' : self.loop_instr, 
            '+loop' : self.plusloop_instr,
            'begin' : self.begin_instr,
            'until' : self.until_instr, 
            'again' : self.again_instr, 
            'while' : self.while_instr,
            'repeat' : self.repeat_instr, 
            '!' : self.exclam_instr,
            '+!' : '''    dup @ rot + swap !''',
            '*!' : '''    dup @ rot * swap !''',
            'and' : self.and_instr,
            'or' : self.or_instr,
            'xor' : self.xor_instr,
            'forget' : self.forget_instr,
            'cls' : self.clearstack_instr,
            'leave' : '',
            'abort' : self.abort_instr,
            'see' : self.see_instr,
            'create' : self.create_instr,
            'does>' : self.does_instr,
            'immediate' : self.immediate_instr,
            'postpone' : self.postpone_instr,
            'array' : self.array_instr,
            '[' : self.bbraket_instr,
            ']' : self.ebraket_instr,
            '{' : self.bbrace_instr,
            '}' : self.ebrace_instr,
            'cells' : self.cells_instr,
            'cell@' : self.cellarobase_instr,
            'cell!' : self.cellexclam_instr,
            'cell+' : self.addcell_instr,
            'cell-' : self.delcell_instr,
            'cell=' : self.valequal_instr,
            'key=' : '''    keys cell=''',
            'clt' : self.clt_instr,
            ',' : self.forceexclam_instr,
            'load' : self.load_instr,
            'list' : self.list_instr,
            'char' : self.char_instr,
            'chars' : self.chars_instr,
            'bl' : '''    decimal 32 emit''',
            'path' : 'userarea',
            'recurse' : self.recurse_instr,
            'format' : self.format_instr,
            's+' : self.concat_instr,
            'scan' : self.scan_instr,
            'base' : 10,
            'decimal' : self.decimal_instr,
            'octal' : self.octal_instr,
            'hex' : self.hex_instr,
            'base!' : self.baseexclam_instr,
            '>base' : self.tobase_instr,
            '>decimal' : self.todecimal_instr,
            '?int' : self.isint_instr,
            '?def' : self.isdef_instr,
            '?var' : self.isvar_instr,
            '?local' : self.islocal_instr,
            '?float' : self.isfloat_instr,
            '?str' : self.isstr_instr,
            '?char' : self.ischar_instr,
            '?array' : self.isarray_instr,
            '?pack' : self.ispackloaded_instr,
            '?exists' : self.isexists_instr,
            'wp' : self.workstackpointer_instr,
            'sp' : self.seqpointer_instr,
            'vp' : self.dictpointer_instr,
            'kpress' : self.keypress_instr,
            'readk' : self.readkey_instr,
            'space' : '''    bl''',
            't{' : self.begintest_instr,
            '}t' : self.endtest_instr,
            '<=>' : self.test_instr,
            'case' : self.case_instr,
            'endcase' : self.endcase_instr,
            'of' : self.of_instr,
            'endof' : self.endof_instr,
            'defer' : self.defer_instr,
            'is' : self.is_instr,
            "'" : self.tick_instr,
            'evaluate' : self.evaluate_instr,
            'execute' : self.execute_instr,
            ':noname' : self.noname_instr,
            'here' : self.here_instr,
            'local' : self.local_instr,
            'keys' : self.keys_instr,
            'values' : self.values_instr,
            '>md5' : self.md5_instr,
            '>json' : self.jsonencode_instr,
            'json>' : self.jsondecode_instr,
            'lang?' : self.locale_instr,
            'output' : self.output_instr,
            '/t' : '''    9 emit''',
            '/r' : '''    10 emit''',
            '/n' : '''    13 emit''',
            '/nl' : '''    output "web" <> 
    if 
        /n /r
    else
        "<br/>" .
    then'''
        }

        self.variables = ['path']
        self.interpreter.immediate.append('test')
        self.interpreter.userdefinitions['true'] = deque(['@'])
        self.interpreter.userdefinitions['false'] = deque(['@'])
        self.interpreter.userdefinitions['base'] = deque(['@'])
        self.interpreter.compile['const'] = deque(['@'])
        self.interpreter.compile['2const'] = deque(['@'])
        self.help = core_help(self.interpreter.output)
        self.version = 'v2.1.5'

    def output_instr(self):
        self.work.appendleft(self.interpreter.output)
        return "nobreak"

    def begintest_instr(self):
        left_instrs = deque()
        right_instrs = deque()
        instr = self.pop_sequence()
        while str(instr).lower() != '<=>':
            left_instrs.append(str(instr).lower())
            instr = self.pop_sequence()
            if str(instr).lower() == '}t':
                return self.err('error_invalid_instruction', 'tests - }t')
        instr = self.pop_sequence()
        while str(instr).lower() != '}t':
            right_instrs.append(str(instr).lower())
            instr = self.pop_sequence()
            if str(instr).lower() == '<=>':
                return self.err('error_invalid_instruction', 'tests - <=>')
            if str(instr).lower() == 't{':
                return self.err('error_invalid_instruction', 'tests - t{')
        ileft = self.exec_interpreter(left_instrs)
        iright = self.exec_interpreter(right_instrs)
        ileftwork = list(ileft.work)
        irightwork = list(iright.work)
        if ileftwork == irightwork:
            self.work.appendleft(1)
            if self.interpreter.output == 'web':
                print("true test")
            else:
                print(termcolors.GREEN + "true test" + termcolors.NORMAL, end=' ')
        else:
            self.work.appendleft(0)
            if self.interpreter.output == 'web':
                print("false test")
            else:
                print(termcolors.FATAL + "false test" + termcolors.NORMAL, end=' ')
        return 'nobreak'

    def endtest_instr(self):
        return self.err('error_array_invalid', '}t')

    def test_instr(self):
        return self.err('error_array_invalid', '<=>')
