async function findStocksBySymbol(symbol) {
    const response = await fetch(`https://finnhub.io/api/v1/search?q=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
    const data = await response.json();
    return data.result;
}