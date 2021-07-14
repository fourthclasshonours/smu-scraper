import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import * as smuTerms from '../../term_data/SMU';
import getImportantDates from './getImportantDates';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const basePath = `${path.resolve()}/temp/SMU`;

export default async function SMU(): Promise<void> {
  console.time('smu');

  const importantDates = await getImportantDates();

  // write to file
  fs.writeFileSync(
    basePath + '/important_dates.json',
    JSON.stringify(importantDates, null, isProduction ? 0 : 2)
  );

  fs.writeFileSync(
    basePath + '/school_terms.json',
    JSON.stringify(smuTerms.default, null, isProduction ? 0 : 2)
  );

  console.timeEnd('smu');
}
