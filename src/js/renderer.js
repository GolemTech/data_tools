// const readXlsxFile =  new API.readXlsxFile;
// const filePC;
var app;
// var XLSX =  XLSX();

document.addEventListener("DOMContentLoaded", function(event) {
    init_chart();
  });


 app  = new Vue({
    el: "#app",
    data: {
        name: null,
        path: null,
        voltaje_on: null,
        voltaje_off: null,
        filtered_on: null,
        filtered_off: null,
    }
});

function uploadFile(file) {

    // app.path = file[0].path
    console.log(file);
    // readXlsxFile(file[0]).then(function(rows) {
    //     // `rows` is an array of rows
    //     // each row being an array of cells.
    //     console.log(rows);
    //   })
    readXlsxFile(file[0], { getSheets: true }).then((sheets) => {
        // sheets === [{ name: 'Sheet1' }, { name: 'Sheet2' }]
        console.log(sheets);
      })


      readXlsxFile(file[0], { sheet: 'urbanodosss' }).then((data) => {
        console.log(data);
      })
}

