import fs from 'fs';

const c1 = fs.readFileSync('.design/style-lab/concept-1.html', 'utf8');
const kit = fs.readFileSync('.design/style-lab/kitchens.html', 'utf8');
const prod = fs.readFileSync('.design/style-lab/production.html', 'utf8');

function getCss(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1] : '';
}

fs.writeFileSync('concept_1_styles.css', getCss(c1));
fs.writeFileSync('kitchens_styles.css', getCss(kit));
fs.writeFileSync('production_styles.css', getCss(prod));

console.log('Styles saved to disk!');
