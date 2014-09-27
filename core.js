var path = require('path');
var spawn = require('child_process').spawn;


var plist = require('plist');

var _bundleId;

exports.getBundleId = function() {
    if (_bundleId) {
        return _bundleId;
    }

    try {
        var plist = plist.parse(fs.readFileSync('./info.plist', 'utf8'));
        return plist.bundleid;
    } catch (e) {
        return '_alfred_no_bundle_id_';
    }
};

exports.decode = function(s) {
    //TODO gbk -> utf8
    return s;
};

exports.exit = function(msg, code) {
    if (msg) {
        console.log(msg);
    }
    process.exit(code);
};

exports.query = function(s) {
    var scpt = 'tell application "Alfred 2" to search "' + s + '"';
    spawn('osascript', ['-e', scpt]);
};
