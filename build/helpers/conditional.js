"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeepDiff = require("deep-diff");
var utilities_1 = require("../utilities");
/**
 * TODO:
 *  document
 *  test
 */
/**
 * A bunch of helpers for working with conditionals
 */
var ConditionalHelpers = /** @class */ (function () {
    function ConditionalHelpers() {
    }
    ConditionalHelpers._if = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            var evaluation = utilities_1.isOps(input) ? false : !!input;
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation, { input: input });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: if, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._unless = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            var evaluation = utilities_1.isOps(input) ? false : !!input;
            return ConditionalHelpers.conditionalResponse(helper, this, !evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: unless, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._ifAny = function () {
        var helper = arguments[arguments.length - 1];
        try {
            var args = Array.from(arguments);
            args.pop();
            var evaluation = false;
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var arg = args_1[_i];
                if (!!arg) {
                    evaluation = true;
                    break;
                }
            }
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ifAny, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._unlessAll = function () {
        var helper = arguments[arguments.length - 1];
        try {
            var args = Array.from(arguments);
            args.pop();
            var evaluation = false;
            for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
                var arg = args_2[_i];
                if (!arg) {
                    evaluation = true;
                    break;
                }
            }
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: unlessAll, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._ifAll = function () {
        var helper = arguments[arguments.length - 1];
        try {
            var args = Array.from(arguments);
            args.pop();
            var evaluation = true;
            for (var _i = 0, args_3 = args; _i < args_3.length; _i++) {
                var arg = args_3[_i];
                if (!arg) {
                    evaluation = false;
                    break;
                }
            }
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ifAll, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._ifNone = function () {
        var helper = arguments[arguments.length - 1];
        try {
            var args = Array.from(arguments);
            args.pop();
            var evaluation = true;
            for (var _i = 0, args_4 = args; _i < args_4.length; _i++) {
                var arg = args_4[_i];
                if (!!arg) {
                    evaluation = false;
                    break;
                }
            }
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ifNone, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._has = function (target, property) {
        var helper = arguments[arguments.length - 1];
        try {
            if (typeof target !== 'object' || Array.isArray(target) || typeof property !== 'string') {
                throw new Error('Invalid arguments');
            }
            var evaluation = target.hasOwnProperty(property);
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: has, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._hasAll = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var helper = arguments[arguments.length - 1];
        try {
            var helper_1 = args.pop();
            args = Array.isArray(args[0]) ? args[0] : args;
            var missing = args.filter(function (arg) { return !target.hasOwnProperty(arg); });
            var evaluation = missing.length === 0;
            return ConditionalHelpers.conditionalResponse(helper_1, this, evaluation, { missing: missing });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ifAll, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._hasAny = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var helper = arguments[arguments.length - 1];
        try {
            var helper_2 = args.pop();
            var has = [];
            var missing = [];
            for (var _a = 0, args_5 = args; _a < args_5.length; _a++) {
                var arg = args_5[_a];
                if (target.hasOwnProperty(arg)) {
                    has.push(arg);
                }
                else {
                    missing.push(arg);
                }
            }
            var evaluation = has.length > 0;
            return ConditionalHelpers.conditionalResponse(helper_2, this, evaluation, { has: has, missing: missing });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: ifAll, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isString = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = typeof input === 'string';
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isString, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isNumber = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = typeof input === 'number';
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isNumber, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isNaN = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = Number.isNaN(input);
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isNumber, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isFinite = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = Number.isFinite(input);
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isNumber, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isBoolean = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = typeof input === 'boolean';
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isBoolean, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isObject = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = typeof input === 'object' && !Array.isArray(input);
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isObject, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isArray = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = Array.isArray(input);
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isObject, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isFunction = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = typeof input === 'function';
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isFunction, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isNull = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = input === null;
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isNull, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isUndefined = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = typeof input === 'undefined';
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: isUndefined, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._isLike = function (input, test) {
        var helper = arguments[arguments.length - 1];
        try {
            if (!test || utilities_1.isOps(test)) {
                throw new Error('Invalid arguments');
            }
            var inputType = typeof input;
            var testType = typeof test;
            var evaluation = inputType === testType;
            if (!evaluation || inputType !== 'object' || Array.isArray(input)) {
                return ConditionalHelpers.conditionalResponse(helper, this, evaluation, { inputType: inputType, testType: testType });
            }
            var inputProps = Object.getOwnPropertyNames(input);
            var similarities = [];
            var differences = [];
            for (var _i = 0, inputProps_1 = inputProps; _i < inputProps_1.length; _i++) {
                var prop = inputProps_1[_i];
                var comparison = {
                    property: prop,
                    inputType: typeof input[prop],
                    testType: typeof test[prop]
                };
                if (comparison.inputType === comparison.testType) {
                    similarities.push(comparison);
                }
                else {
                    differences.push(comparison);
                }
            }
            return ConditionalHelpers.conditionalResponse(helper, this, differences.length === 0, { similarities: similarities, differences: differences });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: gt, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._gt = function (inputA, inputB) {
        var helper = arguments[arguments.length - 1];
        try {
            if (typeof inputA === 'string') {
                try {
                    inputA = parseInt(inputA);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputA)) {
                inputA = +inputA;
            }
            if (typeof inputB === 'string') {
                try {
                    inputB = parseInt(inputB);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputB)) {
                inputB = +inputB;
            }
            if (typeof inputA !== 'number') {
                throw new Error('Invalid first argument');
            }
            if (typeof inputB !== 'number') {
                throw new Error('Invalid second argument');
            }
            var evaluation = inputA > inputB;
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: gt, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._gte = function (inputA, inputB) {
        var helper = arguments[arguments.length - 1];
        try {
            if (typeof inputA === 'string') {
                try {
                    inputA = parseInt(inputA);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputA)) {
                inputA = +inputA;
            }
            if (typeof inputB === 'string') {
                try {
                    inputB = parseInt(inputB);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputB)) {
                inputB = +inputB;
            }
            if (typeof inputA !== 'number') {
                throw new Error('Invalid first argument');
            }
            if (typeof inputB !== 'number') {
                throw new Error('Invalid second argument');
            }
            var evaluation = inputA >= inputB;
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: gt, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._lt = function (inputA, inputB) {
        var helper = arguments[arguments.length - 1];
        try {
            if (typeof inputA === 'string') {
                try {
                    inputA = parseInt(inputA);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputA)) {
                inputA = +inputA;
            }
            if (typeof inputB === 'string') {
                try {
                    inputB = parseInt(inputB);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputB)) {
                inputB = +inputB;
            }
            if (typeof inputA !== 'number') {
                throw new Error('Invalid first argument');
            }
            if (typeof inputB !== 'number') {
                throw new Error('Invalid second argument');
            }
            var evaluation = inputA < inputB;
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: lt, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._lte = function (inputA, inputB) {
        var helper = arguments[arguments.length - 1];
        try {
            if (typeof inputA === 'string') {
                try {
                    inputA = parseInt(inputA);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputA)) {
                inputA = +inputA;
            }
            if (typeof inputB === 'string') {
                try {
                    inputB = parseInt(inputB);
                }
                catch (err) { }
            }
            else if (utilities_1.isValidDate(inputB)) {
                inputB = +inputB;
            }
            if (typeof inputA !== 'number') {
                throw new Error('Invalid first argument');
            }
            if (typeof inputB !== 'number') {
                throw new Error('Invalid second argument');
            }
            var evaluation = inputA <= inputB;
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: lte, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._eq = function (inputA, inputB) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(inputA) || utilities_1.isOps(inputB)) {
                throw new Error('Invalid arguments');
            }
            var inputAType = typeof inputA;
            var inputBType = typeof inputB;
            if (inputAType === 'undefined' && inputBType === 'undefined') {
                return ConditionalHelpers.conditionalResponse(helper, this, true);
            }
            else if (inputAType === 'object' && typeof inputBType === 'object') {
                var changes = DeepDiff.diff(inputA, inputB);
                return ConditionalHelpers.conditionalResponse(helper, this, !changes, { changes: changes });
            }
            else {
                var evaluation = inputA == inputB;
                return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: eq, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._teq = function (inputA, inputB) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(inputA) || !inputB || utilities_1.isOps(inputB)) {
                throw new Error('Invalid arguments');
            }
            if (typeof inputA === 'object' && typeof inputB === 'object') {
                var changes = DeepDiff.diff(inputA, inputB);
                return ConditionalHelpers.conditionalResponse(helper, this, !changes, { changes: changes });
            }
            else {
                var evaluation = inputA === inputB;
                return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: teq, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._any = function (input) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input) || typeof input !== 'object') {
                throw new Error('Invalid arguments');
            }
            var length_1 = 0;
            if (Array.isArray(input)) {
                length_1 = input.length;
            }
            else {
                length_1 = Object.keys(input).length;
            }
            return ConditionalHelpers.conditionalResponse(helper, this, length_1 > 0, { length: length_1 });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: any, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._contains = function (input, test) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input) || !test || utilities_1.isOps(test)) {
                throw new Error('Invalid arguments');
            }
            var index = input.toString().indexOf(test.toString());
            return ConditionalHelpers.conditionalResponse(helper, this, index > -1, { index: index });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: contains, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._startsWith = function (input, test) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input) || !test || utilities_1.isOps(test)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = input.toString().startsWith(test.toString());
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: startsWith, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._endsWith = function (input, test) {
        var helper = arguments[arguments.length - 1];
        try {
            if (utilities_1.isOps(input) || !test || utilities_1.isOps(test)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = input.toString().endsWith(test.toString());
            return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
        }
        catch (err) {
            console.log('Bristles Error -> Helper: endsWith, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._includes = function (input, test) {
        var helper = arguments[arguments.length - 1];
        try {
            if (!Array.isArray(input) || utilities_1.isOps(test)) {
                throw new Error('Invalid arguments');
            }
            if (typeof test === 'object') {
                for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
                    var _b = _a[_i], index = _b[0], item = _b[1];
                    if (!DeepDiff.diff(item, test)) {
                        return ConditionalHelpers.conditionalResponse(helper, this, true, { index: index });
                    }
                }
                return ConditionalHelpers.conditionalResponse(helper, this, false, { index: -1 });
            }
            else {
                var index = input.indexOf(test);
                return ConditionalHelpers.conditionalResponse(helper, this, index > -1, { index: index });
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: includes, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    /**
     * Check to see if a string matches a regular expression
     *
     * @param input       The string to test
     * @param expression  The regular expression to test the input string with
     * @param options     Any regular expression options to use (defaults to 'gi')
     * @returns           A `false` if there is no match or regular expression match array where the first
     *                    item is the complete match and each subsequent iteam are the captured groups.
     *                    On failure returns `false`
     *
     * @type              Block/Inline
     */
    ConditionalHelpers._regexMatch = function (input, expression, options) {
        var helper = arguments[arguments.length - 1];
        try {
            if (typeof input !== 'string' || typeof expression !== 'string') {
                throw new Error('Invalid arguments');
            }
            if (typeof options !== 'string') {
                options = 'gi';
            }
            var regex = new RegExp(expression, options);
            var matches = regex.exec(input) || false;
            var output = matches;
            return ConditionalHelpers.conditionalResponse(helper, this, !!output, { output: output });
        }
        catch (err) {
            console.log('Bristles Error -> Helper: regexMatch, Error:', err.message);
            return ConditionalHelpers.conditionalResponse(helper, this, false);
        }
    };
    ConditionalHelpers._elseIfWrapper = function () {
        try {
            var helper = arguments[arguments.length - 1];
            if (!helper.fn) {
                throw new Error('The elseIfWrapper helper can only be used as a block helper');
            }
            helper.data['@elseIf'] = helper.data['@elseIf'] || [];
            helper.data['@elseIf'].push(false);
            var output = helper.fn(this);
            var level = helper.data['@elseIf'].length - 1;
            if (helper.data['@elseIf'][level] === false) {
                if (helper.inverse) {
                    output = helper.inverse(this);
                }
                else {
                    output = '';
                }
            }
            helper.data['@elseIf'].pop();
            if (helper.data['@elseIf'].length === 0) {
                delete helper.data['@elseIf'];
            }
            return output;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: elseIfWrapper, Error:', err.message);
            return '';
        }
    };
    ConditionalHelpers._elseIf = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            var level = helper.data['@elseIf'].length - 1;
            if (helper.data['@elseIf'][level] === true) {
                return '';
            }
            if (!helper.fn) {
                throw new Error('The elseIf helper can only be used as a block helper');
            }
            if (helper.inverse.name !== 'noop') {
                throw new Error('The elseIf helper should not contain an inverse/else block');
            }
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var evaluation = !!input;
            if (evaluation) {
                helper.data['@elseIf'][level] = true;
                return helper.fn(this);
            }
            else {
                return '';
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: elseIf, Error:', err.message);
            return '';
        }
    };
    ConditionalHelpers._switch = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            if (!helper.fn) {
                throw new Error('The switch helper can only be used as a block helper');
            }
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            helper.data['@switch'] = helper.data['@switch'] || [];
            helper.data['@switch'].push({
                value: input,
                resolved: false
            });
            var output = helper.fn(this);
            var level = helper.data['@switch'].length - 1;
            if (helper.data['@switch'][level].resolved === false) {
                if (helper.inverse) {
                    output = helper.inverse(this);
                }
                else {
                    output = '';
                }
            }
            helper.data['@switch'].pop();
            if (helper.data['@switch'].length === 0) {
                delete helper.data['@switch'];
            }
            return output;
        }
        catch (err) {
            console.log('Bristles Error -> Helper: switch, Error:', err.message);
            return '';
        }
    };
    ConditionalHelpers._case = function (input) {
        try {
            var helper = arguments[arguments.length - 1];
            var level = helper.data['@switch'].length - 1;
            if (helper.data['@switch'][level].resolved === true) {
                return '';
            }
            if (!helper.fn) {
                throw new Error('The case helper can only be used as a block helper');
            }
            if (helper.inverse.name !== 'noop') {
                throw new Error('The case helper should not contain an inverse/else block');
            }
            if (utilities_1.isOps(input)) {
                throw new Error('Invalid arguments');
            }
            var value = helper.data['@switch'][level].value;
            var evaluation = input == value;
            if (evaluation) {
                helper.data['@switch'][level].resolved = true;
                return helper.fn(this);
            }
            else {
                return '';
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: case, Error:', err.message);
            return '';
        }
    };
    ConditionalHelpers.conditionalResponse = function (helper, context, evaluation, metadata) {
        if (metadata === void 0) { metadata = {}; }
        try {
            if (!utilities_1.isOps(helper)) {
                throw new Error('The passed in helper is not a valid HelperOptions object');
            }
            if (!helper.fn) {
                if (evaluation && helper.hash && helper.hash.hasOwnProperty('ifTrue')) {
                    return helper.hash.ifTrue;
                }
                else if (!evaluation && helper.hash && helper.hash.hasOwnProperty('ifFalse')) {
                    return helper.hash.ifFalse;
                }
                else {
                    return evaluation;
                }
            }
            else {
                var output = '';
                if (!Object.isFrozen(context)) {
                    for (var _i = 0, _a = Object.entries(metadata); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], value = _b[1];
                        context['__' + key] = value;
                    }
                }
                if (evaluation) {
                    output = helper.fn(context);
                }
                else if (helper.inverse) {
                    output = helper.inverse(context);
                }
                if (!Object.isFrozen(context)) {
                    for (var _c = 0, _d = Object.keys(metadata); _c < _d.length; _c++) {
                        var key = _d[_c];
                        delete context['__' + key];
                    }
                }
                return output;
            }
        }
        catch (err) {
            console.log('Bristles Error -> Helper: [some conditional | conditionalResponse error], Error:', err);
            return false;
        }
    };
    return ConditionalHelpers;
}());
exports.default = ConditionalHelpers;
//# sourceMappingURL=conditional.js.map