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
                    label: "LPR",
                    backgroundColor: window.colorChartScheme.secondLineColor,
                    borderColor: window.colorChartScheme.secondLineColor,
                    fill: false,
                    pointRadius: window.chartlines.pointRadius,
                    pointHitRadius: window.chartlines.pointHitRadius,
                    lineTension: window.chartlines.lineTension,
                    borderWidth: window.chartlines.borderWidth,
                    data: [],
                },
                // {
                //     type: "line",
                //     label: "Column A",
                //     backgroundColor: window.colorChartScheme.primaryFilteredLineColor,
                //     borderColor: window.colorChartScheme.primaryFilteredLineColor,
                //     fill: false,
                //     pointRadius: window.chartlines.pointRadius,
                //     pointHitRadius: window.chartlines.pointHitRadius,
                //     lineTension: window.chartlines.lineTension,
                //     borderWidth: window.chartlines.borderWidth,
                //     data: [],
                // }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        reverse: false,
                        userCallback: function (tick) {
                            return tick;
                            // return `${tick.toExponential(0)} Ω`;
                            // return formatBytes(tick.toExponential(0), (subfix = "Ω"), (decimals = 0));
                          },
                    }
                }]
            },
            title: {
                display: true,
                text: 'Custom Chart Title'
            },
            legend:{
                display: true,
                position: 'bottom',
                boxWidth: 100
            }
        }
    });
}

const formatBytes = (value, subfix) => {

    value = parseFloat(value);
    dm = 2;
    k = 1000;
    sizes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
    i = Math.floor(Math.log(Math.abs(value)) / Math.log(k));

    value =
        Math.abs(value) < 1 ?
            `${value.toFixed(3)} ${subfix}` :
            `${parseFloat((value / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}${subfix}`
    return value;
}




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

document.addEventListener("DOMContentLoaded", function (event) {
    init_chart();
    myChart.data.datasets[0].data=data_lpr_1;
    myChart.update()
    
  });
  