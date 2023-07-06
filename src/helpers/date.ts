//import { HelperOptions } from 'handlebars';

import * as DateFns from 'date-fns';
import * as DateFnsTz from 'date-fns-tz';
import { isOps } from 'src/utilities';
import { HelperOptions } from 'handlebars';
const DateMaths = require('@elastic/datemath');

/**
 * A bunch of helpers for working with dates
 */
export default class DateHelpers {
  static _dateParse(date: string, format: string): Date {
    try {
      date = date && date.toString() || '';
      format = typeof format !== 'string' ? '' : format;
      const parsed = DateFns.parse(date, format, new Date());
      return parsed;
    } catch(err) {
      console.log('Bristles Error -> Helper: dateParse, Error:', err.message);
      return new Date(0);
    }
  }

  static _dateFormat(date: Date | number, format: string) {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      const timezone = typeof helper.hash.timezone !== 'string' ? 'Europe/London' : helper.hash.timezone;

      date = date instanceof Date || typeof date === 'number' ? new Date(date) : new Date();
      date = DateFnsTz.utcToZonedTime(date, timezone);
      format = typeof format !== 'string' ? 'yyyy-MM-dd hh:mm:ss' : format;

      const formatted = DateFnsTz.format(date, format, { timeZone: timezone });

      return formatted;
    } catch(err) {
      console.log('Bristles Error -> Helper: dateFormat, Error:', err.message);
      return '';
    }
  }

  static _dateMaths(expression: string, date: Date) {
    try {
      if (typeof expression !== 'string') {
        throw new Error('Expressions must be strings');
      }

      date = date instanceof Date || typeof date === 'number' ? new Date(date) : new Date();

      const output = DateMaths.parse(expression, { forceNow: date });
      return output.toDate();
    } catch(err) {
      console.log('Bristles Error -> Helper: dateMaths, Error:', err.message);
      return new Date();
    }
  }

  static _dateDistance(date: Date, baseDate: Date) {
    try {
      const helper: HelperOptions = arguments[arguments.length - 1];
      date = date instanceof Date || typeof date === 'number' ? new Date(date) : new Date();
      baseDate = baseDate instanceof Date || typeof baseDate === 'number' ? new Date(baseDate) : new Date();

      const options: any = {};

      if (helper.hash.includeSeconds) {
        options.includeSeconds = !!helper.hash.includeSeconds;
      }

      if (helper.hash.addSuffix) {
        options.addSuffix = !!helper.hash.addSuffix;
      }

      const output = DateFns.formatDistance(date, baseDate, options);
      return output;
    } catch(err) {
      console.log('Bristles Error -> Helper: dateMaths, Error:', err.message);
      return new Date();
    }
  }
}