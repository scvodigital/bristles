import * as Querystring from 'querystring';
import { HelperOptions, TemplateDelegate } from 'handlebars';
import * as dot from 'dot-object';
import { isOps } from '../utilities';
import * as deepmerge from 'deepmerge';

const JSON6: any = require('json-6');

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
export default class ObjectHelpers {
  static _values(input: any): any {
    try {
      if (typeof input !== 'object' || isOps(input)) {
        throw new Error('Invalid arguments');
      }
      return Object.values(input);
    } catch(err) {
      console.log('Bristles Error -> Helper: values, Error:', err.message);
      return null;
    }
  }

  static _keys(input: any): any {
    try {
      if (typeof input !== 'object' || isOps(input)) {
        throw new Error('Invalid arguments');
      }
      return Object.keys(input);
    } catch(err) {
      console.log('Bristles Error -> Helper: keys, Error:', err.message);
      return null;
    }
  }

  static _entries(input: any): any {
    try {
      if (typeof input !== 'object' || isOps(input)) {
        throw new Error('Invalid arguments');
      }
      return Object.entries(input);
    } catch(err) {
      console.log('Bristles Error -> Helper: entries, Error:', err.message);
      return null;
    }
  }

  static _get(context: any, path: string): any {
    try {
      if (typeof path !== 'string') {
        throw new Error('Invalid arguments');
      }
      return dot.pick(path, context);
    } catch(err) {
      console.log('Bristles Error -> Helper: get, Error:', err.message);
      return null;
    }
  }

  static _merge(): any {
    try {
      const args = Array.from(arguments);
      const helper = args.pop();
      if (args.length < 2) {
        throw new Error('Invalid arguments');
      }
      return {}; //deepmerge(...args);
    } catch(err) {
      console.log('Bristles Error -> Helper: entries, Error:', err.message);
      return null;
    }
  }

  static _querystringify(input: any) {
    try {
      if (typeof input !== 'object' || input === null || isOps(input)) {
        throw new Error('Invalid arguments');
      }
      return Querystring.stringify(input);
    } catch(err) {
      console.log('Bristles Error -> Helper: querystringify, Error:', err.message);
      return '';
    }
  }

  static _listify(input: any) {
    try {
      if (!input || typeof input !== 'object') {
        throw new Error('Invalid arguments');
      }

      const json = JSON.stringify(input, null, 4);
      return json.replace(/^(?:\s*")(.*?)(?:": [{\[]$)/gim, '<li><strong>$1</strong>:<ul>')
        .replace(/^(?:\s*")(.*?)(?:": )(.*?),?$/gim, '<li><strong>$1</strong>: $2</li>')
        .replace(/^\s*((".*?")|(true)|(false)|(null)|(\d+)),?$/gim, '<li>$1</li>')
        .replace(/ +[{\[]$/gim, '<li><ul class="list-json">')
        .replace(/ +[}\]],?$/gim, '</ul></li>')
        .replace(/[{\[]$/gim, '<ul class="list-json">')
        .replace(/[}\]],?$/gim, '</ul>');
    } catch(err) {
      console.log('Bristles Error -> Helper: listify, Error:', err.message);
      return '';
    }
  }

  //TODO: Merge options
  static _parse(value: any): any {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];

      if (!value || isOps(value)) {
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
        const path = helper.hash.path || '@parsed';
        dot.set(path, value, helper.hash.context);
      } else {
        return value;
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: parse, Error:', err.message);
    }
  }

  static _extend(): any {
    try {
      const args = Array.from(arguments);
      const helper: HelperOptions = args.pop();

      if (args.length === 0) {
        args.push({});
      }

      if (Object.keys(helper.hash).length > 0) {
        args.push(helper.hash);
      }

      const objArgs = args.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item));

      const output = deepmerge.all([{}, ...objArgs], {
        arrayMerge: (destinationArray, sourceArray, options) => sourceArray
      });

      if (!helper.fn) {
        return output;
      } else {
        return helper.fn(output);
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: extend, Error:', err.message);
      return null;
    }
  }

  static _o(): any {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      return Object.assign({}, helper.hash || {});
    } catch(err) {
      console.log('Bristles Error -> Helper: o, Error:', err.message);
      return {};
    }
  }
}