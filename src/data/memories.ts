export interface MemoryPhoto {
  src: string;
  alt: string;
}

export interface MemoryEvent {
  id: string;
  /** Short caption written under the polaroid. */
  label: string;
  title: string;
  organization: string;
  date: string;
  highlight: string;
  /** Every photo from the event; the first one is pinned to the board. */
  photos: MemoryPhoto[];
  /** Shows a "Check the post on LinkedIn" button when set. */
  linkedInUrl?: string;
  /** Shows a "Check the post on Twitter" button when set. */
  twitterUrl?: string;
}

export const memories: MemoryEvent[] = [
  {
    id: 'clickup-2025',
    label: 'clickup',
    title: 'ClickUp Event',
    organization: 'ClickUp',
    date: 'Mar 2025',
    highlight: 'Modern engineering workflows & team velocity',
    photos: [
      {
        src: '/memories/web/clickup-1.jpg',
        alt: 'Keynote session on modern engineering workflows at ClickUp Event',
      },
      {
        src: '/memories/web/clickup-2.jpg',
        alt: 'Collaborative networking lounge at ClickUp Event',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
  },
  {
    id: 'mongodb-2025',
    label: 'mongodb',
    title: 'MongoDB Developer Day',
    organization: 'MongoDB',
    date: 'Jul 2025',
    highlight: 'Atlas, vector search & generative AI pipelines',
    photos: [
      {
        src: '/memories/web/mongodb-1.jpg',
        alt: 'Presentation on MongoDB Atlas & Vector Search for Generative AI',
      },
      {
        src: '/memories/web/mongodb-2.jpg',
        alt: 'Hands-on developer lab building applications with MongoDB Atlas',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
  },
  {
    id: 'google-hackathon-2025',
    label: 'hackathon',
    title: 'Google Hackathon',
    organization: 'Google',
    date: 'Oct 2025',
    highlight: '48-hour sprint: rapid AI prototyping & distributed services',
    photos: [
      {
        src: '/memories/web/google-1.jpg',
        alt: 'Collaborative coding sprint at the Google Hackathon',
      },
      {
        src: '/memories/web/google-2.jpg',
        alt: 'Project stage presentation and architecture defense at Google Hackathon',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
  },
];
