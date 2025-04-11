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

export {
    checkCredentials,
    checkLoginOnLoad
}