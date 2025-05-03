//sætter standardinstillinger, der bruges i alle charts
function apexSettings() {
    Apex.chart = {
        foreColor: '#84837E', //sætter tekstfarve på tværs af chartet
        fontFamily: 'Inter, sans-serif',
        fontSize: '10pt', //content størrelse 10
        height: '400px',
        toolbar: {
            show: false, //fjern toolbar. Noget funktionalitet vi ikke bruger (zoom, gem som png mm).
        },
        zoom: {
            enabled: false,
        },
    }

    Apex.tooltip = { //box der popper op når man hover mus over graf
        enabled: true,
        style: { //er også stylet i style.css
            fontSize: '10pt',
        },
    }
    //farver til serier, de to første er fra design guide (tilføjet flere så der er flere forskellige i pie chart)
    Apex.colors = ['#2C64BC', '#2B2733', '#7A28CB','#FDCA40','#DF2935','#0B5563','#386C0B','#A26769','#E01A4F','#2B061E']

    Apex.title = {
        style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '16pt', //header størrelse 16
            color: '#C3C3C1',
        },
    }

}

//funktion til at generere linjegraf
async function createLineChart(data, optionsObject, chartID){

    const {title, seriesName, currency} = optionsObject;

    await apexSettings() //kør standardinstillinger

    let options = {
        chart: {
            type: 'line', //angiv linjegraf
        },
        series: [{
            data: data,
            name: seriesName,
        }
        ],
        title: {
            text: title,
        },
        xaxis: {
            type: 'datetime', //x aksen er datoformat
            axisBorder: { //vis aksen
                show: true,
                color: '#84837E',
            },
            axisTicks: { //fjerner 'ticks' (små hakker) på aksen
                show: false,
            },
            labels: { //labels på aksen
                style: {
                    fontSize: '10pt', //ikke dækket af foreSize så sættes manuelt
                },
            },
            tooltip: { //fjern lille tooltip på x-aksen
                enabled: false,
            },
        },
        yaxis: {
            type: 'numeric', //numerisk format
            axisBorder: {
                show: true,
                color: '#84837E',
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    fontSize: '10pt',
                },
                formatter: (value) => { //formatter funktion der bruges til at beregne labels. Returnerer i valutaformat for den angivne valuta.
                    return Intl.NumberFormat('da-DK', {
                        style: 'currency',
                        currency: currency,
                        }).format(value);
                },
            },
        },
        grid: { //vis grid på chart
            borderColor: '#242424',
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        stroke: {
            curve: 'smooth',//udjævn grafen
            width: 3, //tykkelse af grafen
        },
    }

    let chart = new ApexCharts(document.getElementById(chartID),options); //opret chart
    chart.render(); //vis chartet
    return chart //returner chartet så det kan ændres senere
}

async function createPieChart(data,title,chartID) {

    //piechart bruger to arrays, en med værdier og en med tilhørende label
    const dataSeries = [];
    const dataLabels = [];

    data.forEach(e => { //looper gennem alle positioner og tilføjer dem til arrays
        dataSeries.push(e.totalValue)
        dataLabels.push(e.assetSymbol)
    });

    await apexSettings() //kør standardinstillinger

    const options = {
        chart: {
            type: 'pie', //angiv piechart
        },
        series: dataSeries,
        labels: dataLabels,
        title: {
            text: title,
        },
        dataLabels: { //datalabels er procentsaterne på hvert lagkagestykke
            enabled: true,
            style: { //ændrer farven på labels så det passer med design-guide dark gray
                colors: ['#84837E'],
            },
            dropShadow: { //ændrer skyggen fra hvid til sort så det er nemmere at læse labels
                enabled: true,
                color: '#000000',
                opacity: 0.8,
            },
        },
        stroke: { //sætter kantfarve
            show: true,
            colors: ['#84837E'],
            width: 1,
        },
        legend: { //flytter farveforklaring til bunden, default er venstre side
            position: 'bottom',
        },
        tooltip: { //normalt viser tooltip <label>: <værdi>. Vi vil kun have label.
            y: { //fjern y-værdi ved at lave formatterfunktion der returnerer tom streng
                formatter: () => {return ''}
            },
        },
    }

    let chart = new ApexCharts(document.getElementById(chartID),options); //opret chart
    chart.render(); //vis chartet
    return chart
}


export {
    createLineChart, createPieChart
}