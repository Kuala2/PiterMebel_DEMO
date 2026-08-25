import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const sites = [
  {
    id: 'anka-bespoke',
    name: 'Anka Bespoke',
    urls: ['https://ankabespoke.co.uk/', 'https://ankabespoke.co.uk/projects', 'https://ankabespoke.co.uk/product/metal']
  },
  {
    id: 'dis-mebel',
    name: 'DiS Mebel',
    urls: ['https://dis-mebel.ru/', 'https://dis-mebel.ru/portfolio.html', 'https://dis-mebel.ru/production.html']
  },
  {
    id: 'ft-bespoke',
    name: 'FT Bespoke',
    urls: ['https://www.ftbespoke.co.uk/', 'https://www.ftbespoke.co.uk/portfolio/', 'https://www.ftbespoke.co.uk/bratton-kitchen/']
  },
  {
    id: 'matthew-cox',
    name: 'Matthew Cox',
    urls: ['https://www.matthewcox.com/', 'https://www.matthewcox.com/collections/tables', 'https://www.matthewcox.com/products/the-fire-table']
  }
];

function rgbToHex(rgbStr) {
  if (!rgbStr) return rgbStr;
  const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgbStr;
  const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
  const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
  const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
  if (match[4] !== undefined && parseFloat(match[4]) < 1) {
    const a = Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`.toUpperCase();
}

async function extractStylesFromPage(page, url) {
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);
  } catch (e) {
    console.warn(`Warning loading ${url}: ${e.message}`);
  }

  const pageData = await page.evaluate(() => {
    function getCleanStyle(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        fontWeight: cs.fontWeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
        paddingRight: cs.paddingRight,
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        borderRadius: cs.borderRadius,
        borderWidth: cs.borderWidth,
        borderColor: cs.borderColor,
        borderStyle: cs.borderStyle,
        maxWidth: cs.maxWidth,
        width: cs.width,
        height: cs.height,
        display: cs.display,
        gap: cs.gap,
        gridTemplateColumns: cs.gridTemplateColumns,
        flexDirection: cs.flexDirection,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems
      };
    }

    const h1s = Array.from(document.querySelectorAll('h1')).map(getCleanStyle).filter(Boolean);
    const h2s = Array.from(document.querySelectorAll('h2')).map(getCleanStyle).filter(Boolean);
    const h3s = Array.from(document.querySelectorAll('h3')).map(getCleanStyle).filter(Boolean);
    const ps = Array.from(document.querySelectorAll('p')).map(getCleanStyle).filter(Boolean);
    const buttons = Array.from(document.querySelectorAll('button, a.btn, a.button, a[class*="btn"], a[class*="button"], a[class*="cta"]')).map(getCleanStyle).filter(Boolean);
    const sections = Array.from(document.querySelectorAll('section, main > div, div[class*="section"], div[class*="container"], div[class*="wrapper"], div[class*="block"]')).map(getCleanStyle).filter(Boolean);
    const cards = Array.from(document.querySelectorAll('article, [class*="card"], [class*="item"], [class*="product"], [class*="project"]')).map(getCleanStyle).filter(Boolean);
    const hero = getCleanStyle(document.querySelector('header, .hero, [class*="hero"], main > section:first-of-type, #hero'));
    const bodyStyle = getCleanStyle(document.body);

    const kickers = Array.from(document.querySelectorAll('span[class*="kicker"], span[class*="caption"], span[class*="sub"], span[class*="label"], [class*="tag"], [class*="badge"]')).map(getCleanStyle).filter(Boolean);

    return {
      h1s,
      h2s,
      h3s,
      ps,
      kickers,
      buttons,
      sections,
      cards,
      hero,
      bodyStyle
    };
  });

  return pageData;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const results = {};

  for (const site of sites) {
    console.log(`\n=== Scraping site: ${site.name} ===`);
    results[site.id] = {
      name: site.name,
      pages: {}
    };

    for (const url of site.urls) {
      const pageKey = url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') || 'home';
      try {
        const data = await extractStylesFromPage(page, url);
        results[site.id].pages[pageKey] = data;
      } catch (err) {
        console.error(`Failed to extract from ${url}:`, err);
      }
    }
  }

  await browser.close();

  // Process & synthesize tokens for each site
  const synthesizedTokens = {
    meta: {
      generatedAt: new Date().toISOString(),
      viewport: '1440x900',
      description: 'Extracted computed CSS tokens from 4 reference benchmark sites'
    },
    sites: {}
  };

  for (const site of sites) {
    const siteData = results[site.id];
    const allH1 = [];
    const allH2 = [];
    const allH3 = [];
    const allBody = [];
    const allKickers = [];
    const allSections = [];
    const allCards = [];
    const allButtons = [];
    const allBorders = [];
    const allBackgrounds = [];
    const heroInfo = [];

    for (const [pageUrl, pData] of Object.entries(siteData.pages || {})) {
      if (!pData) continue;
      if (pData.h1s) allH1.push(...pData.h1s);
      if (pData.h2s) allH2.push(...pData.h2s);
      if (pData.h3s) allH3.push(...pData.h3s);
      if (pData.ps) allBody.push(...pData.ps);
      if (pData.kickers) allKickers.push(...pData.kickers);
      if (pData.sections) allSections.push(...pData.sections);
      if (pData.cards) allCards.push(...pData.cards);
      if (pData.buttons) allButtons.push(...pData.buttons);
      if (pData.bodyStyle) {
        allBackgrounds.push(pData.bodyStyle.backgroundColor);
      }
      if (pData.hero) {
        heroInfo.push(pData.hero);
      }
    }

    const getPrimary = (list, key, fallback = '') => {
      const counts = {};
      list.forEach(item => {
        const val = item[key];
        if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'none' && val !== 'normal' && val !== '0px') {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : fallback;
    };

    // Filter representative H1, H2, H3, Body
    const repH1 = allH1.find(h => parseInt(h.fontSize) >= 32) || allH1[0] || {};
    const repH2 = allH2.find(h => parseInt(h.fontSize) >= 24 && parseInt(h.fontSize) <= 56) || allH2[0] || {};
    const repH3 = allH3.find(h => parseInt(h.fontSize) >= 18 && parseInt(h.fontSize) <= 32) || allH3[0] || {};
    const repBody = allBody.find(p => parseInt(p.fontSize) >= 14 && parseInt(p.fontSize) <= 18) || allBody[0] || {};
    const repKicker = allKickers.find(k => parseInt(k.fontSize) >= 10 && parseInt(k.fontSize) <= 14) || {};
    const repBtn = allButtons[0] || {};
    const repCard = allCards[0] || {};

    const containerMaxWidths = allSections.map(s => s.maxWidth).filter(w => w && w !== 'none' && parseInt(w) > 900);

    synthesizedTokens.sites[site.id] = {
      name: site.name,
      typography: {
        h1: {
          fontSize: repH1.fontSize || '48px',
          lineHeight: repH1.lineHeight || '1.15',
          letterSpacing: repH1.letterSpacing || 'normal',
          fontWeight: repH1.fontWeight || '400',
          fontFamily: repH1.fontFamily || 'serif',
          color: rgbToHex(repH1.color || 'rgb(26, 29, 31)')
        },
        h2: {
          fontSize: repH2.fontSize || '36px',
          lineHeight: repH2.lineHeight || '1.2',
          letterSpacing: repH2.letterSpacing || 'normal',
          fontWeight: repH2.fontWeight || '400',
          fontFamily: repH2.fontFamily || 'serif',
          color: rgbToHex(repH2.color || 'rgb(26, 29, 31)')
        },
        h3: {
          fontSize: repH3.fontSize || '24px',
          lineHeight: repH3.lineHeight || '1.3',
          letterSpacing: repH3.letterSpacing || 'normal',
          fontWeight: repH3.fontWeight || '500',
          color: rgbToHex(repH3.color || 'rgb(26, 29, 31)')
        },
        body: {
          fontSize: repBody.fontSize || '16px',
          lineHeight: repBody.lineHeight || '1.6',
          letterSpacing: repBody.letterSpacing || 'normal',
          fontWeight: repBody.fontWeight || '400',
          fontFamily: repBody.fontFamily || 'sans-serif',
          color: rgbToHex(repBody.color || 'rgb(51, 51, 51)')
        },
        kicker: {
          fontSize: repKicker.fontSize || '12px',
          lineHeight: repKicker.lineHeight || '1.4',
          letterSpacing: repKicker.letterSpacing || '0.08em',
          fontWeight: repKicker.fontWeight || '600',
          textTransform: 'uppercase',
          color: rgbToHex(repKicker.color || 'rgb(120, 120, 120)')
        }
      },
      spacingAndLayout: {
        sectionPaddingTop: getPrimary(allSections, 'paddingTop', '96px'),
        sectionPaddingBottom: getPrimary(allSections, 'paddingBottom', '96px'),
        containerMaxWidth: containerMaxWidths[0] || '1280px',
        gridGap: getPrimary(allSections.concat(allCards), 'gap', '24px'),
        cardPadding: repCard.paddingTop ? `${repCard.paddingTop} ${repCard.paddingRight || repCard.paddingTop}` : '24px',
        cardBorderRadius: repCard.borderRadius || '0px'
      },
      surfacesAndColors: {
        backgroundPrimary: rgbToHex(getPrimary(allBackgrounds.map(b => ({ bg: b })), 'bg', 'rgb(247, 246, 243)')),
        surfaceCard: rgbToHex(repCard.backgroundColor || 'rgb(255, 255, 255)'),
        borderColor: rgbToHex(repCard.borderColor || 'rgb(230, 230, 230)'),
        textPrimary: rgbToHex(repBody.color || 'rgb(26, 29, 31)'),
        buttonPrimary: {
          background: rgbToHex(repBtn.backgroundColor || 'rgb(36, 77, 50)'),
          color: rgbToHex(repBtn.color || 'rgb(255, 255, 255)'),
          borderRadius: repBtn.borderRadius || '4px',
          padding: `${repBtn.paddingTop || '14px'} ${repBtn.paddingRight || '28px'}`
        }
      },
      heroGeometry: {
        height: heroInfo[0]?.height || '85vh',
        columnRatio: '55/45',
        display: heroInfo[0]?.display || 'flex',
        mediaRatio: '16/9'
      }
    };
  }

  // Save to .design/research/CSS_TOKENS.json
  const outPath = path.resolve('.design/research/CSS_TOKENS.json');
  fs.writeFileSync(outPath, JSON.stringify(synthesizedTokens, null, 2), 'utf-8');
  console.log(`\nSuccessfully written computed tokens to ${outPath}`);

  // Also save raw extracted styles for full audit trail
  fs.writeFileSync(path.resolve('.design/research/RAW_COMPUTED_STYLES.json'), JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Saved raw extracted styles to .design/research/RAW_COMPUTED_STYLES.json`);
}

run().catch(e => {
  console.error('Extraction error:', e);
  process.exit(1);
});
