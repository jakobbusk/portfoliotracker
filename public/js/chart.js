//sætter standardinstillinger, der bruges i alle charts
function apexSettings() {
    Apex.chart = {
        foreColor: '#84837E', //sætter tekstfarve på tværs af chartet
        fontFamily: 'Inter, sans-serif',
        fontSize: '10pt', //content størrelse 10
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

    Apex.colors = ['#2C64BC', '#2B2733'] //de to farver til serier

    Apex.title = {
        style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '16pt', //header størrelse 16
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
        stroke: { //udjævn grafen lidt
            curve: 'smooth',
            width: 1
        },
    }

    let chart = new ApexCharts(document.getElementById(chartID),options); //opret chart
    chart.render(); //vis chartet
    return chart //returner chartet så det kan ændres senere
}


export {
    createLineChart,
}