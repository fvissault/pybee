from packages.errors.errors import error

class mysqldb_errors:
    error_name_expected =           error('error', 'name expected')
    error_connection_failed =       error('error', 'connection to database failed')
    error_action_type =             error('fatal', 'action type expected (database or table)')
    error_request_malformed =       error('fatal', 'request malformed')
    error_integer_superior_to_0 =   error('fatal', 'integer must be superior to 0')
    error_request_dont_work =       error('fatal', 'request don\'t work')
