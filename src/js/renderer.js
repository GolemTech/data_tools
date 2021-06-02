// const readXlsxFile =  new API.readXlsxFile;
// const filePC;
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
      console.log(app.sheet_selected);
      // app.index = app.content[0]
      get_columns(app.file, app.sheet_selected) 
    },
    content: () => {
      app.headers = app.content[0];
    },
    column_a: () => {
      var new_array = []
      app.content.forEach(element => {
        new_array.push(element[app.column_a])
      })
      new_array.splice(0,1);
      app.voltaje_on = list2chart(new_array);
      add_voltaje_on(app.voltaje_on)
    },
    column_b: () => {
      var new_array = []
      app.content.forEach(element => {
        new_array.push(element[app.column_b])
      })
      new_array.splice(0,1);
      app.voltaje_off = list2chart(new_array);
      add_voltaje_off(app.voltaje_off)
    }

  }
});

function uploadFile(file) {
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