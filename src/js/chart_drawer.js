var data;
var myChart;
var ctx;


var colorChartScheme = {
    primaryLineColor: "#e65100",
    secondLineColor: "#000",

    primaryFilteredLineColor: "#004d40",
    secondFilteredLineColor: "#3f51b5",
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
    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    type: "line",
                    label: "Voltaje On filtered",
                    backgroundColor: window.colorChartScheme.primaryLineColor,
                    borderColor: window.colorChartScheme.primaryLineColor,
                    fill: false,
                    pointRadius: window.chartlines.pointRadius,
                    pointHitRadius: window.chartlines.pointHitRadius,
                    lineTension: window.chartlines.lineTension,
                    borderWidth: window.chartlines.borderWidth,
                    data: [],
                },
                {
                    type: "line",
                    label: "Voltaje On",
                    backgroundColor: window.colorChartScheme.primaryFilteredLineColor,
                    borderColor: window.colorChartScheme.primaryFilteredLineColor,
                    fill: false,
                    pointRadius: window.chartlines.pointRadius,
                    pointHitRadius: window.chartlines.pointHitRadius,
                    lineTension: window.chartlines.lineTension,
                    borderWidth: window.chartlines.borderWidth,
                    data: [],
                },


                {
                    type: "line",
                    label: "Voltaje Off filtered",
                    backgroundColor: window.colorChartScheme.secondLineColor,
                    borderColor: window.colorChartScheme.secondLineColor,
                    fill: false,
                    pointRadius: window.chartlines.pointRadius,
                    pointHitRadius: window.chartlines.pointHitRadius,
                    lineTension: window.chartlines.lineTension,
                    borderWidth: window.chartlines.borderWidth,
                    data: [],
                },
                {
                    type: "line",
                    label: "Voltaje Off",
                    backgroundColor: window.colorChartScheme.secondFilteredLineColor,
                    borderColor: window.colorChartScheme.secondFilteredLineColor,
                    fill: false,
                    pointRadius: window.chartlines.pointRadius,
                    pointHitRadius: window.chartlines.pointHitRadius,
                    lineTension: window.chartlines.lineTension,
                    borderWidth: window.chartlines.borderWidth,
                    data: [],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        reverse: true,
                    }
                }]
            },
            plugins: {
                  zoom: {
                    zoom: {
                        pan: {
                            enabled: true,
                            // drag: true,
                            // mode: 'xy',
                            },
                       
                        zoom: {
                            enabled: true,
                            // mode: 'xy'
                        }
                    }
                  }
              },
        }
    });
}

// myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         datasets: [{
//             label: 'Columna A',
//             data: [],
//             backgroundColor: "#212121",
//             borderColor: "#212121",
//             // borderWidth: 1
//         },
//         {
//             label: 'Columna b',
//             data: [],
//             backgroundColor: "#e65100",
//             borderColor: "#e65100",
//             // borderWidth: 2
//         }]
//     },
//     options: {
//         scales: {
//             x: {
//                 type: 'linear'
//             },
//             y: {
//                 type: 'linear'
//             }
//         }
//     }
// });


function add_voltaje_on(data) {
    myChart.data.datasets[1].data = data;
    myChart.update();
}

function add_voltaje_on_filtered(data) {
    myChart.data.datasets[0].data = data;
    myChart.update();
}

function add_voltaje_off(data) {
    myChart.data.datasets[3].data = data;
    myChart.update();
}

function add_voltaje_off_filtered(data) {
    myChart.data.datasets[2].data = data;
    myChart.update();
}

const list2chart = (_data) => {
    var data = [];
    for (var i = 0; i < _data.length; i++) {
        data.push({ x: i, y: _data[i] });
    }
    return data;
};

const dict2list = (data, key = "y") => data.map((object) => object[key]);