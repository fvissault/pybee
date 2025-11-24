from packages.errors.core_errors import core_errors
from packages.errors.mail_errors import mail_errors
from packages.base_module import base_module
from packages.help.mail_help import mail_help
from collections import deque
import smtplib, ssl, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

class mail(base_module):
    def __init__(self, interpreter):
        super().__init__(interpreter)
        self.dictionary = {
            'sendmail' : self.sendmail_instr,
            'initmailer' : '''    load mails/config 
    load mails/predefined''',
            'preparemail' : self.preparemail_instr,
            'addattachment' : self.addattachment_instr
        }
        self.help = mail_help(self.interpreter.output)
        self.version = 'v1.0.2'

    '''
    Instruction sendmail : envoie d'un mail 
    '''
    def sendmail_instr(self):
        if len(self.work) > 0:
            sendto = self.pop_work()
            mailcontent = self.pop_work()
            if "mailconfig" in self.interpreter.core_instr.dictionary:
                mconf = self.interpreter.core_instr.dictionary["mailconfig"]
                if "host" in mconf and "port" in mconf and "username" in mconf and "password" in mconf:
                    message = MIMEMultipart("alternative")
                    message["Subject"] = mailcontent["subject"]
                    message["From"] = mconf["username"]
                    message["To"] = sendto

                    # Create the plain-text and HTML version of your message
                    text = mailcontent["text"]
                    html = mailcontent["body"]

                    # Turn these into plain/html MIMEText objects
                    part1 = MIMEText(text, "plain")
                    part2 = MIMEText(html, "html")

                    # Add HTML/plain-text parts to MIMEMultipart message
                    # The email client will try to render the last part first
                    message.attach(part1)
                    message.attach(part2)

                    if "attachments" in mailcontent:
                        for filepath in mailcontent["attachments"]:
                            if os.path.exists(filepath):
                                with open(filepath, "rb") as f:
                                    part = MIMEApplication(f.read(), Name=os.path.basename(filepath))
                                    part['Content-Disposition'] = f'attachment; filename="{os.path.basename(filepath)}"'
                                    message.attach(part)
                                
                    # Create secure connection with server and send email
                    try:
                        context = ssl.create_default_context()
                        with smtplib.SMTP_SSL(mconf["host"], mconf["port"], context=context) as server:
                            server.login(mconf["username"], mconf["password"])
                            server.sendmail(mconf["username"], sendto, message.as_string())
                    except smtplib.SMTPAuthenticationError:
                        return mail_errors.error_auth_failed.print_error('sendmail', self.interpreter.output)
                    except Exception as e:
                        return mail_errors.error_unexpected.print_error('sendmail', self.interpreter.output)
                    return 'nobreak'
                else:
                    return mail_errors.error_mailconfig_malformed.print_error('sendmail', self.interpreter.output)
            else:
                return mail_errors.error_mailconfig_dont_exists.print_error('sendmail', self.interpreter.output)
        else:
            return core_errors.error_nothing_in_work_stack.print_error('sendmail', self.interpreter.output)

    '''
    Instruction preparemail : préparation d'un mail 
    '''
    def preparemail_instr(self):
        if len(self.work) > 2:
            predmails = {}
            mail = {}
            # lire sur la pile : mailname, maillang et toreplace
            toreplace = self.pop_work()
            maillang = self.pop_work()
            mailname = self.pop_work()

            # obtenir le subject, body et text du mail et l'affecter à la structure mail
            if "predefinedmails" in self.interpreter.core_instr.dictionary:
                predmails = self.interpreter.core_instr.dictionary["predefinedmails"]
                if maillang in predmails:
                    pminlang = predmails[maillang]
                    if mailname in pminlang:
                        mail['subject'] = pminlang[mailname]["subject"]
                        mail['body'] = pminlang[mailname]["body"]
                        mail['text'] = pminlang[mailname]["text"]
                        mail['attachments'] = []
                    else:
                        return mail_errors.error_predefinedmail_malformed.print_error('preparemail', self.interpreter.output)
                else:
                    return mail_errors.error_predefinedmail_malformed.print_error('preparemail', self.interpreter.output)
            else:
                return mail_errors.error_predefinedmails_dont_exists.print_error('preparemail', self.interpreter.output)

            # formater le mail à envoyer
            for key, value in toreplace.items():
                mail['subject'] = mail['subject'].replace('[' + key + ']', value)
                mail['body'] = mail['body'].replace('[' + key + ']', value)
                mail['text'] = mail['text'].replace('[' + key + ']', value)
            self.work.appendleft(mail)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('preparemail', self.interpreter.output)

    '''
    Instruction addattachment : ajoute une pièce jointe à un mail
    '''
    def addattachment_instr(self):
        if len(self.work) > 0:
            filepath = self.pop_work()
            mailcontent = self.pop_work()

            if not isinstance(mailcontent, dict):
                return core_errors.error_bad_type.print_error('addattachment', self.interpreter.output)

            if "attachments" not in mailcontent:
                mailcontent["attachments"] = []

            mailcontent["attachments"].append(filepath)
            self.work.appendleft(mailcontent)
            return 'nobreak'
        else:
            return core_errors.error_nothing_in_work_stack.print_error('addattachment', self.interpreter.output)