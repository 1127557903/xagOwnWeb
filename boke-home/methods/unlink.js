const path = require('path')
const fs = require('fs')
const unlinkfile = {
    noName: function (file) {
        let fileName = file.destination + '/' +file.filename
        fs.unlink(fileName,function(e){})
    },
    hadName: function unlinkfile (file) {
        let fileName = 'public' + file
        fs.unlink(fileName,function(e){})
    }
}

module.exports = unlinkfile