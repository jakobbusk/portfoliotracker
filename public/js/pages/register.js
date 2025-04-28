import { register } from '/assets/js/auth.js';

document.getElementById('register').addEventListener('submit', async function (event) {
    event.preventDefault();
    alert("hej")
    //hent værdier fra inputfelter
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await register(name, username, email, password);
    let body = await res.json()
    
    if(res.status === 200) {
        localStorage.setItem('password', password);
        localStorage.setItem('email', email);
        alert(`Velkommen, ${username}!`);
        window.location.href = '/dashboard';
    } else if (res.status === 400) {
        let errorMessage = "";
        for (const err in body.errors) {
            errorMessage = errorMessage+"\n"+body.errors[err]
        }
        alert(errorMessage)
    } else {
        alert('Ukendt fejl')
    }

});