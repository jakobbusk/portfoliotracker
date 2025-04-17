import { availableCurrenciesISO } from "../consts/currencies.js";
export function validateAccountData ({name, currency, bankReference}) {
    const errors = [];

    // Validering af navn
    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
    }

    // Validering af valuta
    if (!currency || typeof currency !== 'string' || !availableCurrenciesISO.includes(currency)) {
        errors.push('Ugyldig valuta.');
    }

    console.log(availableCurrenciesISO.includes(currency));


    // Validering af bankReference
    if (bankReference && (typeof bankReference !== 'string')) {
        errors.push('Bank reference must be a non-empty string if provided.');
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