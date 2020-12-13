//var dialog = require('electron').remote
const dialog = require('electron').dialog
const fs = require('fs')
const path = require('path')
const documents = require('os').homedir()

function ctrlSPressed() {
    if (event.ctrlKey && event.key == "s") {
        console.log(document.getElementById("pad").value)
        electron.dialog.showSaveDialog({
            title: 'Save the pad as a file.',
            defaultPath: `${documents}/Documents`,
            buttonLabel: 'Save',
            // Restricting the user to only Text Files. 
            filters: [
                {
                    name: 'Text Files',
                    extensions: ['pad', 'txt']
                },],
            properties: []
        }).then(file => {
            // Stating whether dialog operation was cancelled or not.
            if (!file.canceled) {
                console.log(file.filePath.toString());

                // Creating and Writing to the sample.txt file 
                fs.writeFile(file.filePath.toString(),
                    'This is a Sample File', function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
            }
        }).catch(err => {
            console.log(err)
        });
    }
}
