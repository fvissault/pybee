import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from mailer_config import mail_config
from predef_mails import predef_mails

class mailer:
    def __init__(self):
        self.predef = predef_mails()

    def send(self, sendto:str, mailname:str, maillang:str, toreplace:dict):
        fromsender = mail_config.username
        password = mail_config.password

        self.predef.get_named_mail(mailname, maillang, toreplace)

        message = MIMEMultipart("alternative")
        message["Subject"] = self.predef.get_subject()
        message["From"] = fromsender
        message["To"] = sendto

        # Create the plain-text and HTML version of your message
        text = self.predef.get_text_body()
        html = self.predef.get_html_body()

        # Turn these into plain/html MIMEText objects
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")

        # Add HTML/plain-text parts to MIMEMultipart message
        # The email client will try to render the last part first
        message.attach(part1)
        message.attach(part2)

        # Create secure connection with server and send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(mail_config.host, mail_config.port, context=context) as server:
            server.login(fromsender, password)
            server.sendmail(fromsender, sendto, message.as_string())

'''
m = mailer()
m.send('frederic.vissault@gmail.com', 'passlost', 'fr', {'name': 'Fred', 'link':'http://google.com'})
'''