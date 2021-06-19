// const readXlsxFile =  new API.readXlsxFile;
const savitzkyGolay = new API.savitzkyGolay;
// const filePC;
var zoomDisabled = true;
var app;
// var XLSX =  XLSX();

document.addEventListener("DOMContentLoaded", function (event) {
  init_chart();
});


app = new Vue({
  el: "#app",
  data: {
    file: null,
    name: null,
    path: null,
    voltaje_on: null,
    voltaje_off: null,
    filtered_on: null,
    filtered_off: null,
    list_sheets: null,
    headers: null,
    sheet_selected: null,
    column_a: null,
    column_b: null,
    content: null,
    index: null,
    index_min: null,
    index_max: null
  },
  watch: {
    // whenever question changes, this function will run
    sheet_selected: () => {
      get_columns(app.file, app.sheet_selected)
    },
    list_sheets: () => {
      // app.column_a = "";
      // app.column_b = "";
    },
    content: () => {
      app.headers = app.content[0];
    },
    column_a: () => {
      var new_array = []
      myChart.data.datasets.forEach(dataset => {
        dataset.data = [];    
      })
      myChart.update();
      app.content.forEach(element => {
        new_array.push(element[app.column_a])
      })
      new_array.splice(0, 1);
      app.voltaje_on = list2chart(new_array);
      update_annotations(0, app.voltaje_on.length)
      add_voltaje_on(app.voltaje_on)
      document.getElementById("range_a").max = app.voltaje_on.length > 300 ? 300 : app.voltaje_on.length;
      var initial = average(dict2list(myChart.data.datasets[1].data));
      document.getElementById("initial_a").value = parseFloat(initial.toFixed(2));

    },
    column_b: () => {
      var new_array = []
      app.content.forEach(element => {
        new_array.push(element[app.column_b])
      })
      new_array.splice(0, 1);
      app.voltaje_off = list2chart(new_array);
      add_voltaje_off(app.voltaje_off)
      document.getElementById("range_b").max = app.voltaje_off.length > 300 ? 300 : app.voltaje_off.length;
    }

  }
});

function uploadFile(file) {
  myChart.clear();
  init_chart();
  app.file = file;
  readXlsxFile(file[0], { getSheets: true }).then((sheets) => {
    // sheets === [{ name: 'Sheet1' }, { name: 'Sheet2' }]
    app.list_sheets = sheets
  })
}



function get_columns(file, sheet) {
  var columns = []
  readXlsxFile(file[0], { sheet: sheet }).then((data) => {
    app.content = data
  })
}


var buttonZoom = document.getElementById("toggleZoomButton");
buttonZoom.onclick = function () {
  zoomDisabled = !zoomDisabled;
  buttonZoom.innerText = zoomDisabled ? "Zoom: Off" : "Zoom: On"
  myChart.options.plugins.zoom.pan.enabled = !myChart.options.plugins.zoom.pan.enabled
  myChart.options.plugins.zoom.zoom.enabled = !myChart.options.plugins.zoom.zoom.enabled
  // window.chartBode.update()
  myChart.update()
};

var resetZoomButton = document.getElementById("resetZoomButton");
resetZoomButton.onclick = function () {
  // window.chartBode.resetZoom();
  myChart.resetZoom();
};


var filter_sav_a_button = document.getElementById("filter_sav_a");
filter_sav_a_button.onclick = function () {
  filter_column_a()
};


function filter_column_a() {
  var windowSize  = document.getElementById("range_a").value;
  var grade_filter  = document.getElementById("grade_range_a").value;
  var options = {
    windowSize: parseInt(windowSize),
    derivative: 0,
    polynomial: parseInt(grade_filter),
  };
  // let data = dict2list(myChart.data.datasets[0].data) > 0 ?;
  let data = myChart.data.datasets[0].data.length > 0 ? dict2list(myChart.data.datasets[0].data): dict2list(myChart.data.datasets[1].data);
  let ans = savitzkyGolay(data, 1, options);
  add_voltaje_on_filtered(list2chart(ans))
}

var filter_spike_a_button = document.getElementById("filter_picos_a");
filter_spike_a_button.onclick = function () {
  let data = dict2list(myChart.data.datasets[1].data);
  var prom = document.getElementById("initial_a").value*1
  var error = document.getElementById("error_a").value/100
  console.log({data, prom, error});
  var ans = borrar_picos(data, prom, error)
  add_voltaje_on_filtered(list2chart(ans))
  // filter_column_a()
};


var filter_sav_b_button = document.getElementById("filter_sav_b");
filter_sav_b_button.onclick = function () {
  filter_column_b()
};

function filter_column_b() {
  var windowSize = document.getElementById("range_b").value;
  var grade_filter = document.getElementById("grade_range_b").value;
  var options = {
    windowSize: parseInt(windowSize),
    derivative: 0,
    polynomial: parseInt(grade_filter),
  };
  let data = dict2list(myChart.data.datasets[3].data);
  let ans = savitzkyGolay(data, 1, options);
  add_voltaje_off_filtered(list2chart(ans))
}

const selectElement_a = document.querySelector('#range_a');
selectElement_a.addEventListener('change', (event) => {
  filter_column_a()
});

const selectElement_grade_a = document.querySelector('#grade_range_a');
selectElement_grade_a.addEventListener('change', (event) => {
  filter_column_a()
});

const selectElement_b = document.querySelector('#range_b');
selectElement_b.addEventListener('change', (event) => {
  filter_column_b()
});

const selectElement_grade_b = document.querySelector('#grade_range_b');
selectElement_grade_b.addEventListener('change', (event) => {
  filter_column_b()
});

function borrar_picos(data, prom, error) {
  var band = new Array(prom, prom, prom);
  var lim_sup = lim_inf = 0
  var list_data_filter = new Array();
  data.forEach((value, index) => {

      if (!isNumber(value)) data[index] = value = average(band);

      lim_sup = (average(band)) * (1 - error)
      lim_inf = (average(band)) * (1 + error)

      if (value > 0) data[index] = value = value * -1;

      if (lim_sup > value && value > lim_inf) {
          band.push(value);
          band.splice(0, 1)
          list_data_filter.push(value)
      } else {
          var avg = average(band);
          var rnd = (-1 * (Math.random() * (-15 - 15) + 15)) / 1000;
          var val = avg + rnd
          band.push(val)
          band.splice(0, 1)
          list_data_filter.push(val)
      }
  })
  return list_data_filter
}

function isNumber(value) {
  if ((undefined === value) || (null === value)) {
      return false;
  }
  if (typeof value == 'number') {
      return true;
  }
  return !isNaN(value - 0);
}

function average(arr) {
  var avg = arr.reduce((p, c) => p + c, 0) / arr.length;
  // return parseFloat(avg.toFixed(3))
  return parseFloat(avg)
}


function update_annotations(min = 0, max = 1) {
  myChart.options.scales.xAxes[0].ticks.min = Math.round(0 - max*0.1);
  myChart.options.scales.xAxes[0].ticks.max = Math.round(max*0.1 + max);
  window.myChart.options.annotation = {
      drawTime: 'afterDatasetsDraw',
      annotations: [
          {
              id: "line1",
              type: "line",
              borderDash: [5, 7],
              mode: "vertical",
              scaleID: "x-axis-0",
              value: min,
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
                  this.label.content = `Inicial: ${event.subject.config.value}`
              },
              onDragEnd: function (event) {
                  value = event.subject.config.value;
                  this.value = value;
                  var list_index = dict2list(myChart.data.datasets[1].data, "x")
                  var closest = closest_array(value, list_index);
                  this.value = closest;
                  console.log(closest);
                  myChart.update()
              },
          },
          {
              id: "line2",
              type: "line",
              borderDash: [5, 7],
              mode: "vertical",
              scaleID: "x-axis-0",
              value: max,
              borderColor: "black",
              borderWidth: 3,

              label: {
                  backgroundColor: "black",
                  content: `Final`,
                  enabled: true,
              },
              draggable: true,
              onDrag: function (event) {
                  this.label.content = `Final: ${event.subject.config.value}`
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
  myChart.update()
}