const { contextBridge } = require('electron')
const osenv = require('osenv')
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');








window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })
  


  contextBridge.exposeInMainWorld('API', {
    osenv: () => osenv,
    fs: () => fs,
    readXlsxFile: () => readXlsxFile,
  })

