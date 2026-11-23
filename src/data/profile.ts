// Links, roles, projects and professional skills from the supplied résumé.
export const email = 'workmail.raghav@gmail.com';
export const links = {
  github: 'https://github.com/raghavbhati',
  linkedin: 'https://www.linkedin.com/in/raghavbhatirv/',
  x: 'https://twitter.com/raghavbhatirv/',
  youtube: 'https://www.youtube.com/@UnboxingForever/',
  fabfunnel: 'https://fabfunnel.com/',
};
/** The résumé PDF in public/; null would turn every Resume link into a "not available" note. */
export const resumeUrl: string | null = '/RaghavBhatiResume.pdf';

/** First day at IdeaClan, used to keep the "years of experience" figure current. */
export const careerStart = new Date(2024, 2, 1);

/** Roles at IdeaClan, current one first. */
export const ideaclanRoles = [
  {
    title: 'Software Development Engineer 1',
    dates: 'March 2026 – Present',
    points: [
      'Delivered 4 ad-platform integrations (Google Ads, Snapchat, BIGO, SmartNews) end to end in under 4 months, building Node.js/TypeScript GraphQL microservices and React frontends with an AI-assisted workflow.',
      'Designed event-driven sync pipelines (RabbitMQ, ClickHouse) for real-time reporting merged with tracker revenue data, keeping each platform’s reporting consistent with the ad platform’s own numbers.',
      'Added production observability to every service (OpenTelemetry tracing, Grafana alerts, health checks, graceful shutdown), so failures surface through alerts and traces instead of customer reports.',
      'Designed activity-based tiered asset syncing: active ad accounts and assets sync frequently while dormant ones sync less often, cutting API calls by 90% and reducing Kafka volume and server costs.',
    ],
  },
  {
    title: 'Associate Software Engineer',
    dates: 'March 2024 – February 2026',
    points: [
      'Engineered high-scale Facebook and NewsBreak services from scratch for in-platform campaign management, syncing ad accounts and spend in near real time and cutting report processing time by 30%.',
      'Built backend microservices with Node.js, TypeScript, GraphQL, REST, and GraphQL Federation, RabbitMQ workers for report syncing, and a Kafka-to-ClickHouse analytics pipeline via Vector, using TypeORM and PostgreSQL.',
      'Created a real-time notification service using GraphQL subscriptions, WebSockets, Redis Pub/Sub, and RabbitMQ to deliver instant user updates.',
      'Built a User Activity service that aggregates logs from multiple microservices via Loki (S3-backed storage) and uses LogQL queries to pull per-user events, turning raw logs into a user-facing activity history.',
      'Contributed React features using Apollo Client and GraphQL Codegen for type-safe client applications.',
    ],
  },
];

export interface Project {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  live: string;
  /** Flip `isPublic` once the repository is public; until then only the Live link shows. */
  repo: { url: string; isPublic: boolean };
}

export const projects: Project[] = [
  {
    name: 'EvenOut',
    tagline: 'A Splitwise alternative for India',
    description:
      'Group expense-splitting app with automated debt simplification and atomic, idempotent ledger updates.',
    tech: [
      'React Native',
      'Expo',
      'Node.js',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'AWS',
    ],
    live: 'https://evenout.in/',
    repo: { url: 'https://github.com/raghavbhati/EvenOut', isPublic: false },
  },
  {
    name: 'MoneyNify',
    tagline: 'Edge-native personal finance tracker',
    description:
      'Offline-first PWA that auto-logs expenses from Telegram, bank emails, PDF statements, and one-line chat entries, with budget analytics.',
    tech: ['Cloudflare Workers', 'D1', 'Drizzle ORM', 'TypeScript', 'React'],
    live: 'https://app.zeherkhanekapaisanahihai.in/',
    repo: { url: 'https://github.com/raghavbhati/Zeher-khane-ka-paisa-nahi-hai', isPublic: false },
  },
];

export const education = [
  {
    school: 'Masai School',
    course: 'Full Stack Web Development, Computer Science',
    place: 'India',
    dates: 'March 2023 – February 2024',
  },
  {
    school: 'Maharaja Ganga Singh University',
    course: 'Bachelor of Arts',
    place: 'Bikaner, India',
    dates: 'July 2020 – June 2023',
  },
];

export const certifications = [
  'Building RAG Apps Using MongoDB',
  'Postman API Fundamentals Student Expert',
];

export const stack = [
  { category: 'Languages', tools: ['TypeScript', 'JavaScript', 'SQL', 'Python', 'Java'] },
  {
    category: 'Backend & APIs',
    tools: [
      'Node.js',
      'Express.js',
      'Hono.js',
      'GraphQL',
      'GraphQL Federation',
      'Apollo Server',
      'REST APIs',
      'Microservices',
      'Event-Driven Architecture',
      'WebSockets',
      'OAuth 2.0',
      'TypeORM',
      'Prisma',
    ],
  },
  {
    category: 'Data & Messaging',
    tools: ['PostgreSQL', 'ClickHouse', 'MongoDB', 'Redis', 'RabbitMQ', 'Kafka', 'BullMQ'],
  },
  {
    category: 'Frontend',
    tools: [
      'React',
      'Redux',
      'React Native',
      'Expo',
      'Tailwind CSS',
      'Ant Design',
      'Apollo Client',
      'GraphQL Codegen',
      'HTML',
      'CSS',
      'Bootstrap',
    ],
  },
  {
    category: 'Workflow & DevOps',
    tools: [
      'Docker',
      'AWS',
      'Cloudflare',
      'Git',
      'GitHub',
      'Grafana',
      'Loki',
      'OpenTelemetry',
      'Postman',
      'Jira',
      'Agile',
      'VS Code',
    ],
  },
  {
    category: 'AI',
    tools: [
      'Claude Code',
      'Codex',
      'MCP',
      'LLM APIs',
      'RAG',
      'Vector Search',
      'Prompt Engineering',
      'AI-Assisted Development',
    ],
  },
  { category: 'Web & Design', tools: ['WordPress', 'Firebase', 'Figma'] },
];
