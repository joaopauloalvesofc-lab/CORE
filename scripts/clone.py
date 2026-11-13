"""Capture the public CORE website without modifying its files."""
import hashlib
import json
import re
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen

ORIGIN = 'https://coregestaodesaude.com.br'
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'):
            self.urls.append(attrs['href'])
        for name in ('src', 'poster'):
            if attrs.get(name):
                self.urls.append(attrs[name])
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon', 'preload', 'manifest'):
            self.urls.append(attrs.get('href', ''))
        if attrs.get('srcset'):
            self.urls.extend(item.strip().split()[0] for item in attrs['srcset'].split(','))

def capture():
    queue = deque(['/'])
    seen = set()
    manifest = []
    while queue:
        path = queue.popleft()
        if path in seen:
            continue
        seen.add(path)
        url = ORIGIN + path
        with urlopen(Request(url, headers={'User-Agent': 'CORE-owner-authorized-copy/1.0'}), timeout=30) as response:
            data = response.read()
            kind = response.headers.get_content_type()
        relative = unquote(path).lstrip('/')
        if '..' in Path(relative).parts:
            raise ValueError('Unsafe path')
        if kind == 'text/html':
            relative = relative.rstrip('/') + '/index.html' if relative else 'index.html'
        destination = PUBLIC / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        manifest.append({'url': url, 'file': str(destination.relative_to(ROOT)), 'type': kind, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        print(relative, len(data), flush=True)
        references = []
        if kind == 'text/html':
            parser = References()
            parser.feed(data.decode('utf-8'))
            references = parser.urls
        elif kind == 'text/css':
            references = re.findall(r'url\([\s\'\"]*([^\)\'\"]+)', data.decode('utf-8'))
        for reference in references:
            parsed = urlsplit(urljoin(url, reference))
            if parsed.netloc == urlsplit(ORIGIN).netloc and parsed.scheme in ('http', 'https'):
                queue.append(parsed.path or '/')
    (ROOT / 'docs' / 'source-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Captured {len(manifest)} files.')

if __name__ == '__main__':
    capture()
