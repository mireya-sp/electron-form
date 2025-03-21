const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const WebScraping = require('./webScraping');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // Mantener esto en false por seguridad
            contextIsolation: true, // Mantener esto en true por seguridad
            allowPopups: true, // Permitir que window.open funcione
        },
    });

    win.loadFile('index.html');
}

ipcMain.handle('hacer-scraping', async (event, busqueda) => {
    try {
        const resultados = await WebScraping.hacerScraping(busqueda);
        return resultados;
    } catch (error) {
        console.error('Error en el scraping: ', error);
        return [];
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});