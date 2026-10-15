import fs from 'fs';
import path from 'path';

// 1. Update src/data/experimentsData.ts
const expDataPath = path.resolve('src/data/experimentsData.ts');
let expDataContent = fs.readFileSync(expDataPath, 'utf-8');

const eqIndex = expDataContent.indexOf('= [');
if (eqIndex !== -1) {
  const jsonStr = expDataContent.slice(eqIndex + 2).trim().replace(/;$/, '');
  const data = JSON.parse(jsonStr);
  
  data.forEach((exp) => {
    exp.demoVideoUrl = `/videos/${exp.id}.mp4`;
  });
  
  const newContent = `import { Experiment } from '../types';

export const INITIAL_EXPERIMENTS: Experiment[] = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(expDataPath, newContent, 'utf-8');
  console.log(`Updated ${data.length} experiments in src/data/experimentsData.ts with demoVideoUrl`);
}

// 2. Also update scripts/build_experiments_data.js
const buildScriptPath = path.resolve('scripts/build_experiments_data.js');
let buildContent = fs.readFileSync(buildScriptPath, 'utf-8');

for (let i = 1; i <= 10; i++) {
  const idStr = `id: 'exp-${i}',`;
  const videoStr = `demoVideoUrl: '/videos/exp-${i}.mp4',`;
  if (!buildContent.includes(`demoVideoUrl: '/videos/exp-${i}.mp4'`)) {
    buildContent = buildContent.replace(idStr, `${idStr}\n    ${videoStr}`);
  }
}

fs.writeFileSync(buildScriptPath, buildContent, 'utf-8');
console.log('Updated scripts/build_experiments_data.js');
