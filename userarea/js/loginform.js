const form = document.getElementById('loginform');
const usernameField = document.getElementById('email');
const rememberMe = document.getElementById('rememberme');

// Au chargement, on récupère le nom d'utilisateur si mémorisé
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
        usernameField.value = savedUser;
        rememberMe.checked = true;
    }
});

// Lors du submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameField.value.trim();

    if (rememberMe.checked) {
        localStorage.setItem('rememberedUser', username);
    } else {
        localStorage.removeItem('rememberedUser');
    }
});