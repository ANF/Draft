import customTitlebar = require('custom-electron-titlebar');
import { ipcRenderer, shell, remote, IpcRendererEvent, } from 'electron';
import * as markdownRenderer from 'markdown-it';
import * as fs from 'fs';

ipcRenderer.once('create-titlebar', () => {
    // Set the Save and Open file shortcuts.
    remote.globalShortcut.register("CommandOrControl+S", () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimized() == false && window.isFocused() == true) saveFile();
        else return;
    });
    remote.globalShortcut.register("CommandOrControl+O", () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimizable() == false && window.isFocused() == true) openFile();
        else return;
    });
    // Set the rendering shortcut.
    remote.globalShortcut.register("CommandOrControl+Shift+R", () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimizable() == false && window.isFocused() == true) renderFile();
        else return;
    });
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
                label: 'Render',
                accelerator: 'Ctrl+Shift+R',
                click: () => renderFile()
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
    console.log(process.argv);
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
        try{remote.app.addRecentDocument(file.filePath);}catch{}
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
        try{remote.app.addRecentDocument(file.filePaths[0]);}catch{}
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

function renderFile() {
    let renderer: markdownRenderer;
    renderer = new markdownRenderer({
        breaks: true,
        html: true,
        typographer: true,
        xhtmlOut: true,
    });
    let rendererWindow = new remote.BrowserWindow({
        darkTheme: true,
        minimizable: false,
        maximizable: true,
        icon: './src/images/favicon.ico',
        title: 'Markdown Render - ANFPad',
        webPreferences: {}
    });
    rendererWindow.removeMenu();
    var result = renderer.render((document.getElementById('pad') as HTMLInputElement).value);
    fs.writeFileSync('./render.html', result, {encoding: 'utf-8'});
    rendererWindow.loadFile('./render.html')
    rendererWindow.show();
}
