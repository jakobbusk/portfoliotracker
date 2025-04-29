export async function historicalStockData (symbol) {

    try {
        const result = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo`);
        const data = await result.json();

        if (data['Time Series (Daily)']) {
            const rawData = data['Time Series (Daily)'];

            const parsedData = Object.entries(rawData).map(([date, values]) => ({
                [date]: values['4. close'],
            }))

            return parsedData;
        } else {
            throw new Error('Invalid response from Alpha Vantage');
        }
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }

}