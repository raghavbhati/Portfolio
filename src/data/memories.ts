export interface MemoryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface MemoryEvent {
  id: string;
  title: string;
  category: 'Conference' | 'Developer Day' | 'Hackathon';
  organization: string;
  date: string;
  formattedDate: string;
  location?: string;
  highlight: string;
  description: string;
  takeaways: string[];
  tags: string[];
  images: MemoryImage[];
  linkedInUrl?: string;
  accentColor: string;
}

export const memories: MemoryEvent[] = [
  {
    id: 'clickup-2025',
    title: 'ClickUp Event',
    category: 'Conference',
    organization: 'ClickUp',
    date: 'March 2025',
    formattedDate: 'Mar 2025',
    location: 'Tech Hub',
    highlight: 'Modern Engineering Workflows & Team Velocity',
    description:
      'Joined the ClickUp community event exploring modern engineering workflows, asynchronous developer collaboration, and eliminating productivity bottlenecks across distributed engineering teams.',
    takeaways: [
      'Explored automated sprint pipelines and cross-functional team synchronization',
      'Discussed system visibility, issue tracking, and reducing developer context-switching',
      'Exchanged insights with distributed team leads and product engineers on agile delivery',
    ],
    tags: ['ClickUp', 'Workflows', 'Agile', 'Productivity', 'DevOps'],
    images: [
      {
        src: '/memories/clickup-1.jpg',
        alt: 'Keynote session on modern engineering workflows at ClickUp Event',
        caption: 'Keynote session on streamlining engineering workflows & developer velocity',
      },
      {
        src: '/memories/clickup-2.jpg',
        alt: 'Collaborative networking lounge at ClickUp Event',
        caption: 'Discussing developer tool integrations and team productivity at the lounge',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
    accentColor: '#7b68ee',
  },
  {
    id: 'mongodb-2025',
    title: 'MongoDB Developer Day',
    category: 'Developer Day',
    organization: 'MongoDB',
    date: 'July 2025',
    formattedDate: 'Jul 2025',
    location: 'Tech Conference Center',
    highlight: 'MongoDB Atlas, Vector Search & Generative AI Pipelines',
    description:
      'Attended the MongoDB developer conference focusing on MongoDB Atlas, high-performance document schemas, and architecting intelligent RAG applications with vector embeddings.',
    takeaways: [
      'Hands-on vector indexing and semantic retrieval in MongoDB Atlas',
      'Building resilient RAG architectures with embeddings and LLM orchestration',
      'Optimizing high-throughput document schemas and aggregation pipelines',
    ],
    tags: ['MongoDB', 'Atlas', 'Vector Search', 'RAG', 'Generative AI'],
    images: [
      {
        src: '/memories/mongodb-1.jpg',
        alt: 'Presentation on MongoDB Atlas & Vector Search for Generative AI',
        caption: 'Keynote on unlocking Generative AI semantics with MongoDB Atlas Vector Search',
      },
      {
        src: '/memories/mongodb-2.jpg',
        alt: 'Hands-on developer lab building applications with MongoDB Atlas',
        caption: 'Interactive workshop implementing semantic search and document data models',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
    accentColor: '#00ed64',
  },
  {
    id: 'google-hackathon-2025',
    title: 'Google Hackathon',
    category: 'Hackathon',
    organization: 'Google',
    date: 'October 2025',
    formattedDate: 'Oct 2025',
    location: 'Innovation Campus',
    highlight: '48-Hour Sprint: Rapid AI Prototyping & Distributed Services',
    description:
      'Competed in the hackathon organized by Google, designing and shipping an end-to-end cloud-backed application with real-time data pipelines and AI capabilities under high pressure.',
    takeaways: [
      'Constructed distributed microservices architecture and real-time streaming pipeline',
      'Integrated Google Cloud services and multimodal AI endpoints for live evaluation',
      'Presented architecture diagram and working prototype to technical judging panel',
    ],
    tags: ['Google', 'Hackathon', 'Google Cloud', 'Microservices', 'Fast Prototyping'],
    images: [
      {
        src: '/memories/google-1.jpg',
        alt: 'Collaborative coding sprint at the Google Hackathon',
        caption: 'Intensive team collaboration and late-night architecture refinement',
      },
      {
        src: '/memories/google-2.jpg',
        alt: 'Project stage presentation and architecture defense at Google Hackathon',
        caption: 'Pitching our microservices architecture and live demo to the judges',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
    accentColor: '#4285f4',
  },
];
