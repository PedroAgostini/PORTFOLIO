# Prompts para novos materiais

O site foi construído como um **palco de keynote**: fundo carvão (#141414 / #1a1a1a), uma única luz de spot branca e quente, o carmim **#e60039** reservado para o que está "no ar" e para os botões de ação. Todo material novo precisa morar nesse mundo: escuro, uma fonte de luz dura vinda de cima, pouca cor e nada de fundo branco de estúdio.

**Como usar a sua foto como referência** (para manter o seu rosto):
- **ChatGPT (GPT Image) / Gemini (Nano Banana):** anexe `materiais/pedro.png` e comece o prompt com *"Use the attached photo as the identity reference. Keep his face, beard, hairline and skin tone exactly."*
- **Midjourney:** suba a foto e use `--cref <url da foto> --cw 100` (rosto + roupa) ou `--cw 20` (só o rosto).
- Os prompts estão em inglês porque os geradores respondem melhor assim.

---

## 1. Retratos (prioridade alta)

### 1.1 O apresentador no palco (substitui a foto da seção "O apresentador")
Onde entra: `public/img/pedro.png` → gere em **1600×1600** ou maior.
```
Use the attached photo as the identity reference. Keep his face, beard, hairline and skin tone exactly.
A Brazilian web developer in his late twenties standing on an empty dark keynote stage, framed from the waist up, wearing a plain black button-up shirt. A single hard spotlight directly above and slightly in front of him, warm white (5200K), creating a clean pool of light on his face and shoulders while everything else falls into deep charcoal (#141414). Faint atmospheric haze visible inside the light cone. Calm, confident, slight half-smile, looking at the camera. Shot on a 85mm lens, f/2, shallow depth of field, cinematic, photorealistic, subtle film grain. No text, no logos, no props.
```

### 1.2 Recorte em PNG transparente (para usar sobre o palco 3D)
Onde entra: pode substituir a foto com fundo e dispensar a máscara radial.
```
Use the attached photo as the identity reference. Same man, same black shirt, waist-up, lit from above by a single warm spotlight with a very thin crimson rim light (#e60039) on the right edge of his shoulder and jaw. Isolated subject on a fully transparent background, clean hair edges, no halo, no shadow on the ground. Photorealistic, 2048×2048 PNG with alpha.
```
> Se a ferramenta não exportar transparência, gere com fundo verde chapado (#00FF00) e remova com remove.bg ou Photoshop.

### 1.3 Mãos no MacBook, sobre o ombro
Onde entra: seção "O que você recebe", ao lado de "Desenvolvimento", ou como imagem de OG.
```
Over-the-shoulder shot of a young man in a black shirt typing on a silver laptop in a dark room at night. The only light comes from the laptop screen and one small warm spotlight from above. The screen shows a clean, modern small-business website (blurred, unreadable). Charcoal background, deep shadows, cinematic, 35mm, shallow focus on the hands and keyboard, subtle film grain. No logos, no readable text.
```

### 1.4 Retrato vertical 9:16 (celular e redes sociais)
```
Use the attached photo as the identity reference. Vertical 9:16 portrait of the same man on a dark stage, one hard spotlight from directly above, the cone of light visible in light haze, he stands slightly off-center with his hands relaxed, black shirt, charcoal background (#141414). Lots of negative space above him for a headline. Photorealistic, cinematic, film grain.
```

### 1.5 No trabalho, tom de bastidor (humaniza, bom para o LinkedIn)
```
Use the attached photo as the identity reference. Candid photo of the same man at a minimal dark desk late at night, reviewing a website on a large monitor, a silver laptop open beside him, a cup of coffee. Lighting: monitor glow on his face plus one warm desk lamp. Dark charcoal room, no clutter, documentary style, 35mm, natural, not posed. No brand logos visible.
```

---

## 2. Vídeo curto (Runway, Kling, Veo ou Sora)

### 2.1 Loop para o hero, 6 a 8 s (opcional, substituiria o spot do 3D em conexões lentas)
```
Static camera. An empty dark stage, charcoal black. A single spotlight flickers on from above, like theatre lights coming up: two quick flickers, then steady. Light haze drifts slowly inside the cone. At the bottom of the frame, a closed silver laptop sits in the pool of light. No people, no text. Seamless loop, 24fps, cinematic, subtle grain.
```

### 2.2 O apresentador entra na luz, 5 s (para a seção "O apresentador" ou para o Instagram)
Use a imagem 1.1 como primeiro frame (image-to-video).
```
The man slowly steps forward into the spotlight from the darkness, stops, and gives a small confident nod to the camera. Camera fixed, slight dolly in. Haze in the light cone. Keep the face identical to the first frame. 5 seconds.
```

---

## 3. Imagem de compartilhamento (Open Graph) 1200×630

Onde entra: `public/img/og.jpg`. Depois, troque `og:image` no `index.html` para `./img/og.jpg`.
```
1200×630 social preview image. Dark charcoal stage (#141414), a single warm spotlight from the top center falling on an open silver laptop whose screen shows a softly blurred modern website. Large empty area on the left for a headline. Cinematic, photorealistic, subtle film grain, no text.
```
Depois de gerar, escreva por cima (Figma ou Canva) em Geist SemiBold, branco:
**"Your business deserves a better stage."** e embaixo, em cinza #a6a6a6: *Pedro de Agostini — Web Developer*.

---

## 4. Modelo 3D (opcional, só se quiser trocar o MacBook procedural)

O MacBook atual é gerado em código: não depende de arquivo e carrega instantâneo. Se quiser um modelo mais detalhado, gere no **Meshy** ou **Tripo** e exporte em `.glb`, com a tampa como **malha separada**, para a dobradiça continuar animando:
```
Low-poly-friendly 14-inch laptop, silver anodized aluminum, closed-lid and open-lid variants, the lid as a separate mesh with its pivot at the hinge, the screen as a separate flat rectangular mesh with clean UVs (0–1) for a texture, no logo, no text, PBR materials, under 30k triangles.
```

---

## 5. Capturas dos projetos (já existem, atualize quando os sites mudarem)

As telas dos MacBooks usam capturas de página inteira dos sites no ar:
1. Salve a nova captura (1280px de largura, página inteira) em `materiais/capturas/<slug>.jpeg`. O slug é o mesmo de `src/data/projects.js`.
2. Rode `npm run prepare:captures`. O script gera a textura de desktop, a de celular e a miniatura do índice em `public/projects/`.

**Para adicionar um projeto novo:** faça a captura, rode o script e adicione um item em `src/data/projects.js` (nome, url, categoria em EN/PT, local e uma linha de descrição em EN/PT).

---

## Regras para todo material novo
- **Uma única fonte de luz, de cima.** Nada de iluminação de estúdio uniforme.
- **Fundo carvão, nunca preto puro nem branco.**
- **Carmim #e60039 só como detalhe** (rim light, um ponto). Nunca como fundo.
- **Sem logos de marcas** (Apple etc.) nos aparelhos.
- **Nada de números ou depoimentos inventados** nas imagens.
