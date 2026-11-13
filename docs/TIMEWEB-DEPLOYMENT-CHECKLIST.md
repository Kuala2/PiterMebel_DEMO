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

- `http://pitermebel.com/` → один редирект (`301`/`308`) на `https://pitermebel.com/`;
- `http://www.pitermebel.com/contacts/` → один редирект на `https://pitermebel.com/contacts/`;
- `https://www.pitermebel.com/` и `https://www.pitermebel.com/contacts/` → `301` на `https://pitermebel.com/...` (без отдачи дубля `200 OK`);
- конечные HTTPS-страницы открываются с валидным сертификатом без предупреждений.

## 2. Старые URL (301-редиректы)

В `Caddyfile` (сниппет `legacy_redirects`) настроены постоянные серверные 301-редиректы (без цепочек и без HTML meta-refresh):

- `/en` и `/en/*` → `https://pitermebel.com/`;
- `/catalog/kitchen` и `/catalog/kitchen/` → `https://pitermebel.com/kitchens/`;
- `/kitchens/slavena` и `/kitchens/slavena/` → `https://pitermebel.com/kitchens/mdf-plastik-gola/`;
- `/kitchens/aleksandra` и `/kitchens/aleksandra/` → `https://pitermebel.com/kitchens/mdf-plastik-slotex/`;
- `/kitchens/timofey` и `/kitchens/timofey/` → `https://pitermebel.com/kitchens/mdf-plastik-hettich/`;
- `/kitchens/stefania` и `/kitchens/stefania/` → `https://pitermebel.com/kitchens/mdf-grafit-gola/`;
- `/kitchens/ulyana` и `/kitchens/ulyana/` → `https://pitermebel.com/kitchens/mdf-belyj-egger/`;
- `/kitchens/valeria` и `/kitchens/valeria/` → `https://pitermebel.com/kitchens/mdf-emal-vitrina/`;
- `/kitchens/viktoria` и `/kitchens/viktoria/` → `https://pitermebel.com/kitchens/mdf-klassika-dub/`;
- `/projects/bathroom-pur-vanity` и `/projects/bathroom-pur-vanity/` → `https://pitermebel.com/projects/bathroom-vanity/`.

Проверить варианты HTTP, HTTPS и `www`. Каждый запрос должен попадать на конечный URL за один переход (`301`). HTML-файлы в `public/` оставлены только как резерв для хостинга без серверных правил.

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
