
import { checkCredentials } from '/assets/js/auth.js';
document.getElementById('login').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Tjekker om login oplysningerne er korrekte
    const res = await checkCredentials(email, password);

    if(res.status === 200) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        window.location.href = '/dashboard';
    } else if (res.status === 401) {
        // Handle invalid credentials
        alert('Invalid email or password');
    } else {
        //
        alert('An error occurred. Please try again.');
    }
});