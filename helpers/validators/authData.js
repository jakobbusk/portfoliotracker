// valider login data

export function validateLoginData({email, password}) {

    const errors = {}

    // tjek om email er tom
    if (!email || email.trim() === '' || email.length < 5 || email.length > 50 || !email.includes('@')) {
        errors.email = 'Fejl på email'
    }

    // tjek om password er tom
    if (!password || password.trim() === '' || password.length < 5 || password.length > 50) {
        errors.password = 'Fejl på password'
    }


    // returner fejl hvis der er nogen
    return {
        errors,
        // hvis der ikke er nogen fejl, så er valid = true
        // Vi bruger Object.keys til at få antallet af fejl
        // Fordi den tæller antallet af "keys" i errors objektet
        valid: Object.keys(errors).length === 0
    }

}

export function validateRegisterData({name, username, email, password}) {
    const errors = {}

    // tjek om navn er tom
    if (!name || name.trim() === '' || name.length < 2 || name.length > 50) {
        errors.name = 'Fejl på navn'
    }

    // tjek om username er tom
    if (!username || username.trim() === '' || username.length < 2 || username.length > 50) {
        errors.username = 'Fejl på brugernavn'
    }

    // tjek om email er tom
    if (!email || email.trim() === '' || email.length < 5 || email.length > 50 || !email.includes('@')) {
        errors.email = 'Fejl på email'
    }

    // tjek om password er tom
    if (!password || password.trim() === '' || password.length < 5 || password.length > 50) {
        errors.password = 'Fejl på password'
    }

    // returner fejl hvis der er nogen
    return {
        errors,
        // hvis der ikke er nogen fejl, så er valid = true
        // Vi bruger Object.keys til at få antallet af fejl
        // Fordi den tæller antallet af "keys" i errors objektet
        valid: Object.keys(errors).length === 0
    }
}