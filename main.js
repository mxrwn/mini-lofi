const {app, BrowserWindow, screen, Tray, Menu} = require('electron');
const path = require('path');

let mainWindow, tray = null;

const createWindow = () => {
    let display = screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;
    const win = new BrowserWindow({
        icon: "./icon.png",
        width: 320,
        x: width - 340,
        y: height - 250,
        height: 180,
        resizable: false,
        frame: false,
        //transparent: true,
    })
    //win.webContents.openDevTools();
    win.removeMenu()
    win.loadFile('src/index.html')
    win.setAlwaysOnTop(true, 'pop-up-menu')
    win.on('minimize', () => {
        win.hide();
        tray = createTray()
    })
    win.on('restore', function (event) {
        tray.destroy();
        win.show();
    });
    win.setSkipTaskbar(true);

    return win;
}



app.whenReady().then(() => {
    mainWindow = createWindow()
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    

})

function createTray() {
    let appIcon = new Tray(path.join(__dirname, "icon.png"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show', click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Exit', click: function () {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    appIcon.on('double-click', function (event) {
        mainWindow.show();
    });
    appIcon.setToolTip('Lofi Music');
    appIcon.setContextMenu(contextMenu);
    return appIcon;
}
