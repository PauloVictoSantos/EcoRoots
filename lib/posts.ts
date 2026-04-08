export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  icon: string;
}

export const posts: Post[] = [
  {
    slug: "futuro-da-ia-generativa",
    title:
      "O Futuro da IA Generativa: Como Modelos de Linguagem Estão Transformando o Mundo",
    excerpt:
      "Descubra como os avanços em IA generativa estão revolucionando setores como saúde, educação e criatividade, e o que esperar para os próximos anos.",
    content: `A inteligência artificial generativa está passando por uma revolução sem precedentes. Modelos de linguagem como o Claude, GPT e Gemini estão redefinindo o que é possível em termos de criação de conteúdo, análise de dados e automação de tarefas complexas.

## O Estado Atual da IA Generativa

Nos últimos dois anos, vimos uma explosão no uso de IA generativa em praticamente todos os setores. Empresas estão usando essas ferramentas para automatizar processos, gerar insights a partir de grandes volumes de dados e criar experiências personalizadas para seus clientes.

A capacidade desses modelos de entender contexto, nuances linguísticas e até mesmo emoções tem aberto portas para aplicações que antes pareciam ficção científica. Desde assistentes virtuais que podem manter conversas naturais até sistemas que geram código, arte e música, as possibilidades parecem infinitas.

## Impacto nos Setores-Chave

### Saúde

Na área da saúde, a IA generativa está sendo usada para acelerar a descoberta de medicamentos, analisar imagens médicas com precisão sobre-humana e personalizar tratamentos para pacientes individuais. Hospitais ao redor do mundo já estão implementando assistentes de IA que ajudam médicos a diagnosticar doenças raras.

### Educação

No setor educacional, tutores de IA estão transformando a forma como aprendemos. Esses sistemas podem adaptar o conteúdo ao ritmo e estilo de aprendizagem de cada aluno, oferecendo uma experiência verdadeiramente personalizada que era impossível com métodos tradicionais.

### Criatividade

Artistas, escritores e músicos estão usando IA como ferramenta colaborativa, expandindo os limites da criatividade humana. A IA não está substituindo a criatividade, mas amplificando-a de maneiras surpreendentes.

## O Que Esperar do Futuro

O futuro da IA generativa promete ser ainda mais transformador. Com avanços em multimodalidade, raciocínio e autonomia, estamos caminhando para um mundo onde a IA será um parceiro onipresente no nosso dia a dia.

A chave para um futuro positivo está no desenvolvimento responsável dessas tecnologias, garantindo que sejam seguras, transparentes e benéficas para toda a humanidade.`,
    category: "Inteligência Artificial",
    date: "05 Abr 2026",
    readTime: "8 min",
    author: { name: "Ana Silva", role: "Pesquisadora de IA", initials: "AS" },
    icon: "🤖",
  },
  {
    slug: "react-server-components-guia",
    title:
      "React Server Components: O Guia Definitivo para Performance Extrema",
    excerpt:
      "Aprenda como React Server Components podem reduzir drasticamente o bundle size e melhorar a experiência do usuário no seu próximo projeto.",
    content: `React Server Components representam uma das maiores mudanças no ecossistema React desde a introdução dos Hooks. Esta tecnologia permite renderizar componentes no servidor, enviando apenas o HTML resultante para o cliente.

## Por Que Server Components?

O problema fundamental que os Server Components resolvem é o tamanho crescente dos bundles JavaScript. À medida que as aplicações React crescem, o JavaScript enviado ao navegador pode facilmente ultrapassar megabytes, resultando em tempos de carregamento lentos e experiências frustrantes para o usuário.

Com Server Components, o código do componente nunca chega ao navegador. Isso significa que você pode importar bibliotecas pesadas no servidor sem impactar o performance do cliente.

## Como Funcionam na Prática

Server Components executam apenas no servidor. Eles podem acessar diretamente bancos de dados, sistemas de arquivos e APIs internas sem expor credenciais ao cliente. O resultado é enviado como uma representação serializada que o React no cliente pode renderizar.

### Regras Fundamentais

Os Server Components não podem usar estado como useState ou useReducer. Também não podem usar efeitos como useEffect ou useLayoutEffect, nem APIs do navegador. No entanto, Server Components podem importar Client Components, enquanto Client Components não podem importar Server Components diretamente.

## Padrões de Composição

A chave para usar Server Components efetivamente é entender os padrões de composição. O padrão mais comum é o "donut pattern", onde um Server Component envolve Client Components, passando dados como props.

## Performance Real

Em benchmarks reais, aplicações que migram para Server Components frequentemente veem reduções de 30-50% no bundle JavaScript, com melhorias significativas no Largest Contentful Paint (LCP) e Time to Interactive (TTI).

## Conclusão

React Server Components não são apenas uma otimização — são uma mudança fundamental na arquitetura de aplicações React. Se você ainda não começou a explorar essa tecnologia, agora é o momento perfeito para começar.`,
    category: "Desenvolvimento Web",
    date: "02 Abr 2026",
    readTime: "6 min",
    author: {
      name: "Carlos Mendes",
      role: "Engenheiro Frontend",
      initials: "CM",
    },
    icon: "⚛️",
  },
  {
    slug: "edge-computing-2026",
    title: "Edge Computing em 2026: Por Que Latência Zero é o Novo Padrão",
    excerpt:
      "Como edge computing está eliminando a latência e criando experiências instantâneas que redefinem as expectativas dos usuários modernos.",
    content: `A era da computação na edge está finalmente aqui. Depois de anos de promessas, 2026 marca o ponto de inflexão onde edge computing se tornou o padrão, não a exceção.

## A Revolução da Edge

Tradicionalmente, aplicações web dependiam de servidores centralizados em data centers distantes. Cada request viajava centenas ou milhares de quilômetros, adicionando latência que degradava a experiência do usuário. Edge computing resolve isso colocando a computação fisicamente perto do usuário.

## O Ecossistema Atual

Plataformas como Cloudflare Workers, Vercel Edge Functions e Deno Deploy tornaram trivial deployar código na edge. Com mais de 300 pontos de presença ao redor do mundo, seu código pode executar a menos de 50ms do usuário, em qualquer lugar do planeta.

### Bancos de Dados na Edge

O avanço mais significativo de 2026 é a maturidade dos bancos de dados distribuídos na edge. Soluções como Turso, Neon e PlanetScale agora oferecem réplicas de leitura em dezenas de regiões, com consistência eventual medida em milissegundos.

### AI na Edge

Modelos de IA compactos agora executam diretamente na edge, permitindo inferência em tempo real sem a latência de chamar APIs centralizadas. Isso está habilitando casos de uso como tradução instantânea, moderação de conteúdo em tempo real e personalização dinâmica.

## Arquiteturas Edge-First

A arquitetura edge-first inverte o modelo tradicional. Em vez de pensar na edge como cache, ela se torna o ponto primário de computação. O servidor central passa a ser o backup para operações que realmente precisam de centralização.

## O Impacto nos Negócios

Empresas que adotaram edge computing relatam melhorias de 40-60% em métricas de conversão, diretamente atribuídas à redução de latência. Quando cada milissegundo conta, a edge faz toda a diferença.

## Conclusão

Se você ainda está construindo aplicações com arquitetura centralizada, 2026 é o ano para repensar sua estratégia. A edge não é mais o futuro — é o presente.`,
    category: "Cloud & DevOps",
    date: "28 Mar 2026",
    readTime: "10 min",
    author: {
      name: "Marina Costa",
      role: "Arquiteta Cloud",
      initials: "MC",
    },
    icon: "☁️",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
