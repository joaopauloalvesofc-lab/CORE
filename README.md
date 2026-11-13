# CORE Gestão — cópia fiel

Cópia das páginas públicas de https://coregestaodesaude.com.br/ realizada em 13/11/2026, com refinamentos de espaçamento, alinhamento, leitura e responsividade solicitados pelo proprietário. Logo, cores, fonte, textos e funcionalidades originais preservados.

## Abrir localmente

Com Node.js 20 ou superior:

```sh
npm run dev
```

Abra http://localhost:4173. Não é necessário instalar pacotes. Para outra porta: `PORT=4174 npm run dev`.

## Arquivos

- `public/`: site completo, com uma pasta para cada página.
- `public/assets/`: imagens, logotipos, fonte, estilos e JavaScript originais.
- `public/assets/refinements.css`: camada de acabamento visual, carregada após os estilos originais nas 18 páginas.
- `docs/source-manifest.json`: URLs de origem e hashes SHA-256 de cada arquivo capturado.
- `scripts/`: servidor local, build e conferência da cópia.

## Verificar e preparar publicação

```sh
npm run check
npm run build
```

A conferência usa Python 3.9 ou superior. O build gera `dist/`; publique o conteúdo dessa pasta na **raiz** de uma hospedagem estática com suporte a `index.html` em subpastas. O projeto não depende de React, serviços externos de build ou banco de dados.

## Funcionalidades preservadas

Menu responsivo, submenu de soluções, perguntas frequentes, busca e filtros de conteúdos, seleção de serviço pelo endereço, validação do formulário, geração de mensagem para WhatsApp/e-mail e links de contato e carreira.

O formulário prepara a mensagem e abre o canal escolhido pelo visitante. O envio precisa ser concluído no WhatsApp ou no aplicativo de e-mail, exatamente como no original. Não há recebimento automático de propostas nem painel administrativo na cópia pública.

Os contatos, links externos e textos foram preservados. Por solicitação do proprietário, URLs canônicas, Open Graph e dados estruturados foram corrigidos para `https://coregestaodesaude.com.br`. O build rejeita páginas que voltem a expor links do GitHub ou metadados oficiais incorretos. Nenhum contato foi enviado durante a validação.

## Publicação

Repositório: https://github.com/joaopauloalvesofc-lab/CORE. Hospedagem: Vercel, com `vercel.json` configurando o build e a pasta `dist/`. O domínio público oficial é https://coregestaodesaude.com.br/. GitHub Pages não é utilizado.

`scripts/clone.py` é o registro reproduzível da captura. Executá-lo novamente **sobrescreve** os arquivos locais do site e remove o vínculo com os refinamentos. Use apenas para uma nova captura intencional.

Para reverter somente o acabamento, remova o elemento `link` com `data-core-refinements="1"` das páginas HTML. O CSS original e os logotipos continuam intactos. `npm run check` verifica a integridade da base original descontando apenas esse elemento adicional.
