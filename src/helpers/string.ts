import { HelperOptions, TemplateDelegate } from 'handlebars';
import * as S from 'string';
import Dedent from 'ts-dedent';
const TruncHtml = require('trunc-html');

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
export default class StringHelpers {
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
  static _split(input: string, delimeter?: string): string[] {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return [];
      }
      if (delimeter == null || delimeter.constructor.name !== 'String') {
        delimeter = ',';
      }
      return input.split(delimeter);
    } catch(err) {
      console.error('Bristles Error -> Helper: split, Error:', err.message);
      return [];
    }
  }

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
  static _substr(input: string, from: number, length?: number): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
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
    } catch(err) {
      console.error('Bristles Error -> Helper: substr, Error:', err.message);
      return '';
    }
  }

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
  static _substring(input: string, start: number, end?: number): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
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
    } catch(err) {
      console.error('Bristles Error -> Helper: substring, Error:', err.message);
      return '';
    }
  }

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
  static _concat(...args: any[]): string {
    try {
      const helper: HelperOptions = args.pop();
      const unstringableTypes = ['function', 'undefined', 'object'];
      const stringableArgs = args.filter(arg => !unstringableTypes.includes(typeof arg))
      const output = stringableArgs.join(helper.hash.separator || '');
      return output;
    } catch(err) {
      console.error('Bristles Error -> Helper: concat, Error:', err.message);
      return '';
    }
  }

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
  static _indexOf(input: string, match: string): number {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String' || !match || typeof match === 'object') {
        return -1;
      }
      return input.indexOf(match.toString());
    } catch(err) {
      console.error('Bristles Error -> Helper: indexOf, Error:', err.message);
      return -1;
    }
  }

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
  static _lastIndexOf(input: string, match: string): number {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String' || !match || typeof match === 'object') {
        return -1;
      }
      return input.lastIndexOf(match.toString());
    } catch(err) {
      console.error('Bristles Error -> Helper: indexOf, Error:', err.message);
      return -1;
    }
  }

  static _toUpperCase(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return input.toUpperCase();
    } catch(err) {
      console.error('Bristles Error -> Helper: toUpperCase, Error:', err.message);
      return '';
    }
  }

  static _toLowerCase(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return input.toLowerCase();
    } catch(err) {
      console.error('Bristles Error -> Helper: toLowerCase, Error:', err.message);
      return '';
    }
  }

  static _inflect(count: number, singular: any, plural: any, includeCount: boolean) {
    try {
      const word = (count > 1 || count === 0) ? plural : singular;
      if (includeCount === true) {
        return String(count) + ' ' + word;
      } else {
        return word;
      }
    } catch(err) {
      console.error('Bristles Error -> Helper: inflect, Error:', err.message);
      return singular || plural || '';
    }
  };

  static _padStart(input: string, maxLength: number, fillString: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
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
    } catch(err) {
      console.error('Bristles Error -> Helper: padStart, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _padEnd(input: string, maxLength: number, fillString: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
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
    } catch(err) {
      console.error('Bristles Error -> Helper: padEnd, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _repeat(input: string, times: number): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String' || typeof times !== 'number') {
        return '';
      }
      return input.repeat(times);
    } catch(err) {
      console.error('Bristles Error -> Helper: repeat, Error:', err.message);
      return '';
    }
  }

  static _camelize(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).camelize().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: camelize, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _capitalize(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).capitalize().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: capitalize, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _chompLeft(input: string, prefix: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      prefix = typeof prefix === 'string' ? prefix : input.substring(0, 1) || ' ';
      return S(input).chompLeft(prefix).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: chompLeft, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _chompRight(input: string, suffix: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      suffix = typeof suffix === 'string' ? suffix : input.substring(0, 1) || ' ';
      return S(input).chompRight(suffix).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: chompRight, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _collapseWhitespace(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).collapseWhitespace().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: collapseWhitespace, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _countOccurances(input: string, substring: string): number {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String' || substring == null || substring.constructor.name !== 'String') {
        return 0;
      }
      return S(input).count(substring);
    } catch(err) {
      console.error('Bristles Error -> Helper: countOccurances, Error:', err.message);
      return 0;
    }
  }

  static _dasherize(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).dasherize().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: dasherize, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _decodeHTMLEntities(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).decodeHTMLEntities().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: decodeHTMLEntities, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _ensureLeft(input: string, prefix: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      if (prefix == null || prefix.constructor.name !== 'String') {
        return input;
      }
      return S(input).ensureLeft(prefix).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: ensureLeft, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _ensureRight(input: string, suffix: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      if (suffix == null || suffix.constructor.name !== 'String') {
        return input;
      }
      return S(input).ensureRight(suffix).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: ensureRight, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _humanize(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).humanize().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: humanize, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _lines(input: string): string[] {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return [];
      }
      return S(input).lines();
    } catch(err) {
      console.error('Bristles Error -> Helper: lines, Error:', err.message);
      return typeof input === 'string' ? [input] : [];
    }
  }

  static _replace(input: string, match: string, replacement: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      if (match == null || match.constructor.name !== 'String' || replacement == null || replacement.constructor.name !== 'String') {
        return input;
      }
      return input.split(match).join(replacement);
    } catch(err) {
      console.error('Bristles Error -> Helper: replace, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _regexReplace(input: string, match: string, options: string, replacement: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      if (match == null || match.constructor.name !== 'String' || options == null || options.constructor.name !== 'String' || replacement == null || replacement.constructor.name !== 'String') {
        return input;
      }
      const regex = new RegExp(match, options);
      return input.replace(regex, replacement);
    } catch(err) {
      console.error('Bristles Error -> Helper: replace, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _slugify(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input.replace(/\//g, '-')).slugify().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: slugify, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _trim(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).trim().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: trim, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _trimLeft(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).trimLeft().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: trimLeft, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _trimRight(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).trimRight().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: trimRight, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _stripLeft(input: string, chars: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      chars = typeof chars === 'string' ? chars : '\s';
      return S(input).stripLeft(chars).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: stripLeft, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _stripRight(input: string, chars: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      chars = typeof chars === 'string' ? chars : '\s';
      return S(input).stripRight(chars).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: stripRight, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _stripTags(input: string): string {
    try {
      const tags = Array.from(arguments);
      tags.pop();
      tags.shift();
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).stripTags(...tags).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: stripTags, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _titleCase(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).titleCase().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: titleCase, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _toBoolean(input: string): boolean {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return false;
      }
      return S(input).toBoolean();
    } catch(err) {
      console.error('Bristles Error -> Helper: toBoolean, Error:', err.message);
      return false;
    }
  }

  static _truncate(input: string, length: number, chars: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      if (typeof length !== 'number') {
        return input;
      }
      chars = typeof chars === 'string' ? chars : '...';
      return S(input).truncate(length, chars).s;
    } catch(err) {
      console.error('Bristles Error -> Helper: truncate, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _truncateHtml(input: string, length: number): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      if (typeof length !== 'number') {
        return input;
      }

      const options: any = {};

      if (typeof helper.hash.ignoreTags === 'string') {
        options.ignoreTags = helper.hash.ignoreTags.split(',');
      } else if (Array.isArray(helper.hash.ignoreTags)) {
        options.ignoreTags = helper.hash.ignoreTags;
      }

      if (typeof helper.hash.imageAltText !== 'boolean') {
        options.imageAltText = !!helper.hash.imageAltText;
      }

      if (typeof helper.hash.sanitizer === 'object') {
        options.sanitizer = helper.hash.sanitizer;
      }

      const output = TruncHtml(input, length, options);

      if (helper.hash.returnText === true) {
        return output.text;
      } else {
        return output.html;
      }
    } catch(err) {
      console.error('Bristles Error -> Helper: truncateHtml, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _underscore(input: string): string {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String') {
        return '';
      }
      return S(input).underscore().s;
    } catch(err) {
      console.error('Bristles Error -> Helper: underscore, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }

  static _encodeURIComponent(input: string) {
    return encodeURIComponent('' + input);
  }

  static _encodeURI(input: string) {
    return encodeURI('' + input);
  }

  static _decodeURIComponent(input: string) {
    return decodeURIComponent('' + input);
  }

  static _decodeURI(input: string) {
    return decodeURI('' + input);
  }

  static _unindent(): string {
    try {
      const args = Array.from(arguments);
      const helper = args.pop();

      const input = (args[0] || helper.fn(this)) as string;
      const output = Dedent(input);

      return output;
    } catch(err) {
      console.error('Bristles Error -> Helper: unindent, Error:', err.message);
      return typeof arguments[0] === 'string' ? arguments[0] : '';
    }
  }

  static _match(input: string, pattern: string, options: string): string|RegExpExecArray[] {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (input == null || input.constructor.name !== 'String' || pattern == null || pattern.constructor.name !== 'String') {
        return '';
      }
      options = typeof options === 'string' ? options : 'gi';
      const regex = new RegExp(pattern, options);

      const matches: RegExpExecArray[] = [];
      let match: RegExpExecArray|null = null;
      while ((match = regex.exec(input)) !== null) {
        matches.push(match);
      }

      if (helper.fn) {
        if (matches.length === 0 && helper.inverse) {
          return helper.inverse(this);
        } else if (matches.length > 0) {
          const output = [];
          for (let index = 0; index < matches.length; index++) {
            const context = {
              match: matches[index],
              first: index === 0,
              last: index === matches.length - 1,
              index
            };
            output.push(helper.fn(context));
          }
          return output.join('');
        }
      }

      return matches;
    } catch(err) {
      console.error('Bristles Error -> Helper: match, Error:', err.message);
      return typeof input === 'string' ? input : '';
    }
  }
}
