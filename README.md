# Pedro de Agostini — Portfolio

Portfolio bilíngue (EN/PT) em formato de keynote: cada projeto é lançado num MacBook 3D que abre com o scroll enquanto o site rola sozinho na tela.

**Stack:** React 19 · Vite · GSAP (ScrollTrigger) · Motion · Three.js via React Three Fiber + drei · Lenis

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview    # serve o dist/ localmente
```

## Publicar

- **GitHub Pages:** o workflow `.github/workflows/deploy-pages.yml` faz build, valida e publica a cada push em `main`. No GitHub, selecione **Settings → Pages → Source: GitHub Actions** uma única vez.
- **Vercel:** importe o repositório. `vercel.json` configura build, cache e headers de segurança.
- **Netlify:** importe o repositório. `netlify.toml` e `public/_headers` configuram build e headers de segurança.

A URL canônica de produção é `https://pedroagostini.vercel.app/`. Em outro domínio, defina a variável de ambiente `SITE_URL` com a URL pública completa e barra final.

Antes de publicar manualmente, rode:

```bash
npm run check
```

O comando gera o build e valida canonical, Open Graph, JSON-LD, robots, sitemap, `llms.txt`, `llms-full.txt`, `index.md` e os artefatos essenciais de produção.

## Contato

Os CTAs abrem uma conversa no WhatsApp e o rodapé também oferece e-mail, LinkedIn e GitHub. O projeto é totalmente estático e não depende de backend nem armazena dados de visitantes.

## Onde mexer

| O quê | Arquivo |
|---|---|
| Textos EN/PT, WhatsApp, e-mail, links | `src/i18n/strings.js` |
| Projetos (ordem, nome, categoria, local, descrição) | `src/data/projects.js` |
| Cores, tipografia e espaçamentos | `src/styles/global.css` (tokens em `:root`) |
| MacBook 3D e luz de palco | `src/three/MacBook.jsx`, `src/three/StageScene.jsx` |

## Capturas dos projetos

As telas dos MacBooks usam capturas de página inteira dos sites no ar, guardadas em `materiais/capturas/<slug>.jpeg`.
Depois de trocar ou adicionar uma captura, rode:

```bash
npm run prepare:captures
```

O script gera em `public/projects/` a textura de desktop, a de celular e a miniatura do índice.

## Acessibilidade

- Com `prefers-reduced-motion`, ou num navegador sem WebGL, o 3D e o scroll suave são desligados e os projetos aparecem estáticos, em molduras de notebook.
- O idioma inicial segue o navegador. A escolha fica salva e atualiza o `lang` do documento.

## Novos materiais

Prompts para gerar retratos, vídeos, imagem de compartilhamento e modelo 3D estão em [`MATERIAIS-PROMPTS.md`](MATERIAIS-PROMPTS.md).
