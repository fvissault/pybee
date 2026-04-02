function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function validPass(p) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p)
}

function signup(){
    const firstname = document.getElementById("firstname")
    const lastname = document.getElementById("lastname")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const confirm = document.getElementById("confirm")
    const entity = document.getElementById("entity")

    if (firstname.value.trim() === "" ) {
        alert(t("alertfirstname"));
        firstname.focus()
        return
    }
    if (lastname.value.trim() === "" ) {
        alert(t("alertlastname"));
        lastname.focus()
        return
    }
    if (!validEmail(email.value)) {
        alert(t("alertemail"));
        email.focus()
        return
    }
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
    if (entity.value.trim() === "" ) {
        alert(t("alertorg"));
        entity.focus()
        return
    }

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "unique_email",
            email: email.value
        })
    })
    .then(r => r.json())
    .then(user => {
        if (user.id) {
            alert(t("alertuniqueemail"));
            email.focus()
            return;
        }
        fetch("/pybee/studio/api/entities.py", {
            method: "POST",
            credentials: "include",
            body: new URLSearchParams({
                action: "getByName",
                name: entity.value
            })
        })
        .then(r => r.json())
        .then(ent => {
            if (!ent.id) {
                alert(t("alertorg"));
                return;
            }
            fetch("/pybee/studio/api/users.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    firstname: firstname.value,
                    lastname: lastname.value,
                    email: email.value,
                    password: password.value,
                    id_entity: ent.id
                })
            })
            .then(r => r.json())
            .then(res => {
                fetch("/pybee/studio/api/mail.py", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({
                        lang: currentLang,
                        predname: "signin",
                        email: email.value,
                        toreplace: JSON.stringify({ 
                            name: firstname.value, 
                            link: "http://localhost/pybee/studio/confirm.html?token=" + res.token, 
                            email: email.value 
                        }),
                    })
                })
                .then(r => r.json())
                .then(res => {
                    alert(t("alertemailsent"))
                    location.href = "signin.html"
                })
            })
        })
    })
    .catch(err => {
        alert("Network error");
    });
}

const translations = {
    fr : { 
        title: "Inscription à Beetle Studio",
        registration : "Création de compte Beetle Studio", 
        firstname : "Prénom", 
        lastname : "Nom", 
        email : "Email", 
        password : "Mot de passe", 
        confirm : "Confirmer le mot de passe",
        organization : "Organisation",
        register : "S'inscrire", 
        signin : "Retour à la connexion",
        alertfirstname: "Prénom invalide",
        alertlastname : "Nom invalide",
        alertemail: "Email invalide",
        alertpassword: "Mot de passe invalide",
        alertconfirm: "Le mot de passe et sa confirmation ne correspondent pas",
        alertorg: "Organisation invalide",
        alertuniqueemail: "Email déjà utilisé",
        alertemailsent: "Un email vous a été envoyé pour finaliser votre inscription" 
    } , 
    en : { 
        title: "Beetle Studio Signup",
        registration : "Beetle Studio Registration", 
        firstname : "Firstname", 
        lastname : "Lastname", 
        email : "Email", 
        password : "Password", 
        confirm : "Confirm password",
        organization : "Organization",
        register : "Sign up", 
        signin : "Back to sign in",
        alertfirstname: "Invalid firstname",
        alertlastname : "Invalid lastname",
        alertemail: "Invalid email",
        alertpassword: "Invalid password",
        alertconfirm: "Confirm password and password are not the same",
        alertorg: "Invalid organization",
        alertuniqueemail: "Email already used",
        alertemailsent: "We have sent a mail in your email to end your registration"
    } ,
    it : {
        title: "Registrazione a Beetle Studio",
        registration : "Registrazione Beetle Studio", 
        firstname : "Nome", 
        lastname : "Cognome", 
        email : "Email", 
        password : "Password", 
        confirm : "Conferma password",
        organization : "Organizzazione",
        register : "Registrati", 
        signin : "Torna al login", 
        alertfirstname: "Nome non valido",
        alertlastname : "Cognome non valido",
        alertemail: "Email non valida",
        alertpassword: "Password non valida",
        alertconfirm: "La password e la conferma non corrispondono",
        alertorg: "Organizzazione non valida",
        alertuniqueemail: "Email già utilizzata",
        alertemailsent: "Ti abbiamo inviato un'email per completare la registrazione"
    },
    de : {
        title: "Registrierung bei Beetle Studio",
        registration : "Beetle Studio Registrierung", 
        firstname : "Vorname", 
        lastname : "Nachname", 
        email : "E-Mail", 
        password : "Passwort", 
        confirm : "Passwort bestätigen",
        organization : "Organisation",
        register : "Registrieren", 
        signin : "Zur Anmeldung zurück",
        alertfirstname: "Ungültiger Vorname",
        alertlastname : "Ungültiger Nachname",
        alertemail: "Ungültige E-Mail",
        alertpassword: "Ungültiges Passwort",
        alertconfirm: "Passwort und Bestätigung stimmen nicht überein",
        alertorg: "Ungültige Organisation",
        alertuniqueemail: "E-Mail wird bereits verwendet",
        alertemailsent: "Wir haben Ihnen eine E-Mail gesendet, um Ihre Registrierung abzuschließen" 
    } ,
    es : {
        title: "Registro en Beetle Studio",
        registration : "Registro de Beetle Studio", 
        firstname : "Nombre", 
        lastname : "Apellido", 
        email : "Correo electrónico", 
        password : "Contraseña", 
        confirm : "Confirmar contraseña",
        organization : "Organización",
        register : "Registrarse", 
        signin : "Volver al inicio de sesión",
        alertfirstname: "Nombre no válido",
        alertlastname : "Apellido no válido",
        alertemail: "Correo electrónico no válido",
        alertpassword: "Contraseña no válida",
        alertconfirm: "La contraseña y su confirmación no coinciden",
        alertorg: "Organización no válida",
        alertuniqueemail: "Correo electrónico ya utilizado",
        alertemailsent: "Te hemos enviado un correo electrónico para completar tu registro" 
    }
}

renderUI()