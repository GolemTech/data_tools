var data;
var myChart;
var ctx;


var colorChartScheme = {
    primaryLineColor: "rgb(255, 159, 64)",
    secondLineCOlor: "#000",
};


var chartlines = {
    pointRadius: 1,
    borderWidth: 2,
    lineTension: 0, //0 -1
    pointHitRadius: 5,
    pointHoverBorderWidth: 5,
};


function init_chart() {
    ctx = document.getElementById("myChart").getContext("2d");
    data = {
        datasets: [
            {
                type: "line",
                label: "Voltaje On",
                backgroundColor: window.colorChartScheme.primaryLineColor,
                borderColor: window.colorChartScheme.primaryLineColor,
                fill: false,
                yAxisID: "y-axis-1",
                pointRadius: window.chartlines.pointRadius,
                pointHitRadius: window.chartlines.pointHitRadius,
                lineTension: window.chartlines.lineTension,
                borderWidth: window.chartlines.borderWidth,
                data: {},
            },
            {
                type: "line",
                label: "Voltaje Off",
                backgroundColor: window.colorChartScheme.secondLineCOlor,
                borderColor: window.colorChartScheme.secondLineCOlor,
                fill: false,
                yAxisID: "y-axis-1",
                pointRadius: window.chartlines.pointRadius,
                pointHitRadius: window.chartlines.pointHitRadius,
                lineTension: window.chartlines.lineTension,
                borderWidth: window.chartlines.borderWidth,
                data: {},
            }
        ]
    };




    myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        }
    });
}






