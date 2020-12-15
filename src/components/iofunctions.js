//var dialog = require('electron').remote
const dialog = require('electron').dialog
const fs = require('fs')
const path = require('path')

function checkForCommands() {
    if (event.ctrlKey && event.key == "s") {
        fs.writeFile("./Documents.pad", document.getElementById("pad").value, function (err) {
            if (err) {
                alert(err);
                throw err;
            }
        });
    }

    if (event.ctrlKey && event.key == "o") {
        fs.readFile("./Documents.pad", function (err, data) {
            if (err) {
                alert(err);
                throw err;
            }
            document.getElementById("pad").value = data;
        });
    }
}

/*
const dialogPopup = electron.dialog;
  console.log(document.getElementById("pad").value)
  dialogPopup.showSaveDialog().then(file => {
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
  });}

function ctrlSPressed() {
    if (event.ctrlKey && event.key == "s") {
        console.log(document.getElementById("pad").value)
        dialog.showSaveDialog().then(file => {
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


function ctrlSPressed() {
    if (event.ctrlKey && event.key == "s") {
        console.log(document.getElementById("pad").value)
        electron.dialog.showSaveDialog({
            title: 'Save the pad as a file.',
            defaultPath: `${homedir}/Documents`,
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
}*/