import customTitlebar = require('custom-electron-titlebar');
import { ipcRenderer, shell, remote, IpcRendererEvent, BrowserWindow, } from 'electron';
import * as markdownRenderer from 'markdown-it';
import * as fs from 'fs';

var titleBar: customTitlebar.Titlebar;
var openFilePath: string = null;
var fileIsOpen: boolean = false;
var theme: string;
const DraftVersion = '0.4.0';

//#region Color Variables.
const dark_TitlebarColor = '#1E1E1E';
const dark_TextAreaPadColor = '#242424';
const dark_TextColor = '#f5f5f5';
const dark_scrollbarColor = '#30302f';
const dark_scrollbarHover = '#2e2e2d';

const light_TitlebarColor = '#e6e6e6';
const light_TextAreaPadColor = '#f5f5f5';
const light_TextColor = '#0a0a0a';
const light_scrollbarColor = '#dad7d7';
const light_scrollbarHover = '#cac8c8';

const monokai_TitlebarColor = '#1e1f1c';
const monokai_TextAreaPadColor = '#272822';
const monokai_TextColor = '#f6f8ef';
const monokai_scrollbarColor = '#27291f';
const monokai_scrollbarHover = '#24271d';
//#endregion

ipcRenderer.on('create-titlebar', () => {
    const window = remote.getCurrentWindow();
    // Set the Save, Open and Close file shortcuts.
    remote.globalShortcut.register("CommandOrControl+O", () => {
        if (window.isMinimized() == false && window.isFocused() == true) openFile();
        else return;
    });
    remote.globalShortcut.register("CommandOrControl+S", () => {
        if (window.isMinimized() == false && window.isFocused() == true) saveFile();
        else return;
    });
    remote.globalShortcut.register('CommandOrControl+Shift+S', () => {
        if (window.isMinimized() == false && window.isFocused() == true) saveFile('Save As');
        else return;
    });
    remote.globalShortcut.register('CommandOrControl+W', () => {
        if (window.isMinimized() == false && window.isFocused() == true) closeFile();
        else return;
    });
    // Set the close window shortcut.
    remote.globalShortcut.register('Alt+F4', () => {
        if (window.isMinimized() == false && window.isFocused() == true) process.exit(0);
        else return;
    });
    // Set the rendering shortcut.
    remote.globalShortcut.register("CommandOrControl+Shift+R", () => {
        if (window.isMinimized() == false && window.isFocused() == true) renderFile();
        else return;
    });
    theme = localStorage.getItem('Theme');
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
                label: 'Close File',
                accelerator: 'CmdOrCtrl+W',
                click: () => closeFile()
            },
            {
                label: 'Exit',
                accelerator: 'Alt+F4',
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
                        detail: `This is Draft running v${DraftVersion} using\nElectron: v${process.versions.electron}\nNodeJS: v${process.versions.node}`,
                        checkboxLabel: 'Get support',
                        checkboxChecked: false,
                        type: 'info',
                        noLink: false,
                    };
                    remote.dialog.showMessageBox(appWindow, options).then((response) => {
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
                        checked: theme == 'System' || null || undefined,
                        click: () => updateTheme('System')
                    },
                    {
                        label: 'Dark',
                        type: 'radio',
                        checked: theme == 'Dark',
                        click: () => updateTheme('Dark')
                    },
                    {
                        label: 'Light',
                        type: 'radio',
                        checked: theme == 'Light',
                        click: () => updateTheme('Light')
                    },
                    {
                        label: 'Monokai',
                        type: 'radio',
                        checked: theme == 'Monokai',
                        click: () => updateTheme('Monokai')
                    }
                ]
            },
            {
                label: 'Settings',
                type: 'normal',
                click: (menuItem, appWindow, keyboardEvent) => {
                    openSettings(menuItem, theme);
                }
            }
        ]
    }));
    //console.log(process.argv);
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
                    extensions: ['pad', 'txt', 'md', '*']
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
                extensions: ['pad', 'txt', 'md', '*']
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
 * Closes a file if  open.
 */
function closeFile() {
    if (fileIsOpen) {
        (document.getElementById("pad") as HTMLInputElement).value = "";
        titleBar.updateTitle('Draft');
        fileIsOpen = false;
    }
}

/**
 * Renders markdown and shows the result in a new window.
 */
function renderFile() {
    // if (navigator.onLine) {
    //     // Communicate with GitHub's API to render GFM (GitHub Flavored markdown)
    // } else offlineRender();
    offlineRender(); // For now, we'll just render it using local files.
}

function offlineRender() {
    const directory = __dirname;
    let renderer: markdownRenderer;
    renderer = new markdownRenderer({
        breaks: true,
        html: false, // Disabled at the moment because of internal tags created at core.
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
    var result = '<html>\n\t<head>\n'
        + '\t\t<link rel="stylesheet" href="../src/styles/lib/andyferra_github.css" />\n'
        + '\t</head>\n\t<body>\n\t\t'
        + renderer.render((document.getElementById('pad') as HTMLInputElement).value)
        + '\n\t</body>\n</html>';
    
    fs.writeFileSync(directory + '/render.html', result, { encoding: 'utf-8' });    
    rendererWindow.webContents.loadFile(directory + '/render.html');
    rendererWindow.on('close', () => fs.unlink(directory + '/render.html', (err) => {}));
}

/**
 * Updates the theme and style of the app.
 * @param themeName The name of the theme to set, if it is not valid/provided,
 * it defaults back to the system prefered theme.
 */
function updateTheme(themeName: string = 'System') {
    // Get required values before anything else.
    let themeManager = document.getElementById('theme');
    let pad = document.getElementById('pad');
    switch (themeName) {
        case 'System':
            if (remote.nativeTheme.shouldUseDarkColors) updateTheme('Dark');
            else updateTheme('Light');
            break;

        case 'Dark':
            themeManager.setAttribute('href', '../styles/themes/main/dark.css');
            titleBar.updateBackground(customTitlebar.Color.fromHex(dark_TitlebarColor));
            pad.removeAttribute('style'); // *
            remote.nativeTheme.themeSource = 'dark';
            break;

        case 'Light':
            document.getElementById('theme').setAttribute('href', '../styles/themes/main/light.css');
            titleBar.updateBackground(customTitlebar.Color.fromHex(light_TitlebarColor));
            document.getElementById('pad').removeAttribute('style'); // *
            remote.nativeTheme.themeSource = 'light';
            break;

        case 'Monkai': // For backwards support, will be removed soon.
        case 'Monokai':
            themeManager.setAttribute('href', '../styles/themes/main/monokai.css');
            titleBar.updateBackground(customTitlebar.Color.fromHex(monokai_TitlebarColor));
            pad.removeAttribute('style'); // *
            remote.nativeTheme.themeSource = 'dark';
            break;

        default:
            alert('Something went wrong on function applyTheme\nPlease report to the developer.\ncodename: ' + themeName);
            throw new Error('Invalid theme name.');
    }
    theme = themeName;
    localStorage.setItem('Theme', themeName);
    // * This is because there is an attribute within the textArea
    //   tag which has to be removed because the css file cannot
    //   override it without removing that property/attribute.
}
function translateTitleBarThemeColor(themeName: string) {
    switch (themeName) {
        case 'System':
            if (remote.nativeTheme.shouldUseDarkColors) return dark_TitlebarColor;
            else return light_TitlebarColor;
        case 'Light':
            return light_TitlebarColor;
        case 'Dark':
            return dark_TitlebarColor;
        case 'Monokai':
            return monokai_TitlebarColor;
        default:
            alert('Something went wrong while translating color.\nPlease report to the developer.\ncodename: ' + themeName);
            throw new Error('Invalid theme name.');
    }
}

function openSettings(menuItem: Electron.MenuItem, currentTheme: string) {
    const settingsWindow = initializeWindow(currentTheme);
}

