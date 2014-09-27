var jsonxml = require('jsontoxml');

module.exports = Class(function() {
    var items = [];

    // item
    // var item = {
    //     attrs: {
    //         uid: 'uid',
    //         arg: 'arg',
    //         valid: 'no', // no
    //         autocomplete: 'autocomplete',
    //         type: 'fileicon' // ileicon, filetype
    //     },
    //     children: {
    //         title: 'title',
    //         subtitle: 'subtitle',
    //         icon: 'icon.png',
    //         icontype: 'fileicon', // fileicon, filetype
    //     }
    // };

    return {
        init: function(options) {
            options = options || {};
            this.emptyMsg = options.emptyMsg || '没有结果返回';
        },
        addItem: function(item) {
            if (item.icontype) {
                item.attrs = item.attrs || {};
                item.attr.type = item.icontype;
            }
            items.push(item);
        },
        clean: function() {
            items = [];
        },
        isEmpty: function() {
            return items.length == 0 ? true : false;
        },
        toXML: function() {
            var output = '';
            if (this.isEmpty()) {
                items.push({
                    title: this.emptyMsg
                });
            }
            output = jsonxml({
                items: items.map(function(item) {
                    return {
                        name: 'item',
                        attrs: item.attrs,
                        children: item.children
                    };
                })
            }, {
                escape: true,
                xmlHeader: true
            });
            return output;
        },
        output: function() {
            console.log(this.toXML());
        }
    }
});
