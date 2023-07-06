import { HelperOptions } from 'handlebars';
import { isFunction } from 'util';

import * as dot from 'dot-object';
import * as MathJS from 'mathjs';

import { isOps } from '../utilities';

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
export default class ArrayHelpers {
  static _map(input: any[], func: (...args: any[]) => any): any[] {
    try {
      if (!Array.isArray(input) || !isFunction(func)) {
        throw new Error('Invalid arguments');
      }
      return input.map(func);
    } catch(err) {
      console.log('Bristles Error -> Helper: map, Error:', err.message);
      return [];
    }
  }

  static _pluck(input: any[], path: string, undefinedAsNull: boolean) {
    const output: any[] = [];

    try {
      if (!Array.isArray(input)) {
        throw new Error('Input is not an array');
      }

      if (typeof path !== 'string') {
        throw new Error('Path is not a string');
      }

      for (const item of input) {
        const value = dot.pick(path, item);
        if (typeof value === 'undefined' && undefinedAsNull !== true) continue;
        output.push(value);
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: Pluck, Error:', err.message);
    }

    return output;
  }

  static _union(inputA: any[], inputB: any[]) {
    try {
      return MathJS.setUnion(inputA, inputB);
    } catch(err) {
      console.log('Bristles Error -> Helper: union, Error:', err.message);
      return [];
    }
  }

  static _intersect(inputA: any[], inputB: any[]) {
    try {
      return MathJS.setIntersect(inputA, inputB);
    } catch(err) {
      console.log('Bristles Error -> Helper: intersect, Error:', err.message);
      return [];
    }
  }

  static _difference(inputA: any[], inputB: any[]) {
    try {
      return MathJS.setDifference(inputA, inputB);
    } catch(err) {
      console.log('Bristles Error -> Helper: difference, Error:', err.message);
      return [];
    }
  }

  static _filter(items: any[], property: string, comparator: string, test: any) {
    const found: any[] = [];

    try {
      items.forEach(item => {
        const value: any = property === null ? item : dot.pick(property, item);
        let match = false;
        try {
          switch (comparator) {
            case ('==='): match = value === test;
            break;
            case ('=='): match = value == test;
            break;
            case ('>='): match = value >= test;
            break;
            case ('>'): match = value > test;
            break;
            case ('<='): match = value <= test;
            break;
            case ('<'): match = value < test;
            break;
            case ('testIn'): match = value.indexOf(test) > -1;
            break;
            case ('valueIn'): match = test.indexOf(value) > -1;
            break;
            case ('testNotIn'): match = value.indexOf(test) === -1;
            break;
            case ('valueNotIn'): match = test.indexOf(value) === -1;
            break;
            case ('exists'): match = !!property;
          }
        } catch(err) { }
        if (match) {
          found.push(item);
        }
      });
    } catch(err) {
      console.log('Bristles Error -> Helper: filter, Error:', err.message);
    }

    return found;
  }

  static _each(input: any, join: string): string {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (isOps(input)){
        throw new Error('Invalid arguments');
      }

      if (!helper.fn) {
        throw new Error('The each helper can only be used as a block helper');
      }

      let outputs: string[] = [];
      input = typeof input === 'undefined' ? [] : typeof input !== 'object' ? [input] : input;

      if (Array.isArray(input)) {
        const total = input.length;
        for (let index = 0; index < total; index++) {
          const data = {
            '__total': total,
            '__first': index === 0,
            '__last': index === total - 1,
            '__index': index
          };
          const item = Object.assign(input[index], data);

          const output = helper.fn(item).trim();
          outputs.push(output);
        }
      } else {
        const keys = Object.keys(input);
        const total = keys.length;
        for (let index = 0; index < keys.length; index++) {
          const data = {
            '__total': total,
            '__first': index === 0,
            '__last': index === total - 1,
            '__key': keys[index]
          };
          const item = Object.assign(input[keys[index]], data);

          const output = helper.fn(item).trim();
          outputs.push(output);
        }
      }

      outputs = outputs.filter(item => !!item);
      if (outputs.length > 0) {
        return outputs.join(typeof join === 'string' ? join : '\n');
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: each, Error:', err.message);
    }

    try {
      if (helper.inverse) {
        return helper.inverse(this);
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: each, Inverse Error:', err);
    }

    return '';
  }

  static _sort(input: any[], direction?: string, path?: string): any[] {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (!Array.isArray(input)) {
        throw new Error('Invalid arguments');
      }

      direction = direction || 'asc';
      direction = direction === 'desc' ? 'desc' : 'asc';
      path = typeof path === 'string' ? path : undefined;

      let func = (a: number, b: number) => { return a - b; };
      if (!path) {
        if (direction === 'desc') {
          func = (a: number, b: number) => { return b - a; };
        }
      } else {
        if (direction === 'desc') {
          func = (a: number, b: number) => {
            return dot.pick(path || '', b) - dot.pick(path || '', a);
          };
        } else {
          func = (a: number, b: number) => {
            return dot.pick(path || '', a) - dot.pick(path || '', b);
          };
        }
      }

      if (helper.hash.mutate === true) {
        return input.sort(func);
      } else {
        const clone = JSON.parse(JSON.stringify(input));
        clone.sort(func);
        return clone;
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: sort, Error:', err.message);
      return Array.isArray(input) ? input : [];
    }
  }

  static _slice(input: any[], begin?: number, end?: number): any[] {
    try {
      if (!Array.isArray(input)) {
        throw new Error('Invalid arguments');
      }

      begin = typeof begin === 'number' ? begin : 0;
      end = typeof end === 'number' ? end : undefined;

      return input.slice(begin, end);
    } catch(err) {
      console.log('Bristles Error -> Helper: slice, Error:', err.message);
      return [];
    }
  }

  static _splice(input: any[], start?: number, deleteCount?: number, items?: any[]): any[] {
    const helper: HelperOptions = arguments[arguments.length - 1];
    try {
      if (!Array.isArray(input)) {
        throw new Error('Invalid arguments');
      }

      start = typeof start === 'number' ? start : 0;
      deleteCount = typeof deleteCount === 'number' ? deleteCount : 0;
      items = Array.isArray(items) ? items : [];

      if (helper.hash.mutate === true) {
        return input.splice(start, deleteCount, ...items);
      } else {
        const clone = JSON.parse(JSON.stringify(input));
        clone.splice(start, deleteCount, ...items);
        return clone;
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: splice, Error:', err.message);
      return [];
    }
  }

  static _count(input: any): number {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (isOps(input) || typeof input !== 'object') {
        return 0;
      }
      if (Array.isArray(input)) {
        return input.length;
      } else {
        return Object.keys(input).length;
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: count, Error:', err.message);
      return 0;
    }
  }

  static _itemAt(input: any[], index: number): any {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      if (!Array.isArray(input) || typeof index !== 'number') {
        throw new Error('Invalid arguments');
      }

      if (index < 0) {
        const position = input.length + index;
        if (position < 0) {
          throw new Error(`Position ${position} is out of bounds. Input has ${input.length} items`);
        }
        return input[position];
      } else {
        if (index >= input.length) {
          throw new Error(`Position ${index} is out of bounds. Input has ${input.length} items`);
        }
        return input[index];
      }
    } catch(err) {
      console.log('Bristles Error -> Helper: itemAt, Error:', err.message);
      return null;
    }
  }

  static _array(): any[] {
    try {
      const args = Array.from(arguments);
      return args.slice(0, args.length - 1);
    } catch(err) {
      console.log('Bristles Error -> Helper: array, Error:', err.message);
      return [];
    }
  }

  static _join(input: any[], separator: string): string {
    try {
      if (!Array.isArray(input)) {
        throw new Error('First argument must be an array');
      }

      separator = typeof separator === 'string' ? separator : ',';
      const options: HelperOptions = Array.from(arguments).pop();

      if (input.length === 0 && options.hash.wrapEmpty !== true) {
        return '';
      }

      const joined = input.join(separator);
      const left = options.hash.left || '';
      const right = options.hash.right || '';
      return `${left}${joined}${right}`;
    } catch(err) {
      console.log('Bristles Error -> Helper: join, Error:', err.message);
      return '';
    }
  }
}
