/**
 * Parse existing sch_term.json into objects
 */

import fs from 'fs';

export default async function guides(): Promise<unknown> {
  const path = './src/json/guides.json';
  const raw = fs.readFileSync(path);
  const guides = JSON.parse(raw.toString());
  return guides;
}
