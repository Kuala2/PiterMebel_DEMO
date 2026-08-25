import fs from 'fs';
import path from 'path';

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') checkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (/ class=/.test(l)) {
          console.log(`${fullPath}:${i + 1}: ${l.trim()}`);
        }
      });
    }
  }
}

checkDir('app');
checkDir('components');
console.log('Checked all files for class=');
