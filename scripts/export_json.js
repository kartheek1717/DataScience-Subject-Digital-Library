import fs from 'fs';
import path from 'path';

const text = fs.readFileSync('src/data/experimentsData.ts', 'utf-8');
const eqIndex = text.indexOf('= [');
if (eqIndex !== -1) {
  const jsonStr = text.slice(eqIndex + 2).trim().replace(/;$/, '');
  const data = JSON.parse(jsonStr);
  fs.writeFileSync('scripts/experiments_all.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Exported ${data.length} experiments to scripts/experiments_all.json`);
} else {
  console.error('Could not find "= ["');
}
