import {createLineChart} from '/assets/js/chart.js';


let testDataLine = [
    {
        y: 1,
        x: new Date('2025-04-01')
    },
    {
        y: 2,
        x: new Date('2025-04-02')
    },
    {
        y: 6,
        x: new Date('2025-04-03')
    },
    {
        y: 4,
        x: new Date('2025-04-04')
    },
    {
        y: 5,
        x: new Date('2025-04-05')
    },
    {
        y: 3,
        x: new Date('2025-04-06')
    },
    {
        y: 7,
        x: new Date('2025-04-07')
    },
]

window.onload = async () => {
    //testChart(testData);
    try {
        createLineChart(
            testDataLine,
            {title: 'Total værdi', seriesName: 'Total Værdi series', currency: 'DKK'},
            'totalValueChart'
        )
    } catch (error) {
        alert('Fejl ved generering af graf')
        console.log(error)
    }

}