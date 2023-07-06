import { HelperOptions, TemplateDelegate } from 'handlebars';
import * as DeepDiff from 'deep-diff';

import { isOps, Map, isValidDate } from '../utilities';

/**
 * TODO:
 *  document
 *  test
 */

/**
 * A bunch of helpers for working with conditionals
 */
export default class ConditionalHelpers {
  static _if(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const evaluation = isOps(input) ? false : !!input;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation, { input });
    } catch (err) {
      console.log('Bristles Error -> Helper: if, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _unless(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const evaluation = isOps(input) ? false : !!input;
      return ConditionalHelpers.conditionalResponse(helper, this, !evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: unless, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _ifAny(): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const args = Array.from(arguments);
      args.pop();
      let evaluation = false;
      for (const arg of args) {
        if (!!arg) {
          evaluation = true;
          break;
        }
      }
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: ifAny, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _unlessAll(): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const args = Array.from(arguments);
      args.pop();
      let evaluation = false;
      for (const arg of args) {
        if (!arg) {
          evaluation = true;
          break;
        }
      }
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: unlessAll, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _ifAll(): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const args = Array.from(arguments);
      args.pop();
      let evaluation = true;
      for (const arg of args) {
        if (!arg) {
          evaluation = false;
          break;
        }
      }
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: ifAll, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _ifNone(): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const args = Array.from(arguments);
      args.pop();
      let evaluation = true;
      for (const arg of args) {
        if (!!arg) {
          evaluation = false;
          break;
        }
      }
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: ifNone, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _has(target: any, property: string): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (typeof target !== 'object' || Array.isArray(target) || typeof property !== 'string') {
        throw new Error('Invalid arguments');
      }
      const evaluation = target.hasOwnProperty(property);
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: has, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _hasAll(target: any, ...args: any[]): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const helper = args.pop();
      args = Array.isArray(args[0]) ? args[0] : args;
      const missing = args.filter(arg => { return !target.hasOwnProperty(arg); });
      const evaluation = missing.length === 0;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation, { missing });
    } catch (err) {
      console.log('Bristles Error -> Helper: ifAll, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _hasAny(target: any, ...args: any[]): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      const helper = args.pop();
      const has = [];
      const missing = [];
      for (const arg of args) {
        if (target.hasOwnProperty(arg)) {
          has.push(arg);
        } else {
          missing.push(arg);
        }
      }
      const evaluation = has.length > 0;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation, { has, missing });
    } catch (err) {
      console.log('Bristles Error -> Helper: ifAll, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isString(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = typeof input === 'string';
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isString, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isNumber(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = typeof input === 'number';
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isNumber, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isNaN(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = Number.isNaN(input);
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isNumber, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isFinite(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = Number.isFinite(input);
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isNumber, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isBoolean(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = typeof input === 'boolean';
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isBoolean, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isObject(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = typeof input === 'object' && !Array.isArray(input);
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isObject, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isArray(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = Array.isArray(input);
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isObject, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isFunction(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = typeof input === 'function';
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isFunction, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isNull(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = input === null;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isNull, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isUndefined(input: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = typeof input === 'undefined';
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: isUndefined, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _isLike(input: any, test: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (!test || isOps(test)) {
        throw new Error('Invalid arguments');
      }
      const inputType = typeof input;
      const testType = typeof test;
      const evaluation = inputType === testType;
      if (!evaluation || inputType !== 'object' || Array.isArray(input)) {
        return ConditionalHelpers.conditionalResponse(helper, this, evaluation, { inputType, testType });
      }

      const inputProps = Object.getOwnPropertyNames(input);
      const similarities = [];
      const differences = [];
      for (const prop of inputProps) {
        const comparison = {
          property: prop,
          inputType: typeof input[prop],
          testType: typeof test[prop]
        };

        if (comparison.inputType === comparison.testType) {
          similarities.push(comparison);
        } else {
          differences.push(comparison);
        }
      }

      return ConditionalHelpers.conditionalResponse(helper, this, differences.length === 0, { similarities, differences });
    } catch (err) {
      console.log('Bristles Error -> Helper: gt, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _gt(inputA: number, inputB: number): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (typeof inputA === 'string') {
        try { inputA = parseInt(inputA); } catch(err) {}
      } else if (isValidDate(inputA)) {
        inputA = +inputA;
      }
      if (typeof inputB === 'string') {
        try { inputB = parseInt(inputB); } catch(err) {}
      } else if (isValidDate(inputB)) {
        inputB = +inputB;
      }

      if (typeof inputA !== 'number') {
        throw new Error('Invalid first argument');
      }
      if (typeof inputB !== 'number') {
        throw new Error('Invalid second argument');
      }
      const evaluation = inputA > inputB;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: gt, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _gte(inputA: number, inputB: number): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (typeof inputA === 'string') {
        try { inputA = parseInt(inputA); } catch(err) {}
      } else if (isValidDate(inputA)) {
        inputA = +inputA;
      }
      if (typeof inputB === 'string') {
        try { inputB = parseInt(inputB); } catch(err) {}
      } else if (isValidDate(inputB)) {
        inputB = +inputB;
      }

      if (typeof inputA !== 'number') {
        throw new Error('Invalid first argument');
      }
      if (typeof inputB !== 'number') {
        throw new Error('Invalid second argument');
      }
      const evaluation = inputA >= inputB;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: gt, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _lt(inputA: number, inputB: number): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (typeof inputA === 'string') {
        try { inputA = parseInt(inputA); } catch(err) {}
      } else if (isValidDate(inputA)) {
        inputA = +inputA;
      }
      if (typeof inputB === 'string') {
        try { inputB = parseInt(inputB); } catch(err) {}
      } else if (isValidDate(inputB)) {
        inputB = +inputB;
      }

      if (typeof inputA !== 'number') {
        throw new Error('Invalid first argument');
      }
      if (typeof inputB !== 'number') {
        throw new Error('Invalid second argument');
      }
      const evaluation = inputA < inputB;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: lt, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _lte(inputA: number, inputB: number): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (typeof inputA === 'string') {
        try { inputA = parseInt(inputA); } catch(err) {}
      } else if (isValidDate(inputA)) {
        inputA = +inputA;
      }
      if (typeof inputB === 'string') {
        try { inputB = parseInt(inputB); } catch(err) {}
      } else if (isValidDate(inputB)) {
        inputB = +inputB;
      }

      if (typeof inputA !== 'number') {
        throw new Error('Invalid first argument');
      }
      if (typeof inputB !== 'number') {
        throw new Error('Invalid second argument');
      }
      const evaluation = inputA <= inputB;
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: lte, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _eq(inputA: any, inputB: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(inputA) || isOps(inputB)) {
        throw new Error('Invalid arguments');
      }

      const inputAType = typeof inputA;
      const inputBType = typeof inputB;

      if (inputAType === 'undefined' && inputBType === 'undefined') {
        return ConditionalHelpers.conditionalResponse(helper, this, true);
      } else if (inputAType === 'object' && typeof inputBType === 'object') {
        const changes = DeepDiff.diff(inputA, inputB);
        return ConditionalHelpers.conditionalResponse(helper, this, !changes, { changes });
      } else {
        const evaluation = inputA == inputB;
        return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
      }
    } catch (err) {
      console.log('Bristles Error -> Helper: eq, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _teq(inputA: any, inputB: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(inputA) || !inputB || isOps(inputB)) {
        throw new Error('Invalid arguments');
      }
      if (typeof inputA === 'object' && typeof inputB === 'object') {
        const changes = DeepDiff.diff(inputA, inputB);
        return ConditionalHelpers.conditionalResponse(helper, this, !changes, { changes });
      } else {
        const evaluation = inputA === inputB;
        return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
      }
    } catch (err) {
      console.log('Bristles Error -> Helper: teq, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _any(input: any[]): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input) || typeof input !== 'object') {
        throw new Error('Invalid arguments');
      }
      let length = 0;
      if (Array.isArray(input)) {
        length = input.length;
      } else {
        length = Object.keys(input).length;
      }
      return ConditionalHelpers.conditionalResponse(helper, this, length > 0, { length });
    } catch (err) {
      console.log('Bristles Error -> Helper: any, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _contains(input: string, test: string): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input) || !test || isOps(test)) {
        throw new Error('Invalid arguments');
      }
      const index = input.toString().indexOf(test.toString());
      return ConditionalHelpers.conditionalResponse(helper, this, index > -1, { index });
    } catch (err) {
      console.log('Bristles Error -> Helper: contains, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _startsWith(input: string, test: string): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input) || !test || isOps(test)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = input.toString().startsWith(test.toString());
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: startsWith, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _endsWith(input: string, test: string): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input) || !test || isOps(test)) {
        throw new Error('Invalid arguments');
      }
      const evaluation = input.toString().endsWith(test.toString());
      return ConditionalHelpers.conditionalResponse(helper, this, evaluation);
    } catch (err) {
      console.log('Bristles Error -> Helper: endsWith, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _includes(input: any[], test: any): any {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (!Array.isArray(input) || isOps(test)) {
        throw new Error('Invalid arguments');
      }
      if (typeof test === 'object') {
        for (const [index, item] of Object.entries(input)) {
          if (!DeepDiff.diff(item, test)) {
            return ConditionalHelpers.conditionalResponse(helper, this, true, { index });
          }
        }
        return ConditionalHelpers.conditionalResponse(helper, this, false, { index: -1 });
      } else {
        const index = input.indexOf(test);
        return ConditionalHelpers.conditionalResponse(helper, this, index > -1, { index });
      }
    } catch (err) {
      console.log('Bristles Error -> Helper: includes, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

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
  static _regexMatch(input: string, expression: string, options?: string): false | string[] | string {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (typeof input !== 'string' || typeof expression !== 'string') {
        throw new Error('Invalid arguments');
      }

      if (typeof options !== 'string') {
        options = 'gi';
      }

      const regex = new RegExp(expression, options);
      const matches = regex.exec(input) || false;
      const output: false | string[] | string = matches;

      return ConditionalHelpers.conditionalResponse(helper, this, !!output, { output });
    } catch (err) {
      console.log('Bristles Error -> Helper: regexMatch, Error:', err.message);
      return ConditionalHelpers.conditionalResponse(helper, this, false);
    }
  }

  static _elseIfWrapper() {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];

      if (!helper.fn) {
        throw new Error('The elseIfWrapper helper can only be used as a block helper');
      }

      helper.data['@elseIf'] = helper.data['@elseIf'] || [];
      helper.data['@elseIf'].push(false);

      let output = helper.fn(this);
      const level = helper.data['@elseIf'].length - 1;

      if (helper.data['@elseIf'][level] === false) {
        if (helper.inverse) {
          output = helper.inverse(this);
        } else {
          output = '';
        }
      }

      helper.data['@elseIf'].pop();
      if (helper.data['@elseIf'].length === 0) {
        delete helper.data['@elseIf'];
      }
      return output;
    } catch (err) {
      console.log('Bristles Error -> Helper: elseIfWrapper, Error:', err.message);
      return '';
    }
  }

  static _elseIf(input: any) {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];

      const level = helper.data['@elseIf'].length - 1;
      if (helper.data['@elseIf'][level] === true) {
        return '';
      }

      if (!helper.fn) {
        throw new Error('The elseIf helper can only be used as a block helper');
      }

      if (helper.inverse.name !== 'noop') {
        throw new Error('The elseIf helper should not contain an inverse/else block')
      }

      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }

      const evaluation = !!input;
      if (evaluation) {
        helper.data['@elseIf'][level] = true;
        return helper.fn(this);
      } else {
        return '';
      }
    } catch (err) {
      console.log('Bristles Error -> Helper: elseIf, Error:', err.message);
      return '';
    }
  }

  static _switch(input: any) {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];

      if (!helper.fn) {
        throw new Error('The switch helper can only be used as a block helper');
      }

      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }

      helper.data['@switch'] = helper.data['@switch'] || [];
      helper.data['@switch'].push({
        value: input,
        resolved: false
      });

      let output = helper.fn(this);
      const level = helper.data['@switch'].length - 1;

      if (helper.data['@switch'][level].resolved === false) {
        if (helper.inverse) {
          output = helper.inverse(this);
        } else {
          output = '';
        }
      }

      helper.data['@switch'].pop();
      if (helper.data['@switch'].length === 0) {
        delete helper.data['@switch'];
      }
      return output;
    } catch (err) {
      console.log('Bristles Error -> Helper: switch, Error:', err.message);
      return '';
    }
  }

  static _case(input: any) {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];

      const level = helper.data['@switch'].length - 1;
      if (helper.data['@switch'][level].resolved === true) {
        return '';
      }

      if (!helper.fn) {
        throw new Error('The case helper can only be used as a block helper');
      }

      if (helper.inverse.name !== 'noop') {
        throw new Error('The case helper should not contain an inverse/else block')
      }

      if (isOps(input)) {
        throw new Error('Invalid arguments');
      }

      const value = helper.data['@switch'][level].value;
      const evaluation = input == value;

      if (evaluation) {
        helper.data['@switch'][level].resolved = true;
        return helper.fn(this);
      } else {
        return '';
      }
    } catch (err) {
      console.log('Bristles Error -> Helper: case, Error:', err.message);
      return '';
    }
  }

  static conditionalResponse(helper: HelperOptions, context: any, evaluation: boolean, metadata: Map<any> = {}): any {
    try {
      if (!isOps(helper)) {
        throw new Error('The passed in helper is not a valid HelperOptions object');
      }

      if (!helper.fn) {
        if (evaluation && helper.hash && helper.hash.hasOwnProperty('ifTrue')) {
          return helper.hash.ifTrue;
        } else if (!evaluation && helper.hash && helper.hash.hasOwnProperty('ifFalse')) {
          return helper.hash.ifFalse;
        } else {
          return evaluation;
        }
      } else {
        let output = '';

        if (!Object.isFrozen(context)) {
          for (const [key, value] of Object.entries(metadata)) {
            context['__' + key] = value;
          }
        }

        if (evaluation) {
          output = helper.fn(context);
        } else if (helper.inverse) {
          output = helper.inverse(context);
        }

        if (!Object.isFrozen(context)) {
          for (const key of Object.keys(metadata)) {
            delete context['__' + key];
          }
        }

        return output;
      }
    } catch (err) {
      console.log('Bristles Error -> Helper: [some conditional | conditionalResponse error], Error:', err);
      return false;
    }
  }
}