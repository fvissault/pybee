function confirm() {
    const params = new URLSearchParams(window.location.search)
    const email = params.get("email")
    const messageobj = document.getElementById("message")

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "confirm_email",
            email: email
        })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.error) {
            messageobj.innerHTML = "<h4 data-i18n='text:messagenok'></h4>"
            renderUI()
        } else {
            fetch("/pybee/studio/api/users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "set_active",
                    email: email,
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
    } ,
    it : {
    },
    de : {
    } ,
    es : {
    }
}
