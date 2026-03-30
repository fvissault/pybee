#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from utils import *

data = get_post_data()

msg = MIMEText("Cliquez ici pour réinitialiser votre mot de passe")
msg["Subject"] = "Reset password"
msg["From"] = "noreply@test.com"
msg["To"] = data["email"]

server = smtplib.SMTP("localhost")
server.send_message(msg)
server.quit()

json_response({"status": "sent"})