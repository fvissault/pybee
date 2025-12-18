from packages.errors.errors import error

class mq_errors:
    error_integer_expected =                 error('error', 'integer expected')
    error_float_expected =                   error('error', 'float expected')
    error_precision_sup_0 =                  error('error', 'precision must be superior to 0')
    error_positive_number_expected =         error('fatal', 'positive number is mandatory and expected')
    error_a_must_be_inferior_to_b =          error('fatal', 'first number must be inferior to the second number')    
    error_number_between_minus_1_and_1 =     error('fatal', 'number must be between -1 and 1')    
    error_number_greater_than_1 =            error('fatal', 'number must be greater than 1')