import { parseImportantDates } from './src/modules';

const main = async () => {
  const importantDate = await parseImportantDates();
  console.log(importantDate);
};

main();
