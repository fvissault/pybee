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
        alert('Invalid firstname');
        firstname.focus()
        return
    }
    if (lastname.value.trim() === "" ) {
        alert('Invalid lastname');
        lastname.focus()
        return
    }
    if (!validEmail(email.value)) {
        alert('Invalid email');
        email.focus()
        return
    }
    if (!validPass(password.value)) {
        alert('Invalid password');
        password.focus()
        return
    }
    if (password.value !== confirm.value){
        alert("Confirm password and password are not the same");
        confirm.focus()
        return;
    }
    if (entity.value.trim() === "" ) {
        alert('Invalid organization');
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
            alert("Email déjà utilisé");
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
                alert("Entreprise inconnue");
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
                if (res.status === "ok") {
                    fetch("/pybee/studio/api/mail.py", {
                        method: "POST",
                        credentials: "include",
                        body: new URLSearchParams({
                            lang: currentLang,
                            predname: "signin",
                            email: email.value,
                            toreplace: JSON.stringify({ 
                                name: firstname.value, 
                                link: "http://localhost/pybee/studio/confirm.html?email=" + email.value, 
                                email: email.value 
                            }),
                        })
                    })
                    .then(r => r.json())
                    .then(res => {
                        console.log(res)
                        alert("Un email vous a été envoyé sur votre boite email pour terminer votre incription")
                        location.href = "signin.html";
                    })
                } else {
                    alert("Signup error");
                }
            })
            .catch(err => {
                alert("Network error");
            });
        });
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
        signin : "Retour à la connexion" 
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
        signin : "Back to sign in" 
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
        signin : "Torna al login" 
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
        signin : "Zur Anmeldung zurück" 
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
        signin : "Volver al inicio de sesión" 
    }
}

renderUI()