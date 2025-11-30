from packages.errors.errors import error

class db_errors:
    error_name_expected =           error('error', 'database name expected')
    error_connection_failed =       error('error', 'connection to database failed')
    error_action_type =             error('fatal', 'action type expected (database or table)')
    error_request_malformed =       error('fatal', 'request malformed')
    error_integer_superior_to_0 =   error('fatal', 'integer must be superior to 0')
    error_request_dont_work =       error('fatal', 'request don\'t work')
    error_engine_expected =         error('error', 'engine expected : mysql or postgresql')
    error_pg_not_supported =        error('error', 'not supported on PostgreSQL')
