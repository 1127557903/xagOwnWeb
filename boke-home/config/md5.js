const crypto = require('crypto');
const MD5_STR = require('./jwtpass')
function md5(str) {
    let obj = crypto.createHash('md5');
    obj.update(str + MD5_STR);
    return obj.digest('hex')
}
module.exports = md5