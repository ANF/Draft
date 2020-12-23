const path = require('path')

module.exports = {
  "packagerConfig": {
    "icon": path.join(__dirname, "src", "images", "favicon.ico"),
    //"platform": "linux" // Choices are 'darwin', 'mas', 'win32' or 'linux'
    //"arch": "arm64" // Choices are ia32, x64, armv7l, arm64
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "setupIcon": path.join(__dirname, "src", "images", "favicon.ico"),
        "iconUrl": "https://raw.githubusercontent.com/ANF-Studios/ANFPad/master/src/images/favicon.ico",
        "name": "ANFPad",
        "authors": "ANF-Studios",
        "description": "A simple application that manages all your notes.",
        "noMsi": "true",
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": ['darwin', 'linux'],
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ]
}