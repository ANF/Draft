import { app, BrowserWindow, Menu, MenuItem, nativeTheme, shell, ipcMain, ipcRenderer, globalShortcut } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

var mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 500,
    minHeight: 400,
    titleBarStyle: 'hidden',
    frame: false,
    icon: './src/images/favicon.ico',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      textAreasAreResizable: false,
      disableDialogs: false,
      preload: path.join(__dirname, 'preload.js'),
      //devTools: false,
    }
  });
  // Set the theme to dark mode.
  nativeTheme.themeSource = 'dark';
  
  // This part initializes the custom titlebar (and menubar).
  mainWindow.webContents.once('did-finish-load', () => mainWindow.webContents.send('create-titlebar'));

  // Disables the reload shortcut. The force reaload is for rendering.
  globalShortcut.register("CommandOrControl+R", () => { })

  //#region Right Click Actions
  mainWindow.webContents.on('context-menu', (event, params) => {
    const rightClick = new Menu();
    for (const suggestion of params.dictionarySuggestions) {
      rightClick.append(new MenuItem({
        label: suggestion,
        click: () => {
          mainWindow.webContents.replaceMisspelling(suggestion)
          rightClick.closePopup();
        }
      }))
    }

    /** TODO: Enable/Disable spell-check.
    rightClick.append(
      new MenuItem({
        label: 'Spell Check',
        type: 'checkbox',
        checked: true,
        click: (checked, BrowserWindow) => {
          if (checked) {  }
        }
      })
    );*/

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      rightClick.append(
        new MenuItem({
          label: 'Add to Dictionary',
          click: () => {
            mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord);
            rightClick.closePopup();
          }
        })
      )
    } else { return; }
    rightClick.popup();
  });
  //#endregion

  // load the index.html of the app and if the file has access and loads it.
  await mainWindow.loadFile('./src/pages/index.html');

  // and finally show the window.
  mainWindow.show();

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

//#region Event Handlers
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Note: This event only works on MacOS
app.on('open-file', (event, dir) => {
  // If invoked when the cancelable attribute
  // value is true, and while executing a
  // listener for the event with passive set
  // to false, signals to the operation that
  // caused event to be dispatched that it
  // needs to be canceled.
  event.preventDefault();
  // When a file is opened, the containing text is read
  // and is finally loaded into the html document.
  fs.readFile(dir, (err, data) => {
    if (err) {alert(err);throw(err);}
    // This part sends a message to the renderer process
    // to set the data (text) in the textarea to be displayed.
    mainWindow.webContents.send('load-text', data);
  });
});
//#endregion

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
