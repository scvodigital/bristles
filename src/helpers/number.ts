import * as MathJS from 'mathjs';
import { HelperOptions, TemplateDelegate } from 'handlebars';
import { isOps } from '../utilities';

/**
 * A bunch of helpers for working with numbers
 */
export default class NumberHelpers {
  static _sum(...args: any[]): number {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      args.pop();
      return args.reduce(function(a, b){ return a + b; });
    } catch (err) {
      console.log('Bristles Error -> Helper: sum, Error:', err.message);
      return 0;
    }
  }

  static _maths(expression: string, data: any) {
    try {
      if (typeof expression !== 'string') {
        throw new Error('Invalid arguments, the first argument must be a string');
      }

      const args = Array.from(arguments);
      const helper: HelperOptions = args.pop();

      if (isOps(data)) {
        data = this;
      }

      data = Object.assign(data, helper.hash)

      const output = MathJS.evaluate(expression, data);

      return output;
    } catch (err) {
      console.log('Bristles Error -> Helper: maths, Error:', err.message);
      return 0;
    }
  }

  static _toLocaleString(input: any, locale: string, radix: number) {
    try {
      const args = Array.from(arguments);
      const helper: HelperOptions = args.pop();
      const options = helper.hash;

      locale = typeof locale === 'string' ? locale : 'en-GB';
      radix = typeof radix === 'number' ? radix : 10;

      let num = parseInt(input, radix);

      if (Number.isNaN(num)) {
        return input;
      }

      return num.toLocaleString(locale, options);
    } catch (err) {
      console.log('Bristles Error -> Helper: format, Error:', err.message);
      return input;
    }
  }
}