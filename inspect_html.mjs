import fs from 'fs';

function inspectHtml(filename) {
  console.log('====================================');
  console.log('INSPECTING: ' + filename);
  console.log('====================================');
  const html = fs.readFileSync('.design/style-lab/' + filename, 'utf8');
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('<section') || l.includes('<header') || l.includes('<footer') || l.includes('class="ornament-divider"')) {
      console.log(`${i + 1}: ${l.trim()}`);
    }
  });
}

inspectHtml('concept-1.html');
inspectHtml('kitchens.html');
inspectHtml('production.html');
