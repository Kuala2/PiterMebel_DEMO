import fs from 'fs';

const c1 = fs.readFileSync('concept_1_styles.css', 'utf8');
const kit = fs.readFileSync('kitchens_styles.css', 'utf8');
const prod = fs.readFileSync('production_styles.css', 'utf8');

// Combine and organize into a unified globals.css
const baseGlobals = `/* ==========================================================================
   DESIGN LOCK: PiterMebel Studio Design System (Concept-1 + Kitchens + Production)
   ========================================================================== */

:root {
  --bg-dark: #0A0C0E;
  --bg-surface: #111418;
  --bg-surface-elevated: #161A1F;
  --bg-surface-hover: #202429;
  --bg-header-scrolled: rgba(10, 12, 14, 0.94);
  
  /* Exact Green from the Origami Bird */
  --color-green-brand: #72BA38;
  --color-green-hover: #82D140;
  --color-green-dark: #1E2E14;
  --color-green-subtle: rgba(114, 186, 56, 0.12);

  --color-text-primary: #FFFFFF;
  --color-text-secondary: #C4CAD3;
  --color-text-muted: #828B99;

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.14);
  --border-green: rgba(114, 186, 56, 0.45);

  /* Typography */
  --font-main: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Cormorant Garamond', Garamond, Georgia, serif;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;

  --container-max: 1360px;
  --transition: all 0.22s ease;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  background-color: var(--bg-dark);
}

body {
  background-color: var(--bg-dark);
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(114, 186, 56, 0.09) 0%, transparent 45%),
    radial-gradient(ellipse at 85% 30%, rgba(32, 42, 52, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 15% 70%, rgba(114, 186, 56, 0.06) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 90%, rgba(32, 40, 50, 0.35) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.032'%3E%3Cpath d='M0 0l60 60M120 0L60 60M0 120l60-60M120 120L60 60M60 0v120M0 60h120'/%3E%3Ccircle cx='60' cy='60' r='28' stroke-opacity='0.02'/%3E%3Crect x='56' y='56' width='8' height='8' fill='%2372ba38' fill-opacity='0.06' stroke='none'/%3E%3Cpath d='M0 0h120v120H0z' stroke-opacity='0.015'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  color: var(--color-text-primary);
  font-family: var(--font-main);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Container */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: 36px;
  padding-right: 36px;
}

/* Typography elements */
.section-title {
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.15;
  color: #FFFFFF;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary);
  max-width: 680px;
  line-height: 1.6;
}

.page-hero-title {
  font-family: var(--font-serif);
  font-size: 46px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.12;
  color: #FFFFFF;
  margin-bottom: 14px;
}

/* Decorative Section Divider Ornament */
.ornament-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 35px 0;
  opacity: 0.5;
}

.divider-line {
  height: 1px;
  flex: 1;
  max-width: 240px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
}

.divider-symbol {
  color: var(--color-green-brand);
  font-size: 14px;
  letter-spacing: 0.3em;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 26px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  line-height: 1;
  text-transform: uppercase;
  transition: var(--transition);
  text-decoration: none;
}

.btn-green {
  background-color: var(--color-green-brand);
  color: #0D0F11 !important;
  border: none;
}

.btn-green:hover {
  background-color: var(--color-green-hover);
  transform: translateY(-1px);
}

.btn-glass {
  background: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
  border: 1px solid var(--border-medium);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #FFFFFF;
}

.btn-sm {
  padding: 9px 16px;
  font-size: 11px;
  letter-spacing: 0.05em;
}

/* Header */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-header-scrolled);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.site-header.is-transparent {
  background: transparent;
  border-bottom-color: transparent;
}

.site-header.is-scrolled {
  background: var(--bg-header-scrolled);
  border-bottom-color: var(--border-subtle);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: 20px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  text-decoration: none;
}

.origami-bird-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-title {
  font-family: var(--font-main);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  line-height: 1;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  padding: 6px 0;
  text-decoration: none;
  transition: var(--transition);
  position: relative;
}

.nav-link:hover, .nav-link.is-active {
  color: var(--color-green-brand);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
}

.header-address-tag {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.header-address-tag strong {
  color: #FFFFFF;
  font-size: 12px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  padding: 8px;
  color: #FFFFFF;
  cursor: pointer;
}

.mobile-nav-drawer {
  display: none;
  position: fixed;
  top: 68px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 12, 14, 0.98);
  backdrop-filter: blur(16px);
  z-index: 999;
  padding: 32px 20px;
  flex-direction: column;
  gap: 20px;
}

.mobile-nav-drawer.is-open {
  display: flex;
}

.mobile-nav-link {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #FFFFFF;
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.mobile-nav-link.is-active {
  color: var(--color-green-brand);
}

/* Page Hero for Subpages */
.page-hero {
  padding-top: 130px;
  padding-bottom: 40px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
}

.page-hero-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.breadcrumbs a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  color: var(--color-green-brand);
}

/* Hero Fullscreen (Home) */
.hero-fullscreen {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: var(--bg-dark);
  padding-top: 80px;
}

.hero-bg-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 12, 14, 0.65);
}

.hero-center-wrapper {
  position: relative;
  z-index: 2;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px;
}

.hero-center-content {
  max-width: 1000px;
  margin: 0 auto;
}

.hero-kicker {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-green-brand);
  margin-bottom: 16px;
}

.hero-slogan-title {
  font-family: var(--font-serif);
  font-size: 78px;
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: 0.01em;
  color: #FFFFFF;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.65);
  margin-bottom: 24px;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
}

.hero-bottom-bar {
  position: relative;
  z-index: 2;
  background: rgba(10, 12, 14, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-subtle);
}

.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.hero-stat-item {
  padding: 26px 32px;
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-stat-item:last-child {
  border-right: none;
}

.stat-num {
  font-family: var(--font-main);
  font-size: 32px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  font-variant-numeric: lining-nums tabular-nums;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-unit {
  color: var(--color-green-brand);
  font-size: 16px;
  font-weight: 700;
  font-style: normal;
}

.stat-text {
  font-family: var(--font-main);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  line-height: 1.4;
  letter-spacing: 0.01em;
}

/* Filter Tabs */
.catalog-tabs-bar, .filter-tabs-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 28px;
  scrollbar-width: none;
}

.catalog-tabs-bar::-webkit-scrollbar, .filter-tabs-bar::-webkit-scrollbar {
  display: none;
}

.cat-tab, .filter-tab {
  padding: 9px 20px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-elevated);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border-subtle);
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition);
}

.cat-tab:hover, .filter-tab:hover {
  color: #FFFFFF;
  border-color: var(--border-medium);
}

.cat-tab.is-active, .filter-tab.is-active {
  background: var(--color-green-brand);
  color: #0D0F11;
  font-weight: 700;
  border-color: var(--color-green-brand);
}

/* Sections General */
.catalog-section, .projects-section, .workshop-section, .steps-section, .materials-section, .standards-section, .invite-section, .final-section, .faq-section {
  padding-top: 80px;
  padding-bottom: 80px;
  position: relative;
}

.section-head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 20px;
}

/* Ladder Grid for Catalog / Projects */
.kitchens-ladder-grid, .projects-ladder-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ladder-row {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 28px;
}

.ladder-row.reverse {
  grid-template-columns: 1fr 1.35fr;
}

/* Card Styles */
.catalog-card, .project-card {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
}

.catalog-card:hover, .project-card:hover {
  border-color: var(--border-green);
  transform: translateY(-2px);
}

.card-gallery-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #0E1012;
}

.card-img-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 50%;
  transition: transform 0.3s ease;
}

.catalog-card:hover .card-img-slide, .project-card:hover .card-img-slide {
  transform: scale(1.03);
}

.card-badge-top {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(10, 12, 14, 0.85);
  border: 1px solid var(--border-medium);
  backdrop-filter: blur(8px);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-green-brand);
  z-index: 5;
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  gap: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.3;
}

.card-specs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.card-spec-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
  padding-bottom: 4px;
}

.card-spec-label {
  color: var(--color-text-muted);
  font-size: 12px;
}

.card-spec-value {
  color: #FFFFFF;
  text-align: right;
  font-weight: 500;
}

/* Workshop Split Section */
.workshop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.workshop-photo-frame {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.workshop-photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 50%;
}

.workshop-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.workshop-bullets {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.workshop-bullet-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.bullet-icon {
  color: var(--color-green-brand);
  font-size: 16px;
  line-height: 1.4;
}

/* Steps Section */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.step-card {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  transition: var(--transition);
}

.step-card:hover {
  border-color: var(--border-green);
}

.step-number {
  font-family: var(--font-serif);
  font-size: 36px;
  font-weight: 500;
  color: var(--color-green-brand);
  line-height: 1;
}

.step-title {
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.3;
}

.step-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.55;
}

/* Materials Section */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.material-card {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.material-card:hover {
  border-color: var(--border-green);
  transform: translateY(-2px);
}

.material-photo {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #0E1012;
}

.material-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 50%;
}

.material-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.material-title {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
}

.material-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.45;
}

/* Standards / Production Stages Section */
.standards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.standard-card {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.standard-card:hover {
  border-color: var(--border-green);
}

.standard-photo {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.standard-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.standard-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.standard-stage {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-green-brand);
}

.standard-title {
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
}

.standard-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.55;
}

/* FAQ Section */
.faq-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.faq-item {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 22px 28px;
  transition: var(--transition);
}

.faq-item:hover {
  border-color: var(--border-medium);
}

.faq-question {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.faq-answer {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Measure Form / Final Section */
.final-section {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
}

.form-split-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 48px;
  align-items: start;
}

.form-info-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-card-box {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-card-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-green-brand);
}

.contact-card-text {
  font-size: 15px;
  color: #FFFFFF;
  line-height: 1.5;
}

.contact-card-sub {
  font-size: 13px;
  color: var(--color-text-muted);
}

.measure-form-card {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 36px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.form-input, .form-textarea {
  width: 100%;
  background: rgba(10, 12, 14, 0.6);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  font-family: var(--font-main);
  font-size: 14px;
  color: #FFFFFF;
  transition: var(--transition);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-green-brand);
  background: rgba(10, 12, 14, 0.9);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-error-msg {
  font-size: 12px;
  color: #FF5A5A;
  margin-top: 6px;
}

.form-success-box {
  background: rgba(114, 186, 56, 0.12);
  border: 1px solid var(--color-green-brand);
  border-radius: var(--radius-sm);
  padding: 24px;
  text-align: center;
  color: #FFFFFF;
}

/* Detail Pages (Kitchens/[slug], Projects/[slug]) */
.detail-hero-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  margin-bottom: 48px;
}

.detail-gallery-main {
  position: relative;
  aspect-ratio: 16 / 11;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.detail-gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 50%;
}

.detail-thumbs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.detail-thumb-item {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.detail-thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info-pane {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-title {
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 500;
  line-height: 1.15;
  color: #FFFFFF;
}

.detail-story-box {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.65;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-specs-table {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Footer */
.site-footer {
  background: #07080A;
  border-top: 1px solid var(--border-subtle);
  padding: 60px 0 40px;
}

.footer-top-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-brand-pane {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-brand-title {
  font-family: var(--font-main);
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.footer-slogan {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.footer-col-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-green-brand);
  margin-bottom: 14px;
}

.footer-links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
}

.footer-links-list a {
  font-size: 13px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.footer-links-list a:hover {
  color: var(--color-green-brand);
}

.footer-bottom-row {
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-muted);
  gap: 16px;
  flex-wrap: wrap;
}

/* ==========================================================================
   RESPONSIVE MEDIA QUERIES
   ========================================================================== */

@media (max-width: 1024px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero-slogan-title {
    font-size: 48px;
  }

  .hero-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-stat-item:nth-child(2) {
    border-right: none;
  }

  .hero-stat-item:nth-child(1), .hero-stat-item:nth-child(2) {
    border-bottom: 1px solid var(--border-subtle);
  }

  .ladder-row, .ladder-row.reverse {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .materials-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .standards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .workshop-grid, .form-split-grid, .detail-hero-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-top-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .site-header {
    height: 68px;
  }

  .header-inner {
    height: 68px;
  }

  .header-nav, .header-address-tag {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .hero-fullscreen {
    padding-top: 68px;
    min-height: auto;
  }

  .hero-slogan-title {
    font-size: 38px;
    margin-bottom: 20px;
  }

  .hero-center-wrapper {
    padding: 48px 16px;
  }

  .hero-stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-stat-item {
    border-right: none;
    border-bottom: 1px solid var(--border-subtle);
    padding: 18px 20px;
  }

  .hero-stat-item:last-child {
    border-bottom: none;
  }

  .section-title, .page-hero-title, .detail-title {
    font-size: 28px;
  }

  .materials-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .steps-grid, .standards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .footer-top-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-bottom-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .hero-slogan-title {
    font-size: 32px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .measure-form-card {
    padding: 24px 16px;
  }
}
`;

fs.writeFileSync('app/globals.css', baseGlobals);
console.log('app/globals.css updated with locked design system!');
