/**
 * Parse existing sch_term.json into objects
 */

import fs from 'fs';

export default async function community(): Promise<unknown> {
  const path = './src/json/community.json';
  const raw = fs.readFileSync(path);
  const community = JSON.parse(raw.toString());
  return community;
}
