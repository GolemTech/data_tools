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
    index: null
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
      app.content.forEach(element => {
        new_array.push(element[app.column_a])
      })
      new_array.splice(0, 1);
      app.voltaje_on = list2chart(new_array);
      add_voltaje_on(app.voltaje_on)
      var len = app.voltaje_on.length > 200 ? 200 : app.voltaje_on.length;
      document.getElementById("range_a").max = len;
      document.getElementById("range_b").max = len;
    },
    column_b: () => {
      var new_array = []
      app.content.forEach(element => {
        new_array.push(element[app.column_b])
      })
      new_array.splice(0, 1);
      app.voltaje_off = list2chart(new_array);
      add_voltaje_off(app.voltaje_off)
      document.getElementById("range_b").max = app.voltaje_off.length
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
  var windowSize = input = document.getElementById("range_a").value;
  var options = {
    windowSize: parseInt(windowSize),
    derivative: 0,
    polynomial: 3,
  };
  let data = dict2list(myChart.data.datasets[1].data);
  let ans = savitzkyGolay(data, 1, options);
  add_voltaje_on_filtered(list2chart(ans))
}


var filter_sav_b_button = document.getElementById("filter_sav_b");
filter_sav_b_button.onclick = function () {
  filter_column_b()
};

function filter_column_b() {
  var windowSize = input = document.getElementById("range_b").value;
  var options = {
    windowSize: parseInt(windowSize),
    derivative: 0,
    polynomial: 3,
  };
  let data = dict2list(myChart.data.datasets[3].data);
  let ans = savitzkyGolay(data, 1, options);
  add_voltaje_off_filtered(list2chart(ans))
}

const selectElement_a = document.querySelector('#range_a');
selectElement_a.addEventListener('change', (event) => {
  filter_column_a()
});

const selectElement_b = document.querySelector('#range_b');
selectElement_b.addEventListener('change', (event) => {
  filter_column_b()
});