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
                    label: "Column A filtered",
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
                    label: "Column A",
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
                    label: "Column B filtered",
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
                    label: "Column B",
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
            annotation: {
                drawTime: 'afterDatasetsDraw',
                annotations: [
                    {
                        id: "line1",
                        type: "line",
                        borderDash: [5, 7],
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: 0,
                        borderColor: "black",
                        borderWidth: 3,
                        label: {
                            backgroundColor: "orange",
                            content: `Inicial`,
                            enabled: true,
                            yAdjust: 50
                        },
                        draggable: true,
                        onDrag: function (event) {

                        },
                        onDrag: function (event) {
                            this.label.content = `Inicial drag`
                        },
                        onDragEnd: function (event) {
                            value = event.subject.config.value;
                            this.value = value;
                            var list_index = dict2list(myChart.data.datasets[1].data, "x")
                            var closest = closest_array(value, list_index);
                            this.value = closest;
                            myChart.update()
                        },
                    },
                    {
                        id: "line2",
                        type: "line",
                        borderDash: [5, 7],
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: 1,
                        borderColor: "black",
                        borderWidth: 3,

                        label: {
                            backgroundColor: "black",
                            content: `Final`,
                            enabled: true,
                        },
                        draggable: true,
                        onDrag: function (event) {
                            this.label.content = `Final drag`
                        },
                        onDragEnd: function (event) {
                            value = event.subject.config.value;
                            this.value = value;
                            var list_index = dict2list(myChart.data.datasets[1].data, "x")
                            var closest = closest_array(value, list_index);
                            this.value = closest;
                            myChart.update()
                        },
                    }
                ]
            }
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

function closest_object(goal, key, object) {
    var closest = object.reduce(function (prev, curr) {
        return (Math.abs(curr[key] - goal) < Math.abs(prev[key] - goal) ? curr : prev);
    });
    return closest
}

function closest_array(goal, array) {
    var closest = array.reduce(function (prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    return closest
}