export interface MemoryPhoto {
  src: string;
  alt: string;
}

export const CLOUDFLARE_R2_BASE_URL = 'https://pub-e8e0176912ee4887a675dc3fc830520f.r2.dev';

export const r2Url = (key: string) => `${CLOUDFLARE_R2_BASE_URL}/${encodeURIComponent(key)}`;

export interface MemoryEvent {
  id: string;
  /** What the event was. */
  title: string;
  /** When it was, e.g. "1st Jul 2025". */
  date: string;
  /** What happened there. */
  description: string;
  /** Every photo from the event; the first one is pinned to the board. */
  photos: MemoryPhoto[];
}

export const memories: MemoryEvent[] = [
  {
    id: 'clickhouse-2025',
    title: 'ClickHouse Event',
    date: '22nd Mar 2025',
    description: 'Modern engineering workflows & team velocity',
    photos: [
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.11.02.jpeg'),
        alt: 'Architecture presentation on distributed log pipeline and ClickHouse',
      },
    ],
  },
  {
    id: 'mongodb-2025',
    title: 'MongoDB.local Delhi',
    date: '1st Jul 2025',
    description: 'Atlas, vector search & generative AI pipelines',
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
  },
  {
    id: 'promptwars',
    title: 'Promptwars Hackathon',
    date: '17th Oct 2026',
    description: '1day sprint: rapid AI prototyping & distributed services',
    photos: [
      {
        src: r2Url('WhatsApp Image 2026-10-21 at 12.11.20.jpeg'),
        alt: 'Raghav developing AI prototype during hackathon sprint',
      },
    ],
  },
];
