import fs from 'fs';
import path from 'path';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const publicDir = path.resolve('public');
const imgDir = path.join(publicDir, 'img');
const kitchensDir = path.join(imgDir, 'kitchens');
const projectsDir = path.join(imgDir, 'projects');
const materialsDir = path.join(imgDir, 'materials');
const brandDir = path.join(imgDir, 'brand');

ensureDir(kitchensDir);
ensureDir(projectsDir);
ensureDir(materialsDir);
ensureDir(brandDir);

// 1. Copy Brand Assets
const brandSource = path.resolve('brand');
if (fs.existsSync(brandSource)) {
  const brandFiles = fs.readdirSync(brandSource);
  for (const file of brandFiles) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      fs.copyFileSync(path.join(brandSource, file), path.join(brandDir, file));
    }
  }
}

// 2. Map Kitchens (7 items)
const kitchenMap = {
  'aleksandra': {
    source: 'products/item_1_kukhnya_alexandra',
    photos: ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg', 'photo_4.jpg']
  },
  'slavena': {
    source: 'products/item_2_kukhnya_slavena',
    photos: ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg', 'photo_4.jpg', 'photo_5.jpg']
  },
  'stefania': {
    source: 'products/item_3_kukhnya_stefania',
    photos: ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg', 'photo_4.jpg', 'photo_5.jpg']
  },
  'timofey': {
    source: 'products/item_4_kukhnya_timofey',
    photos: ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg', 'photo_4.jpg', 'photo_5.jpg']
  },
  'ulyana': {
    source: 'products/item_5_kukhnya_ulyana',
    photos: ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg']
  },
  'valeria': {
    source: 'products/item_6_kukhnya_valeria',
    photos: ['photo_1.jpg', 'photo_2.jpg'],
    extra: ['posts/post_235/photo_1.jpg', 'posts/post_234/photo_2.jpg']
  },
  'viktoria': {
    source: 'products/item_7_kukhnya_viktoria',
    photos: ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg', 'photo_4.jpg']
  }
};

for (const [slug, cfg] of Object.entries(kitchenMap)) {
  const targetSub = path.join(kitchensDir, slug);
  ensureDir(targetSub);
  let idx = 1;
  for (const p of cfg.photos) {
    const srcPath = path.resolve(cfg.source, p);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(targetSub, `photo_${idx}.jpg`));
      idx++;
    }
  }
  if (cfg.extra) {
    for (const ep of cfg.extra) {
      const srcPath = path.resolve(ep);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(targetSub, `photo_${idx}.jpg`));
        idx++;
      }
    }
  }
}

// 3. Map Projects (13 items)
const projectMap = {
  'island-parquet': {
    photos: [
      'posts/post_253/photo_1.jpg',
      'posts/post_253/photo_2.jpg',
      'posts/post_253/photo_3.jpg',
      'posts/post_253/photo_4.jpg'
    ]
  },
  'oak-stone': {
    photos: [
      'posts/post_246/photo_1.jpg',
      'posts/post_246/photo_2.jpg',
      'posts/post_246/photo_3.jpg',
      'posts/post_246/photo_4.jpg',
      'posts/post_246/photo_5.jpg'
    ]
  },
  'white-showcase': {
    photos: [
      'products/item_6_kukhnya_valeria/photo_1.jpg',
      'posts/post_248/photo_1.jpg',
      'posts/post_248/photo_2.jpg',
      'posts/post_248/photo_3.jpg',
      'posts/post_250/photo_1.jpg'
    ]
  },
  'marble-hood': {
    photos: [
      'posts/post_231/photo_1.jpg',
      'posts/post_231/photo_2.jpg',
      'posts/post_231/photo_3.jpg',
      'posts/post_231/photo_4.jpg',
      'posts/post_231/photo_5.jpg'
    ]
  },
  'narrow-kitchen': {
    photos: [
      'posts/post_244/photo_1.jpg',
      'posts/post_244/photo_2.jpg',
      'posts/post_244/photo_3.jpg',
      'posts/post_234/photo_1.jpg'
    ]
  },
  'glass-wardrobe': {
    photos: [
      'posts/post_254/photo_1.jpg',
      'posts/post_254/photo_2.jpg',
      'posts/post_254/photo_3.jpg',
      'posts/post_254/photo_4.jpg',
      'posts/post_254/photo_5.jpg',
      'posts/post_254/photo_6.jpg'
    ]
  },
  'brick-wardrobe': {
    photos: [
      'posts/post_247/photo_1.jpg',
      'posts/post_247/photo_2.jpg',
      'posts/post_247/photo_3.jpg',
      'posts/post_247/photo_4.jpg',
      'posts/post_247/photo_5.jpg',
      'posts/post_247/photo_6.jpg'
    ]
  },
  'wardrobe-inside': {
    photos: [
      'posts/post_243/photo_1.jpg',
      'posts/post_243/photo_2.jpg',
      'posts/post_243/photo_3.jpg',
      'posts/post_243/photo_4.jpg',
      'posts/post_243/photo_5.jpg',
      'posts/post_243/photo_6.jpg'
    ]
  },
  'bedroom-set': {
    photos: [
      'posts/post_232/photo_1.jpg',
      'posts/post_232/photo_2.jpg',
      'posts/post_232/photo_3.jpg',
      'posts/post_232/photo_4.jpg',
      'posts/post_232/photo_5.jpg',
      'posts/post_232/photo_6.jpg'
    ]
  },
  'mirror-hall': {
    photos: [
      'posts/post_256/photo_1.jpg',
      'posts/post_256/photo_2.jpg',
      'posts/post_243/photo_2.jpg',
      'posts/post_232/photo_8.jpg'
    ]
  },
  'slat-panels': {
    photos: [
      'posts/post_245/photo_1.jpg',
      'posts/post_245/photo_2.jpg',
      'posts/post_245/photo_3.jpg',
      'posts/post_245/photo_4.jpg',
      'posts/post_245/photo_5.jpg',
      'posts/post_245/photo_6.jpg'
    ]
  },
  'oak-veneer-panel': {
    photos: [
      'posts/post_252/photo_4.jpg',
      'posts/post_233/photo_1.jpg',
      'posts/post_253/photo_3.jpg',
      'posts/post_233/photo_2.jpg'
    ]
  },
  'office-reception': {
    photos: [
      'posts/post_251/photo_1.jpg',
      'posts/post_251/photo_2.jpg',
      'posts/post_251/photo_3.jpg',
      'posts/post_251/photo_4.jpg',
      'posts/post_251/photo_5.jpg'
    ]
  }
};

for (const [slug, cfg] of Object.entries(projectMap)) {
  const targetSub = path.join(projectsDir, slug);
  ensureDir(targetSub);
  let idx = 1;
  for (const p of cfg.photos) {
    const srcPath = path.resolve(p);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(targetSub, `photo_${idx}.jpg`));
      idx++;
    }
  }
}

// 4. Map Materials (5 items)
const materialMap = {
  'enamel': 'posts/post_252/photo_4.jpg',
  'veneer': 'posts/post_253/photo_3.jpg',
  'fenix': 'products/item_1_kukhnya_alexandra/photo_3.jpg',
  'stopsol': 'posts/post_254/photo_3.jpg',
  'velvet': 'posts/post_248/photo_2.jpg'
};

for (const [key, src] of Object.entries(materialMap)) {
  const srcPath = path.resolve(src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(materialsDir, `${key}.jpg`));
  }
}

console.log('Assets prepared with enhanced mapping!');
