from packages.errors.errors import error

class web_errors:
    error_fatal =                               error('fatal', 'fatal_message')
    error_error =                               error('error', 'error_message')
    error_warning =                             error('error', 'warning_message')
