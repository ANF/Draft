/*
const { dialog, app } = require('electron').remote;
const fs = require('fs');

var saveFile = () => {
    dialog.showSaveDialog({
        title: 'Save',
        defaultPath: app.getPath('documents'),
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
        app.addRecentDocument(file.filePath);
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {
            // Creating and writing the file.
            fs.writeFile(file.filePath.toString(),
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

var openFile = () => {
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
        app.addRecentDocument(file.filePath);
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
*/