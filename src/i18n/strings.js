export const WHATSAPP_NUMBER = '5514998733928'
export const EMAIL = 'contatopedrodeagostini@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/pedrodeagostini'
export const GITHUB = 'https://github.com/PedroAgostini'

export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

// Every fact below comes from Pedro's LinkedIn (experience, education, skill assessments)
// and GitHub (README, repositories). Nothing here is invented.
export const strings = {
  en: {
    meta: {
      title: 'Pedro de Agostini | Web Development & AI Agents',
      description:
        "Pedro de Agostini's portfolio: websites, e-commerce experiences, web systems and AI agents for companies in Brazil and the United States.",
    },
    skip: 'Skip to content',
    nav: { work: 'Work', career: 'Career', about: 'About', contact: 'Contact', talk: "Let's talk", langLabel: 'Language', menu: 'Open menu', closeMenu: 'Close menu', elsewhere: 'Social media' },
    chapters: { work: 'Work' },
    hero: {
      lines: ['Websites, Systems', 'and AI Agents', 'Built to Perform.'],
      sub: "I'm Pedro de Agostini, a mid-level web developer. I build corporate websites, e-commerce experiences and web systems, and I create AI agents for products and workflows.",
      cta: 'Discuss a project',
      secondary: 'View selected work',
      whatsappText: "Hi Pedro! I saw your portfolio and I'd like to discuss a website, system or AI agent.",
      scroll: 'Explore',
      role: 'Web Developer · AI Agents',
      place: 'Itapuí, SP · Brazil',
      focus: ['Websites', 'Web systems', 'AI agents'],
      localTime: 'Local time',
    },
    work: {
      intro: 'More Than 50 Projects Built. Explore Some of Them.',
      introLines: ['More Than {count} Projects Built.', 'Explore Some of Them.'],
      projectCount: 50,
      introSub: 'Live websites, from planning through deployment.',
      visit: 'Visit site',
      live: 'Live',
      skip: 'Skip to the full list',
      hint: 'Click an app to open the live site right here.',
      openTab: 'Open in new tab',
      close: 'Close window',
      maximize: 'Expand window',
      loading: 'Loading live site',
      desktop: 'Projects',
      dockLabel: 'Contact',
    },
    statement: [
      'I build websites, systems',
      'and AI agents to remove bottlenecks,',
      'simplify workflows',
      'and turn technology into results.',
    ],
    career: {
      title: 'Five Years. Four Roles. One Direction.',
      sub: 'A career shaped by technology, now focused on web products, AI and agent development.',
      now: 'now',
      items: [
        {
          years: '2021 — 2023',
          role: 'IT Technical Analyst',
          org: 'Supermercado Lenharo',
          place: 'Itapuí, SP',
          text: 'Working close to daily business operations taught me to solve real problems with clarity, speed and responsibility.',
        },
        {
          years: '2023 — 2024',
          role: 'DBA Intern',
          org: 'Harpo Tecnologia · Cloud & Data Security',
          place: 'Bauru, SP · remote',
          text: 'An experience centered on data, reliability and attention to detail, principles I now bring to every digital product.',
        },
        {
          years: '2024 — 2025',
          role: 'IT Analyst',
          org: 'K6 Tecnologia',
          place: 'Jaú, SP',
          text: 'Turning complex technical needs into clear and dependable solutions for people and businesses.',
        },
        {
          years: '2025 —',
          role: 'Mid-level Web Developer',
          org: 'Agência TS',
          place: 'Jaú, SP',
          text: 'Corporate websites, landing pages and e-commerce experiences for companies in Brazil and the United States. I also use AI and build agents for digital workflows.',
          current: true,
        },
      ],
    },
    education: {
      title: 'Education Grounded in Practice.',
      items: [
        { k: 'Postgraduate degree', v: 'Data Engineering', org: 'UNOPAR', years: '2024' },
        { k: 'Bachelor’s degree', v: 'Information Systems', org: 'Instituição Toledo de Ensino', years: '2021 — 2024' },
        { k: 'Technology degree', v: 'Systems Analysis and Development', org: 'Instituição Toledo de Ensino', years: '2021 — 2023' },
      ],
      stackLabel: 'Web, data and AI tools I work with',
      stackHint: 'Drag horizontally or use the arrow keys to explore the technologies.',
      stack: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Tailwind CSS', 'WordPress', 'PHP', 'Laravel', 'MySQL', 'Oracle', 'Python', 'Power BI', 'C++', 'Claude', 'Codex'],
      code: 'Explore my work on GitHub',
    },
    index: {
      title: 'Explore Some of My Projects.',
      cols: { name: 'Project', category: 'Business', company: 'Company', domain: 'Address' },
    },
    about: {
      title: 'Websites, Systems and AI Agents, From Idea to Launch.',
      body: [
        'I’m Pedro de Agostini, a mid-level web developer. I create corporate websites, e-commerce stores, web systems and AI agents for companies in Brazil and the United States.',
        'I work across strategy, interface, development and AI to turn business needs into digital products and agents for real workflows. I build each project to stay fast, intuitive, maintainable and ready to evolve.',
      ],
      motto: {
        parts: [
          { text: 'Understanding', strong: true },
          { text: ' the product makes ', strong: false },
          { text: 'every detail', strong: true },
          { text: ' better.', strong: false },
        ],
      },
      portraitAlt: 'Portrait of Pedro de Agostini in a black shirt against a dark background',
    },
    contact: {
      kicker: "Let's Build Something Together.",
      title: 'Projects and partnerships, you’ll speak directly with me.',
      whatsapp: 'Message me on WhatsApp',
      whatsappHint: 'A direct line to me. No queue, no bots.',
    },
    footer: {
      rights: 'Pedro de Agostini',
      built: 'I designed and built this site with React, GSAP, Three.js and AI-assisted tools.',
      top: 'Back to top',
      home: 'Home',
      navigation: 'Footer navigation',
      social: 'Social profiles',
      email: 'Send an email',
    },
  },

  pt: {
    meta: {
      title: 'Pedro de Agostini | Desenvolvimento Web e Agentes de IA',
      description:
        'Portfólio de Pedro de Agostini: sites, e-commerce, sistemas web e agentes de IA para empresas no Brasil e nos Estados Unidos.',
    },
    skip: 'Pular para o conteúdo',
    nav: { work: 'Projetos', career: 'Trajetória', about: 'Sobre', contact: 'Contato', talk: 'Vamos conversar', langLabel: 'Idioma', menu: 'Abrir menu', closeMenu: 'Fechar menu', elsewhere: 'Redes sociais' },
    chapters: { work: 'Projetos' },
    hero: {
      lines: ['Sites, sistemas', 'e agentes de IA', 'para gerar resultados.'],
      sub: 'Sou Pedro de Agostini, desenvolvedor web pleno. Crio sites institucionais, experiências de e-commerce e sistemas web, além de agentes de IA para produtos e fluxos de trabalho.',
      cta: 'Falar sobre um projeto',
      secondary: 'Ver trabalhos selecionados',
      whatsappText: 'Oi Pedro! Vi seu portfólio e quero conversar sobre um site, sistema ou agente de IA.',
      scroll: 'Explore',
      role: 'Desenvolvedor Web · Agentes de IA',
      place: 'Itapuí, SP · Brasil',
      focus: ['Websites', 'Sistemas web', 'Agentes de IA'],
      localTime: 'Horário local',
    },
    work: {
      intro: 'Mais de 50 projetos construídos. Conheça alguns deles.',
      introLines: ['Mais de {count} projetos construídos.', 'Conheça alguns deles.'],
      projectCount: 50,
      introSub: 'Websites no ar, do planejamento ao deploy.',
      visit: 'Ver site',
      live: 'No ar',
      skip: 'Ir para a lista completa',
      hint: 'Clique em um app para abrir o site ao vivo aqui mesmo.',
      openTab: 'Abrir em nova aba',
      close: 'Fechar janela',
      maximize: 'Expandir janela',
      loading: 'Carregando o site ao vivo',
      desktop: 'Projetos',
      dockLabel: 'Contato',
    },
    statement: [
      'Crio websites, sistemas',
      'e agentes de IA para resolver gargalos,',
      'simplificar processos',
      'e transformar tecnologia em resultado.',
    ],
    career: {
      title: 'Cinco anos. Quatro funções. Uma direção.',
      sub: 'Uma carreira construída em tecnologia, hoje focada em produtos web, IA e desenvolvimento de agentes.',
      now: 'agora',
      items: [
        {
          years: '2021 — 2023',
          role: 'Analista Técnico de TI',
          org: 'Supermercado Lenharo',
          place: 'Itapuí, SP',
          text: 'A proximidade com a operação diária me ensinou a resolver problemas reais com clareza, agilidade e responsabilidade.',
        },
        {
          years: '2023 — 2024',
          role: 'Estagiário DBA',
          org: 'Harpo Tecnologia · Cloud & Segurança de Dados',
          place: 'Bauru, SP · remoto',
          text: 'Uma experiência centrada em dados, confiabilidade e atenção aos detalhes, princípios que levo para cada produto digital.',
        },
        {
          years: '2024 — 2025',
          role: 'Analista de TI',
          org: 'K6 Tecnologia',
          place: 'Jaú, SP',
          text: 'Transformando necessidades técnicas complexas em soluções claras e confiáveis para pessoas e empresas.',
        },
        {
          years: '2025 —',
          role: 'Desenvolvedor Web Pleno',
          org: 'Agência TS',
          place: 'Jaú, SP',
          text: 'Sites institucionais, landing pages e experiências de e-commerce para empresas no Brasil e nos Estados Unidos. Também uso IA e desenvolvo agentes para fluxos digitais.',
          current: true,
        },
      ],
    },
    education: {
      title: 'Formação que sustenta a prática.',
      items: [
        { k: 'Pós-graduação', v: 'Engenharia de Dados', org: 'UNOPAR', years: '2024' },
        { k: 'Bacharelado', v: 'Sistemas de Informação', org: 'Instituição Toledo de Ensino', years: '2021 — 2024' },
        { k: 'Tecnólogo', v: 'Análise e Desenvolvimento de Sistemas', org: 'Instituição Toledo de Ensino', years: '2021 — 2023' },
      ],
      stackLabel: 'Ferramentas de web, dados e IA com que trabalho',
      stackHint: 'Arraste na horizontal ou use as setas para explorar as tecnologias.',
      stack: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Tailwind CSS', 'WordPress', 'PHP', 'Laravel', 'MySQL', 'Oracle', 'Python', 'Power BI', 'C++', 'Claude', 'Codex'],
      code: 'Explorar meus projetos no GitHub',
    },
    index: {
      title: 'Veja alguns dos meus projetos.',
      cols: { name: 'Projeto', category: 'Negócio', company: 'Empresa', domain: 'Endereço' },
    },
    about: {
      title: 'Websites, sistemas e agentes de IA, da ideia ao lançamento.',
      body: [
        'Sou Pedro de Agostini, desenvolvedor web pleno. Crio sites institucionais, e-commerces, sistemas web e agentes de IA para empresas no Brasil e nos Estados Unidos.',
        'Trabalho entre estratégia, interface, desenvolvimento e IA para transformar necessidades de negócio em produtos digitais e agentes para fluxos reais. Faço cada projeto para ser rápido, intuitivo, fácil de manter e preparado para evoluir.',
      ],
      motto: {
        parts: [
          { text: 'Entender', strong: true },
          { text: ' o produto melhora ', strong: false },
          { text: 'cada detalhe', strong: true },
          { text: '.', strong: false },
        ],
      },
      portraitAlt: 'Retrato de Pedro de Agostini de camisa preta contra um fundo escuro',
    },
    contact: {
      kicker: 'Vamos construir algo juntos.',
      title: 'Projetos e parcerias, a conversa começa direto comigo.',
      whatsapp: 'Me chame no WhatsApp',
      whatsappHint: 'Uma linha direta comigo. Sem fila, sem robô.',
    },
    footer: {
      rights: 'Pedro de Agostini',
      built: 'Criei este site com React, GSAP, Three.js e ferramentas de IA.',
      top: 'Voltar ao topo',
      home: 'Início',
      navigation: 'Navegação do rodapé',
      social: 'Perfis sociais',
      email: 'Enviar um e-mail',
    },
  },
}
