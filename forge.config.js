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
        "iconUrl": "https://raw.githubusercontent.com/ANF-Studios/Draft/master/src/images/favicon.ico",
        "name": "Draft",
        "authors": "ANF-Studios",
        "description": "A simple application that manages all your notes.",
        "noMsi": "true",
      }
    },
    {
      "name": "@electron-forge/maker-deb",
      "platforms": ['darwin', 'linux'],
      "config": {
        "options": {
          "name": "Draft",
          "icon": path.join(__dirname, "src", "images", "favicon.ico")
        }
      }
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