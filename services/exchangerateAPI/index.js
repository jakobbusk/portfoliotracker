//henter conversionrate fra exchange rate api
async function getConversionRate(base, target) {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API}/pair/${base}/${target}`);
    const data = await response.json();
    return data;
}

export {
    getConversionRate
}