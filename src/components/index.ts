import { app, BrowserWindow, Menu, MenuItem, dialog, nativeTheme, remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

app.on('open-file', (event, path) => {
  if (fs.statSync(path)) (document.getElementById("pad") as HTMLInputElement).value = path;
  createWindow()
})

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 500,
    width: 800,
    icon: './src/images/favicon.ico',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      textAreasAreResizable: false,
      disableDialogs: false,
      preload: 'preload.ts'
      //devTools: false,
    }
  });
  nativeTheme.themeSource = 'light';
  mainWindow.setMenu(null);

  //#region Right Click Actions
  // Create a new menu and assign it (result: no menu),
  //const appMenu = new Menu();
  //Menu.setApplicationMenu(appMenu);
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
  mainWindow.loadFile('./src/pages/index.html');

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
//#endregion

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

