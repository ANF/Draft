import customTitlebar = require('custom-electron-titlebar');
import { ipcRenderer, shell, remote } from 'electron';
import { IpcRendererEvent } from 'electron/main';
import * as fs from 'fs';

ipcRenderer.once('create-titlebar', () => {
    //
    remote.globalShortcut.register("CommandOrControl+S", () => saveFile());
    remote.globalShortcut.register("CommandOrControl+O", () => openFile());
    const menu = new remote.Menu();
    menu.append(new remote.MenuItem({
        label: 'File',
        role: 'fileMenu',
        submenu: [
            {
                label: 'Save',
                accelerator: 'Ctrl+S',
                click: () => saveFile()
            },
            {
                label: 'Open',
                accelerator: 'Ctrl+O',
                click: () => openFile()
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit',
                role: 'close'
            }
        ]
    }));
    menu.append(new remote.MenuItem({
        label: 'Edit',
        role: 'editMenu'
    }));
    menu.append(new remote.MenuItem({
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    const options = {
                        defaultId: 2,
                        title: 'Help - ANFPad',
                        message: 'Thank you for using ANFPad',
                        detail: `This is ANFPad running v0.3.0 using\nElectron: v${process.versions.electron}\nNodeJS: v${process.versions.node}`,
                        checkboxLabel: 'Get support',
                        checkboxChecked: false,
                        type: 'info',
                        noLink: false,
                    };
                    remote.dialog.showMessageBox(remote.getCurrentWindow(), options).then((response) => {
                        if (response.checkboxChecked) shell.openExternal('https://github.com/ANF-Studios/ANFPad#further-help');
                    }).catch((err) => { alert(err); throw err; });
                }
            }
        ]
    }));
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#1E1E1E'),
        icon: '../images/favicon.ico',
        menu: menu,
    });
});

ipcRenderer.on('load-text', (event: IpcRendererEvent, data: Buffer) =>
    (document.getElementById("pad") as HTMLInputElement).value = data.toString());

function saveFile() {
    remote.dialog.showSaveDialog({
        title: 'Save',
        defaultPath: remote.app.getPath('documents'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {
                name: 'Text Documents',
                extensions: ['pad', 'txt', 'md']
            },],
        properties: []
    }).then((file) => {
        // Add the selected file to the recent documents in the taskbar menu.
        remote.app.addRecentDocument(file.filePath);
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {
            // Creating and writing the file.
            fs.writeFile(file.filePath.toString(),
                (document.getElementById("pad") as HTMLInputElement).value,
                function (err: NodeJS.ErrnoException) {
                    if (err) {
                        alert(err);
                        throw err;
                    }
                });
        }
    }).catch((err: NodeJS.ErrnoException) => {
        alert(err);
        throw err;
    });
}

function openFile() {
    remote.dialog.showOpenDialog({
        title: 'Open',
        defaultPath: remote.app.getPath('documents'),
        buttonLabel: 'Open',
        // Restricting the user to only Text Files.
        filters: [
            {
                name: 'Text Documents',
                extensions: ['pad', 'txt', 'md']
            },],
        properties: ['openFile']
    }).then((file: Electron.OpenDialogReturnValue) => {
        // Add the selected file to the recent documents in the taskbar menu.
        remote.app.addRecentDocument(file.filePaths[0]);
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {
            // Reading the file and setting the value.
            fs.readFile(file.filePaths.toString(), 'utf8', function (err, data) {
                if (err) {
                    alert(err);
                    throw err;
                }
                (document.getElementById("pad") as HTMLInputElement).value = data;
            });
        }
    }).catch((err: NodeJS.ErrnoException) => {
        alert(err);
        throw err;
    });
}