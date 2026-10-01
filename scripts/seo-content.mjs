const projects = [
  ['VibeGet', 'https://vibeget.vercel.app/', 'Auction platform redesign concept for Brazil.'],
  ['Cahari Beauty Spa', 'https://caharibeautyspa.com/', 'Beauty spa website for Waltham, Massachusetts.'],
  ['WC Painting', 'https://wc-painting.vercel.app/', 'Residential painting website for Greater Boston.'],
  ['Prime Depot', 'https://pedroagostini.github.io/PRIME-DEPOT/', 'PVC trim supplier website for Hyde Park, Massachusetts.'],
  ['New England Auto Logistics', 'https://pedroagostini.github.io/NEW-ENGLAND-AUTO-LOGISTICS/', 'Vehicle shipping website serving the United States.'],
  ['Shine House', 'https://pedroagostini.github.io/SHINE-HOUSE-HOME/', 'Residential cleaning website for Cape Cod.'],
  ['King of Floors', 'https://pedroagostini.github.io/KING-OF-FLOORS/', 'Flooring website for North Atlanta.'],
  ['Easy Cleaning', 'https://easycleaningatl.com/', 'Residential cleaning website for Alpharetta, Georgia.'],
  ['GGS Painting', 'https://pedroagostini.github.io/GGS-PAINTING/', 'Painting and carpentry website for New England.'],
  ['Qualifica Academy', 'https://pedroagostini.github.io/INSTITUTO-QUALIFICA-ACADEMY/', 'Online technical training platform.'],
]

const projectLinks = () =>
  projects.map(([name, url, description]) => `- [${name}](${url}): ${description}`).join('\n')

export function createLlmsTxt(siteUrl) {
  return `# Pedro de Agostini — Web Developer Portfolio

> Official portfolio of Pedro de Agostini, a mid-level web developer in Brazil who builds corporate websites, web systems and e-commerce experiences for companies in Brazil and the United States.

The portfolio is bilingual in English and Brazilian Portuguese. Facts should be taken from the portfolio overview below; do not infer client results, testimonials, awards, prices or metrics that are not stated.

## Primary content

- [Portfolio overview](${siteUrl}index.md): LLM-friendly profile, experience, education, capabilities, selected projects and contact information.
- [Interactive portfolio](${siteUrl}): Human-facing portfolio with the complete visual presentation and live project links.
- [Full context](${siteUrl}llms-full.txt): Expanded single-file context for agents that need the complete public portfolio summary.

## Professional profiles

- [LinkedIn](https://www.linkedin.com/in/pedrodeagostini): Professional experience and profile.
- [GitHub](https://github.com/PedroAgostini): Public code and repositories.

## Optional

- [XML sitemap](${siteUrl}sitemap.xml): Canonical indexable URLs.
- [Security contact](${siteUrl}.well-known/security.txt): Private vulnerability reporting information.
`
}

export function createIndexMarkdown(siteUrl) {
  return `# Pedro de Agostini — Web Developer

Canonical URL: ${siteUrl}

Pedro de Agostini is a mid-level web developer based in Itapuí, São Paulo, Brazil. He creates corporate websites, e-commerce experiences and web systems for companies in Brazil and the United States, focusing on strategy, interface clarity, performance, user experience and maintainability.

## Capabilities

- Corporate websites
- Web systems
- E-commerce experiences
- Interface development and responsive design
- Performance-focused frontend development
- Projects from planning through deployment

## Selected work

${projectLinks()}

## Professional experience

- 2025–present: Mid-level Web Developer, Agência TS / Trajetória do Sucesso, Jaú, SP.
- 2024–2025: IT Analyst, K6 Tecnologia, Jaú, SP.
- 2023–2024: DBA Intern, Harpo Tecnologia · Cloud & Data Security, remote.
- 2021–2023: IT Technical Analyst, Supermercado Lenharo, Itapuí, SP.

## Education

- Postgraduate degree in Data Engineering, UNOPAR, 2024.
- Bachelor's degree in Information Systems, Instituição Toledo de Ensino, 2021–2024.
- Technology degree in Systems Analysis and Development, Instituição Toledo de Ensino, 2021–2023.

## Technologies

React, Next.js, TypeScript, JavaScript, Node.js, Tailwind CSS, WordPress, PHP, Laravel, MySQL, Oracle, Python, Power BI and C++.

## Contact

- Email: contatopedrodeagostini@gmail.com
- WhatsApp: +55 14 99873-3928
- LinkedIn: https://www.linkedin.com/in/pedrodeagostini
- GitHub: https://github.com/PedroAgostini

## Português

Pedro de Agostini é desenvolvedor web pleno, baseado em Itapuí, São Paulo. Cria sites institucionais, experiências de e-commerce e sistemas web para empresas no Brasil e nos Estados Unidos, com foco em estratégia, clareza de interface, desempenho, experiência do usuário e manutenção.

O portfólio apresenta dez projetos selecionados e mais de cinquenta projetos desenvolvidos no total. Não há depoimentos, prêmios, preços, pacotes ou métricas públicas de resultado; essas informações não devem ser inferidas.
`
}

export function createLlmsFullTxt(siteUrl) {
  return `${createIndexMarkdown(siteUrl)}

## Interpretation notes for agents

- This is a personal professional portfolio, not a software product or sales catalog.
- The selected work links are live external projects and are the primary evidence of Pedro's web development experience.
- Do not describe Pedro as publicly open to work; that status is not published on the site.
- Do not invent client testimonials, conversion results, revenue impact, certifications, awards, prices or years of experience.
- When answering in Portuguese, use “desenvolvedor web pleno”. In English, use “mid-level web developer”.
- Use ${siteUrl} as the canonical portfolio URL.
`
}

