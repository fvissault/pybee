function validPass(p) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p)
}

function reset(){
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const password = document.getElementById("password")
    const confirm = document.getElementById("confirm")

    if (!validPass(password.value)) {
        alert(t("alertpassword"));
        password.focus()
        return
    }
    if (password.value !== confirm.value){
        alert(t("alertconfirm"));
        confirm.focus()
        return;
    }

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "getemailbytoken",
            password : password.value,
            token: token
        })
    })
    .then(r => r.json())
    .then(data => {
        fetch("/pybee/studio/api/users.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "reset",
                password : password.value,
                email: data.email
            })
        })
        .then(r => r.json())
        .then(user => {
            alert(t("alertreinit"))
            location.href = "signin.html"
        });
    })   
}

const translations = {
    fr : { 
        title: "Beetle Studio - réinitialisation du mot de passe",
        reinitialize : "Réinitialisation du mot de passe", 
        password : "Nouveau mot de passe", 
        confirm : "Confirmer le mot de passe",
        reset : "Réinitialiser", 
        signin : "Retour à la connexion",
        alertpassword: "Mot de passe invalide",
        alertconfirm: "Le mot de passe et sa confirmation ne correspondent pas",
        alertreinit: "Votre mot de passe a été réinitialisé avec succès"
    } , 
    en : { 
        title: "Beetle Studio - Password reset",
        reinitialize : "Password reset", 
        password : "New password", 
        confirm : "Confirm password",
        reset : "Reset", 
        signin : "Back to sign in",
        alertpassword: "Invalid password",
        alertconfirm: "Password and confirmation do not match",
        alertreinit: "Your password has been successfully reset"
    },
    it : {
        title: "Beetle Studio - Reimpostazione della password",
        reinitialize : "Reimpostazione della password", 
        password : "Nuova password", 
        confirm : "Conferma password",
        reset : "Reimposta", 
        signin : "Torna al login",
        alertpassword: "Password non valida",
        alertconfirm: "La password e la conferma non corrispondono",
        alertreinit: "La password è stata reimpostata con successo"
    },
    de : {
        title: "Beetle Studio - Passwort zurücksetzen",
        reinitialize : "Passwort zurücksetzen", 
        password : "Neues Passwort", 
        confirm : "Passwort bestätigen",
        reset : "Zurücksetzen", 
        signin : "Zur Anmeldung zurück",
        alertpassword: "Ungültiges Passwort",
        alertconfirm: "Passwort und Bestätigung stimmen nicht überein",
        alertreinit: "Ihr Passwort wurde erfolgreich zurückgesetzt"
    } ,
    es : {
        title: "Beetle Studio - Restablecer contraseña",
        reinitialize : "Restablecer contraseña", 
        password : "Nueva contraseña", 
        confirm : "Confirmar contraseña",
        reset : "Restablecer", 
        signin : "Volver al inicio de sesión",
        alertpassword: "Contraseña no válida",
        alertconfirm: "La contraseña y su confirmación no coinciden",
        alertreinit: "Tu contraseña ha sido restablecida con éxito"
    }
}

renderUI()