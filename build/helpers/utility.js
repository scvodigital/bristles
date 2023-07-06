"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("../utilities");
var html_attributes_map_1 = require("./html-attributes-map");
var JSON6 = require('json-6');
var SafeStringify = require('fast-safe-stringify');
/**
 * TODO:
 * CSV parse and unparse functions
 * Document all functions
 * Test cases for all functions
 * Installed fast-json-stringify but not implemented it yet
 */
/**
 * A bunch of helpers for working with odd stuff
 */
var UtilityHelpers = /** @class */ (function () {
    function UtilityHelpers() {
    }
    UtilityHelpers._json = function () {
        try {
            var helper = arguments[arguments.length - 1];
            var value = helper.hash.value || null;
            if (helper.fn) {
                var type = helper.hash.type || 'object';
                var block = helper.fn(this) || '';
                switch (type) {
                    case ('array'):
                        try {
                            value = JSON6.parse('[' + block + ']');
                        }
                        catch (err) {
                            throw new Error("Failed to parse json: " + err.message + "\n[\n" + block + "\n]\n");
                        }
                        break;
                    case ('object'):
                        try {
                            value = JSON6.parse('{' + block + '}');
                        }
                        catch (err) {
                            throw new Error("Failed to parse json: " + err.message + "\n{\n" + block + "\n}\n");
                        }
                        break;
                    case ('number'):
                        value = parseInt(block) || -1;
                        break;
                    case ('boolean'):
                        value = Boolean(block) || false;
                        break;
                    default:
                        value = block;
                }
            }
            if (helper.hash.key) {
                return SafeStringify(helper.hash.key) + ': ' + SafeStringify(value, null, 4);
            }
            else {
                return SafeStringify(value, null, 4);
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: json, Error:', err.message);
            return JSON.stringify({
                parseError: err.message
            }, null, 4);
        }
    };
    UtilityHelpers._typeof = function () {
        try {
            var args = Array.from(arguments);
            args.pop();
            if (Array.isArray(args[0])) {
                return 'array';
            }
            return typeof args[0];
        }
        catch (err) {
            console.log('Bristles Error -> Helper: getType, Error:', err.message);
            return;
        }
    };
    UtilityHelpers._coalesce = function () {
        try {
            var args = Array.from(arguments);
            var helper = args.pop();
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var arg = args_1[_i];
                if (typeof arg !== 'undefined' && arg !== null && arg !== '') {
                    return arg;
                }
            }
            if (helper.hash.empty) {
                return helper.hash.empty;
            }
            return '';
        }
        catch (err) {
            console.log('Bristles Error -> Helper: coalesce, Error:', err.message);
        }
    };
    UtilityHelpers._raw = function (options) {
        return options.fn(this);
    };
    UtilityHelpers._lookupMap = function () {
        try {
            var args = Array.from(arguments);
            var options = args.pop();
            var map = {};
            for (var _i = 0, _a = Object.entries(options.hash); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                var values = Array.isArray(value) ? value : [value];
                for (var _c = 0, values_1 = values; _c < values_1.length; _c++) {
                    var item = values_1[_c];
                    map[item] = key;
                }
            }
            if (args.length > 0) {
                var input = args[0];
                if (map.hasOwnProperty(input)) {
                    return map[input];
                }
                else if (args.length > 1) {
                    return args[1];
                }
                else {
                    return null;
                }
            }
            else {
                return map;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: lookup, Error:', err.message);
            return null;
        }
    };
    UtilityHelpers._once = function (key, context, options) {
        try {
            if (!Array.isArray(context.__once)) {
                context.__once = [];
            }
            else if (context.__once.includes(key)) {
                return options.inverse ? options.inverse(this) : '';
            }
            context.__once.push(key);
            return options.fn(this);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: once, Error:', err.message);
            return '';
        }
    };
    UtilityHelpers._partial = function (partial) {
        try {
            if (typeof partial !== 'function') {
                throw new Error('Invalid argument. Was expecting partial function');
            }
            var args = Array.from(arguments);
            var options = args.pop();
            var context = args[1] || this;
            var data = Object.assign(context, options.data, options.hash);
            var output = partial(data);
            return output;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: partial, Error:', err.message);
            return typeof partial === 'string' ? partial : '';
        }
    };
    UtilityHelpers._toHtmlAttributes = function (input) {
        var attributes = [];
        try {
            if (typeof input === 'string') {
                return input;
            }
            if (utilities_1.isOps(input)) {
                throw new Error('No input provided');
            }
            if (typeof input !== 'object' || Array.isArray(input)) {
                throw new Error('Invalid input type. Inputs must be an object or a string (for pass-through)');
            }
            var options = Array.from(arguments).pop();
            var ignore = options.hash.ignore || [];
            var tagName = options.hash.tagName || false;
            var booleanAttributes = [
                'async', 'autofocus', 'autoplay', 'checked', 'contenteditable', 'controls', 'default',
                'defer', 'disabled', 'formNoValidate', 'frameborder', 'hidden', 'ismap', 'itemscope',
                'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'readonly', 'required',
                'reversed', 'scoped', 'selected', 'typemustmatch'
            ];
            var stringableTypes = ['number', 'boolean', 'string'];
            for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (tagName && !key.startsWith('data-')) {
                    var attribute = html_attributes_map_1.HTML_ATTRIBUTES_MAP[key] || [];
                    if (attribute !== true && !attribute.includes(tagName)) {
                        continue;
                    }
                }
                if (ignore.includes(key)) {
                    continue;
                }
                var valueType = typeof value;
                if (booleanAttributes.includes(key)) {
                    if (!!value) {
                        attributes.push(key);
                    }
                }
                else if (valueType === 'object') {
                    var stringified = JSON.stringify(value);
                    var escaped = stringified.replace(/'/g, '&apos;');
                    attributes.push(key + "='" + escaped + "'");
                }
                else if (stringableTypes.includes(valueType)) {
                    var escaped = ('' + value).replace(/"/g, '&quot;');
                    if (escaped !== '') {
                        attributes.push(key + "=\"" + escaped + "\"");
                    }
                }
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: toHtmlAttributes, Error:', err.message);
        }
        return attributes.join(' ');
    };
    /*TODO: This isn't currently returning anything and I need to give this some proper thought
    *       and security consideration such as checking that the evaluated function does not
    *       have ANY access to the wider context and I need to work out what to do in case of infinite
    *       loops. Also, if this is going to be used with `map` I need to work out how to stuff
    *       other parameters into the evaluated function so it isn't just the current item being
    *       mapped. May just drop this in its entirety. Though it would be amazing for filtering
    *       and preparing data
    */
    UtilityHelpers._eval = function (code) {
        try {
            var args = Array.from(arguments);
            var helper = args.pop();
            args.shift();
            var evaluator = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return Function('"use strict";return (' + code + ')')().apply(void 0, args);
            };
            var output = evaluator.apply(void 0, args);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: eval, Error:', err.message);
            return err.message;
        }
    };
    return UtilityHelpers;
}());
exports.default = UtilityHelpers;
//# sourceMappingURL=utility.js.map