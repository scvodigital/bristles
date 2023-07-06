"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var dot = require("dot-object");
var MathJS = require("mathjs");
var utilities_1 = require("../utilities");
/**
 * TODO: functions
 *  join
 *  merge
 *  delta
 *  same
 *  pop
 *  push
 *  shift
 *  unshift
 *  filter
 *  find
 */
/**
 * A bunch of helpers for working with arrays
 */
var ArrayHelpers = /** @class */ (function () {
    function ArrayHelpers() {
    }
    ArrayHelpers._map = function (input, func) {
        try {
            if (!Array.isArray(input) || !util_1.isFunction(func)) {
                throw new Error('Invalid arguments');
            }
            return input.map(func);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: map, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._pluck = function (input, path, undefinedAsNull) {
        var output = [];
        try {
            if (!Array.isArray(input)) {
                throw new Error('Input is not an array');
            }
            if (typeof path !== 'string') {
                throw new Error('Path is not a string');
            }
            for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
                var item = input_1[_i];
                var value = dot.pick(path, item);
                if (typeof value === 'undefined' && undefinedAsNull !== true)
                    continue;
                output.push(value);
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: Pluck, Error:', err.message);
        }
        return output;
    };
    ArrayHelpers._union = function (inputA, inputB) {
        try {
            return MathJS.setUnion(inputA, inputB);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: union, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._intersect = function (inputA, inputB) {
        try {
            return MathJS.setIntersect(inputA, inputB);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: intersect, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._difference = function (inputA, inputB) {
        try {
            return MathJS.setDifference(inputA, inputB);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: difference, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._filter = function (items, property, comparator, test) {
        var found = [];
        try {
            items.forEach(function (item) {
                var value = property === null ? item : dot.pick(property, item);
                var match = false;
                try {
                    switch (comparator) {
                        case ('==='):
                            match = value === test;
                            break;
                        case ('=='):
                            match = value == test;
                            break;
                        case ('>='):
                            match = value >= test;
                            break;
                        case ('>'):
                            match = value > test;
                            break;
                        case ('<='):
                            match = value <= test;
                            break;
                        case ('<'):
                            match = value < test;
                            break;
                        case ('testIn'):
                            match = value.indexOf(test) > -1;
                            break;
                        case ('valueIn'):
                            match = test.indexOf(value) > -1;
                            break;
                        case ('testNotIn'):
                            match = value.indexOf(test) === -1;
                            break;
                        case ('valueNotIn'):
                            match = test.indexOf(value) === -1;
                            break;
                        case ('exists'): match = !!property;
                    }
                }
                catch (err) { }
                if (match) {
                    found.push(item);
                }
            });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: filter, Error:', err.message);
        }
        return found;
    };
    ArrayHelpers._each = function (input, join) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            if (!helper.fn) {
                throw new Error('The each helper can only be used as a block helper');
            }
            var outputs = [];
            input = typeof input === 'undefined' ? [] : typeof input !== 'object' ? [input] : input;
            if (Array.isArray(input)) {
                var total = input.length;
                for (var index = 0; index < total; index++) {
                    var data = {
                        '__total': total,
                        '__first': index === 0,
                        '__last': index === total - 1,
                        '__index': index
                    };
                    var item = Object.assign(input[index], data);
                    var output = helper.fn(item).trim();
                    outputs.push(output);
                }
            }
            else {
                var keys = Object.keys(input);
                var total = keys.length;
                for (var index = 0; index < keys.length; index++) {
                    var data = {
                        '__total': total,
                        '__first': index === 0,
                        '__last': index === total - 1,
                        '__key': keys[index]
                    };
                    var item = Object.assign(input[keys[index]], data);
                    var output = helper.fn(item).trim();
                    outputs.push(output);
                }
            }
            outputs = outputs.filter(function (item) { return !!item; });
            if (outputs.length > 0) {
                return outputs.join(typeof join === 'string' ? join : '\n');
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: each, Error:', err.message);
        }
        try {
            if (helper.inverse) {
                return helper.inverse(this);
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: each, Inverse Error:', err);
        }
        return '';
    };
    ArrayHelpers._sort = function (input, direction, path) {
        var helper = arguments[arguments.length - 1];
        try {
            if (!Array.isArray(input)) {
                throw new Error('Invalid arguments');
            }
            direction = direction || 'asc';
            direction = direction === 'desc' ? 'desc' : 'asc';
            path = typeof path === 'string' ? path : undefined;
            var func = function (a, b) { return a - b; };
            if (!path) {
                if (direction === 'desc') {
                    func = function (a, b) { return b - a; };
                }
            }
            else {
                if (direction === 'desc') {
                    func = function (a, b) {
                        return dot.pick(path || '', b) - dot.pick(path || '', a);
                    };
                }
                else {
                    func = function (a, b) {
                        return dot.pick(path || '', a) - dot.pick(path || '', b);
                    };
                }
            }
            if (helper.hash.mutate === true) {
                return input.sort(func);
            }
            else {
                var clone = JSON.parse(JSON.stringify(input));
                clone.sort(func);
                return clone;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: sort, Error:', err.message);
            return Array.isArray(input) ? input : [];
        }
    };
    ArrayHelpers._slice = function (input, begin, end) {
        try {
            if (!Array.isArray(input)) {
                throw new Error('Invalid arguments');
            }
            begin = typeof begin === 'number' ? begin : 0;
            end = typeof end === 'number' ? end : undefined;
            return input.slice(begin, end);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: slice, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._splice = function (input, start, deleteCount, items) {
        var helper = arguments[arguments.length - 1];
        try {
            if (!Array.isArray(input)) {
                throw new Error('Invalid arguments');
            }
            start = typeof start === 'number' ? start : 0;
            deleteCount = typeof deleteCount === 'number' ? deleteCount : 0;
            items = Array.isArray(items) ? items : [];
            if (helper.hash.mutate === true) {
                return input.splice.apply(input, [start, deleteCount].concat(items));
            }
            else {
                var clone = JSON.parse(JSON.stringify(input));
                clone.splice.apply(clone, [start, deleteCount].concat(items));
                return clone;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: splice, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._count = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (utilities_1.isOps(input) || typeof input !== 'object') {
                return 0;
            }
            if (Array.isArray(input)) {
                return input.length;
            }
            else {
                return Object.keys(input).length;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: count, Error:', err.message);
            return 0;
        }
    };
    ArrayHelpers._itemAt = function (input, index) {
        try {
            var helper = arguments[arguments.length - 1];
            if (!Array.isArray(input) || typeof index !== 'number') {
                throw new Error('Invalid arguments');
            }
            if (index < 0) {
                var position = input.length + index;
                if (position < 0) {
                    throw new Error("Position " + position + " is out of bounds. Input has " + input.length + " items");
                }
                return input[position];
            }
            else {
                if (index >= input.length) {
                    throw new Error("Position " + index + " is out of bounds. Input has " + input.length + " items");
                }
                return input[index];
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: itemAt, Error:', err.message);
            return null;
        }
    };
    ArrayHelpers._array = function () {
        try {
            var args = Array.from(arguments);
            return args.slice(0, args.length - 1);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: array, Error:', err.message);
            return [];
        }
    };
    ArrayHelpers._join = function (input, separator) {
        try {
            if (!Array.isArray(input)) {
                throw new Error('First argument must be an array');
            }
            separator = typeof separator === 'string' ? separator : ',';
            var options = Array.from(arguments).pop();
            if (input.length === 0 && options.hash.wrapEmpty !== true) {
                return '';
            }
            var joined = input.join(separator);
            var left = options.hash.left || '';
            var right = options.hash.right || '';
            return "" + left + joined + right;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: join, Error:', err.message);
            return '';
        }
    };
    return ArrayHelpers;
}());
exports.default = ArrayHelpers;
//# sourceMappingURL=array.js.map