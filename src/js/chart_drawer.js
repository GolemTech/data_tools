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
    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    type: "line",
                    label: "Voltaje On",
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
                    label: "Voltaje Off",
                    backgroundColor: window.colorChartScheme.secondLineCOlor,
                    borderColor: window.colorChartScheme.secondLineCOlor,
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
            scales: {
                x: {
                    display: true,
                    type: "linear",
                    ticks: {
                        reverse: true,
                    }
                },
                y: {
                    display: true,
                    type: "linear",
                    ticks: {
                        reverse: true,
                    }
                },

            },
            // plugins: {
            //     legend: {
            //         position: 'bottom',
            //     },
            // }

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
    myChart.data.datasets[0].data = data;
    myChart.update();
}

function add_voltaje_off(data) {
    myChart.data.datasets[1].data = data;
    myChart.update();
}

const list2chart = (_data) => {
    var data = [];
    for (var i = 0; i < _data.length; i++) {
        data.push({ x: i, y: _data[i] });
    }
    console.log(data);
    return data;
};