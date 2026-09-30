---
name: Pedro de Agostini
description: A launch keynote for live client websites. One dark stage, one light, crimson only for what is live and what to press.
colors:
  stage-floor: "#141414"
  stage-air: "#1a1a1a"
  surface: "#1f1f1f"
  muted: "#262626"
  line: "#333333"
  dim: "#a6a6a6"
  ink: "#fafafa"
  live: "#e60039"
  live-deep: "#66001a"
  live-shadow: "#4c0013"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 8.2vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.08rem, 1.4vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'ss01', 'cv11'"
  label:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0.01em"
    fontFeature: "'tnum'"
rounded:
  base: "4px"
  inner: "3px"
  hairline: "2px"
spacing:
  gutter: "clamp(16px, 5.5vw, 96px)"
  row: "24px"
  block: "36px"
components:
  button-live:
    backgroundColor: "{colors.live}"
    textColor: "#ffffff"
    rounded: "{rounded.base}"
    padding: "0 22px"
    height: "52px"
  button-live-hover:
    backgroundColor: "#ff0a47"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "0 22px"
    height: "52px"
  button-sm:
    padding: "0 16px"
    height: "40px"
  button-xl:
    padding: "0 26px"
    height: "64px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "14px"
  lang-toggle:
    textColor: "{colors.dim}"
    rounded: "{rounded.base}"
    padding: "3px"
  index-row:
    textColor: "{colors.ink}"
    padding: "24px 0"
---

# Design System: Pedro de Agostini

## Overview

**Creative North Star: "The Launch Keynote"**

Every client site is launched like a product at a keynote: alone on a dark stage, under one light, revealed in builds. The house is a charcoal stage: a solid floor and a slightly lifted air, lit by warm white spot cones falling from top center. There are no cards, no grids of thumbnails, no skill bars. Each section is a keynote ritual (the opening slide, the statement slide, the product reveal, the spec sheet, the presenter, "one more thing"), and each carries one statement at slide scale.

The palette is owner-pinned (21st.dev "Slate Dark") and nearly achromatic. The only chroma on the stage is crimson, and it means one of two things: this is live, or press this. Density is low; one idea per viewport, generous vertical air measured in viewport heights, and hairline rules instead of containers. Motion is damped and theatrical: lights come up, words build in from below a mask, the machine rises and turns. Nothing snaps.

The 3D stage (a single MacBook under a spot, lid scrubbed by scroll, the project scrolling itself on screen) is the signature and sits fixed behind the content. After the machine leaves, everything else sits on the solid stage floor, and later scenes reuse the same light as painted spot cones.

**Key Characteristics:**
- Charcoal stage, one warm white spot, film grain over the whole house.
- Crimson reserved for live state and primary action.
- Slide-scale Geist, tight negative tracking, built word by word.
- Geist Mono only for spec data.
- Hairline rules and 4px corners; no cards.
- Damped motion throughout (Lenis inertia, expo-out builds).

## Colors

A near-black charcoal ramp with a single crimson light color and its shadow.

### Primary
- **Live Crimson** (`live`): the stage's one light color. Used for the primary action button, the live-indicator dot and its ping ring, the focus-visible outline, text selection, the text caret, the hover state of index arrows and text-link underlines, and a faint ring reflection in the 3D environment map.
- **Crimson Shadow** (`live-deep`): owner-pinned accent; crimson's shadow side. Pinned in the token set, not yet deployed on a built surface.
- **Crimson Umbra** (`live-shadow`): the deepest crimson step, declared for shadowed crimson material. Not yet deployed on a built surface.

### Neutral
- **Stage Floor** (`stage-floor`): page background, the solid floor under every post-stage section, the 3D floor plane, the frosted top bar tint.
- **Stage Air** (`stage-air`): the 3D clear color and fog; the lifted haze the machine stands in.
- **Surface** (`surface`): the only filled planes: form fields and the hover preview frame.
- **Muted** (`muted`): owner-pinned fill step between surface and line; held in reserve.
- **Line** (`line`): every hairline rule, ghost button stroke, field stroke, language-toggle frame and active pill, scrollbar thumb.
- **Dim** (`dim`): secondary copy, nav links at rest, captions, spec values, footer.
- **Ink** (`ink`): primary text, headlines, progress fill, focus border on fields.

### Named Rules
**The One Light Rule.** Crimson means "live" or "act" and nothing else. It is never decoration, never a heading color, never a background panel. If a crimson element is neither a live indicator nor an action (or that action's hover/focus feedback), it is wrong.

**The Charcoal Ramp Rule.** Depth on the page comes from the neutral ramp (floor, air, surface, line), not from new hues. No blue-grays, no warm browns.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui)
**Body Font:** Geist Variable (with ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono Variable (with ui-monospace, SF Mono)

**Character:** One confident grotesk at slide scale, tracked tight and set heavy, against a mono that reads like a spec sheet. The theme's bundled faces (Poppins, Playfair) were intentionally not used.

### Hierarchy
- **Display** (600, clamp 2.9rem to 6rem, 0.96): the opening line, the "now presenting" title, the closing "one more thing" title. One per scene.
- **Headline** (600, clamp 2rem to 4rem, 0.98): section titles and each project name in the reveal.
- **Statement** (560, clamp 1.9rem to 3.7rem, 1.12, -0.035em, max 21em): the single statement slide; a mid-weight headline meant to be read as a sentence.
- **Title** (600, clamp 1.5rem to 2.4rem, 1.05, -0.035em): spec-sheet keys, the contact lead and "or" line.
- **Lead** (400, clamp 1.08rem to 1.3rem, 1.5): the line under a headline; 28 to 36em max.
- **Body** (400, 1rem, 1.55, ss01 + cv11): general copy, form text.
- **Label / Spec** (Geist Mono, 0.8125rem, +0.01em, tabular numerals): counts, project numbers, categories, places, domains, index column heads.

### Named Rules
**The Spec Data Rule.** Geist Mono is for data only: counts, indices, categories, places, domains. Never for headings, prose, or decorative labels above headings.

**The Slide Scale Rule.** Headings are 600 weight with -0.04em tracking and sub-1 line height, balanced with `text-wrap: balance`. One heading statement per viewport.

## Layout

A single full-bleed column with a fluid gutter (`spacing.gutter`) on both sides. Scenes are measured in viewport height: the opening and the "now presenting" intro are 100svh; the work reveal is a sticky 100svh track pinned over the fixed 3D canvas, with the caption confined to the left (about 31rem, 38vw max) so the machine owns center stage. Later sections breathe with 14 to 26vh block padding.

Structured content uses hairline-divided rows rather than containers: the project index is a four-column row grid (name, category, place, domain) collapsing to three at 1080px and to a two-area stack at 640px; the spec sheet is a two-column key/value grid collapsing to one at 640px. About and Contact are two-column splits that stack at 899px. Top-nav links hide at 899px; the small action button drops its label at 640px; hero actions stretch full width on phones.

Breakpoints observed: 1080px, 899px, 640px.

## Elevation & Depth

Depth is lighting, not shadow. The page is flat charcoal; dimension comes from the 3D stage (a warm white spot, `#fff4ee`, over a dark floor with fog in the air color) and, where WebGL is absent or a later scene needs it, from painted spot cones: radial gradients of warm white at 9 to 14% alpha falling from top center. A fixed fractal-noise grain at 7% opacity covers the whole house.

### Shadow Vocabulary
- **Live glow** (`0 10px 30px -8px rgb(230 0 57 / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.18)`): the primary action only; intensifies on hover.
- **Deep drop** (`0 30px 60px -18px rgb(0 0 0 / 0.85)`): objects floating above the floor, such as the index hover preview and the portrait.
- **Focus halo** (`0 0 0 3px rgb(230 0 57 / 0.4)`): form fields on focus.

### Named Rules
**The One Spot Rule.** Light falls from above, center, warm white. A scene gets one spot, never a wash or a colored gradient background.

**The Frosted Bar Rule.** The only translucent surface is the top bar once scrolled: floor color at 72% with a 14px blur and a hairline under it.

## Shapes

Tight, almost-square corners (`rounded.base`, 4px) on everything interactive: buttons, fields, the language toggle, the preview frame, the portrait. Inner pills step down to 3px; progress ticks and the focus outline use 2px. Borders are 1px hairlines in `line`. The only round form is the live dot. Containers do not exist; content is separated by full-width hairline rules.

## Components

### Buttons
Keynote clickers: compact, solid, one decision each.
- **Shape:** gently squared (4px), height 52px, 22px horizontal padding, weight 550, -0.01em tracking, optional 18px trailing icon.
- **Live (primary):** crimson fill, white text, live glow. Reserved for the WhatsApp action ("Start a project", "Talk", the closing call).
- **Ghost (secondary):** transparent with a `line` stroke and ink text; hover lifts the stroke to #595959 with a 3% white wash. Used for "See the work", "Visit live site", profile links, and form submit.
- **Hover / Focus:** icon nudges 3px right; transitions 0.35 to 0.5s on the expo-out curve; focus is a 2px crimson outline at 3px offset.
- **Sizes:** small (40px, top bar) and extra large (64px, closing call).

### Inputs / Fields
- **Style:** `surface` fill, 1px `line` stroke, 4px corners, 14px padding; dim label above at 0.88rem.
- **Focus:** stroke turns ink, with a 3px crimson focus halo.
- **Hover:** stroke lifts to #4a4a4a.

### Navigation
- **Top bar:** fixed; wordmark (620 weight), dim nav links brightening to ink on hover, EN/PT segmented toggle with a sliding `line` pill, and the small live button. Transparent at top, frosted once scrolled. Nav links hide below 900px.

### Live Indicator
A 7px crimson dot with a ring that pings outward every 2.4s. Marks a project as live (index rows, the reveal counter). Animation stops under reduced motion.

### Project Index
Hairline-ruled rows: mono number, project name (clamp 1.25rem to 1.9rem, 560), category, place, and domain with live dot and arrow. Hovering a row slides the name 10px right, dims its siblings to 32%, turns the arrow crimson, and floats a 16:10 screenshot preview beside the cursor (hidden on touch).

### Spec Sheet
Two-column key/value rows; key at title size, value in dim lead type; each row opens with a hairline rule that draws in from the left.

### The Product Reveal (signature)
A pinned 3D stage: one MacBook rises into the spot, its lid opens scrubbed by scroll, the screen powers on and the live site scrolls itself; between projects the lid closes and the machine turns to the next. The caption builds line by line through masks at left; a footer carries the live counter, segmented progress ticks (26px by 2px, ink fill scaling left to right), and a skip link. Without WebGL or under reduced motion, a static list shows each project in a flat CSS laptop frame beside its caption.

### Motion Grammar
Damped everywhere: Lenis inertia (lerp 0.085), anchor scrolls of 1.6s with quartic ease-out, CSS on `cubic-bezier(0.16, 1, 0.3, 1)`, GSAP builds on expo-out. Headlines build word by word, rising from below a clip mask with 0.07s stagger; supporting lines fade up from a slight blur. The canvas fades in over 1.4s, and the whole set dims as the machine exits.

## Do's and Don'ts

### Do:
- **Do** keep crimson (#e60039) for live indicators and actions, including their hover and focus feedback.
- **Do** separate content with 1px hairline rules in #333333 instead of boxing it.
- **Do** set headings in Geist at 600 with -0.04em tracking and let one statement own the viewport.
- **Do** put counts, indices, categories, places and domains in Geist Mono at 0.8125rem with tabular numerals.
- **Do** light a scene with a single warm white spot from top center (3D or painted radial gradient).
- **Do** build text in with masked word rises and damped easing; respect reduced motion.
- **Do** use 4px corners on every interactive element.

### Don't:
- **Don't** use cards, thumbnail grids, or skill bars.
- **Don't** use crimson as a decorative accent, heading color, or background panel.
- **Don't** use Poppins or Playfair; the theme's bundled faces were deliberately set aside for Geist.
- **Don't** put Geist Mono on headings, prose, or labels stacked above headings.
- **Don't** add interface hues outside the pinned Slate Dark palette (the MacBook's aluminium and glass are material, not interface color).
- **Don't** snap: no instant jumps, no linear easing on reveals.
