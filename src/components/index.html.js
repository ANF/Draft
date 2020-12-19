const { dialog, app, BrowserWindow, Menu } = require('electron').remote;
const fs = require('fs');

function checkForCommands(event) {
    if (event.ctrlKey && event.key == "s") {
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
        }).then((file) => {
            // Add the selected file to the recent documents in the taskbar menu.
            app.addRecentDocument(file.filePath.toString());
            // Stating whether dialog operation was cancelled or not.
            if (!file.canceled) {
                // Creating and writing the file.
                fs.writeFile(file.filePath,
                    (document.getElementById("pad")).value,
                    function (err) {
                        if (err) {
                            alert(err);
                            throw err;
                        }
                    });
            }
        }).catch((err) => {
            alert(err);
            throw err;
        });
    }
    if (event.ctrlKey && event.key == "o") {
        dialog.showOpenDialog({
            title: 'Open',
            defaultPath: app.getPath('documents'),
            buttonLabel: 'Open',
            // Restricting the user to only Text Files.
            filters: [
                {
                    name: 'Text Documents',
                    extensions: ['pad', 'txt', 'md']
                },],
            properties: ['openFile']
        }).then((file) => {
            // Add the selected file to the recent documents in the taskbar menu.
            app.addRecentDocument(file.filePaths.toString());
            // Stating whether dialog operation was cancelled or not.
            if (!file.canceled) {
                // Reading the file and setting the value.
                fs.readFile(file.filePaths.toString(), 'utf8', function (err, data) {
                    if (err) {
                        alert(err);
                        throw err;
                    }
                    document.getElementById("pad").value = data;
                });
            }
        }).catch((err) => {
            alert(err);
            throw err;
        });
    }
    // This is the secret easter egg 👀
    if (event.shiftKey && event.altKey && event.keyCode == 65) {
        var EasterWindow = new BrowserWindow(({
            height: 400,
            width: 400,
            minHeight: 400,
            minWidth: 400,
            icon: './src/images/favicon.ico',
            title: 'You found the easter egg! - ANFPad',
            fullscreen: false,
            resizable: false,
            fullscreenable: false,
            minimizable: false,
            maximizable: false,
            webPreferences: {
                devTools: false,
            }
        }));
        EasterWindow.setMenu(new Menu());
        EasterWindow.loadFile('./src/pages/easter.html');
        EasterWindow.show();
    }
}
