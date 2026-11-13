// Links, roles and professional skills from the supplied résumé.
export const email = 'workmail.raghav@gmail.com';
export const links = {
  github: 'https://github.com/raghavbhati',
  linkedin: 'https://www.linkedin.com/in/raghavbhatirv/',
  x: 'https://twitter.com/raghavbhatirv/',
  fabfunnel: 'https://fabfunnel.com/',
};
/** Set to '/RaghavBhatiResume.pdf' once the PDF is in public/; until then the links say so. */
export const resumeUrl: string | null = null;

/** Roles at IdeaClan, current one first. */
export const ideaclanRoles = [
  {
    title: 'Software Development Engineer 1',
    dates: 'March 2026 – Present',
    points: [
      'Built Google, Bigo, and Snapchat ad-platform services from scratch with AI-assisted development, and maintain them alongside the Facebook and NewsBreak services.',
    ],
  },
  {
    title: 'Associate Software Engineer',
    dates: 'March 2024 – March 2026',
    points: [
      'Developed and maintained backend microservices using Node.js and TypeScript, with optimized GraphQL and REST APIs and GraphQL Federation.',
      'Built Facebook and NewsBreak services for in-platform campaign management, integrating ad accounts and synchronizing spend data in near real time. Backend optimizations reduced report processing time by 30%.',
      'Built a Kafka pipeline to stream data into ClickHouse and used TypeORM with PostgreSQL for schema design and query optimization.',
      'Developed real-time notifications with GraphQL subscriptions, WebSockets, Redis Pub/Sub, and RabbitMQ.',
      'Built a User Activity service using Loki APIs and event-driven workflows for background report synchronization.',
      'Contributed React features using Apollo Client and GraphQL Codegen for type-safe client applications.',
    ],
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

export const stack = [
  { category: 'Languages', tools: ['TypeScript', 'JavaScript', 'SQL', 'Java'] },
  {
    category: 'Backend & APIs',
    tools: [
      'Node.js',
      'Express.js',
      'GraphQL',
      'REST APIs',
      'Microservices',
      'WebSockets',
      'TypeORM',
    ],
  },
  {
    category: 'Data & Messaging',
    tools: ['PostgreSQL', 'ClickHouse', 'MongoDB', 'Redis', 'RabbitMQ', 'Kafka'],
  },
  {
    category: 'Frontend',
    tools: [
      'React',
      'Redux',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Ant Design',
      'Apollo Client',
      'GraphQL Codegen',
      'Bootstrap',
    ],
  },
  {
    category: 'Workflow & DevOps',
    tools: [
      'Docker',
      'Git',
      'GitHub',
      'Grafana',
      'Loki',
      'OpenTelemetry',
      'Postman',
      'Jira',
      'VS Code',
    ],
  },
  {
    category: 'AI',
    tools: ['Claude Code', 'MCP', 'LLM APIs', 'RAG', 'Vector Search', 'Prompt Engineering'],
  },
  { category: 'Web & Design', tools: ['WordPress', 'Firebase', 'Figma'] },
];
