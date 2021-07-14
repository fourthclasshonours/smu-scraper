import fs from 'fs';

import UNIVERSITIES from './src/sources';

try {
  fs.mkdirSync('temp');
} catch {}

async function main() {
  for (const university of UNIVERSITIES) {
    try {
      try {
        fs.mkdirSync(`temp/${university.name}`);
      } catch {}

      await university();
    } catch (e) {
      console.error(`[${university.name}]:\n`, e);
    }
  }
}

main();
