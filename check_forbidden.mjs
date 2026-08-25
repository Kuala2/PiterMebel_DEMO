import fs from 'fs';
import path from 'path';

const forbiddenPatterns = [
  { term: "+7", regex: /\+7/i },
  { term: "₽", regex: /₽/i },
  { term: "руб", regex: /руб/i },
  { term: "гарант", regex: /гарант/i },
  { term: "Blum", regex: /blum/i },
  { term: "Hettich", regex: /hettich/i },
  { term: "Egger", regex: /egger|эггер/i },
  { term: "ЧПУ", regex: /чпу/i },
  { term: "PUR", regex: /\bpur\b|pur-/i },
  { term: "дней", regex: /дней/i },
  { term: "lorem", regex: /lorem/i },
  { term: "[placeholder]", regex: /\[\s*(ваш|текст|placeholder|xxx)/i }
];

const targetDirs = ['app', 'components', 'data'];
let hasErrors = false;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.css') || entry.name.endsWith('.js'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, lineIdx) => {
        for (const { term, regex } of forbiddenPatterns) {
          if (regex.test(line)) {
            console.error(`[FORBIDDEN FOUND] ${fullPath}:${lineIdx + 1} -> matched "${term}":\n   ${line.trim()}`);
            hasErrors = true;
          }
        }
      });
    }
  }
}

console.log('Scanning app/, components/, data/ for forbidden strings...');
for (const d of targetDirs) {
  if (fs.existsSync(d)) {
    scanDir(d);
  }
}

if (!hasErrors) {
  console.log('✅ PASS: No forbidden strings found in any user-facing code or data files!');
} else {
  console.error('❌ FAIL: Forbidden strings detected. Please fix them.');
  process.exit(1);
}
