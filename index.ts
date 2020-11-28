import fs from 'fs';
import path from 'path';

import MODULES from './src/modules';

const isProduction = process.env.NODE_ENV === 'production';

const main = async () => {
  for (const module of MODULES) {
    const module_name = module.name;
    const filename = path.join('temp', `${module_name}.json`);
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    const results = await module();
    fs.writeFileSync(
      filename,
      JSON.stringify(results, null, isProduction ? 0 : 2)
    );
  }
};

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp');
}

main();
