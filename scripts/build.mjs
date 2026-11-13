import { cp, mkdir, rm, readdir, readFile } from 'node:fs/promises';
const source = new URL('../public/', import.meta.url);
// Fail the deployment if legacy hosting URLs return to public metadata.
async function verifyOfficialUrls(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await verifyOfficialUrls(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      const path = file.pathname.slice(source.pathname.length).replace(/index\.html$/, '');
      const official = `https://coregestaodesaude.com.br/${path}`;
      if (/github\.(?:io|com)/i.test(html) ||
          !html.includes(`<link rel="canonical" href="${official}">`) ||
          !html.includes(`<meta property="og:url" content="${official}">`)) {
        throw new Error(`Endereço oficial de compartilhamento inválido: ${path}`);
      }
    }
  }
}
await verifyOfficialUrls(source);
const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('Site pronto em dist/ — publique o conteúdo dessa pasta na raiz do domínio.');
