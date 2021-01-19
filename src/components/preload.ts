import customTitlebar = require('custom-electron-titlebar');
import { ipcRenderer, shell, remote, IpcRendererEvent, app, } from 'electron';
import * as markdownRenderer from 'markdown-it';
import * as fs from 'fs';

var titleBar: customTitlebar.Titlebar;
var openFilePath: string = null;
var fileIsOpen: boolean = false;

//#region Color Variables.
const dark_TitlebarColor = '#1E1E1E';
const dark_TextAreaPadColor = '#242424';
const dark_TextColor = '#f5f5f5';

const light_TitlebarColor = '#e6e6e6';
const light_TextAreaPadColor = '#f5f5f5';
const light_TextColor = '#0a0a0a';

const monkai_TitlebarColor = '#272822';
const monkai_TextAreaPadColor = '#2f3128';
const monkai_TextColor = '#f6f8ef';
//#endregion

ipcRenderer.on('create-titlebar', () => {
    // Set the Save and Open file shortcuts.
    remote.globalShortcut.register("CommandOrControl+O", () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimizable() == false && window.isFocused() == true) openFile();
        else return;
    });
    remote.globalShortcut.register("CommandOrControl+S", () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimized() == false && window.isFocused() == true) saveFile();
        else return;
    });
    remote.globalShortcut.register('CommandOrControl+Shift+S', () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimized() == false && window.isFocused() == true) saveFile('Save As');
        else return;
    })
    // Set the rendering shortcut.
    remote.globalShortcut.register("CommandOrControl+Shift+R", () => {
        var window = remote.getCurrentWindow();
        if (window.isMinimized() == false && window.isFocused() == true) renderFile();
        else return;
    });
    const menu = new remote.Menu();
    menu.append(new remote.MenuItem({
        label: 'File',
        role: 'fileMenu',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => openFile()
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => saveFile()
            },
            {
                label: 'Save As',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => saveFile()
            },
            {
                label: 'Render',
                accelerator: 'CmdOrCtrl+Shift+R',
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
                        title: 'Help - Draft',
                        message: 'Thank you for using Draft',
                        detail: `This is Draft running v0.4.0 using\nElectron: v${process.versions.electron}\nNodeJS: v${process.versions.node}`,
                        checkboxLabel: 'Get support',
                        checkboxChecked: false,
                        type: 'info',
                        noLink: false,
                    };
                    remote.dialog.showMessageBox(remote.getCurrentWindow(), options).then((response) => {
                        if (response.checkboxChecked) shell.openExternal('https://github.com/ANF-Studios/Draft#further-help');
                    }).catch((err) => { alert(err); throw err; });
                },
            },
            {
                label: 'Themes',
                type: 'submenu',
                submenu: [
                    {
                        label: 'System',
                        type: 'radio',
                        click: () => updateTheme('System')
                    },
                    {
                        label: 'Dark',
                        type: 'radio',
                        click: () => updateTheme('Dark')
                    },
                    {
                        label: 'Light',
                        type: 'radio',
                        click: () => updateTheme('Light')
                    },
                    {
                        label: 'Monkai',
                        type: 'radio',
                        click: () => updateTheme('Monkai')
                    }
                ]
            }
        ]
    }));
    console.log(process.argv);
    let theme: string;
    try {
        if (fs.existsSync('./theme.data')) fs.readFile('./theme.data', (err, data) => {
            if (err) { alert(err); throw (err); } theme = data.toString();
        }); //theme = JSON.parse(fs.readFileSync('./config.json').toString());
        else theme = null;
    } catch {
        fs.unlink('./theme.data', (err) => {
            if (err) { alert(err); throw (err); }
        });
        alert("There was an error in parsing the settings, settings are reverted to default.");
    }
    titleBar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#1E1E1E'),
        icon: '../images/favicon.ico',
        menu: menu,
    });
    // Update the theme according to the previously
    // used theme or system if the former is not defined.
    updateTheme(theme || 'System');
});

// This part of the code adds an asterisk to the beginning,
// this indicates that the file is unsaved.
document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (openFilePath !== null) {
        fs.readFile(openFilePath, (err, data) => {
            if (err) { alert(err); throw (err); }
            if ((document.getElementById("pad") as HTMLInputElement).value !== data.toString()) {
                titleBar.updateTitle(`*${openFilePath.replace(/^.*[\\\/]/, '')} - Draft`);
            };
        });
    }
});

ipcRenderer.on('load-text', (event: IpcRendererEvent, data: Buffer) =>
    (document.getElementById("pad") as HTMLInputElement).value = data.toString());

/**
* Saves a file to a sepcified directory.
*/
function saveFile(savePrompt: string = 'Save') {
    if (fileIsOpen == true) {
        fs.writeFile(openFilePath,
            (document.getElementById("pad") as HTMLInputElement).value,
            (err) => {
                if (err) { alert(err); throw (err); }
            });
        titleBar.updateTitle(`${openFilePath?.replace(/^.*[\\\/]/, '')} - Draft`);
    }
    else {
        remote.dialog.showSaveDialog({
            title: savePrompt,
            defaultPath: remote.app.getPath('documents'),
            buttonLabel: savePrompt,
            // Restricting the user to only Text Files.
            filters: [
                {
                    name: 'Text Documents',
                    extensions: ['pad', 'txt', 'md']
                },],
            properties: []
        }).then((file) => {
            // Add the selected file to the recent documents in the taskbar menu.
            try { remote.app.addRecentDocument(file.filePath); } catch { }
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
                openFilePath = file.filePath.toString();
                titleBar.updateTitle(`${file.filePath.replace(/^.*[\\\/]/, '')} - Draft`);
            }
        }).catch((err: NodeJS.ErrnoException) => {
            alert(err);
            throw err;
        });
    }
}

/**
 * Opens a file from the local drive.
 */
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
        try { remote.app.addRecentDocument(file.filePaths[0]); } catch { }
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {
            // Reading the file and setting the value.
            fs.readFile(file.filePaths.toString(), 'utf8', function (err, data) {
                if (err) {
                    alert(err);
                    throw err;
                }
                (document.getElementById("pad") as HTMLInputElement).value = data;
                // Change the title bar to `${fileName} - ${applicationName}`,
                titleBar.updateTitle(`${file.filePaths[0].replace(/^.*[\\\/]/, '')} - Draft`);
                // Set the opened file path for later use.
                openFilePath = file.filePaths[0].toString();
                // And set the fileIsOpen bool to true.
                fileIsOpen = true;
            });
        }
    }).catch((err: NodeJS.ErrnoException) => {
        alert(err);
        throw err;
    });
}

/**
 * Renders markdown and shows the result in a new window.
 */
function renderFile() {
    let renderer: markdownRenderer;
    renderer = new markdownRenderer({
        breaks: true,
        html: true,
        linkify: true,
        typographer: true,
        xhtmlOut: true,
    });
    let rendererWindow = new remote.BrowserWindow({
        darkTheme: false,
        minimizable: false,
        maximizable: true,
        icon: './src/images/favicon.ico',
        title: 'Markdown Render - Draft',
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    });
    rendererWindow.removeMenu();
    var result = renderer.render((document.getElementById('pad') as HTMLInputElement).value);
    // In final production, relative directories change causing a mess.
    // This is why it writes somewhere else and reads elsewhere.
    fs.writeFileSync('./resources/app/render.html', result, { encoding: 'utf-8' });    
    rendererWindow.webContents.loadFile('./render.html');
    rendererWindow.on('close', () => fs.unlink('./render.html', (err) => {}));
}

/**
 * Updates the theme and style of the app.
 * @param themeName The name of the theme to set, if it is not valid/provided,
 * it defaults back to the system prefered theme.
 */
function updateTheme(themeName: string = 'System') {
    switch (themeName) {
        case 'System':
            if (remote.nativeTheme.shouldUseDarkColors) updateTheme('Dark');
            else updateTheme('Light');
            break;

        case 'Dark':
            document.body.style.backgroundColor = dark_TextAreaPadColor;
            remote.nativeTheme.themeSource = 'dark';
            var pad = document.getElementById('pad');
            pad.style.backgroundColor = dark_TextAreaPadColor;
            pad.style.color = dark_TextColor;
            titleBar.updateBackground(customTitlebar.Color.fromHex(dark_TitlebarColor));
            break;

        case 'Light':
            document.body.style.backgroundColor = light_TextAreaPadColor;
            remote.nativeTheme.themeSource = 'light';
            var pad = document.getElementById('pad');
            pad.style.backgroundColor = light_TextAreaPadColor;
            pad.style.color = light_TextColor;
            titleBar.updateBackground(customTitlebar.Color.fromHex(light_TitlebarColor));
            break;

        case 'Monkai':
            document.body.style.backgroundColor = monkai_TextAreaPadColor;
            remote.nativeTheme.themeSource = 'dark';
            var pad = document.getElementById('pad');
            pad.style.backgroundColor = monkai_TextAreaPadColor;
            pad.style.color = monkai_TextColor;
            titleBar.updateBackground(customTitlebar.Color.fromHex(monkai_TitlebarColor));
            break;

        default:
            alert('Something went wrong on function applyTheme\nPlease report to the developer.');
            throw new Error('Invalid theme name.');
    }
    fs.writeFile('./theme.data',
        themeName,
        (err) => { if (err) { alert(err); throw (err); } });
}
