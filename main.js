const electron = require('electron')
const {
    app,
    BrowserWindow
} = electron
const Menu = electron.Menu


app.on('ready', () => {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
    })
    win.loadURL('file://' + __dirname + '/index.html')


})
