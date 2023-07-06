"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Querystring = require("querystring");
var dot = require("dot-object");
var utilities_1 = require("../utilities");
var deepmerge = require("deepmerge");
var JSON6 = require('json-6');
/**
 * TODO: Functions
 *  dotPattern
 *  deep-diff
 * TODO: Other
 *  Document all functions
 *  Test cases for all functions
 */
/**
 * A bunch of helpers for working with objects
 */
var ObjectHelpers = /** @class */ (function () {
    function ObjectHelpers() {
    }
    ObjectHelpers._values = function (input) {
        try {
            if (typeof input !== 'object' || utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            return Object.values(input);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: values, Error:', err.message);
            return null;
        }
    };
    ObjectHelpers._keys = function (input) {
        try {
            if (typeof input !== 'object' || utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            return Object.keys(input);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: keys, Error:', err.message);
            return null;
        }
    };
    ObjectHelpers._entries = function (input) {
        try {
            if (typeof input !== 'object' || utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            return Object.entries(input);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: entries, Error:', err.message);
            return null;
        }
    };
    ObjectHelpers._get = function (context, path) {
        try {
            if (typeof path !== 'string') {
                throw new Error('Invalid arguments');
            }
            return dot.pick(path, context);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: get, Error:', err.message);
            return null;
        }
    };
    ObjectHelpers._merge = function () {
        try {
            var args = Array.from(arguments);
            var helper = args.pop();
            if (args.length < 2) {
                throw new Error('Invalid arguments');
            }
            return {}; //deepmerge(...args);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: entries, Error:', err.message);
            return null;
        }
    };
    ObjectHelpers._querystringify = function (input) {
        try {
            if (typeof input !== 'object' || input === null || utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            return Querystring.stringify(input);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: querystringify, Error:', err.message);
            return '';
        }
    };
    ObjectHelpers._listify = function (input) {
        try {
            if (!input || typeof input !== 'object') {
                throw new Error('Invalid arguments');
            }
            var json = JSON.stringify(input, null, 4);
            return json.replace(/^(?:\s*")(.*?)(?:": [{\[]$)/gim, '<li><strong>$1</strong>:<ul>')
                .replace(/^(?:\s*")(.*?)(?:": )(.*?),?$/gim, '<li><strong>$1</strong>: $2</li>')
                .replace(/^\s*((".*?")|(true)|(false)|(null)|(\d+)),?$/gim, '<li>$1</li>')
                .replace(/ +[{\[]$/gim, '<li><ul class="list-json">')
                .replace(/ +[}\]],?$/gim, '</ul></li>')
                .replace(/[{\[]$/gim, '<ul class="list-json">')
                .replace(/[}\]],?$/gim, '</ul>');
        }
        catch (err) {
            console.log('Bristles Error -> Helper: listify, Error:', err.message);
            return '';
        }
    };
    //TODO: Merge options
    ObjectHelpers._parse = function (value) {
        try {
            var helper = arguments[arguments.length - 1];
            if (!value || utilities_1.isOps(value)) {
                value = helper.fn ? helper.fn(this) : null;
            }
            switch (helper.hash.type || null) {
                case ('json'):
                    value = JSON6.parse(value);
                    break;
                case ('number'):
                    value = parseInt(value);
                    break;
                case ('boolean'):
                    value = Boolean(value);
                    break;
                case ('querystring'):
                    value = Querystring.parse(value);
                    break;
            }
            if (helper.hash.context) {
                var path = helper.hash.path || '@parsed';
                dot.set(path, value, helper.hash.context);
            }
            else {
                return value;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: parse, Error:', err.message);
        }
    };
    ObjectHelpers._extend = function () {
        try {
            var args = Array.from(arguments);
            var helper = args.pop();
            if (args.length === 0) {
                args.push({});
            }
            if (Object.keys(helper.hash).length > 0) {
                args.push(helper.hash);
            }
            var objArgs = args.filter(function (item) { return typeof item === 'object' && item !== null && !Array.isArray(item); });
            var output = deepmerge.all([{}].concat(objArgs), {
                arrayMerge: function (destinationArray, sourceArray, options) { return sourceArray; }
            });
            if (!helper.fn) {
                return output;
            }
            else {
                return helper.fn(output);
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: extend, Error:', err.message);
            return null;
        }
    };
    ObjectHelpers._o = function () {
        try {
            var helper = arguments[arguments.length - 1];
            return Object.assign({}, helper.hash || {});
        }
        catch (err) {
            console.log('Bristles Error -> Helper: o, Error:', err.message);
            return {};
        }
    };
    return ObjectHelpers;
}());
exports.default = ObjectHelpers;
//# sourceMappingURL=object.js.map