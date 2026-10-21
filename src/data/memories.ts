export interface MemoryPhoto {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export const CLOUDFLARE_R2_BASE_URL = 'https://pub-e8e0176912ee4887a675dc3fc830520f.r2.dev';

export const r2Url = (key: string) => `${CLOUDFLARE_R2_BASE_URL}/${encodeURIComponent(key)}`;

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
  location?: string;
}

export const memories: MemoryEvent[] = [
  {
    id: 'clickhouse-2025',
    label: 'clickhouse',
    title: 'ClickHouse Event',
    organization: 'ClickHouse',
    date: '22th Mar 2025',
    highlight: 'Modern engineering workflows & team velocity',
    photos: [
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.11.02.jpeg'),
        alt: 'Architecture presentation on distributed log pipeline and ClickHouse',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
    location: 'Gurgaon',
  },
  {
    id: 'mongodb-2025',
    label: 'mongodb',
    title: 'MongoDB.local Delhi',
    organization: 'MongoDB',
    date: '1st Jul 2025',
    highlight: 'Atlas, vector search & generative AI pipelines',
    photos: [
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.10.36 (1).jpeg'),
        alt: 'Raghav Bhati at MongoDB.local Delhi',
      },
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.10.37.jpeg'),
        alt: 'MongoDB.local Delhi delegate badge for Raghav Bhati',
      },
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.10.36.jpeg'),
        alt: 'Keynote presentation on AI architecture and functional test generation at MongoDB.local',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
    location: 'Delhi',
  },
  {
    id: 'promptwars',
    label: 'promptwars hackathon',
    title: 'Promptwars Hackathon',
    organization: 'Hack2Skill - Google for developers',
    date: '17th Oct 2026',
    location: 'Chandigarh',
    highlight: '1day sprint: rapid AI prototyping & distributed services',
    photos: [
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.11.20.jpeg'),
        alt: 'Raghav developing AI prototype during hackathon sprint',
      },
    ],
    linkedInUrl: 'https://www.linkedin.com/in/raghavbhatirv/',
  },
];
