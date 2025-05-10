//henter søgeresultater fra finnhub
async function findStocksBySymbol(symbol) {
    const response = await fetch(`https://finnhub.io/api/v1/search?q=${symbol}&exchange=US&token=${process.env.FINNHUB_API_KEY}`);
    const data = await response.json();
    // returns count og result, derfor sætter vi den til data.result fordi
    // vi kun ønsker den
    return data.result;
}

export {
    findStocksBySymbol
}