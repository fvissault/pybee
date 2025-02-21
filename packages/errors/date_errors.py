from packages.errors.errors import error

class date_errors:
    error_bad_millisecond_data =                       error('error', 'milliseconds must be superior to 0')
    error_bad_second_data =                            error('error', 'seconds must be between 0 and 59')
    error_bad_minut_data =                             error('error', 'minuts must be between 0 and 59')
    error_bad_hour_data =                              error('error', 'hours must be between 0 and 23')
    error_bad_day_data =                               error('error', 'days must be between 1 and 31')
    error_bad_month_data =                             error('error', 'days must be between 1 and 12')
    error_bad_year_data =                              error('error', 'year must be in 4 characters')
    error_bad_datas =                                  error('error', 'one of date datas is malformed')
    error_bad_timestamp =                              error('error', 'timestamp must be a float')
    error_bad_date_format =                            error('error', 'date format is not valid')
