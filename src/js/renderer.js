// const readXlsxFile =  new API.readXlsxFile;
const savitzkyGolay = new API.savitzkyGolay;
const stringify = new API.stringify;
const fastcsv = new API.fastcsv;
const fs = new API.fs;
const getCurrentWindow = new API.getCurrentWindow;

// const filePC;
var zoomDisabled = true;
var app;
let reverse = true;
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
    name_a: null,
    name_a: null,
    column_b: null,
    name_b: null,
    content: null,
    index: null,
    index_min: null,
    index_max: null
  },
  watch: {
    // whenever question changes, this function will run
    sheet_selected: () => {
      launch_loading()
      try {
        get_columns(app.file, app.sheet_selected)
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          timer: 1500
        })
      }
      
    },
    list_sheets: () => {
      // app.column_a = "";
      // app.column_b = "";
    },
    content: () => {
      app.headers = app.content[0];
      swal.close()
    },
    column_a: () => {

      if (app.column_a) {
        try {
          var new_array = []
          app.content.forEach(element => {
            new_array.push(element[app.column_a])
          })
          // new_array.splice(0, 1);
          app.name_a = new_array.splice(0, 1)[0];
          app.voltaje_on = list2chart(new_array);
  
          myChart.data.datasets[1].label = app.name_a
          myChart.data.datasets[0].label = `${app.name_a} filtered`
          add_voltaje_on(app.voltaje_on)
  
          document.getElementById("range_a").max = app.voltaje_on.length > 300 ? 300 : app.voltaje_on.length;
          var initial = average(dict2list(myChart.data.datasets[1].data));
          document.getElementById("initial_a").value = parseFloat(initial.toFixed(2));
          app.filtered_on = dict2list(app.voltaje_on);
          update_annotations(0, app.voltaje_on.length)
        } catch (e) {
         error();
        }
        
      }

    },
    column_b: () => {
      try {
        if (app.column_b) {
          var new_array = []
          app.content.forEach(element => {
            new_array.push(element[app.column_b])
          })
          app.name_b = new_array.splice(0, 1)[0];
          app.voltaje_off = list2chart(new_array);
  
          update_annotations(0, app.voltaje_off.length)
          myChart.data.datasets[3].label = app.name_b
          myChart.data.datasets[2].label = `${app.name_b} filtered`
          add_voltaje_off(app.voltaje_off)
  
          document.getElementById("range_b").max = app.voltaje_off.length > 300 ? 300 : app.voltaje_off.length;
          var initial = average(dict2list(myChart.data.datasets[3].data));
          document.getElementById("initial_b").value = parseFloat(initial.toFixed(2));
          app.filtered_off = dict2list(app.voltaje_off);
        }
      } catch (e) {
        error();
      }
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
  document.getElementById("filename").innerHTML = app.name = app.file[0].name
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

var reset_filter_a = document.getElementById("reset_filter_a");
reset_filter_a.onclick = function () {
try {
  console.log("click a");
  myChart.data.datasets[0].data = myChart.data.datasets[1].data;
  app.filtered_on = dict2list(app.voltaje_on)
  myChart.update()
} catch (e) {
  error();
}
};


var reset_filter_b = document.getElementById("reset_filter_b");
reset_filter_b.onclick = function () {
try {
  console.log("click a");
  myChart.data.datasets[2].data = myChart.data.datasets[3].data;
  app.filtered_off = dict2list(app.voltaje_off)
  myChart.update()
} catch (e) {
  error();
}
};

var resetZoomButton = document.getElementById("resetZoomButton");
resetZoomButton.onclick = function () {
  // window.chartBode.resetZoom();
  myChart.resetZoom();
};

var reset_charts = document.getElementById("reset_charts");
reset_charts.onclick = function () {
  location.reload()
};


var filter_sav_a_button = document.getElementById("filter_sav_a");
filter_sav_a_button.onclick = function () {
  filter_column_a()
};


function filter_column_a() {


  try {
    var windowSize = document.getElementById("range_a").value;
    var grade_filter = document.getElementById("grade_range_a").value;
    var options = {
      windowSize: parseInt(windowSize),
      derivative: 0,
      polynomial: parseInt(grade_filter),
    };
    // let data = dict2list(myChart.data.datasets[0].data) > 0 ?;
    let data = myChart.data.datasets[0].data.length > 0 ? dict2list(myChart.data.datasets[0].data) : dict2list(myChart.data.datasets[1].data);
    let ans = savitzkyGolay(data, 1, options);
    add_voltaje_on_filtered(list2chart(ans))
  } catch (e) {
    error();
  }

}

var filter_spike_a_button = document.getElementById("filter_picos_a");
filter_spike_a_button.onclick = function () {

  // filter_column_a()

  try {
    let data = app.filtered_on;
    var prom = document.getElementById("initial_a").value * 1
    var err = document.getElementById("error_a").value / 100
    console.log({ data, prom, err });
    var ans = borrar_picos({ data, start: app.index_min, end: app.index_max, prom, err })
    app.filtered_on = ans;
    add_voltaje_on_filtered(list2chart(ans))
    // filter_column_a()
  } catch (e) {
    console.log(e);
    error()
  }
};

var filter_spike_b_button = document.getElementById("filter_picos_b");
filter_spike_b_button.onclick = function () {
try {
  let data = app.filtered_off;
  var prom = document.getElementById("initial_b").value * 1
  var err = document.getElementById("error_b").value / 100
  console.log({ data, prom, err });
  var ans = borrar_picos({ data, start: app.index_min, end: app.index_max, prom, err })
  app.filtered_off = ans;
  add_voltaje_off_filtered(list2chart(ans))
  // filter_column_a()
} catch (e) {
  error();
}
};


var filter_sav_b_button = document.getElementById("filter_sav_b");
filter_sav_b_button.onclick = function () {
  filter_column_b()
};

function filter_column_b() {

  try {
    var windowSize = document.getElementById("range_b").value;
    var grade_filter = document.getElementById("grade_range_b").value;
    var options = {
      windowSize: parseInt(windowSize),
      derivative: 0,
      polynomial: parseInt(grade_filter),
    };
    let data = myChart.data.datasets[2].data.length > 0 ? dict2list(myChart.data.datasets[2].data) : dict2list(myChart.data.datasets[3].data);
    let ans = savitzkyGolay(data, 1, options);
    add_voltaje_off_filtered(list2chart(ans))
  } catch (e) {
    error();
  }
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

function borrar_picos(params) {
  let data = params.data;
  let start = params.start ? params.start : 0;
  let end = params.end ? params.end : data.length;
  let prom = params.prom;
  let error = params.err;

  var band = new Array(prom, prom, prom);
  var lim_sup = lim_inf = 0
  var list_data_filter = data;


  for (let index = start; index < end; index++) {


    let value = data[index]
    if (!isNumber(value)) data[index] = value = average(band);
    lim_sup = (average(band)) * (1 - error)
    lim_inf = (average(band)) * (1 + error)

    if (value > 0) data[index] = value = value * -1;
    if (lim_sup > value && value > lim_inf) {
      band.push(value);
      band.splice(0, 1)
      data[index] = value
    } else {
      var avg = average(band);
      var rnd = (-1 * (Math.random() * (-15 - 15) + 15)) / 1000;
      var val = avg + rnd
      band.push(val)
      band.splice(0, 1)
      data[index] = val
    }
  }
  return data 
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
  myChart.options.scales.xAxes[0].ticks.min = Math.round(0 - max * 0.03);
  myChart.options.scales.xAxes[0].ticks.max = Math.round(max * 0.03 + max);
  app.index_min = min;
  app.index_max = max;
  let column_a = document.getElementById("initial_a").value;
  console.log(column_a);
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
          this.value = app.index_min = closest;
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
          this.value = app.index_max = closest;
          myChart.update()
        },
      }
    ]
  }
  myChart.update()
}


var reverse_axis = document.getElementById("reverse_axis");
reverse_axis.onclick = function () {
  // window.chartBode.update()
  reverse = !reverse;
  myChart.options.scales.yAxes[0].ticks.reverse = reverse;
  myChart.update()
};


function saveFIle() {

  const content = fileContent();
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = `${app.file[0].name}_filtered.csv`
  element.click();
}

function fileContent() {
  let column_a = dict2list(myChart.data.datasets[0].data)
  column_a.unshift(app.name_a)
  let column_b = dict2list(myChart.data.datasets[2].data)
  column_b.unshift(app.name_b)
  console.log({ column_a, column_b });

  let content = ""
  for (let index = 0; index < column_a.length; index++) {
    const element_a = column_a[index];
    const element_b = column_b[index];
    content += `${element_a}, ${element_b}\n`;

  }
  return content
}


function launch_loading(text) {
  Swal.fire({
    title: text || "Un momento por favor!",
    // html: 'data uploading',// add html attribute if you want or remove
    allowOutsideClick: false,
    showCancelButton: false, // There won't be any cancel button
    showConfirmButton: false, // There won't be any confirm button
    willOpen: () => {
      Swal.showLoading()
    },
  });
}

const download = document.querySelector('#download');
download.onclick = function () {
  saveFIle()
};

function error() {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    timer: 1500
  })
}