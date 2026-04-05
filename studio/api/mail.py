#!C:\Users\A648326\AppData\Local\Programs\Python\Python312\python.exe
import smtplib, ssl, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import traceback
from utils import *
from predefined_mails import predefined_mails
from config_mails import config_mails
import html

try:
    form = get_post_data()
    action = form.getvalue("action") or ""
    data = normalize(form, ["email", "lang", "toreplace", "predname"])
    emailtosend = data.get("email", "")
    if not is_valid_email(emailtosend):
        json_response({"status": "invalid email"})
    else:
        toreplace = data.get("toreplace", {})
        if isinstance(toreplace, str):
            try:
                toreplace = json.loads(toreplace)
            except:
                toreplace = {}
        lang = data.get("lang", "en")
        predname = data.get("predname")
        if lang not in predefined_mails or predname not in predefined_mails.get(lang, {}):
            json_response({"status": "invalid template"})
        else:
            predemail = predefined_mails[lang][predname]
            try:
                predemail['subject'] = predemail['subject'].format(**toreplace)
                predemail['text'] = predemail['text'].format(**toreplace)
            except KeyError as e:
                json_response({"status": "template error", "missing": str(e)})
            safe_replace = {k: html.escape(str(v)) for k, v in toreplace.items()}
            predemail['body'] = predemail['body'].format(**safe_replace)

            message = MIMEMultipart("alternative")
            message["Subject"] = predemail["subject"]
            message["From"] = config_mails["username"]
            message["To"] = emailtosend

            # Create the plain-text and HTML version of your message
            text = predemail["text"]
            html_body = predemail["body"]

            # Turn these into plain/html MIMEText objects
            part1 = MIMEText(text, "plain", "utf-8")
            part2 = MIMEText(html_body, "html", "utf-8")

            # Add HTML/plain-text parts to MIMEMultipart message
            # The email client will try to render the last part first
            message.attach(part1)
            message.attach(part2)

            if "attachments" in predemail:
                for filepath in predemail["attachments"]:
                    if os.path.exists(filepath):
                        with open(filepath, "rb") as f:
                            part = MIMEApplication(f.read(), Name=os.path.basename(filepath))
                            part['Content-Disposition'] = f'attachment; filename="{os.path.basename(filepath)}"'
                            message.attach(part)

            try:
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(config_mails["host"], config_mails["port"], context=context) as server:
                    server.login(config_mails["username"], config_mails["password"])
                    server.sendmail(config_mails["username"], emailtosend, message.as_string())
                    json_response({"status": "sent"})
            except smtplib.SMTPAuthenticationError:
                json_response({"status": "Send mail error : auth failed"})
            except Exception as e:
                traceback.print_exc()
                json_response({"status": "error", "message": str(e)})
except Exception as e:
    traceback.print_exc()
    json_response({"status": "fatal error", "message": str(e)})