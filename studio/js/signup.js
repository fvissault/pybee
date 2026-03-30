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
        console.log("entity response:", ent);
        if (!ent.id) {
            alert("Entreprise inconnue");
            return;
        }
        console.log(ent)
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
            //console.log(res);

            if (res.status === "ok") {
                location.href = "signin.html";
            } else {
                alert("Signup error");
            }
        })
        .catch(err => {
            //console.error(err);
            alert("Network error");
        });
    });
}
