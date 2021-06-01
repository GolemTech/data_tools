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
    content: null
  },
  watch: {
    // whenever question changes, this function will run
    sheet_selected: () => {
      console.log(app.sheet_selected);
      get_columns(app.file, app.sheet_selected) 
    },
    content: () => {
      app.headers = app.content[0];
    },
    column_a: () => {
      console.log(app.column_a);
    }

  }
});

function uploadFile(file) {

  // app.path = file[0].path
  console.log(file);
  app.file = file;
  // readXlsxFile(file[0]).then(function(rows) {
  //     // `rows` is an array of rows
  //     // each row being an array of cells.
  //     console.log(rows);
  //   })
  readXlsxFile(file[0], { getSheets: true }).then((sheets) => {
    // sheets === [{ name: 'Sheet1' }, { name: 'Sheet2' }]
    app.list_sheets = sheets
  })


  // readXlsxFile(file[0], { sheet: 'urbanodosss' }).then((data) => {
  //   console.log(data);
  // })
}



function get_columns(file, sheet) {
  var columns = []
  readXlsxFile(file[0], { sheet: sheet }).then((data) => {
    app.content = data
  })
}