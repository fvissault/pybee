from packages.errors.errors import error

class file_errors:
    error_open_file_failed =                            error('fatal', 'this file doesn\'t exists')
    error_not_a_file_descriptor =                       error('error', 'not a file descriptor')
    error_end_of_content_missing =                      error('error', 'end of content missing')
    error_end_of_content_work_with_begin_of_content =   error('error', 'end of content work with begin of content')
