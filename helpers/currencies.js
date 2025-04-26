// Gør efter ISO 4217 standarden
export const availableCurrencies = [
    {
        code: 'DKK',
        name: 'Danske kroner',
        symbol: 'kr.',
    },
    {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
    },
    {
        code: 'USD',
        name: 'Amerikanske dollars',
        symbol: '$',
    },
    {
        code: 'GBP',
        name: 'Britiske pund',
        symbol: '£',
    },
];

export const availableCurrenciesISO = [
    'DKK',
    'EUR',
    'USD',
    'GBP',
];


// Valuta konvertering
// Her bruger vi exchangerate-api.com til at hente vekselkurser
// hvor vi får conversion rate i "x.xxxx" format så vi ikke skal dividere med 100
export function convertToTargetCurrency(amount, baseCurrency, targetCurrency, exchangeRate) {
    // Hvus valutaerne er de samme så returner beløbet
    if (baseCurrency === targetCurrency) {
        return amount;
    }

    // Tjek om kursen er ugyldig
    if (exchangeRate == undefined ||exchangeRate <= 0) {
        throw new Error('Invalid exchange rate');
    }

    // Omregn beløbet til kontovalutaen
    // beløb / (vekselkurs/100) - 1000dk / 0.1526 = 152,6
    var convertedAmount = amount * exchangeRate

    // Her bruger vi toFixed til at sikre at vi kun har to decimaler
    // Vigtgit at vi bruger Number() til at konvertere det til et tal igen
    return Number(convertedAmount.toFixed(2));
    // For at få den korrekte exchange rate, så skal vi tage transaktionens valuta som base og kontoen som valuta mål
    // https://v6.exchangerate-api.com/v6/:YOUR-API-KEY/pair/:baseCurrency/:targetCurrency
}