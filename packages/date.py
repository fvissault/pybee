from packages.errors.core_errors import core_errors
from packages.errors.date_errors import date_errors
from packages.base_module import base_module
from packages.help.date_help import date_help
from datetime import datetime, date as dat
import calendar
import locale
locale.setlocale(locale.LC_TIME,'')

class date(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            #*********************************
            'now' : self.now_instr,
             #*********************************
           'timestamp' : self.timestamp_instr,
            #*********************************
            'year' : self.year_instr,
            #*********************************
            'year=' : '''    swap year =''',
            #*********************************
            'month' : self.month_instr,
            #*********************************
            'month=' : '''    swap month # =''',
            #*********************************
            'monthlname=' : '''    swap month lname =''',
            #*********************************
            'monthsname=' : '''    swap month sname =''',
            #*********************************
            'day' : self.day_instr,
            #*********************************
            'day=' : '''    swap day # =''',
            #*********************************
            'daylname=' : '''    swap day lname =''',
            #*********************************
            'daysname=' : '''    swap day sname =''',
            #*********************************
            'hour' : self.hour_instr,
            #*********************************
            'hour=' : '''    swap hour =''',
            #*********************************
            'minut' : self.minut_instr,
            #*********************************
            'minut=' : '''    swap minut =''',
            #*********************************
            'second' : self.second_instr,
            #*********************************
            'second=' : '''    swap second =''',
            #*********************************
            'microsecond' : self.microsecond_instr,
            #*********************************
            'microsecond=' : '''    swap microsecond =''',
            #*********************************
            'fdate' : self.date_instr,
            #*********************************
            'ftime' : self.time_instr,
            #*********************************
            'fdt' : self.datetime_instr,
            #*********************************
            'd+' : self.dateplus_instr,
            #*********************************
            'd-' : self.dateminus_instr,
            #*********************************
            '#monthdays' : self.dayscount_instr,
            #*********************************
            'd=' : '''    2dup year year= 
    if 
        2dup month # month= 
        if 
            day # day= 
            if 
                true 
            else 
                false 
            then 
        else 
            false 
        then 
    else 
        false 
    then''',
            #*********************************
            'd<>' : '''    d= invert''',
            #*********************************
            'dt=' : '''    =''',
            #*********************************
            'dt<>' : '''    = invert''',
            #*********************************
            'dt<' : '''    <''',
            #*********************************
            'dt<=' : '''    > invert''',
            #*********************************
            'dt>' : '''    >''',
            #*********************************
            'dt>=' : '''    < invert''',
            #*********************************
            't=' : '''    2dup hour hour= 
    if 
        2dup minut minut= 
        if 
            second minut= 
            if 
                true 
            else 
                false 
            then 
        else 
            false 
        then 
    else 
        false 
    then''',
            #*********************************
            't<>' : '''    t= invert''',
            #*********************************
            '?leap' : '''    2 #monthdays 29 = 
    if 
        true 
    else 
        false 
    then''',
            #*********************************
            '#week' : self.wnumber_instr}
        self.help = date_help(self.interpreter.output)
        self.version = 'v1.1.6'

    '''
    Instruction now : obtention d'un timestamp current_date
    '''
    def now_instr(self):
        ct = datetime.now()
        self.interpreter.work.appendleft(ct.timestamp())
        return 'nobreak'

    '''
    Instruction timestamp : obtention d'un timestamp à partir de 'year month day hh mm ss ms'
    '''
    def timestamp_instr(self):
        if len(self.interpreter.work) > 6:
            try:
                millisecond = self.pop_work()
                if millisecond < 0:
                    return date_errors.error_bad_millisecond_data.print_error('timestamp', self.interpreter)
                second = self.pop_work()
                if second > 59 and second < 0:
                    return date_errors.error_bad_second_data.print_error('timestamp', self.interpreter)
                minut = self.pop_work()
                if minut > 59 and minut < 0:
                    return date_errors.error_bad_minut_data.print_error('timestamp', self.interpreter)
                hour = self.pop_work()
                if hour > 23 and hour < 0:
                    return date_errors.error_bad_hour_data.print_error('timestamp', self.interpreter)
                day = self.pop_work()
                if day > 31 and day < 1:
                    return date_errors.error_bad_day_data.print_error('timestamp', self.interpreter)
                month = self.pop_work()
                if month > 12 and month < 1:
                    return date_errors.error_bad_month_data.print_error('timestamp', self.interpreter)
                year = self.pop_work()
                if len(str(year)) != 4:
                    return date_errors.error_bad_year_data.print_error('timestamp', self.interpreter)
            except:
                return date_errors.error_bad_datas.print_error('timestamp', self.interpreter)
            d = datetime(year, month, day, hour, minut, second, millisecond)
            self.interpreter.work.appendleft(d.timestamp())
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('timestamp', self.interpreter)

    '''
    Instruction year : timestamp YEAR
    '''
    def year_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('year', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            self.interpreter.work.appendleft(dt.year)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('year', self.interpreter)

    '''
    Instruction month : timestamp MONTH { number | shortname | longname }
    '''
    def month_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('month', self.interpreter)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_instruction_expected.print_error('month', self.interpreter)
            obj_type = str(self.pop_sequence())
            if obj_type != '#' and obj_type != 'sname' and obj_type != 'lname':
                return core_errors.error_bad_type.print_error('month', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            if obj_type == '#':
                tostack = dt.month
            if obj_type == 'lname':
                tostack = dt.strftime('%B')
            if obj_type == 'sname':
                tostack = dt.strftime('%b')
            self.interpreter.work.appendleft(tostack)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('month', self.interpreter)

    '''
    Instruction day : timestanp DAY { number | shortname | longname }
    '''
    def day_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('day', self.interpreter)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_instruction_expected.print_error('day', self.interpreter)
            obj_type = str(self.pop_sequence())
            if obj_type != '#' and obj_type != 'sname' and obj_type != 'lname':
                return core_errors.error_bad_type.print_error('day', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            if obj_type == '#':
                tostack = dt.day
            if obj_type == 'lname':
                tostack = dt.strftime('%A')
            if obj_type == 'sname':
                tostack = dt.strftime('%a')
            self.interpreter.work.appendleft(tostack)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('day', self.interpreter)

    '''
    Instruction hour : timestamp HOUR
    '''
    def hour_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('hour', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            self.interpreter.work.appendleft(dt.hour)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('hour', self.interpreter)

    '''
    Instruction minut : timestamp MINUT
    '''
    def minut_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('minut', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            self.interpreter.work.appendleft(dt.minute)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('minut', self.interpreter)

    '''
    Instruction second : timestamp SECOND
    '''
    def second_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('second', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            self.interpreter.work.appendleft(dt.second)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('second', self.interpreter)

    '''
    Instruction microsecond : timestamp MICROSECOND
    '''
    def microsecond_instr(self):
        if len(self.interpreter.work) > 0:
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('microsecond', self.interpreter)
            dt = datetime.fromtimestamp(timestamp)
            self.interpreter.work.appendleft(dt.microsecond)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('microsecond', self.interpreter)

    '''
    Instruction fdate : timestamp "separator" FDATE { english | french }
    '''
    def date_instr(self):
        if len(self.interpreter.work) > 1:
            sep = self.pop_work()
            if not isinstance(sep, str):
                return date_errors.error_bad_date_format.print_error('fdate', self.interpreter)
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('fdate', self.interpreter)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_instruction_expected.print_error('fdate', self.interpreter)
            format = str(self.pop_sequence())
            if format != 'english' and format != 'french':
                return date_errors.error_bad_date_format.print_error('fdate', self.interpreter)
            try:
                dt = datetime.fromtimestamp(float(timestamp))
                if format == 'french':
                    format = '%d' + sep + '%m' + sep + '%Y'
                if format == 'english':
                    format = '%m' + sep + '%d' + sep + '%Y'
                tostack = dt.strftime(format)
                self.interpreter.work.appendleft(tostack)
            except:
                return date_errors.error_bad_date_format.print_error('fdate', self.interpreter)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('fdate', self.interpreter)

    '''
    Instruction ftime : timestamp "separator" FTIME
    '''
    def time_instr(self):
        if len(self.interpreter.work) > 1:
            sep = self.pop_work()
            if not isinstance(sep, str):
                return date_errors.error_bad_date_format.print_error('ftime', self.interpreter)
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('ftime', self.interpreter)
            try:
                dt = datetime.fromtimestamp(float(timestamp))
                format = '%H' + sep + '%M' + sep + '%S'
                tostack = dt.strftime(format)
                self.interpreter.work.appendleft(tostack)
            except:
                return date_errors.error_bad_date_format.print_error('ftime', self.interpreter)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('ftime', self.interpreter)

    '''
    Instruction fdatetime : timestamp date_sep time_sep FDATETIME { english | french }
    '''
    def datetime_instr(self):
        if len(self.interpreter.work) > 0:
            timesep = self.pop_work()
            if not isinstance(timesep, str):
                return date_errors.error_bad_date_format.print_error('fdatetime', self.interpreter)
            datesep = self.pop_work()
            if not isinstance(datesep, str):
                return date_errors.error_bad_date_format.print_error('fdatetime', self.interpreter)
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('fdatetime', self.interpreter)
            if self.interpreter.isemptylastsequence():
                return core_errors.error_instruction_expected.print_error('fdatetime', self.interpreter)
            format = str(self.pop_sequence())
            if format != 'english' and format != 'french':
                return date_errors.error_bad_date_format.print_error('fdatetime', self.interpreter)
            try:
                dt = datetime.fromtimestamp(float(timestamp))
                if format == 'french':
                    format = '%d' + datesep + '%m' + datesep + '%Y %H' + timesep + '%M' + timesep + '%S'
                if format == 'english':
                    format = '%m' + datesep + '%d' + datesep + '%Y %H' + timesep + '%M' + timesep + '%S'
                tostack = dt.strftime(format)
                self.interpreter.work.appendleft(tostack)
            except:
                return date_errors.error_bad_date_format.print_error('fdatetime', self.interpreter)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('fdatetime', self.interpreter)

    '''
    Instruction date+ : timestamp n 'd' | 'h' | 'm' | 's' D+
    '''
    def dateplus_instr(self):
        delta = 0
        if len(self.interpreter.work) > 2:
            period = self.pop_work()
            if period != 'd' and period != 'h' and period != 'm' and period != 's' and period != 'day' and period != 'hour' and period != 'minut' and period != 'second':
                return date_errors.error_bad_datas.print_error('d+', self.interpreter)
            count = self.pop_work()
            if not self.isinteger(count):
                return date_errors.error_bad_datas.print_error('d+', self.interpreter)
            if period == 'd' or period == 'day':
                delta = count * 86400
            if period == 'h' or period == 'hour':
                delta = count * 3600
            if period == 'm' or period == 'minut':
                delta = count * 60
            if period == 's' or period == 'second':
                delta = count
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('d+', self.interpreter)
            timestamp += delta
            self.interpreter.work.appendleft(timestamp)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('d+', self.interpreter)

    '''
    Instruction date- : timestamp n 'd' | 'h' | 'm' | 's' D-
    '''
    def dateminus_instr(self):
        delta = 0
        if len(self.interpreter.work) > 2:
            period = self.pop_work()
            if period != 'd' and period != 'h' and period != 'm' and period != 's' and period != 'day' and period != 'hour' and period != 'minut' and period != 'second':
                return date_errors.error_bad_datas.print_error('d-', self.interpreter)
            count = self.pop_work()
            if not self.isinteger(count):
                return date_errors.error_bad_datas.print_error('d-', self.interpreter)
            if period == 'd' or period == 'day':
                delta = count * 86400
            if period == 'h' or period == 'hour':
                delta = count * 3600
            if period == 'm' or period == 'minut':
                delta = count * 60
            if period == 's' or period == 'second':
                delta = count
            timestamp = self.pop_work()
            if not self.isfloat(timestamp):
                return date_errors.error_bad_timestamp.print_error('d-', self.interpreter)
            timestamp -= delta
            self.interpreter.work.appendleft(timestamp)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('d-', self.interpreter)

    '''
    Instruction #monthdays : year month #MONTHDAYS
    '''
    def dayscount_instr(self):
        if len(self.interpreter.work) > 1:
            month = self.pop_work()
            if not self.isinteger(month):
                return date_errors.error_bad_datas.print_error('#monthdays month', self.interpreter)
            if month < 1 or month > 12:
                return date_errors.error_bad_datas.print_error('#monthdays month', self.interpreter)
            year = self.pop_work()
            if not self.isinteger(year):
                return date_errors.error_bad_datas.print_error('#monthdays year', self.interpreter)
            monthdatas = calendar.monthrange(year, month)
            self.interpreter.work.appendleft(monthdatas[1])
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('#monthdays', self.interpreter)

    '''
    Instruction #week : year month day #WEEK
    '''
    def wnumber_instr(self):
        # dt.isocalendar()
        if len(self.interpreter.work) > 1:
            day = self.pop_work()
            if not self.isinteger(day):
                return date_errors.error_bad_datas.print_error('#week day', self.interpreter)
            if day < 1 or day > 31:
                return date_errors.error_bad_datas.print_error('#week day', self.interpreter)
            month = self.pop_work()
            if not self.isinteger(month):
                return date_errors.error_bad_datas.print_error('#week month', self.interpreter)
            if month < 1 or month > 12:
                return date_errors.error_bad_datas.print_error('#week month', self.interpreter)
            year = self.pop_work()
            if not self.isinteger(year):
                return date_errors.error_bad_datas.print_error('#week year', self.interpreter)
            d = dat(year, month, day)
            iso = d.isocalendar()
            self.interpreter.work.appendleft(iso[1])
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('#week', self.interpreter)
