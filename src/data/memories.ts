export interface MemoryPhoto {
  /** The screen-sized copy, for the centre card. */
  src: string;
  /** A small copy, for the polaroids on the board and the folder. */
  thumb?: string;
  alt: string;
}

export const CLOUDFLARE_R2_BASE_URL = 'https://pub-e8e0176912ee4887a675dc3fc830520f.r2.dev';

export const r2Url = (key: string) => `${CLOUDFLARE_R2_BASE_URL}/${encodeURIComponent(key)}`;

/**
 * A photo in the bucket by its original file name, in the two sizes made for the site from
 * it: `<name>-w1600.jpg` (`sips -Z 1600`) for the centre card and `<name>-w480.jpg`
 * (`sips -Z 480`) for thumbnails. The originals are 3–7 MB each; these are about a tenth.
 */
export const r2Photo = (file: string, alt: string): MemoryPhoto => {
  const name = file.replace(/\.[^.]+$/, '');
  return { src: r2Url(`${name}-w1600.jpg`), thumb: r2Url(`${name}-w480.jpg`), alt };
};

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
      r2Photo(
        'WhatsApp Image 2026-10-21 at 12.11.02.jpeg',
        'Architecture presentation on distributed log pipeline and ClickHouse'
      ),
    ],
  },
  {
    id: 'mongodb-2025',
    title: 'MongoDB.local Delhi',
    date: '1st Jul 2025',
    description: 'Atlas, vector search & generative AI pipelines',
    photos: [
      r2Photo(
        'WhatsApp Image 2026-10-21 at 12.10.36 (1).jpeg',
        'Raghav Bhati at MongoDB.local Delhi'
      ),
      r2Photo(
        'WhatsApp Image 2026-10-21 at 12.10.37.jpeg',
        'MongoDB.local Delhi delegate badge for Raghav Bhati'
      ),
      r2Photo(
        'WhatsApp Image 2026-10-21 at 12.10.36.jpeg',
        'Keynote presentation on AI architecture and functional test generation at MongoDB.local'
      ),
    ],
  },
  {
    id: 'promptwars',
    title: 'Promptwars Hackathon',
    date: '17th Oct 2026',
    description: '1day sprint: rapid AI prototyping & distributed services',
    photos: [
      r2Photo(
        'WhatsApp Image 2026-10-21 at 12.11.20.jpeg',
        'Raghav developing AI prototype during hackathon sprint'
      ),
    ],
  },
];
