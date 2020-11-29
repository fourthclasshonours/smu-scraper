/**
 * Parse existing sch_term.json into objects
 */

import fs from 'fs';

export default async function sch_terms(): Promise<unknown> {
  const path = './src/json/sch_terms.json';
  const raw = fs.readFileSync(path);
  const sch_terms = JSON.parse(raw.toString());
  return sch_terms;
}
