var path = require('path');
var fs = require('fs');

var config = require('./config');
var util = require('./util');
var core = require('./core');
var rimraf = require('rimraf');

// data example
// { 'expire' : 0, name: '', data' : {} }
var defExpire = 60 * 60 * 24;

var configBase = config.getConfigBase();
var cacheBase = config.getConfigBase();
var cacheDir = path.join(configBase, core.getBundleId());

function getFilePath(name) {
    if (!util.existsSync(cacheDir)) {
        util.mkdirpSync(cacheDir);
    }
    return path.join(cacheDir, name + '.js');
};

function save(name, cacheContent) {
    var cachePath = getFilePath(name);
    var str = 'module.exports=' + JSON.stringify(cacheContent, null, 4);
    fs.writeFile(cachePath, str, function(err) {
        if (err) throw err;
    });
}

exports.getContent = function(name) {
    var cacheContent = {};
    var cachePath = getFilePath(name);
    try {
        cacheContent = require(cachePath);
    } catch (e) {};
    return cacheContent;
};

exports.set = function(name, data, expire, file) {
    var cacheContent = {
        expire: +new Date() + (expire || defExpire),
        name: name,
        data: data
    };
    save(name, cacheContent);
};

exports.get = function(name) {
    var data = {};
    var cacheContent = exports.getContent();
    if (cacheContent.expire > +new Date()) {
        return cacheContent.data;
    }
    return data;
};

exports.delete = function(name) {
    var cachePath = getFilePath(name);
    if (util.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
    }
};

exports.clean = function() {
    if (util.existsSync(cacheDir)) {
        rimraf(cacheDir);
    }
};

exports.timeout = function(name) {
    var cacheContent = exports.getContent();
    var now = +new Date();
    if (cacheContent.expire >= now) {
        return cacheContent.expire - now;
    }
    return -1;
};
