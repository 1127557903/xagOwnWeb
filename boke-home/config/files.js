const path = require('path')
const fs = require('fs')
function uploadfile (file,exts) {
    var ext = ''
    if(exts){
        ext = exts
    } else {
        ext = path.parse(file.originalname).ext
    }
    let fileName = file.destination + '/' +file.filename+ext
    let dbFilename = fileName.replace('public','')
    fs.rename(file.path,fileName,err=>{})
    return dbFilename
}

module.exports = uploadfile