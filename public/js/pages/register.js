import { register } from '/assets/js/auth.js';

//eventlistener når der trykkes på submitknap i formularen
document.getElementById('register').addEventListener('submit', async function (event) {
    //undgå standard funktionalitet
    event.preventDefault();
    //hent værdier fra inputfelter
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await register(name, username, email, password);
    let body = await res.json()

    if(res.status === 200) {
        //hvis ok gem credentials i localStorage
        localStorage.setItem('password', password);
        //velkommen pop up og redirect til dashboard
        localStorage.setItem('username', username);
        alert(`Velkommen, ${username}!`);
        window.location.href = '/dashboard';
    } else if (res.status === 400) {
        let errorMessage = "";
        //loop gennem alle errors fra register (gør der kan vises flere fejl på en gang)
        for (const err in body.errors) {
            errorMessage = errorMessage+"\n"+body.errors[err]
        }
        //pop up med fejlbesked(er)
        alert(errorMessage)
    } else {
        alert('Ukendt fejl')
    }

});