function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function validPass(p) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p)
}

function signin(){
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    if (!validEmail(email)) {
        alert('Invalid email');
        return
    }
    if (!validPass(password)) {
        alert('Invalid password');
        return
    }

    fetch("/pybee/studio/api/users.py", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({
            action: "login",
            email: email,
            password: password
        })
    })
    .then(r => r.json())
    .then(data => {
        if(data.error){
            alert("Failed authentication");
        } else {
            fetch("/pybee/studio/api/session.py", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    action: "create",
                    userid: data.id,
                    email: data.email
                })
            }).then(() => location.href = "main.html");
        }
    });
}

const translations = {
    fr : { 
        title: "Connexion à Beetle Studio",
        identification : "Authentification Beetle Studio", 
        email : "Email", 
        enteremail : "Saisissez votre email", 
        password : "Mot de passe", 
        enterpassword : "Saisissez votre mot de passe",
        login : "Valider", 
        signup : "Créer un compte",
        or: "ou", 
        pass : "Mot de passe oublié ?"
    } , 
    en : { 
        title: "Beetle Studio Signin",
        identification : "Beetle Studio Authentication", 
        email : "Email", 
        enteremail : "Enter email", 
        password : "Password", 
        enterpassword : "Enter password",
        login : "Sign in", 
        signup : "Create an account",
        or: "or", 
        pass : "Password lost?" 
    } ,
    it : {
        title: "Accesso a Beetle Studio",
        identification : "Autenticazione Beetle Studio", 
        email : "Email", 
        enteremail : "Inserisci email", 
        password : "Password", 
        enterpassword : "Inserisci la password",
        login : "Conferma", 
        signup : "Crea un account",
        or: "o", 
        pass : "Password dimenticata?" 
    },
    de : {
        title: "Anmeldung bei Beetle Studio",
        identification : "Beetle Studio Anmeldung", 
        email : "E-Mail", 
        enteremail : "E-Mail eingeben", 
        password : "Passwort", 
        enterpassword : "Passwort eingeben",
        login : "Bestätigen", 
        signup : "Konto erstellen",
        or: "oder", 
        pass : "Passwort vergessen?" 
    } ,
    es : {
        title: "Inicio de sesión en Beetle Studio",
        identification : "Autenticación de Beetle Studio", 
        email : "Correo electrónico", 
        enteremail : "Introducir correo electrónico", 
        password : "Contraseña", 
        enterpassword : "Introducir contraseña",
        login : "Validar", 
        signup : "Crear una cuenta",
        or: "o", 
        pass : "¿Contraseña olvidada?" 
    }
}

renderUI()