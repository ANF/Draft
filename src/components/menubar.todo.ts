/**
 * Author: @ANF-Studios
 * Work on the menu bar.
 */

/*
const electron = require('electron').remote, dialog = electron.dialog, app = electron.app;
import fs = require('fs');

const menu = new electron.Menu();
menu.append(new electron.MenuItem({
    label: 'File',
    role: 'fileMenu',
    submenu: [
        //#region Save
        {
            label: 'Save',
            click: () => saveFile()
        }
        //#endregion
    ]
}));
electron.mainWindow.setMenu(menu);

function saveFile() {
    dialog.showSaveDialog({
        title: 'Save',
        defaultPath: app.getPath('documents'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {
                name: 'Text Documents',
                extensions: ['pad', 'txt', 'md']
            },
        ],
        properties: []
    }).then((file: Electron.SaveDialogReturnValue) => {
        // Add the selected file to the recent documents in the taskbar menu.
        app.addRecentDocument(file.filePath.toString());
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {
            // Creating and writing the file.
            fs.writeFile(file.filePath,
                (document.getElementById("pad") as HTMLInputElement).value,
                function (err) {
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
*/