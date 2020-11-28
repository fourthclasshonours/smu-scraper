/**
 * Parse iCal Data containing SMU important dates
 * and returns it as a JSON
 */

import * as ICAL from 'ical.js';
import jsdom, { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

export default async function importantDates(): Promise<unknown> {
  const url = 'https://www.trumba.com/calendars/SMU_RO_Acad.ics';
  const iCalData = fetch(url).then((res) => {
    return res.text();
  });
  const jCalData = new ICAL.Component(ICAL.parse(await iCalData));
  const veventList = jCalData.getAllSubcomponents('vevent');

  // convert it into a javascript object
  const events = veventList.map((item) => {
    const vevent = new ICAL.Event(item);
    const startTime =
      <number>vevent.startDate.year +
      '-' +
      toTwoDigits(vevent.startDate.month) +
      '-' +
      toTwoDigits(vevent.startDate.day) +
      'T' +
      toTwoDigits(vevent.startDate.hour) +
      ':' +
      toTwoDigits(vevent.startDate.minute) +
      ':' +
      toTwoDigits(vevent.startDate.second) +
      '+08:00';

    const endTime =
      <number>vevent.endDate.year +
      '-' +
      toTwoDigits(vevent.endDate.month) +
      '-' +
      toTwoDigits(vevent.endDate.day) +
      'T' +
      toTwoDigits(vevent.endDate.hour) +
      ':' +
      toTwoDigits(vevent.endDate.minute) +
      ':' +
      toTwoDigits(vevent.endDate.second) +
      '+08:00';

    return {
      summary: htmlDecode(vevent.summary),
      startTime: Date.parse(startTime),
      endTime: Date.parse(endTime),
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
