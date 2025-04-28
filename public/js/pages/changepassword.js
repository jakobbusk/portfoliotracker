import { changePassword } from '/assets/js/auth.js';

document.getElementById('changepassword').addEventListener('submit', async function (event) {
    event.preventDefault();

    //hent værdier fra inputfelter
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    const res = await changePassword(oldPassword, newPassword, confirmNewPassword);
    let body = await res.json()
    //hvis status ok, gem nyt password i localStorage og redirect til dashboard.
    if(res.status === 200) {
        localStorage.setItem('password', newPassword);
        window.location.href = '/dashboard';
    }
    //alert svar fra changePassword
    alert(body.message)
});