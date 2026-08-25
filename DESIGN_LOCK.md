import fs from 'fs';

const c1Styles = fs.readFileSync('concept_1_styles.css', 'utf8');
const kitStyles = fs.readFileSync('kitchens_styles.css', 'utf8');
const prodStyles = fs.readFileSync('production_styles.css', 'utf8');

const designLockContent = `# DESIGN_LOCK.md — Фиксация дизайн-системы концепта «ПитерМебель»

> Данный документ является единственным и непререкаемым источником правды для всей вёрстки проекта.
> Любые отклонения от значений ниже строго запрещены.

---

## 1. CSS-переменные и цветовая палитра

### Палитра (Quiet Luxury Studio: Balanced, Restrained, Natural)
\`\`\`css
:root {
  /* Фоны */
  --bg-dark: #0A0C0E;             /* Основной глубокий темный фон */
  --bg-surface: #111418;          /* Фон секций (Surface 1) */
  --bg-surface-elevated: #161A1F; /* Фон карточек и блоков (Surface 2) */
  --bg-surface-hover: #202429;    /* Состояние наведения карточек */
  --bg-header-scrolled: rgba(10, 12, 14, 0.94); /* Шапка при скролле с blur(14px) */

  /* Фирменный зеленый акцент (Цвет оригами-птицы ПитерМебель) */
  --color-green-brand: #72BA38;   /* Основной зеленый акцент */
  --color-green-hover: #82D140;   /* Зеленый при наведении */
  --color-green-dark: #1E2E14;    /* Темно-зеленый фон бейджей */
  --color-green-subtle: rgba(114, 186, 56, 0.12); /* Полупрозрачный зеленый фон */

  /* Типографические цвета */
  --color-text-primary: #FFFFFF;   /* Основной белый текст и заголовки */
  --color-text-secondary: #C4CAD3; /* Спокойный читаемый вторичный текст */
  --color-text-muted: #828B99;     /* Приглушенные подписи и метаданные */

  /* Границы и разделители */
  --border-subtle: rgba(255, 255, 255, 0.08); /* Тонкие границы карточек и секций */
  --border-medium: rgba(255, 255, 255, 0.14); /* Границы интерактивных элементов */
  --border-green: rgba(114, 186, 56, 0.45);   /* Акцентные границы при наведении */

  /* Скругления */
  --radius-sm: 4px;  /* Кнопки, табы, бейджи */
  --radius-md: 6px;  /* Карточки каталога и объектов */
  --radius-lg: 10px; /* Большие модальные и акцентные блоки */

  /* Сетка и контейнер */
  --container-max: 1360px;
  --transition: all 0.22s ease;
}
\`\`\`

---

## 2. Подключенные шрифты и типографическая иерархия

### Подключение Google Fonts:
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap&subset=cyrillic" rel="stylesheet">
\`\`\`

### Шрифтовые семейства:
- **Основной текст и интерфейс**: \`--font-main: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;\`
- **Заголовки и акценты**: \`--font-serif: 'Cormorant Garamond', Garamond, Georgia, serif;\`

### Размеры, начертания и межстрочные интервалы:

| Элемент / Селектор | Шрифт | Размер (Desktop) | Размер (Mobile ≤768px) | Начертание (Weight) | Line-Height | Letter-Spacing | Цвет |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Slogan (H1)** (\`.hero-slogan-title\`) | Serif | \`78px\` | \`38px\` (\`48px\` на 1024px) | \`400\` | \`1.08\` | \`0.01em\` | \`#FFFFFF\` |
| **Section Title (H2)** (\`.section-title\`) | Serif | \`38px\` | \`28px\` | \`500\` | \`1.15\` | \`0\` | \`#FFFFFF\` |
| **Page Hero Title (H1)** (\`.page-hero-title\`) | Serif | \`46px\` | \`32px\` | \`500\` | \`1.12\` | \`0\` | \`#FFFFFF\` |
| **Card Title (H3)** (\`.card-title\`) | Sans | \`18px\` | \`16px\` | \`700\` | \`1.3\` | \`0\` | \`#FFFFFF\` |
| **Item Title (H3)** (\`.item-title\`) | Serif | \`26px\` | \`22px\` | \`500\` | \`1.2\` | \`0\` | \`#FFFFFF\` |
| **Step / Standard Title (H3)** | Sans | \`18px\` | \`16px\` | \`700\` | \`1.3\` | \`0\` | \`#FFFFFF\` |
| **Section Subtitle** (\`.section-subtitle\`) | Sans | \`14px\` | \`13px\` | \`400\` | \`1.6\` | \`0\` | \`#C4CAD3\` |
| **Body Text** (\`body\`, \`p\`) | Sans | \`15px\` | \`14px\` | \`400\` | \`1.6\` | \`0\` | \`#FFFFFF\` / \`#C4CAD3\` |
| **Stat Number** (\`.stat-num\`) | Sans | \`32px\` | \`24px\` | \`800\` | \`1\` | \`-0.02em\` | \`#FFFFFF\` |
| **Stat Unit** (\`.stat-unit\`) | Sans | \`16px\` | \`14px\` | \`700\` | \`1\` | \`0\` | \`#72BA38\` |
| **Stat Label** (\`.stat-text\`) | Sans | \`13px\` | \`12px\` | \`500\` | \`1.4\` | \`0.01em\` | \`#C4CAD3\` |
| **Nav Link** (\`.nav-link\`) | Sans | \`12px\` | — | \`600\` | \`1\` | \`0.06em\` (uppercase) | \`rgba(255,255,255,0.85)\` |
| **Brand Title** (\`.brand-title\`) | Sans | \`18px\` | \`16px\` | \`700\` | \`1\` | \`-0.01em\` | \`#FFFFFF\` |
| **Badge / Tag** (\`.card-badge-top\`, \`.spec-badge\`) | Sans | \`11px\` | \`10px\` | \`600\` | \`1\` | \`0.04em\` (uppercase) | \`#C4CAD3\` |
| **Step Number** (\`.step-number\`) | Serif | \`36px\` | \`28px\` | \`500\` | \`1\` | \`0\` | \`#72BA38\` |

---

## 3. Контейнер, сетки, зазоры и высоты

### Контейнер (\`.container\`)
- \`max-width: 1360px\`
- \`padding-left: 36px\`, \`padding-right: 36px\` (Desktop)
- \`padding-left: 20px\`, \`padding-right: 20px\` (Tablet ≤1024px)
- \`padding-left: 16px\`, \`padding-right: 16px\` (Mobile ≤768px)

### Высота и стили шапки (\`.site-header\`)
- Высота: \`80px\` (десктоп и планшет), \`68px\` (мобильные ≤768px)
- Позиционирование: \`fixed; top: 0; left: 0; right: 0; z-index: 1000;\`
- Фон на Hero: \`transparent\`, при скролле / на внутренних: \`background: rgba(10, 12, 14, 0.94); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border-subtle);\`

### Кнопки (\`.btn\`)
- Скругление: \`border-radius: var(--radius-sm)\` (\`4px\`)
- Главная кнопка (\`.btn-green\`): \`background: #72BA38; color: #0D0F11; font-size: 12px; font-weight: 600; padding: 13px 26px; text-transform: uppercase; letter-spacing: 0.05em;\` (hover: \`#82D140; transform: translateY(-1px)\`)
- Вторичная кнопка (\`.btn-glass\`): \`background: rgba(255,255,255,0.06); color: #FFFFFF; border: 1px solid var(--border-medium); backdrop-filter: blur(8px); padding: 13px 26px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;\`
- Малая кнопка (\`.btn-sm\`): \`padding: 9px 16px; font-size: 11px;\`

### Карточки и соотношения сторон фотографий:
- **Каталог кухонь (Карусель/Сетка)**:
  - Ширина карточки: \`460px\` (\`300px\` на мобильных)
  - Соотношение кадра: \`aspect-ratio: 16 / 10\`
  - Зазор в треке: \`gap: 28px\` (\`16px\` на мобильных)
- **Лестничная сетка кухонь / объектов (\`.kitchens-ladder-grid\`, \`.ladder-row\`)**:
  - Чередующиеся ряды: большая карточка (60%) + малая карточка (40%), следующий ряд — наоборот.
  - Зазор между карточками: \`gap: 28px\` (вертикальный \`margin-bottom: 32px\`)
  - Высота большой карточки: \`aspect-ratio: 16 / 11\` или \`min-height: 420px\`
  - Высота малой карточки: \`aspect-ratio: 4 / 3\`
- **Сетка материалов (\`.materials-grid\`)**:
  - \`grid-template-columns: repeat(5, 1fr)\` (на планшетах \`repeat(3, 1fr)\`, на мобильных \`repeat(2, 1fr)\`)
  - Зазор: \`gap: 16px\`
  - Соотношение фото материала: \`aspect-ratio: 1 / 1\`
- **Сетка этапов (\`.steps-grid\`)**:
  - \`grid-template-columns: repeat(4, 1fr)\` (на мобильных \`repeat(1, 1fr)\`)
  - Зазор: \`gap: 24px\`
- **Сетка стандартов производства (\`.standards-grid\`)**:
  - \`grid-template-columns: repeat(3, 1fr)\` (на мобильных \`repeat(1, 1fr)\`)
  - Зазор: \`gap: 24px\`

### Декоративные разделители (\`.ornament-divider\`)
- Высота: \`padding: 35px 0\`
- Структура: тонкая линия (\`1px\`, градиент \`linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)\`, max-width 240px) + символ \`✦ ✦ ✦\` в цвете \`var(--color-green-brand)\` с \`letter-spacing: 0.3em\`.

---

## 4. Все медиа-запросы (Брейкпоинты)

1. **\`@media (max-width: 1024px)\`**:
   - Контейнер: \`padding-left: 20px; padding-right: 20px;\`
   - Hero Slogan: \`font-size: 48px;\`
   - Stats grid: \`grid-template-columns: repeat(2, 1fr);\`, \`hero-stat-item:nth-child(2) { border-right: none; }\`, \`border-bottom: 1px solid var(--border-subtle);\`
   - Production / Steps: 2 колонки.
   - Header Nav: скрытие некоторых второстепенных ссылок или компактный режим.

2. **\`@media (max-width: 768px)\`**:
   - Контейнер: \`padding-left: 16px; padding-right: 16px;\`
   - Header height: \`68px\`
   - Header Nav: скрывается, появляется кнопка мобильного звонка/записи (\`.mobile-call-btn\`) и кнопка меню.
   - Hero Slogan: \`font-size: 38px;\`
   - Section Title: \`font-size: 28px;\`
   - Stats grid: \`grid-template-columns: 1fr;\` (по 1 в ряд или 2x2 компактно).
   - Ladder grid: \`grid-template-columns: 1fr;\` (все карточки в одну колонку на полную ширину).
   - Materials grid: \`grid-template-columns: repeat(2, 1fr);\`.
   - Steps grid / Standards grid: \`grid-template-columns: 1fr;\`.
   - Footer: \`grid-template-columns: 1fr; gap: 32px;\`.

3. **\`@media (max-width: 480px)\`**:
   - Hero Slogan: \`font-size: 32px;\`
   - Buttons: полная ширина на некоторых CTA (\`width: 100%\`).
`;

fs.writeFileSync('DESIGN_LOCK.md', designLockContent);
console.log('DESIGN_LOCK.md generated successfully!');
