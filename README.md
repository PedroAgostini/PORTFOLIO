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

- **Vercel:** importe o repositório. O preset do Vite já funciona sem configuração.
- **GitHub Pages:** rode `npm run build` e publique a pasta `dist/`. O `base: './'` no `vite.config.js` permite servir o site num subcaminho (`/PORTFOLIO/`).

## Formulário de contato (ação necessária)

O formulário envia via [FormSubmit](https://formsubmit.co) para `contatopedrodeagostini@gmail.com`, sem backend.
**No primeiro envio, o FormSubmit manda um e-mail de ativação para esse endereço. Clique no link uma única vez**; a partir daí as mensagens chegam normalmente.
O endpoint fica em `src/components/Contact.jsx` (`FORM_ENDPOINT`).

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
