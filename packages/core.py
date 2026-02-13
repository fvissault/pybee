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
            'dup' : '''    "Exec dup instruction" log-info
    0 pick''', 
            '2dup' : '''    "Exec 2dup instruction" log-info
    over over''', 
            'drop' : self.drop_instr, 
            '2drop' : '''    "Exec 2drop instruction" log-info
    drop drop''', 
            'nip' : '''    "Exec nip instruction" log-info
    swap drop''', 
            '2nip' : '''    "Exec 2nip instruction" log-info
    2swap 2drop''', 
            'swap' : '''    "Exec swap instruction" log-info
    1 roll''', 
            '2swap' : '''    "Exec 2swap instruction" log-info
    rot >r rot r>''',
            'reverse' : '''    "Exec reverse instruction" log-info
    swap rot''',
            'roll' : self.roll_instr, 
            'pick' : self.pick_instr, 
            'over' : '''    "Exec over instruction" log-info
    swap dup rot rot''',
            '2over' : '''    "Exec 2over instruction" log-info
    2>r 2dup 2r> 2swap''', 
            'rot' : '''    "Exec rot instruction" log-info
    2 roll''', 
            'rotonall' : '''    "Exec rotonall instruction" log-info
    wp 1- roll''', 
            '.' : self.point_instr, 
            '.s' : '''    "Exec .s instruction" log-info
    dup .''', 
            '2.s' : '''    "Exec 2.s instruction" log-info
    2dup . bl . bl''', 
            'cr' : '''    ( "Warning: 'cr' is deprecated, use /nl instead" . )
    "Exec cr instruction" log-info 
    /nl''',
            '.cr' : '''    "Exec .cr instruction" log-info
    . /nl''',
            '.scr' : '''    "Exec .scr instruction" log-info
    .s /nl''',
            '.2cr' : '''    "Exec .2cr instruction" log-info
    .cr /nl''',
            '.bl' : '''    "Exec .bl instruction" log-info
    space emit''',
            'words' : self.words_instr, 
            'dump' : self.dump_instr, 
            'bye' : self.bye_instr, 
            ':' : self.begin_def_instr,
            ';' : self.pointvirg_instr, 
            '(' : self.bcomment_instr, 
            ')' : self.ecomment_instr, 
            '1+' : '''    "Exec 1+ instruction" log-info
    1 +''', 
            '2+' : '''    "Exec 2+ instruction" log-info
    2 +''', 
            '2*' : '''    "Exec 2* instruction" log-info
    2 *''', 
            '1-' : '''    "Exec 1- instruction" log-info
    1 -''', 
            '2-' : '''    "Exec 2- instruction" log-info
    2 -''', 
            'true' : 1,
            'false' : 0, 
            '0=' : '''    "Exec 0= instruction" log-info
    0 =''', 
            '0>' : '''    "Exec 0> instruction" log-info
    0 >''', 
            '0<' : '''    "Exec 0< instruction" log-info
    0 <''', 
            '0>=' : '''    "Exec 0>= instruction" log-info
    0 >=''', 
            '0<=' : '''    "Exec 0<= instruction" log-info
    0 <=''', 
            'invert' : '''    "Exec invert instruction" log-info
    0=''', 
            '2>r' : '''    "Exec 2>r instruction" log-info
    swap >r >r''',
            '2r>' : '''    "Exec 2r> instruction" log-info
    r> r> swap''', 
            'import' : self.import_instr, 
            'detach' : self.detach_instr, 
            'help' : self.help_instr, 
            'emit' : self.emit_instr,
            'stemit' : self.stackemit_instr,
            'input' : self.input_instr, 
            'secinput' : self.secinput_instr, 
            'var' : '''    "Exec var instruction" log-info
    create ,''', 
            '2var' : '''    "Exec 2var instruction" log-info
    create , ,''', 
            'const' : '''    "Exec const instruction" log-info
    create , drop''',
            '2const' : '''    "Exec 2const instruction" log-info
    create , , drop''',
            '@' : self.arobase_instr,
            '?' : '''    "Exec ? instruction" log-info
    @ .''', 
            '*' : self.prod_instr, 
            '+' : self.plus_instr,
            '-' : self.minus_instr,
            '/' : self.div_instr,
            'negate' : '''    "Exec negate instruction" log-info
    -1 *''',
            'min' : '''    "Exec min instruction" log-info
    2dup <= 
    if 
        drop 
    else 
        nip 
    then''',
            'max' : '''    "Exec max instruction" log-info
    2dup >= 
    if 
        drop 
    else 
        nip 
    then''',
            '*/' : '''    "Exec */ instruction" log-info
    rot rot * swap /''',
            '%' : '''    "Exec % instruction" log-info
    100 */''',
            'packages' : self.packages_instr,
            'variables' : self.variables_instr,
            'constants' : self.constants_instr,
            '=' : self.equal_instr, 
            '<>' : '''    "Exec <> instruction" log-info
    = invert''',
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
            '2rdrop' : '''    "Exec 2rdrop instruction" log-info
    rdrop rdrop''',
            'rswap' : self.rswap_instr,
            'rdup' : self.rdup_instr,
            '2rdup' : '''    "Exec 2rdup instruction" log-info
    rover rover''',
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
            '+!' : '''    "Exec +! instruction" log-info
    dup @ rot + swap !''',
            '*!' : '''    "Exec *! instruction" log-info
    dup @ rot * swap !''',
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
            'key=' : '''    "Exec key= instruction" log-info
    keys cell=''',
            'clt' : self.clt_instr,
            ',' : self.forceexclam_instr,
            'load' : self.load_instr,
            'list' : self.list_instr,
            'char' : self.char_instr,
            'char?' : self.getchar_instr,
            'chars' : self.chars_instr,
            'bl' : '''    "Exec bl instruction" log-info
    decimal 32 emit''',
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
            '?const' : self.isconst_instr,
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
            'space' : '''    "Exec space instruction" log-info
    bl''',
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
            '/t' : '''    "Exec /t instruction" log-info
    9 emit''',
            '/r' : '''    "Exec /r instruction" log-info
    10 emit''',
            '/n' : '''    "Exec /n instruction" log-info
    13 emit''',
            '/nl' : '''    "Exec /nl instruction" log-info
    output "web" <> 
    if 
        /n /r
    else
        /n
    then''',
            'rpad' : self.ljust_instr,
            'lpad' : self.rjust_instr,
            'index?' : '''   ( xs x -- i|-1 )
    "Exec index? instruction" log-info
    local x
    local xs
    xs @ cells local n
    -1 local out
    0 local i
    n @ i
    do
        xs @ i @ cell@ maybe-int x @ maybe-int = 
        if
            i @ out !
            leave
        then
    loop
    out @''',
            'maybe-int' : self.maybeint_instr,
            'log-on' : self.logon_instr,
            'log-off' : self.logoff_instr,
            'log-info' : self.loginfo_instr,
            'log-warn' : self.logwarn_instr,
            'log-err' : self.logerr_instr
        }

        self.variables = ['path']
        self.interpreter.immediate.append('test')
        self.interpreter.userdefinitions['true'] = deque(['@'])
        self.interpreter.userdefinitions['false'] = deque(['@'])
        self.interpreter.userdefinitions['base'] = deque(['@'])
        self.interpreter.compile['const'] = deque(['@'])
        self.interpreter.compile['2const'] = deque(['@'])
        self.help = core_help(self.interpreter.output)
        self.version = 'v2.3.7'

    def output_instr(self):
        self.interpreter.work.appendleft(self.interpreter.output)
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
        ileftwork = ileft.work
        irightwork = iright.work
        if self.normalize_stack(ileftwork) == self.normalize_stack(irightwork):
            self.interpreter.work.appendleft(1)
            if self.interpreter.output == 'web':
                print("true test")
            else:
                print(termcolors.GREEN + "true test" + termcolors.NORMAL)
        else:
            self.interpreter.work.appendleft(0)
            if self.interpreter.output == 'web':
                print("false test")
            else:
                print(termcolors.FATAL + "false test" + termcolors.NORMAL)
        return 'nobreak'

    def endtest_instr(self):
        return self.err('error_array_invalid', '}t')

    def test_instr(self):
        return self.err('error_array_invalid', '<=>')
