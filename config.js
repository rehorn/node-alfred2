var path = require('path');
var fs = require('fs');

var _configBase = path.normalize('~/Library/Application Support/Alfred 2/Workflow Data/');
var _cacheBase = path.normalize('~/Library/Caches/com.runningwithcrayons.Alfred-2/Workflow Data/');
var _logBase = path.normalize('~/Library/Logs/Alfred 2');
var _storageBase = '/tmp/Alfred 2';

var core = require('./core');
var util = require('./util');

function getFilePath() {
    var configDir = path.join(_configBase, core.getBundleId());
    if (!util.existsSync(configDir)) {
        util.mkdirpSync(configDir);
    }
    return path.join(configDir, 'config.js');
};

function save(configs) {
    var configPath = getFilePath;
    var str = 'module.exports=' + JSON.stringify(configs, null, 4);
    fs.writeFile(configPath, str, function(err) {
        if (err) throw err;
    });
};

exports.getConfigBase = function() {
    return _configBase;
};

exports.getCacheBase = function() {
    return _cacheBase;
};

exports.getLogBase = function() {
    return _logBase;
};

exports.getStorageBase = function() {
    return _storageBase;
};

exports.getAll = function() {
    var configs = {};
    var configPath = getFilePath();
    try {
        configs = require(configPath);
    } catch (e) {};
    return configs;
};

exports.get = function(key, def) {
    return exports.getAll()[key] || def;
};

exports.set = function(key, val) {
    var configs = exports.getAll();
    configs[key] = val;
    save(configs);
};

exports.delete = function() {
    var configs = exports.getAll();
    delete configs[key];
    save(configs);
};

exports.clean = function() {
    var configPath = getFilePath();
    if (util.existsSync(configPath)) {
        fs.unlinkSync(configPath);
    }
};
