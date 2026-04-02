function confirm() {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const messageobj = document.getElementById("message")

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "confirm_email",
            token: token
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            messageobj.innerHTML = "<h4 data-i18n='text:messagenok'></h4>"
            renderUI()
        } else {
            fetch("/pybee/studio/api/users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "set_active",
                    email: data.email
                })
            })
            .then(r => r.json())
            .then(data => {
                messageobj.innerHTML = "<h4 data-i18n='text:messageok'></h4>";
                renderUI()
            });
        }
    });
}

const translations = {
    fr : { 
        title: "Beetle studio : Confirmation d'email",
        identification : "Beetle Studio confirmation d'email", 
        messageok : "✅ Votre email est maintenant validé. Vous pouvez vous connecter au studio de Beetle.", 
        messagenok : "❌ Votre email est déjà validé ou inconnu de nos services.", 
        login : "Valider", 
        signin : "Retour à la connexion",
    } , 
    en : { 
        title: "Beetle Studio: Email confirmation",
        identification : "Beetle Studio email confirmation", 
        messageok : "✅ Your email has been successfully verified. You can now sign in to Beetle Studio.", 
        messagenok : "❌ Your email is already verified or not recognized.", 
        login : "Confirm", 
        signin : "Back to sign in",
    },
    it : {
        title: "Beetle Studio: Conferma email",
        identification : "Conferma email Beetle Studio", 
        messageok : "✅ La tua email è stata verificata. Ora puoi accedere a Beetle Studio.", 
        messagenok : "❌ La tua email è già verificata oppure non è riconosciuta.", 
        login : "Conferma", 
        signin : "Torna al login",
    },
    de : {
        title: "Beetle Studio: E-Mail-Bestätigung",
        identification : "Beetle Studio E-Mail-Bestätigung", 
        messageok : "✅ Ihre E-Mail wurde erfolgreich bestätigt. Sie können sich jetzt bei Beetle Studio anmelden.", 
        messagenok : "❌ Ihre E-Mail ist bereits bestätigt oder nicht bekannt.", 
        login : "Bestätigen", 
        signin : "Zur Anmeldung zurück",
    } ,
    es : {
        title: "Beetle Studio: Confirmación de correo electrónico",
        identification : "Confirmación de correo de Beetle Studio", 
        messageok : "✅ Tu correo electrónico ha sido verificado. Ahora puedes iniciar sesión en Beetle Studio.", 
        messagenok : "❌ Tu correo ya está verificado o no es reconocido.", 
        login : "Confirmar", 
        signin : "Volver al inicio de sesión",
    }
}
