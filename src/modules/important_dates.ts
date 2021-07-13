/**
 * Parse iCal Data containing SMU important dates
 * and returns it as a JSON
 */

import * as ICAL from 'ical.js';
import { JSDOM } from 'jsdom';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

export default async function important_dates(): Promise<unknown> {
  const url = 'https://www.trumba.com/calendars/SMU_RO_Acad.ics';
  const iCalData = fetch(url).then((res) => {
    return res.text();
  });
  const jCalData = new ICAL.Component(ICAL.parse(await iCalData));
  const veventList = jCalData.getAllSubcomponents('vevent');

  // convert it into a javascript object
  const events = veventList.map((item) => {
    const vevent = new ICAL.Event(item);
    const startTime = moment.tz(
      `
      ${vevent.startDate.year}-${toTwoDigits(
        vevent.startDate.month
      )}-${toTwoDigits(vevent.startDate.day)} ${toTwoDigits(
        vevent.startDate.hour
      )}:${toTwoDigits(vevent.startDate.minute)}
    `,
      'YYYY-MM-DD hh:mm',
      'Asia/Singapore'
    );

    const endTime = moment.tz(
      `
      ${vevent.endDate.year}-${toTwoDigits(vevent.endDate.month)}-${toTwoDigits(
        vevent.endDate.day
      )} ${toTwoDigits(vevent.endDate.hour)}:${toTwoDigits(
        vevent.endDate.minute
      )}
    `,
      'YYYY-MM-DD hh:mm',
      'Asia/Singapore'
    );

    return {
      summary: htmlDecode(vevent.summary),
      startTime: startTime.unix(),
      endTime:
        vevent.endDate.hour === 23 && vevent.endDate.minute === 59
          ? endTime.add(1, 'day').set({ hour: 0, minute: 0 }).unix()
          : endTime.unix(),
    };
  });

  // remove duplicate results
  const uniqueData = events.filter((data, index) => {
    const dataString = JSON.stringify(data);
    return (
      index ===
      events.findIndex((object) => {
        return JSON.stringify(object) === dataString;
      })
    );
  });

  return uniqueData;
}

function toTwoDigits(num: number): string {
  return ('0' + num).slice(-2);
}

function htmlDecode(string: string): string {
  const toDecode = new JSDOM('<p>' + string + '</p>');
  return <string>toDecode.window.document.querySelector('p')?.textContent;
}
