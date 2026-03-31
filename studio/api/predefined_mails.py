predefined_mails = {
    "fr" : {
        "passlost" : {
            "subject" : "Réinitialisation de votre mot de passe" ,
            "body" : """<html>
                            <body>
                                <div>Bonjour {name},</div>
                                <div>Vous souhaitez réinitialiser votre mot de passe.</div>
                                <div>Veuillez cliquer sur le lien suivant afin de réinitialiser votre mot de passe :</div>
                                <a href="{link}">Réinitialiser votre mot de passe</a>
                                <div>L'équipe</div>
                            </body>
                        </html>""" ,
            "text" : """Bonjour {name},\n
Vous souhaitez réinitialiser votre mot de passe.\n
Veuillez copier/coller le lien suivant dans votre navigateur afin de réinitialiser votre mot de passe : {link}\n
L'équipe"""
        } , 
        "signin" : {
            "subject" : "Félicitations pour votre inscription" ,
            "body" : """<html>
                            <body>
                                <div>Bonjour {name},</div>
                                <div>Nous sommes heureux de vous compter parmi nous !</div>
                                <div>Votre identifiant pour vous connecter est l'email que vous avez renseigné lors de votre inscription : {email}</div>
                                <div>Si vous avez oublié votre mot de passe, votre application vous permet de le réinitialiser lors de l'authentification.</div>
                                <div>Cependant, pour terminer votre inscription, vous devez valider votre email en cliquant sur le lien suivant :</div>
                                <a href="{link}">Valider votre email</a>
                                <div>L'équipe</div>
                            </body>
                        </html>""" ,
            "text" : """Bonjour {name},\n
Nous sommes heureux de vous compter parmi nous !\n
Votre identifiant est : {email}\n
Pour finaliser votre inscription, veuillez utiliser le lien suivant :\n
{link}\n
L'équipe"""
        }
    } , 

    "en" : {
        "passlost" : {
            "subject" : "Reset your password",
            "body" : """<html>
                            <body>
                                <div>Hello {name},</div>
                                <div>You requested a password reset.</div>
                                <div>Please click the link below to reset your password:</div>
                                <a href="{link}">Reset your password</a>
                                <div>The team</div>
                            </body>
                        </html>""",
            "text" : """Hello {name},\n
You requested a password reset.\n
Please copy and paste the following link into your browser to reset your password: {link}\n
The team"""
        },
        "signin" : {
            "subject" : "Welcome to Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Hello {name},</div>
                                <div>We are happy to have you with us!</div>
                                <div>Your login email is: {email}</div>
                                <div>If you forgot your password, you can reset it from the login page.</div>
                                <div>To complete your registration, please confirm your email by clicking the link below:</div>
                                <a href="{link}">Confirm your email</a>
                                <div>The team</div>
                            </body>
                        </html>""",
            "text" : """Hello {name},\n
We are happy to have you with us!\n
Your login email is: {email}\n
To complete your registration, please use the following link:\n
{link}\n
The team"""
        }
    },

    "de" : {
        "passlost" : {
            "subject" : "Passwort zurücksetzen",
            "body" : """<html>
                            <body>
                                <div>Hallo {name},</div>
                                <div>Sie haben eine Zurücksetzung Ihres Passworts angefordert.</div>
                                <div>Bitte klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</div>
                                <a href="{link}">Passwort zurücksetzen</a>
                                <div>Das Team</div>
                            </body>
                        </html>""",
            "text" : """Hallo {name},\n
Sie haben eine Zurücksetzung Ihres Passworts angefordert.\n
Bitte kopieren Sie den folgenden Link in Ihren Browser, um Ihr Passwort zurückzusetzen: {link}\n
Das Team"""
        },
        "signin" : {
            "subject" : "Willkommen bei Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Hallo {name},</div>
                                <div>Wir freuen uns, Sie bei uns zu haben!</div>
                                <div>Ihre Anmelde-E-Mail lautet: {email}</div>
                                <div>Falls Sie Ihr Passwort vergessen haben, können Sie es auf der Anmeldeseite zurücksetzen.</div>
                                <div>Bitte bestätigen Sie Ihre E-Mail über den folgenden Link:</div>
                                <a href="{link}">E-Mail bestätigen</a>
                                <div>Das Team</div>
                            </body>
                        </html>""",
            "text" : """Hallo {name},\n
Wir freuen uns, Sie bei uns zu haben!\n
Ihre E-Mail: {email}\n
Bitte bestätigen Sie Ihre Registrierung über den folgenden Link:\n
{link}\n
Das Team"""
        }
    },

    "it" : {
        "passlost" : {
            "subject" : "Reimposta la tua password",
            "body" : """<html>
                            <body>
                                <div>Ciao {name},</div>
                                <div>Hai richiesto di reimpostare la password.</div>
                                <div>Clicca sul link seguente per reimpostarla:</div>
                                <a href="{link}">Reimposta la password</a>
                                <div>Il team</div>
                            </body>
                        </html>""",
            "text" : """Ciao {name},\n
Hai richiesto di reimpostare la password.\n
Copia e incolla il seguente link nel tuo browser: {link}\n
Il team"""
        },
        "signin" : {
            "subject" : "Benvenuto in Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Ciao {name},</div>
                                <div>Siamo felici di averti con noi!</div>
                                <div>La tua email di accesso è: {email}</div>
                                <div>Per completare la registrazione, conferma la tua email:</div>
                                <a href="{link}">Conferma email</a>
                                <div>Il team</div>
                            </body>
                        </html>""",
            "text" : """Ciao {name},\n
Siamo felici di averti con noi!\n
Email: {email}\n
Completa la registrazione con questo link:\n
{link}\n
Il team"""
        }
    },

    "es" : {
        "passlost" : {
            "subject" : "Restablecer tu contraseña",
            "body" : """<html>
                            <body>
                                <div>Hola {name},</div>
                                <div>Has solicitado restablecer tu contraseña.</div>
                                <div>Haz clic en el siguiente enlace:</div>
                                <a href="{link}">Restablecer contraseña</a>
                                <div>El equipo</div>
                            </body>
                        </html>""",
            "text" : """Hola {name},\n
Has solicitado restablecer tu contraseña.\n
Copia y pega este enlace en tu navegador: {link}\n
El equipo"""
        },
        "signin" : {
            "subject" : "Bienvenido a Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Hola {name},</div>
                                <div>¡Estamos encantados de tenerte con nosotros!</div>
                                <div>Tu correo de acceso es: {email}</div>
                                <div>Para completar tu registro, confirma tu email:</div>
                                <a href="{link}">Confirmar email</a>
                                <div>El equipo</div>
                            </body>
                        </html>""",
            "text" : """Hola {name},\n
¡Estamos encantados de tenerte con nosotros!\n
Correo: {email}\n
Completa tu registro con este enlace:\n
{link}\n
El equipo"""
        }
    }
}