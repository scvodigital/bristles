"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var S = require("string");
var ts_dedent_1 = require("ts-dedent");
var TruncHtml = require('trunc-html');
/**
 * TODO: Functions
 *  regexReplace
 *  inflect
 *  toBase64
 *  fromBase64
 *  hash
 * TODO: Other
 *  Document all functions
 *  Test cases for all functions
 */
/**
 * A bunch of helpers for working with strings
 */
var StringHelpers = /** @class */ (function () {
    function StringHelpers() {
    }
    /**
     * Split up a string by a given delimeter
     *
     * @param input       The string to split
     * @param delimeter?  The string by which to split the input string (defaults to ',')
     * @returns           An array of strings. On failure returns an empty array.
     *
     * @type              Inline
     * @example ```
     * {{split "Europe, Asia, North America" ", "}}
     * output => [ "Europe", "Asia", "North America" ]
     * ```
     */
    StringHelpers._split = function (input, delimeter) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return [];
            }
            if (delimeter == null || delimeter.constructor.name !== 'String') {
                delimeter = ',';
            }
            return input.split(delimeter);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: split, Error:', err.message);
            return [];
        }
    };
    /**
     * Gets a portion of a string from a starting point to a given length
     *
     * @param input       The string to split
     * @param from        The point in the string to start from. The first character is `0`
     * @param length?     How many characters to return. If left empty the rest of the string after the start point will be returned
     * @returns           A subportion of the input string. On failure returns an empty string.
     *
     * @type              Inline
     * @example ```
     * {{substr "Hello, my name is E. Honda. How are you?" 18 8}}
     * output => "E. Honda"
     * ```
     */
    StringHelpers._substr = function (input, from, length) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (typeof from !== 'number') {
                from = 0;
            }
            if (typeof length !== 'number') {
                length = undefined;
            }
            return input.substr(from, length);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: substr, Error:', err.message);
            return '';
        }
    };
    /**
     * Gets a portion of a string from a starting point to an end point
     *
     * @param input       The string to split
     * @param start       The point in the string to start from. The first character is `0`
     * @param end?        The point in the string to end at. If left empty the rest of the string after the start point will be returned
     * @returns           A subportion of the input string. On failure returns an empty string.
     *
     * @type              Inline
     * @example ```
     * {{substring "Hello, my name is E. Honda. How are you?" 18 26}}
     * output => "E. Honda"
     * ```
     */
    StringHelpers._substring = function (input, start, end) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (typeof start !== 'number') {
                start = 0;
            }
            if (typeof end !== 'number') {
                end = undefined;
            }
            return input.substr(start, end);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: substring, Error:', err.message);
            return '';
        }
    };
    /**
     * Joins any number of strings or stringable objects together into one long string
     *
     * @param ...inputs   The things to join together. Objects will be ignored
     * @returns           One big string. On failure returns an empty string.
     *
     * @type              Inline
     * @example ```
     * context => { "name": "E. Honda", "yearBorn": 1960, "likesNoodles": true }
     * {{concat "My name is " name " and I was born in " yearBorn ". True or false, I like noodles? " likesNoodles}}
     * output => "My name is E. Honda and I was born in 1960. True or false, I like noodles? true"
     * ```
     */
    StringHelpers._concat = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            var helper = args.pop();
            var unstringableTypes_1 = ['function', 'undefined', 'object'];
            var stringableArgs = args.filter(function (arg) { return !unstringableTypes_1.includes(typeof arg); });
            var output = stringableArgs.join(helper.hash.separator || '');
            return output;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: concat, Error:', err.message);
            return '';
        }
    };
    /**
     * Find the position of the first instance of one string in another.
     *
     * @param input       The string to search
     * @param match       The string you are searching for
     * @returns           The position of the first occurance of the match string as a number, or `-1` if it is not found. On failure returns `-1`.
     *
     * @type              Inline
     * @example ```
     * {{indexOf "This string contains multiple letter 'i's" "i"}}
     * output => 2
     * ```
     */
    StringHelpers._indexOf = function (input, match) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String' || !match || typeof match === 'object') {
                return -1;
            }
            return input.indexOf(match.toString());
        }
        catch (err) {
            console.log('Bristles Error -> Helper: indexOf, Error:', err.message);
            return -1;
        }
    };
    /**
     * Find the position of the last instance of one string in another.
     *
     * @param input       The string to search
     * @param match       The string you are searching for
     * @returns           The position of the last occurance of the match string as a number, or `-1` if it is not found. On failure returns `-1`.
     *
     * @type              Inline
     * @example ```
     * {{indexOf "This string contains multiple letter 'i's" "i"}}
     * output => 38
     * ```
     */
    StringHelpers._lastIndexOf = function (input, match) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String' || !match || typeof match === 'object') {
                return -1;
            }
            return input.lastIndexOf(match.toString());
        }
        catch (err) {
            console.log('Bristles Error -> Helper: indexOf, Error:', err.message);
            return -1;
        }
    };
    StringHelpers._toUpperCase = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return input.toUpperCase();
        }
        catch (err) {
            console.log('Bristles Error -> Helper: toUpperCase, Error:', err.message);
            return '';
        }
    };
    StringHelpers._toLowerCase = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return input.toLowerCase();
        }
        catch (err) {
            console.log('Bristles Error -> Helper: toLowerCase, Error:', err.message);
            return '';
        }
    };
    StringHelpers._inflect = function (count, singular, plural, includeCount) {
        try {
            var word = (count > 1 || count === 0) ? plural : singular;
            if (includeCount === true) {
                return String(count) + ' ' + word;
            }
            else {
                return word;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: inflect, Error:', err.message);
            return singular || plural || '';
        }
    };
    ;
    StringHelpers._padStart = function (input, maxLength, fillString) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (typeof maxLength !== 'number') {
                return input;
            }
            if (!fillString || typeof fillString === 'object') {
                fillString = ' ';
            }
            return input.padStart(maxLength, fillString.toString());
        }
        catch (err) {
            console.log('Bristles Error -> Helper: padStart, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._padEnd = function (input, maxLength, fillString) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (typeof maxLength !== 'number') {
                return input;
            }
            if (!fillString || typeof fillString === 'object') {
                fillString = ' ';
            }
            return input.padEnd(maxLength, fillString.toString());
        }
        catch (err) {
            console.log('Bristles Error -> Helper: padEnd, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._repeat = function (input, times) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String' || typeof times !== 'number') {
                return '';
            }
            return input.repeat(times);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: repeat, Error:', err.message);
            return '';
        }
    };
    StringHelpers._camelize = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).camelize().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: camelize, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._capitalize = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).capitalize().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: capitalize, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._chompLeft = function (input, prefix) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            prefix = typeof prefix === 'string' ? prefix : input.substring(0, 1) || ' ';
            return S(input).chompLeft(prefix).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: chompLeft, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._chompRight = function (input, suffix) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            suffix = typeof suffix === 'string' ? suffix : input.substring(0, 1) || ' ';
            return S(input).chompRight(suffix).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: chompRight, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._collapseWhitespace = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).collapseWhitespace().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: collapseWhitespace, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._countOccurances = function (input, substring) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String' || substring == null || substring.constructor.name !== 'String') {
                return 0;
            }
            return S(input).count(substring);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: countOccurances, Error:', err.message);
            return 0;
        }
    };
    StringHelpers._dasherize = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).dasherize().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: dasherize, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._decodeHTMLEntities = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).decodeHTMLEntities().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: decodeHTMLEntities, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._ensureLeft = function (input, prefix) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (prefix == null || prefix.constructor.name !== 'String') {
                return input;
            }
            return S(input).ensureLeft(prefix).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ensureLeft, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._ensureRight = function (input, suffix) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (suffix == null || suffix.constructor.name !== 'String') {
                return input;
            }
            return S(input).ensureRight(suffix).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ensureRight, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._humanize = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).humanize().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: humanize, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._lines = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return [];
            }
            return S(input).lines();
        }
        catch (err) {
            console.log('Bristles Error -> Helper: lines, Error:', err.message);
            return typeof input === 'string' ? [input] : [];
        }
    };
    StringHelpers._replace = function (input, match, replacement) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (match == null || match.constructor.name !== 'String' || replacement == null || replacement.constructor.name !== 'String') {
                return input;
            }
            return input.split(match).join(replacement);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: replace, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._regexReplace = function (input, match, options, replacement) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (match == null || match.constructor.name !== 'String' || options == null || options.constructor.name !== 'String' || replacement == null || replacement.constructor.name !== 'String') {
                return input;
            }
            var regex = new RegExp(match, options);
            return input.replace(regex, replacement);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: replace, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._slugify = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input.replace(/\//g, '-')).slugify().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: slugify, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._trim = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).trim().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: trim, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._trimLeft = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).trimLeft().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: trimLeft, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._trimRight = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).trimRight().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: trimRight, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._stripLeft = function (input, chars) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            chars = typeof chars === 'string' ? chars : '\s';
            return S(input).stripLeft(chars).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: stripLeft, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._stripRight = function (input, chars) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            chars = typeof chars === 'string' ? chars : '\s';
            return S(input).stripRight(chars).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: stripRight, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._stripTags = function (input) {
        var _a;
        try {
            var tags = Array.from(arguments);
            tags.pop();
            tags.shift();
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return (_a = S(input)).stripTags.apply(_a, tags).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: stripTags, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._titleCase = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).titleCase().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: titleCase, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._toBoolean = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return false;
            }
            return S(input).toBoolean();
        }
        catch (err) {
            console.log('Bristles Error -> Helper: toBoolean, Error:', err.message);
            return false;
        }
    };
    StringHelpers._truncate = function (input, length, chars) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (typeof length !== 'number') {
                return input;
            }
            chars = typeof chars === 'string' ? chars : '...';
            return S(input).truncate(length, chars).s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: truncate, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._truncateHtml = function (input, length) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            if (typeof length !== 'number') {
                return input;
            }
            var options = {};
            if (typeof helper.hash.ignoreTags === 'string') {
                options.ignoreTags = helper.hash.ignoreTags.split(',');
            }
            else if (Array.isArray(helper.hash.ignoreTags)) {
                options.ignoreTags = helper.hash.ignoreTags;
            }
            if (typeof helper.hash.imageAltText !== 'boolean') {
                options.imageAltText = !!helper.hash.imageAltText;
            }
            if (typeof helper.hash.sanitizer === 'object') {
                options.sanitizer = helper.hash.sanitizer;
            }
            var output = TruncHtml(input, length, options);
            if (helper.hash.returnText === true) {
                return output.text;
            }
            else {
                return output.html;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: truncateHtml, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._underscore = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String') {
                return '';
            }
            return S(input).underscore().s;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: underscore, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    StringHelpers._encodeURIComponent = function (input) {
        return encodeURIComponent('' + input);
    };
    StringHelpers._encodeURI = function (input) {
        return encodeURI('' + input);
    };
    StringHelpers._decodeURIComponent = function (input) {
        return decodeURIComponent('' + input);
    };
    StringHelpers._decodeURI = function (input) {
        return decodeURI('' + input);
    };
    StringHelpers._unindent = function () {
        try {
            var args = Array.from(arguments);
            var helper = args.pop();
            var input = (args[0] || helper.fn(this));
            var output = ts_dedent_1.default(input);
            return output;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: unindent, Error:', err.message);
            return typeof arguments[0] === 'string' ? arguments[0] : '';
        }
    };
    StringHelpers._match = function (input, pattern, options) {
        try {
            var helper = arguments[arguments.length - 1];
            if (input == null || input.constructor.name !== 'String' || pattern == null || pattern.constructor.name !== 'String') {
                return '';
            }
            options = typeof options === 'string' ? options : 'gi';
            var regex = new RegExp(pattern, options);
            var matches = [];
            var match = null;
            while ((match = regex.exec(input)) !== null) {
                matches.push(match);
            }
            if (helper.fn) {
                if (matches.length === 0 && helper.inverse) {
                    return helper.inverse(this);
                }
                else if (matches.length > 0) {
                    var output = [];
                    for (var index = 0; index < matches.length; index++) {
                        var context = {
                            match: matches[index],
                            first: index === 0,
                            last: index === matches.length - 1,
                            index: index
                        };
                        output.push(helper.fn(context));
                    }
                    return output.join('');
                }
            }
            return matches;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: match, Error:', err.message);
            return typeof input === 'string' ? input : '';
        }
    };
    return StringHelpers;
}());
exports.default = StringHelpers;
//# sourceMappingURL=string.js.map