# Timeweb: чек-лист домена, редиректов и заголовков

Этот файл описывает настройки, которые нельзя гарантированно применить из репозитория. `Caddyfile` содержит готовый вариант для собственного Caddy, но статический фронтенд Timeweb App Platform может его не читать.

## 1. Домен и сертификаты

1. В приложении Timeweb привязать оба домена: `pitermebel.com` и `www.pitermebel.com`.
2. Проверить DNS-записи обоих имён по значениям, показанным в панели Timeweb. Не копировать старые IP или CNAME из памяти.
3. Дождаться статуса выпущенного TLS-сертификата для обоих имён.
4. Назначить `pitermebel.com` главным доменом.
5. Включить постоянный редирект `www.pitermebel.com/*` → `https://pitermebel.com/*` с сохранением пути и query-параметров.
6. Только после проверки HTTPS на `www` можно добавить `includeSubDomains` в HSTS. До этого безопасный вариант — `Strict-Transport-Security: max-age=31536000` без поддоменов.

Проверка после публикации:

- `http://pitermebel.com/` → один редирект на `https://pitermebel.com/`;
- `http://www.pitermebel.com/contacts/` → один редирект на `https://pitermebel.com/contacts/`;
- `https://www.pitermebel.com/contacts/` → один редирект на `https://pitermebel.com/contacts/`;
- конечные HTTPS-страницы открываются с валидным сертификатом без предупреждений.

## 2. Старые URL

Настроить постоянные серверные редиректы (301 или 308), не полагаясь на HTML/JavaScript:

- `/basket` и `/basket/` → `/kitchens/`;
- `/catalog/kitchen` и `/catalog/kitchen/` → `/kitchens/`.

Проверить варианты HTTP, HTTPS и `www`. Каждый запрос должен попадать на конечный URL за один переход. HTML-файлы в `public/` оставлены только как резерв для хостинга без серверных правил.

## 3. Заголовки

Для HTML:

- `Cache-Control: no-cache, must-revalidate`;
- `Content-Security-Policy: frame-ancestors 'self' https://metrika.yandex.ru https://*.metrika.yandex.ru https://webvisor.com https://*.webvisor.com;`;
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
