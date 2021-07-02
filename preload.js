const { contextBridge } = require('electron')
const osenv = require('osenv')
const fs = require('fs');
const savitzkyGolay = require('ml-savitzky-golay-generalized');
const stringify = require('csv-stringify')
const fastcsv = require('fast-csv'); 
const {getCurrentWindow, globalShortcut} = require('electron').remote;








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
    savitzkyGolay: () => savitzkyGolay,
    stringify: () => stringify,
    fastcsv: () => fastcsv,
    getCurrentWindow: () => getCurrentWindow,

  })

