function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function reset(){
    let email = document.getElementById('email')

    if (!validEmail(email.value)) {
        alert(t("alertemail"));
        email.focus()
        return
    }

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "unique_email",
            email: email.value,
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            alert(t("alertemail"))
        } else {
            fetch("/pybee/studio/api/users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "gettokenbyemail",
                    email: email.value,
                })
            })
            .then(r => r.json())
            .then(res => {
                console.log(data)
                fetch("/pybee/studio/api/mail.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        lang: currentLang,
                        predname: "passlost",
                        email: email.value,
                        toreplace: JSON.stringify({ 
                            name: data["firstname"], 
                            link: "http://localhost/pybee/studio/reset.html?token=" + res.token, 
                            email: email.value 
                        }),
                    })
                })
                .then(r => r.json())
                .then(data => {
                    alert(t("alertemailsent"))
                    location.href = "signin.html";
                });
            })
        }
    })
}

const translations = {
    fr : { 
        title: "Mot de passe perdu",
        identification : "Mot de passe perdu ?", 
        email : "Email", 
        enteremail : "Saisissez votre email", 
        reset : "Réinitialiser", 
        signin : "Retour à la connexion",
        alertemail: "Email invalide",
        alertemailsent: "Un email vous a été envoyé pour réinitialiser votre mot de passe" 
    } , 
    en : { 
        title: "Forgot password",
        identification : "Forgot your password?", 
        email : "Email", 
        enteremail : "Enter your email", 
        reset : "Reset", 
        signin : "Back to sign in",
        alertemail: "Invalid email",
        alertemailsent: "An email has been sent to reset your password"
    },
    it : {
        title: "Password dimenticata",
        identification : "Hai dimenticato la password?", 
        email : "Email", 
        enteremail : "Inserisci la tua email", 
        reset : "Reimposta", 
        signin : "Torna al login",
        alertemail: "Email non valida",
        alertemailsent: "Ti abbiamo inviato un'email per reimpostare la password"
    },
    de : {
        title: "Passwort vergessen",
        identification : "Passwort vergessen?", 
        email : "E-Mail", 
        enteremail : "E-Mail eingeben", 
        reset : "Zurücksetzen", 
        signin : "Zur Anmeldung zurück",
        alertemail: "Ungültige E-Mail",
        alertemailsent: "Eine E-Mail zum Zurücksetzen Ihres Passworts wurde gesendet"
    } ,
    es : {
        title: "Contraseña olvidada",
        identification : "¿Has olvidado tu contraseña?", 
        email : "Correo electrónico", 
        enteremail : "Introduce tu correo electrónico", 
        reset : "Restablecer", 
        signin : "Volver al inicio de sesión",
        alertemail: "Correo electrónico no válido",
        alertemailsent: "Se ha enviado un correo electrónico para restablecer tu contraseña"
    }
}

renderUI()