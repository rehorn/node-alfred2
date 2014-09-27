/**
 * 动态创建一个类
 * 提供了继承、扩展、调用父级别方法等方法
 * @return {[type]} [description]
 */
global.Class = function(prop, superCls) {
    'use strict';
    var cls = function() {
        function T(args) {
            for (var name in cls.__prop) {
                var val = cls.__prop[name];
                this[name] = isObject(val) ? extend({}, val) : val;
            }
            //自动执行init方法
            if (isFunction(this.init)) {
                //获取init返回值，如果返回一个promise，可以让后续执行在then之后
                this.__initReturn = this.init.apply(this, args);
            }
            return this;
        }
        T.prototype = cls.prototype;
        T.constructor = cls;
        return new T(arguments);
    };
    //类的属性，不放在原型上，实例化的时候调用
    cls.__prop = {};
    cls.extend = function(prop) {
        if (isFunction(prop)) {
            prop = prop();
        }
        if (isObject(prop)) {
            for (var name in prop) {
                var val = prop[name];
                if (isFunction(val)) {
                    this.prototype[name] = val;
                } else {
                    cls.__prop[name] = isObject(val) ? extend({}, val) : val;
                }
            }
        }
        return this;
    };
    cls.inherits = function(superCls) {
        util.inherits(this, superCls);
        //将父级的属性复制到当前类上
        extend(cls.__prop, superCls.__prop);
        return this;
    };
    if (superCls === true && isFunction(prop)) {
        superCls = prop;
        prop = undefined;
    }
    if (isFunction(superCls)) {
        cls.inherits(superCls);
    }
    //调用父级方法
    cls.prototype.super = cls.prototype.super_ = function(name, data) {
        //如果当前类没有这个方法，则直接返回。
        //用于在a方法调用父级的b方法
        if (!this[name]) {
            this.super_c = null;
            return;
        }
        var super_ = this.super_c ? this.super_c.super_ : this.constructor.super_;
        if (!super_) {
            this.super_c = null;
            return;
        }
        //如果父级没有这个方法，那么直接返回
        if (!isFunction(super_.prototype[name])) {
            this.super_c = null;
            return;
        }
        while (this[name] === super_.prototype[name] && super_.super_) {
            super_ = super_.super_;
        }
        this.super_c = super_;
        if (!this.super_t) {
            this.super_t = 1;
        }
        //如果参数不是数组，自动转为数组
        if (!isArray(data)) {
            data = arguments.length === 1 ? [] : [data];
        }
        var t = ++this.super_t;
        var method = super_.prototype[name];
        var ret;
        switch (data.length) {
            case 0:
                ret = method.call(this);
                break;
            case 1:
                ret = method.call(this, data[0]);
                break;
            case 2:
                ret = method.call(this, data[0], data[1]);
                break;
            default:
                ret = method.apply(this, data);
        }
        if (t === this.super_t) {
            this.super_c = null;
            this.super_t = 0;
        }
        return ret;
    };
    if (prop) {
        cls.extend(prop);
    }
    return cls;
};

global.extend = function() {
    'use strict';
    var args = [].slice.call(arguments);
    var deep = true;
    var target = args.shift();
    if (isBoolean(target)) {
        deep = target;
        target = args.shift();
    }
    target = target || {};
    var length = args.length;
    var options, name, src, copy, copyAsArray, clone;
    for (var i = 0; i < length; i++) {
        options = args[i] || {};
        if (isFunction(options)) {
            options = options();
        }
        for (name in options) {
            src = target[name];
            copy = options[name];
            if (src === copy) {
                continue;
            }
            if (deep && copy && (isObject(copy) || (copyAsArray = isArray(copy)))) {
                if (copyAsArray) {
                    copyAsArray = false;
                    clone = src && isArray(src) ? src : [];
                } else {
                    clone = src && isObject(src) ? src : {};
                }
                target[name] = extend(deep, clone, copy);
            } else if (copy !== undefined) {
                target[name] = copy;
            }
        }
    }
    return target;
};


var toString = Object.prototype.toString;

global.isBoolean = function(obj) {
    return toString.call(obj) === '[object Boolean]';
};

global.isNumber = function(obj) {
    'use strict';
    return toString.call(obj) === '[object Number]';
};

global.isObject = function(obj) {
    if (isBuffer(obj)) {
        return false;
    }
    return toString.call(obj) === '[object Object]';
};

global.isString = function(obj) {
    return toString.call(obj) === '[object String]';
};

global.isFunction = function(obj) {
    return typeof obj === 'function';
};

global.isEmpty = function(obj) {
    if (isObject(obj)) {
        var key;
        for (key in obj) {
            return false;
        }
        return true;
    } else if (isArray(obj)) {
        return obj.length === 0;
    } else if (isString(obj)) {
        return obj.length === 0;
    } else if (isNumber(obj)) {
        return obj === 0;
    } else if (obj === null || obj === undefined) {
        return true;
    } else if (isBoolean(obj)) {
        return !obj;
    }
    return false;
};

global.isArray = Array.isArray;
global.isBuffer = Buffer.isBuffer;
