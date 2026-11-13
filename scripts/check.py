"""Verify the captured source bytes and all internal links/anchors."""
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
ORIGIN = 'https://coregestaodesaude.com.br'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for key in ('href', 'src', 'poster'):
            if attrs.get(key):
                self.links.append(attrs[key])

manifest = json.loads((ROOT / 'docs/source-manifest.json').read_text())
errors = []
pages = {}
for item in manifest:
    file = ROOT / item['file']
    if not file.is_file():
        errors.append(f'Arquivo ausente: {file}')
        continue
    original_bytes = file.read_bytes()
    if item['type'] == 'text/html':
        original_bytes = original_bytes.replace(b'<link rel="stylesheet" href="/assets/refinements.css" data-core-refinements="1">', b'')
        # The public domain replaces the legacy GitHub Pages metadata by owner request.
        original_bytes = original_bytes.replace(b'https://coregestaodesaude.com.br', b'https://andremartinslicitacao-del.github.io/CORE')
    if hashlib.sha256(original_bytes).hexdigest() != item['sha256']:
        errors.append(f'Arquivo diferente do original capturado: {file}')
    if item['type'] == 'text/html':
        page = Page()
        page.feed(file.read_text())
        pages[file] = page
        content = file.read_text()
        if 'github.io' in content or 'github.com' in content:
            errors.append(f'Endereço GitHub exposto no site: {file}')
        expected = item['url']
        if f'<link rel="canonical" href="{expected}">' not in content:
            errors.append(f'URL canônica incorreta: {file}')
        if f'<meta property="og:url" content="{expected}">' not in content:
            errors.append(f'URL de compartilhamento incorreta: {file}')

links = 0
for file, page in pages.items():
    base = ORIGIN + '/' + file.relative_to(PUBLIC).as_posix().removesuffix('index.html')
    for reference in page.links:
        target = urlsplit(urljoin(base, reference))
        if target.netloc != urlsplit(ORIGIN).netloc or target.scheme not in ('http', 'https'):
            continue
        destination = PUBLIC / unquote(target.path).lstrip('/')
        if destination.is_dir():
            destination = destination / 'index.html'
        links += 1
        if not destination.is_file():
            errors.append(f'{file.relative_to(PUBLIC)} → ausente: {reference}')
        elif target.fragment and destination in pages and unquote(target.fragment) not in pages[destination].ids:
            errors.append(f'{file.relative_to(PUBLIC)} → âncora ausente: {reference}')

for file in PUBLIC.rglob('*.css'):
    for reference in re.findall(r'url\([\s\'\"]*([^\)\'\"]+)', file.read_text()):
        target = PUBLIC / reference.lstrip('/') if reference.startswith('/') else file.parent / reference
        if not target.is_file():
            errors.append(f'Recurso CSS ausente: {reference}')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'OK: base dos {len(manifest)} arquivos preservada (descontando refinamento e domínio autorizado), {len(pages)} páginas e {links} referências internas válidas; URLs oficiais no domínio próprio, sem links GitHub no HTML público.')
