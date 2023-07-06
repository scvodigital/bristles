import { HelperOptions, TemplateDelegate } from 'handlebars';
import { isOps } from '../utilities';

import { HTML_ATTRIBUTES_MAP } from './html-attributes-map';

const JSON6: any = require('json-6');
const SafeStringify = require('fast-safe-stringify');

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
export default class UtilityHelpers {
  static _json() {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      let value = helper.hash.value || null;
      if (helper.fn) {
        const type = helper.hash.type || 'object';
        const block = helper.fn(this) || '';
        switch (type) {
          case ('array'):
            try {
              value = JSON6.parse('[' + block + ']');
            } catch(err) {
              throw new Error(`Failed to parse json: ${err.message}\n[\n${block}\n]\n`);
            }
            break;
          case ('object'):
            try {
              value = JSON6.parse('{' + block + '}');
            } catch(err) {
              throw new Error(`Failed to parse json: ${err.message}\n{\n${block}\n}\n`);
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
      } else {
        return SafeStringify(value, null, 4);
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: json, Error:', err.message);
      return JSON.stringify({
        parseError: err.message
      }, null, 4);
    }
  }

  static _typeof() {
    try {
      const args = Array.from(arguments);
      args.pop();
      if (Array.isArray(args[0])) {
        return 'array';
      }
      return typeof args[0];
    } catch(err) {
      console.log('Bristles Error -> Helper: getType, Error:', err.message);
      return;
    }
  }

  static _coalesce() {
    try {
      const args = Array.from(arguments);
      const helper: HelperOptions = args.pop();
      for (const arg of args) {
        if (typeof arg !== 'undefined' && arg !== null && arg !== '') {
          return arg;
        }
      }
      if (helper.hash.empty) {
        return helper.hash.empty;
      }
      return '';
    } catch(err) {
      console.log('Bristles Error -> Helper: coalesce, Error:', err.message);
    }
  }

  static _raw(options: HelperOptions) {
    return options.fn(this);
  }

  static _lookupMap() {
    try {
      const args = Array.from(arguments);
      const options: HelperOptions = args.pop();

      const map: any = {};

      for (const [key, value] of Object.entries(options.hash)) {
        const values = Array.isArray(value) ? value : [value];
        for (const item of values) {
          map[item] = key;
        }
      }

      if (args.length > 0) {
        const input = args[0];
        if (map.hasOwnProperty(input)) {
          return map[input];
        } else if (args.length > 1) {
          return args[1];
        } else {
          return null;
        }
      } else {
        return map;
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: lookup, Error:', err.message);
      return null;
    }
  }

  static _once(key: string, context: any, options: HelperOptions) {
    try {
      if (!Array.isArray(context.__once)) {
        context.__once = [];
      } else if (context.__once.includes(key)) {
        return options.inverse ? options.inverse(this) : '';
      }
      context.__once.push(key);
      return options.fn(this);
    } catch(err) {
      console.log('Bristles Error -> Helper: once, Error:', err.message);
      return '';
    }
  }

  static _partial(partial: (context: any) => string): string {
    try {
      if (typeof partial !== 'function') {
        throw new Error('Invalid argument. Was expecting partial function');
      }

      const args = Array.from(arguments);
      const options: HelperOptions = args.pop();
      const context = args[1] || this;
      const data = Object.assign(context, options.data, options.hash);
      const output = partial(data);

      return output;
    } catch(err) {
      console.log('Bristles Error -> Helper: partial, Error:', err.message);
      return typeof partial === 'string' ? partial : '';
    }
  }

  static _toHtmlAttributes(input: any): string {
    const attributes: string[] = [];
    try {
      if (typeof input === 'string') {
        return input;
      }

      if (isOps(input)) {
        throw new Error('No input provided')
      }

      if (typeof input !== 'object' || Array.isArray(input)) {
        throw new Error('Invalid input type. Inputs must be an object or a string (for pass-through)')
      }

      const options: HelperOptions = Array.from(arguments).pop();
      const ignore: string[] = options.hash.ignore || [];
      const tagName = options.hash.tagName || false;

      const booleanAttributes = [
        'async', 'autofocus', 'autoplay', 'checked', 'contenteditable', 'controls', 'default',
        'defer', 'disabled', 'formNoValidate', 'frameborder', 'hidden', 'ismap', 'itemscope',
        'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'readonly', 'required',
        'reversed', 'scoped', 'selected', 'typemustmatch'
      ];

      const stringableTypes = ['number', 'boolean', 'string'];

      for (const [key, value] of Object.entries(input)) {
        if (tagName && !key.startsWith('data-')) {
          const attribute = HTML_ATTRIBUTES_MAP[key] || [];
          if (attribute !== true && !attribute.includes(tagName)) {
            continue;
          }
        }

        if (ignore.includes(key)) {
          continue;
        }

        const valueType = typeof value;

        if (booleanAttributes.includes(key)) {
          if (!!value) {
            attributes.push(key);
          }
        } else if (valueType === 'object') {
          const stringified = JSON.stringify(value);
          const escaped = stringified.replace(/'/g, '&apos;');
          attributes.push(`${key}='${escaped}'`);
        } else if (stringableTypes.includes(valueType)) {
          const escaped = ('' + value).replace(/"/g, '&quot;');
          if (escaped !== '') {
            attributes.push(`${key}="${escaped}"`);
          }
        }
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: toHtmlAttributes, Error:', err.message);
    }
    return attributes.join(' ');
  }

  /*TODO: This isn't currently returning anything and I need to give this some proper thought
  *       and security consideration such as checking that the evaluated function does not
  *       have ANY access to the wider context and I need to work out what to do in case of infinite
  *       loops. Also, if this is going to be used with `map` I need to work out how to stuff
  *       other parameters into the evaluated function so it isn't just the current item being
  *       mapped. May just drop this in its entirety. Though it would be amazing for filtering
  *       and preparing data
  */
  static _eval(code: string): any {
    try {
      const args = Array.from(arguments);
      const helper = args.pop();
      args.shift();

      const evaluator = function (...args: any[]) {
        return Function('"use strict";return (' + code + ')')()(...args);
      }

      const output = evaluator(...args);
    } catch(err) {
      console.log('Bristles Error -> Helper: eval, Error:', err.message);
      return err.message;
    }
  }
}
