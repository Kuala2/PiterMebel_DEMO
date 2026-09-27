"""Audit the complete static export without network or third-party dependencies."""
import argparse
import hashlib
import json
from collections import defaultdict, deque
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta, self.links, self.images, self.schemas = [], [], [], []
        self.ids, self.headings, self.title = set(), [], ''
        self.lang = None
        self.capture = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'meta':
            self.meta.append(a)
        if tag in ('a', 'link'):
            self.links.append({'tag': tag, **a})
        if tag == 'img':
            self.images.append(a)
        if tag == 'title' or tag == 'h1' or (tag == 'script' and a.get('type') == 'application/ld+json'):
            self.capture = [tag, '']

    def handle_data(self, data):
        if self.capture:
            self.capture[1] += data

    def handle_endtag(self, tag):
        if self.capture and self.capture[0] == tag:
            value = self.capture[1].strip()
            if tag == 'title':
                self.title = value
            elif tag == 'h1':
                self.headings.append(value)
            else:
                self.schemas.append(value)
            self.capture = None

    def metas(self, name):
        return [m.get('content', '') for m in self.meta if m.get('name', m.get('property')) == name]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', default='out')
    parser.add_argument('--report', required=True)
    args = parser.parse_args()
    root = Path(args.out).resolve()
    sitemap = ET.parse(root / 'sitemap.xml').getroot()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    entries = [{'url': n.findtext('s:loc', namespaces=ns), 'lastmod': n.findtext('s:lastmod', namespaces=ns)} for n in sitemap.findall('s:url', ns)]
    urls = {e['url'] for e in entries}
    origin = 'https://pitermebel.com'
    issues, pages, documents, graph = [], [], {}, {}

    def issue(url, check, detail):
        issues.append({'url': url, 'check': check, 'detail': detail})

    def local_file(url):
        path = root / unquote(urlsplit(url).path).lstrip('/')
        if path.is_dir():
            path /= 'index.html'
        return path

    if len(entries) != len(urls):
        issue('sitemap.xml', 'duplicate_url', 'Repeated loc')
    for entry in entries:
        url = entry['url']
        path = local_file(url)
        if not path.is_file():
            issue(url, 'missing_html', str(path))
            continue
        html = path.read_text(encoding='utf-8')
        doc = Document(html)
        documents[url] = doc
        canonical = [a.get('href') for a in doc.links if a.get('rel') == 'canonical']
        descriptions = doc.metas('description')
        if canonical != [url]:
            issue(url, 'canonical', canonical)
        if not doc.title:
            issue(url, 'title', 'Missing title')
        if len(descriptions) != 1 or not descriptions[0]:
            issue(url, 'description', descriptions)
        if len(doc.headings) != 1:
            issue(url, 'h1', doc.headings)
        if doc.lang != 'ru':
            issue(url, 'language', doc.lang)
        if any('noindex' in v for v in doc.metas('robots') + doc.metas('yandex')):
            issue(url, 'noindex_in_sitemap', doc.metas('robots'))
        if doc.metas('og:url') != [url]:
            issue(url, 'og_url', doc.metas('og:url'))
        schemas = []
        for raw in doc.schemas:
            try:
                value = json.loads(raw)
                schemas.extend(value.get('@graph', [value]))
            except (ValueError, AttributeError) as error:
                issue(url, 'json_ld', str(error))
        for value in schemas:
            if value.get('@type') == 'TechArticle' and entry['lastmod']:
                if entry['lastmod'][:10] != value.get('dateModified', value.get('datePublished', ''))[:10]:
                    issue(url, 'lastmod', {'sitemap': entry['lastmod'], 'article': value.get('dateModified')})
        for img in doc.images:
            if 'alt' not in img:
                issue(url, 'missing_alt', img.get('src'))
            src = urljoin(url, img.get('src', ''))
            if urlsplit(src).netloc == urlsplit(origin).netloc and not local_file(src).is_file():
                issue(url, 'missing_image', src)
        graph[url] = set()
        for link in doc.links:
            href = link.get('href', '')
            target = urljoin(url, href)
            parsed = urlsplit(target)
            if parsed.scheme not in ('http', 'https') or parsed.netloc != urlsplit(origin).netloc:
                continue
            if not local_file(target).is_file():
                issue(url, 'broken_internal_link', href)
            clean = target.split('#')[0].split('?')[0]
            if link['tag'] == 'a' and clean in urls and clean != url:
                graph[url].add(clean)
        pages.append({**entry, 'file': str(path.relative_to(root)), 'sha256': hashlib.sha256(html.encode()).hexdigest(),
                      'title': doc.title, 'description': descriptions, 'canonical': canonical, 'h1': doc.headings,
                      'robots': doc.metas('robots'), 'schema_types': [s.get('@type') for s in schemas],
                      'images': len(doc.images), 'internal_links': sorted(graph[url])})
    for field in ('title', 'description'):
        seen = defaultdict(list)
        for page in pages:
            seen[json.dumps(page[field], ensure_ascii=False)].append(page['url'])
        for value, paths in seen.items():
            if len(paths) > 1:
                issue(paths, 'duplicate_' + field, value)
    reached, pending = set(), deque([origin + '/'])
    while pending:
        url = pending.popleft()
        if url in reached:
            continue
        reached.add(url)
        pending.extend(graph.get(url, set()) - reached)
    for url in sorted(urls - reached):
        issue(url, 'unreachable_from_home', 'No source-HTML anchor path from homepage')
    # Only same-document fragments are asserted; cross-page client targets can be conditional.
    for url, doc in documents.items():
        for link in doc.links:
            href = link.get('href', '')
            if href.startswith('#') and len(href) > 1 and unquote(href[1:]) not in doc.ids:
                issue(url, 'missing_fragment', href)
    report = {'captured_at': datetime.now(timezone.utc).isoformat(), 'scope': 'all sitemap URLs, source HTML only',
              'total_urls': len(entries), 'checked_urls': len(pages), 'issues': issues, 'pages': pages}
    Path(args.report).parent.mkdir(parents=True, exist_ok=True)
    Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'urls': len(entries), 'checked': len(pages), 'issues': issues}, ensure_ascii=False, indent=2))
    return bool(issues)


if __name__ == '__main__':
    raise SystemExit(main())
