var fs = require('fs'),
    path = require('path');

var win32 = process.platform === 'win32',
    windowsDriveRegExp = /^[a-zA-Z]\:\/$/,
    pathSeparatorRe = /[\/\\]/g;

var pathExists = fs.exists || path.exists;
var existsSync = fs.existsSync || path.existsSync;

exports.exists = existsSync;

exports.isFile = function(filepath) {
    return existsSync(filepath) && fs.statSync(filepath).isFile();
};

exports.isDerectory = function(filepath) {
    return existsSync(filepath) && fs.statSync(filepath).isDirectory();
};

exports.mkdirpSync = function(dirpath, mode) {
    if (mode == null) {
        mode = parseInt('0777', 8) & (~process.umask());
    }
    // reduce方法把列表中元素归结为一个简单的数值
    dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
        parts += path.join(part, path.sep);
        var subpath = path.resolve(parts);
        if (!existsSync(subpath)) {
            fs.mkdirSync(subpath, mode);
        }
        return parts;
    }, '');
};
