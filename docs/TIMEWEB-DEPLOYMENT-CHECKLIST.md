# Timeweb: чек-лист домена, редиректов и заголовков

Этот файл описывает настройки, которые нельзя гарантированно применить из репозитория. `Caddyfile` содержит готовый вариант для Caddy на VPS (`82.97.243.54`), но без обновления `/etc/caddy/Caddyfile` на сервере (или при использовании управляемого статического хостинга) эти правила не применяются автоматически.

## 1. Домен, DNS и сертификаты

1. Во вкладке **DNS** домена `pitermebel.com` в Timeweb уже должны оставаться обе A-записи на IP сервера (`82.97.243.54`):
   - `A` `pitermebel.com` → `82.97.243.54`
   - `A` `www.pitermebel.com` → `82.97.243.54`
   **Ничего добавлять и удалять во вкладке DNS в Timeweb не нужно** (включая A-запись `www`, а также `MX`, `SPF`, `DKIM`, `DMARC` и `TXT google-site-verification`). Редирект с `www` на основной домен настраивается не в DNS, а на сервере в Caddy (`/etc/caddy/Caddyfile`). Если удалить DNS-запись `www`, браузеры и поисковики получат ошибку DNS вместо 301-редиректа.
2. После применения `Caddyfile` на сервере (`82.97.243.54`) Caddy автоматически выпустит TLS-сертификат для `www.pitermebel.com` и начнёт отдавать постоянный 301-редирект `www.pitermebel.com/*` → `https://pitermebel.com/*` с сохранением пути и query-параметров (блок `https://www.pitermebel.com`).
3. Только после проверки HTTPS-редиректа на `www` можно добавить `includeSubDomains` в HSTS. До этого безопасный вариант — `Strict-Transport-Security: max-age=31536000` без поддоменов.

На сервере с Caddy применить `Caddyfile` из репозитория:

```bash
sudo cp /var/www/pitermebel/Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Проверка после публикации:

- `http://pitermebel.com/` → один редирект (`301`) на `https://pitermebel.com/`;
- `http://www.pitermebel.com/contacts` и `https://www.pitermebel.com/knowledge/rozetki-na-kuhne-shema-vysoty` (без слеша) → один редирект (`301`) сразу на `https://pitermebel.com/.../` с завершающим слешем (сниппет `canonical_domain_redirect`);
- `https://www.pitermebel.com/` и `https://www.pitermebel.com/contacts/` → `301` на `https://pitermebel.com/...` (без отдачи дубля `200 OK`);
- `https://pitermebel.com/kitchens` (без слеша) → `308` на `/kitchens/` (не `200 OK` дубль);
- `https://pitermebel.com/404`, `/404/`, `/404.html`, `/404/index.html` → реальный статус `404` (не `200 OK` и без редиректа);
- конечные HTTPS-страницы открываются с валидным сертификатом без предупреждений.

## 2. Старые URL (301-редиректы)

В `Caddyfile` (сниппет `legacy_redirects`) настроены постоянные серверные 301-редиректы (без цепочек и без HTML meta-refresh):

- `/en` и `/en/*` → `https://pitermebel.com/`;
- `/quiz` и `/quiz/*` → `https://pitermebel.com/calculator/`;
- `/analytics-consent` и `/analytics-consent/` → `https://pitermebel.com/privacy/`;
- `/basket` и `/basket/` → `https://pitermebel.com/kitchens/`;
- `/catalog`, `/catalog/`, `/catalog/kitchen` и `/catalog/kitchen/` → `https://pitermebel.com/kitchens/`;
- `/kitchens/slavena/` → `https://pitermebel.com/kitchens/mdf-plastik-gola/`;
- `/kitchens/aleksandra/` → `https://pitermebel.com/kitchens/mdf-plastik-slotex/`;
- `/kitchens/timofey/` → `https://pitermebel.com/kitchens/mdf-plastik-hettich/`;
- `/kitchens/stefania/` → `https://pitermebel.com/kitchens/mdf-grafit-gola/`;
- `/kitchens/ulyana/` → `https://pitermebel.com/kitchens/mdf-belyj-egger/`;
- `/kitchens/valeria/` → `https://pitermebel.com/kitchens/mdf-emal-vitrina/`;
- `/kitchens/viktoria/` → `https://pitermebel.com/kitchens/mdf-klassika-dub/`;
- `/projects/{island-parquet,oak-stone,white-showcase,marble-hood,narrow-kitchen,emerald-enamel,velvet-matte,sherman-cognac}/` → `https://pitermebel.com/kitchens/<slug>/`;
- `/projects/{glass-wardrobe,brick-wardrobe,light-wood-wardrobe}/` → `https://pitermebel.com/wardrobes/walk-in/`;
- `/projects/wardrobe-inside/` → `https://pitermebel.com/wardrobes/swing/`;
- `/projects/bedroom-set/` → `https://pitermebel.com/wardrobes/bedroom/`;
- `/projects/mirror-hall/` → `https://pitermebel.com/wardrobes/hallway/`;
- `/projects/slat-panels/` → `https://pitermebel.com/wardrobes/sliding/`;
- `/projects/bathroom-pur-vanity/` и `/projects/bathroom-vanity/` → `https://pitermebel.com/custom-furniture/bathroom/`;
- `/projects/oak-veneer-panel/` → `https://pitermebel.com/custom-furniture/tv-zones/`;
- `/projects/office-reception/` → `https://pitermebel.com/custom-furniture/business/`;
- `/projects/sliding-partition/` и `/projects/cascade-partitions/` → `https://pitermebel.com/custom-furniture/partitions/`;
- `/projects/curved-oak-facades/` → `https://pitermebel.com/custom-furniture/veneer-wood/`.

Проверить варианты HTTP, HTTPS и `www`. Каждый запрос должен попадать на конечный URL за один переход (`301`). HTML-заглушки из `public/` удалены, чтобы в `out/` не было лишних старых страниц с ответом `200 OK`.

## 3. Заголовки

Для HTML:

- `Cache-Control: no-cache, must-revalidate`;
- `Content-Security-Policy: frame-ancestors 'self';` (Яндекс.Метрика и Вебвизор отключены);
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`;
- `Strict-Transport-Security: max-age=31536000`.

Для `/_next/static/*`:

- `Cache-Control: public, max-age=31536000, immutable`.

Для изображений, шрифтов и PDF:

- `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`.

Не направлять отсутствующие JS/CSS/изображения на `index.html`: они должны возвращать 404 с корректным типом содержимого.

## 4. Контрольный запуск

После каждой публикации проверить через инструменты разработчика или `curl -I`:

1. коды и цепочки редиректов;
2. сертификаты обоих доменов;
3. заголовки HTML и хешированных ресурсов;
4. ответы 200 для `/robots.txt` и `/sitemap.xml`;
5. ответ 404 для заведомо отсутствующего `.js`;
6. отсутствие mixed content и ошибок загрузки в консоли.

Пока эти пункты не проверены на опубликованном домене, их статус следует считать «подготовлено в проекте, требуется применение в Timeweb», а не «исправлено в продакшене».
