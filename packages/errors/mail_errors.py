from packages.errors.errors import error

class mail_errors:
    error_predefinedmail_malformed = error('error', 'predefined mail found is malformed')
    error_predefinedmails_dont_exists = error('error', 'predefinedmails variable doesn\'t exists. Please, execute \'initmailer\' word')
    error_mailconfig_malformed = error('error', 'mail config found is malformed. It must contains \'host\', \'port\', \'username\' and \'password\'')
    error_mailconfig_dont_exists = error('error', 'mailconfig variable doesn\'t exists. Please, execute \'initmailer\' word')
    error_auth_failed = error('error', 'error authenticating to SMTP mail server. Check your SMTP mail server credentials.')
    error_unexpected = error('error', 'another error has occurred. Please check the entire email production and sending chain.')
