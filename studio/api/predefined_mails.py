predefined_mails = {
    "fr" : {
        "passlost" : {
            "subject" : "Beetle studio - Réinitialisation de votre mot de passe" ,
            "body" : """<html>
                            <body>
                                <div>Bonjour {name},</div>
                                <div>Vous souhaitez réinitialiser votre mot de passe.</div>
                                <div>Veuillez cliquer sur le lien suivant afin de réinitialiser votre mot de passe :</div>
                                <a href="{link}">Réinitialiser votre mot de passe</a>
                                <div>L'équipe Beetle Studio</div>
                            </body>
                        </html>""" ,
            "text" : """Bonjour {name},\n
Vous souhaitez réinitialiser votre mot de passe.\n
Veuillez copier/coller le lien suivant dans votre navigateur afin de réinitialiser votre mot de passe : {link}\n
L'équipe Beetle Studio"""
        } , 
        "signin" : {
            "subject" : "Beetle studio - Félicitations pour votre inscription" ,
            "body" : """<html>
                            <body>
                                <div>Bonjour {name},</div>
                                <div>Nous sommes heureux de vous compter parmi nous !</div>
                                <div>Votre identifiant pour vous connecter est l'email que vous avez renseigné lors de votre inscription : {email}</div>
                                <div>Si vous avez oublié votre mot de passe, votre application vous permet de le réinitialiser lors de l'authentification.</div>
                                <div>Cependant, pour terminer votre inscription, vous devez valider votre email en cliquant sur le lien suivant :</div>
                                <a href="{link}">Valider votre email</a>
                                <div>L'équipe Beetle Studio</div>
                            </body>
                        </html>""" ,
            "text" : """Bonjour {name},\n
Nous sommes heureux de vous compter parmi nous !\n
Votre identifiant est : {email}\n
Pour finaliser votre inscription, veuillez utiliser le lien suivant :\n
{link}\n
L'équipe Beetle Studio"""
        }, 
        "addmember" : {
            "subject" : "Beetle studio - Ajout d'un membre à un projet" ,
            "body" : """<html>
                            <body>
                                <div>Bonjour {name},</div>
                                <div>Vous venez d'être ajouté à un projet.</div>
                                <div>Connectez-vous vite pour découvrir le projet en question.</div>
                                <div>Si vous avez oublié votre mot de passe, votre application vous permet de le réinitialiser lors de l'authentification.</div>
                                <div>L'équipe Beetle Studio</div>
                            </body>
                        </html>""" ,
            "text" : """Bonjour {name},\n
Vous venez d'être ajouté à un projet.\n
Connectez-vous vite pour découvrir le projet en question.\n
Si vous avez oublié votre mot de passe, votre application vous permet de le réinitialiser lors de l'authentification.\n
L'équipe Beetle Studio"""
        }
    } , 

    "en" : {
        "passlost" : {
            "subject" : "Beetle studio - Reset your password",
            "body" : """<html>
                            <body>
                                <div>Hello {name},</div>
                                <div>You requested a password reset.</div>
                                <div>Please click the link below to reset your password:</div>
                                <a href="{link}">Reset your password</a>
                                <div>The Beetle Studio team</div>
                            </body>
                        </html>""",
            "text" : """Hello {name},\n
You requested a password reset.\n
Please copy and paste the following link into your browser to reset your password: {link}\n
The Beetle Studio team"""
        },
        "signin" : {
            "subject" : "Beetle studio - Welcome to Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Hello {name},</div>
                                <div>We are happy to have you with us!</div>
                                <div>Your login email is: {email}</div>
                                <div>If you forgot your password, you can reset it from the login page.</div>
                                <div>To complete your registration, please confirm your email by clicking the link below:</div>
                                <a href="{link}">Confirm your email</a>
                                <div>The Beetle Studio team</div>
                            </body>
                        </html>""",
            "text" : """Hello {name},\n
We are happy to have you with us!\n
Your login email is: {email}\n
To complete your registration, please use the following link:\n
{link}\n
The Beetle Studio team"""
        }, 
        "addmember" : {
            "subject" : "Beetle Studio - Added to a project" ,
            "body" : """<html>
                    <body>
                        <div>Hello {name},</div>
                        <div>You have been added to a project.</div>
                        <div>Sign in now to discover the project.</div>
                        <div>If you forgot your password, you can reset it from the login page.</div>
                        <div>The Beetle Studio team</div>
                    </body>
                </html>""",
            "text" : """Hello {name},\n
You have been added to a project.\n
Sign in now to discover the project.\n
If you forgot your password, you can reset it from the login page.\n
The Beetle Studio team"""
        }
    },

    "de" : {
        "passlost" : {
            "subject" : "Beetle studio - Passwort zurücksetzen",
            "body" : """<html>
                            <body>
                                <div>Hallo {name},</div>
                                <div>Sie haben eine Zurücksetzung Ihres Passworts angefordert.</div>
                                <div>Bitte klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</div>
                                <a href="{link}">Passwort zurücksetzen</a>
                                <div>Das Beetle Studio Team</div>
                            </body>
                        </html>""",
            "text" : """Hallo {name},\n
Sie haben eine Zurücksetzung Ihres Passworts angefordert.\n
Bitte kopieren Sie den folgenden Link in Ihren Browser, um Ihr Passwort zurückzusetzen: {link}\n
Das Beetle Studio Team"""
        },
        "signin" : {
            "subject" : "Beetle studio - Willkommen bei Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Hallo {name},</div>
                                <div>Wir freuen uns, Sie bei uns zu haben!</div>
                                <div>Ihre Anmelde-E-Mail lautet: {email}</div>
                                <div>Falls Sie Ihr Passwort vergessen haben, können Sie es auf der Anmeldeseite zurücksetzen.</div>
                                <div>Bitte bestätigen Sie Ihre E-Mail über den folgenden Link:</div>
                                <a href="{link}">E-Mail bestätigen</a>
                                <div>Das Beetle Studio Team</div>
                            </body>
                        </html>""",
            "text" : """Hallo {name},\n
Wir freuen uns, Sie bei uns zu haben!\n
Ihre E-Mail: {email}\n
Bitte bestätigen Sie Ihre Registrierung über den folgenden Link:\n
{link}\n
Das Beetle Studio Team"""
        }, 
        "addmember" : {
            "subject" : "Beetle Studio - Zu einem Projekt hinzugefügt" ,
            "body" : """<html>
                    <body>
                        <div>Hallo {name},</div>
                        <div>Sie wurden zu einem Projekt hinzugefügt.</div>
                        <div>Melden Sie sich an, um das Projekt zu entdecken.</div>
                        <div>Falls Sie Ihr Passwort vergessen haben, können Sie es auf der Anmeldeseite zurücksetzen.</div>
                        <div>Das Beetle Studio Team</div>
                    </body>
                </html>""",
            "text" : """Hallo {name},\n
Sie wurden zu einem Projekt hinzugefügt.\n
Melden Sie sich an, um das Projekt zu entdecken.\n
Falls Sie Ihr Passwort vergessen haben, können Sie es auf der Anmeldeseite zurücksetzen.\n
Das Beetle Studio Team"""
        }
    },

    "it" : {
        "passlost" : {
            "subject" : "Beetle studio - Reimposta la tua password",
            "body" : """<html>
                            <body>
                                <div>Ciao {name},</div>
                                <div>Hai richiesto di reimpostare la password.</div>
                                <div>Clicca sul link seguente per reimpostarla:</div>
                                <a href="{link}">Reimposta la password</a>
                                <div>Il team Beetle Studio</div>
                            </body>
                        </html>""",
            "text" : """Ciao {name},\n
Hai richiesto di reimpostare la password.\n
Copia e incolla il seguente link nel tuo browser: {link}\n
Il team Beetle Studio"""
        },
        "signin" : {
            "subject" : "Beetle studio - Benvenuto in Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Ciao {name},</div>
                                <div>Siamo felici di averti con noi!</div>
                                <div>La tua email di accesso è: {email}</div>
                                <div>Per completare la registrazione, conferma la tua email:</div>
                                <a href="{link}">Conferma email</a>
                                <div>Il team Beetle Studio</div>
                            </body>
                        </html>""",
            "text" : """Ciao {name},\n
Siamo felici di averti con noi!\n
Email: {email}\n
Completa la registrazione con questo link:\n
{link}\n
Il team Beetle Studio"""
        }, 
        "addmember" : {
            "subject" : "Beetle Studio - Aggiunta a un progetto" ,
            "body" : """<html>
                    <body>
                        <div>Ciao {name},</div>
                        <div>Sei stato aggiunto a un progetto.</div>
                        <div>Accedi subito per scoprire il progetto.</div>
                        <div>Se hai dimenticato la password, puoi reimpostarla dalla pagina di accesso.</div>
                        <div>Il team Beetle Studio</div>
                    </body>
                </html>""",
            "text" : """Ciao {name},\n
Sei stato aggiunto a un progetto.\n
Accedi subito per scoprire il progetto.\n
Se hai dimenticato la password, puoi reimpostarla dalla pagina di accesso.\n
Il team Beetle Studio"""
        }
    },

    "es" : {
        "passlost" : {
            "subject" : "Beetle studio - Restablecer tu contraseña",
            "body" : """<html>
                            <body>
                                <div>Hola {name},</div>
                                <div>Has solicitado restablecer tu contraseña.</div>
                                <div>Haz clic en el siguiente enlace:</div>
                                <a href="{link}">Restablecer contraseña</a>
                                <div>El equipo de Beetle Studio</div>
                            </body>
                        </html>""",
            "text" : """Hola {name},\n
Has solicitado restablecer tu contraseña.\n
Copia y pega este enlace en tu navegador: {link}\n
El equipo de Beetle Studio"""
        },
        "signin" : {
            "subject" : "Beetle studio - Bienvenido a Beetle Studio",
            "body" : """<html>
                            <body>
                                <div>Hola {name},</div>
                                <div>¡Estamos encantados de tenerte con nosotros!</div>
                                <div>Tu correo de acceso es: {email}</div>
                                <div>Para completar tu registro, confirma tu email:</div>
                                <a href="{link}">Confirmar email</a>
                                <div>El equipo de Beetle Studio</div>
                            </body>
                        </html>""",
            "text" : """Hola {name},\n
¡Estamos encantados de tenerte con nosotros!\n
Correo: {email}\n
Completa tu registro con este enlace:\n
{link}\n
El equipo de Beetle Studio"""
        }, 
        "addmember" : {
            "subject" : "Beetle Studio - Añadido a un proyecto" ,
            "body" : """<html>
                    <body>
                        <div>Hola {name},</div>
                        <div>Has sido añadido a un proyecto.</div>
                        <div>Inicia sesión para descubrir el proyecto.</div>
                        <div>Si has olvidado tu contraseña, puedes restablecerla desde la página de inicio de sesión.</div>
                        <div>El equipo de Beetle Studio</div>
                    </body>
                </html>""",
            "text" : """Hola {name},\n
Has sido añadido a un proyecto.\n
Inicia sesión para descubrir el proyecto.\n
Si has olvidado tu contraseña, puedes restablecerla desde la página de inicio de sesión.\n
El equipo de Beetle Studio"""
        }
    }
}