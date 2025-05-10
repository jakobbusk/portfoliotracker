//laver POST request login for at tjekke om email og password er korrekte
async function checkCredentials(email, password) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return res;
}

//tjekker om der er logget ind ved load. 
//Redirecter enten til login eller dashboard alt efter om man er logget ind
async function checkLoginOnLoad(){
    const pathname = window.location.pathname;
    console.log(pathname);


    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if(email && password) {
        if (pathname == '/login' || pathname == '/register') {
            window.location.href = '/dashboard';
        }
    } else if (pathname != '/login' && pathname != '/register') {
        window.location.href = '/login';

    }
}

//sender PUT request til ændring af password
async function changePassword(oldPassword, newPassword, confirmNewPassword){
    let email = localStorage.email;
    const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword, email })
    });
    return res;
}

//sender POST til registrering af ny bruger
async function register(name, username, email, password){
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, name, password })
    });
    return res;
}

export {
    checkCredentials,
    checkLoginOnLoad,
    changePassword,
    register,
}