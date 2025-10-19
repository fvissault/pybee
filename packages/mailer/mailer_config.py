'''
$mailer_config = [
    "host" => "smtp.gmail.com",
    "port" => 465,
    "smtp_auth" => true,
    "smtp_secure" => "ssl",
    "username" => "frederic.vissault@gmail.com",
    "password" => "omdwqvlzxivbrhbs",
    "from" => "contact@propilot.com",
    "from_name" => "Propilot team",
    "charset" => "UTF-8",
    "smtp_debug" => 0 // possibilité de mettre 2 = verbose client et serveur
];
'''

class mailer_config:
    def __init__(self, host, port, username, password):
        self.host = host
        self.port = port
        self.username = username
        self.password = password

    def set_host(self, host):
        if host != '':
            self.host = host

    def set_port(self, port):
        self.port = port

    def set_username(self, username):
        if username != '':
            self.username = username

    def set_password(self, password):
        if password != '':
            self.password = password

mail_config = mailer_config('smtp.gmail.com', 465, 'frederic.vissault@gmail.com', 'omdwqvlzxivbrhbs')