# Validação — 13/11/2026

## Refinamento solicitado posteriormente

- `npm run check` e `npm run build`: passaram após a inclusão de `refinements.css` nas 18 páginas. 857 referências HTML internas válidas; base original conferida descontando apenas o vínculo explícito da nova folha.
- Logos, imagens, fonte, CSS original e JavaScript original permanecem idênticos à captura.
- Prévia real: home em 1280 × 900, 821px (tablet) e 390 × 844; página A CORE também em 320 × 780. Capturas em `refined-desktop.jpg`, `refined-tablet.jpg`, `refined-mobile.jpg` e `refined-preview.jpg`.
- Contato, conteúdos, CME e A CORE em 390px: sem rolagem horizontal e sem imagens carregadas com falha. Home em 390px e contato em 1280px também sem rolagem horizontal.
- Revisão independente: identidade e composição preservadas, sem regressão material no CSS ou nas áreas carregadas. Sinalizou lazy-loading nas capturas iniciais; após percorrer a home no navegador, as oito imagens foram confirmadas carregadas e as capturas completas foram refeitas.
- Build e ZIP atualizados. Refinamentos limitados a apresentação; canais de contato e lógica dos formulários não foram alterados.

## Captura original

- `npm run check`: passou. 29 arquivos idênticos aos hashes capturados, 18 páginas e 839 referências HTML locais válidas; recursos CSS também presentes.
- `npm run build`: passou. Saída estática em `dist/`.
- Revisão técnica independente: comparação ao vivo da home, CSS, JavaScript, contato e CME confirmou identidade byte a byte com a origem. Nenhum defeito material encontrado.
- Prévia no navegador: página inicial inspecionada em desktop (1280 × 720) e celular (390 × 844). Imagens, logotipo, tipografia e composição preservados; capturas anexas.
- Navegação: submenu de soluções abre; Escape fecha; menu móvel abre e fecha.
- Conteúdos: filtro CME reduz a lista para 1 conteúdo; busca inexistente mostra 0 e a orientação correspondente.
- Formulário: envio vazio foca o campo obrigatório; dados fictícios válidos produzem os links de WhatsApp e e-mail com a mensagem esperada. Nenhuma mensagem externa foi enviada.
- Revisão visual: autoinspeção realizada. Revisão visual independente indisponível no navegador do revisor; identidade dos arquivos verificada independentemente.
- Limites: não foram testados envio externo de WhatsApp/e-mail, todos os navegadores, nem eventual área privada. Metadados e comportamentos herdados foram preservados por solicitação expressa.
