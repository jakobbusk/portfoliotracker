//henter historisk kurs data på et symbol
export async function historicalStockData (symbol) {

    try {
        const result = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
        const data = await result.json();

        if (data['Time Series (Daily)']) {
            const rawData = data['Time Series (Daily)'];

            //vi er kun interesseret i lukkekursen, derfor henter vi denne fra resultatet
            const parsedData = {};
            Object.entries(rawData).forEach(([date, values]) => {
                parsedData[date] = values['4. close'];
            });

            return parsedData;
        } else if (data.Information) {
            return {
                error: "Rate limited - Alpha Vantage"
            }
        } else {
            throw new Error('Invalid response from Alpha Vantage');
        }

    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }

}

//hent kursen på en aktie
export async function getStockPrice (symbol) {
    try {
        const result = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
        const data = await result.json();

        if (data['Global Quote']) {
            return {price: data['Global Quote']['05. price'], symbol: data['Global Quote']['01. symbol']};
        } else if (data.Information) {
            return {
                error: "Rate limited - Alpha Vantage"
            }
        } else {
            throw new Error('Invalid response from Alpha Vantage');
        }
    } catch (error) {
        console.error('Error fetching stock price:', error);
        throw error;
    }
}