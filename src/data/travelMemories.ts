import { r2Photo } from './memories';
import type { MemoryPhoto } from './memories';

export interface TravelMemory {
  id: string;
  /** Where the trip went. */
  location: string;
  /** When: a month or a range, e.g. "Oct 2024", "12–16 Oct 2024", "28 Sep – 2 Oct 2024". */
  dates: string;
  /** What the trip was like. */
  experience: string;
  /** An Instagram post with more photos; adds a "See dump on Instagram" button. */
  instagramUrl?: string;
  /** Every photo from the trip; the first one is pinned to the board. */
  photos: MemoryPhoto[];
}

/**
 * The photos of a trip, from the portfolio-image R2 bucket, in the order given. Use JPEG,
 * PNG or WebP: Chrome and Firefox can't show HEIC/HEIF.
 */
const photosOf = (trip: string, files: string[]) =>
  files.map((file, index) => r2Photo(file, `${trip}, photo ${index + 1} of ${files.length}`));

// Board order: each memory is strung to the next one around the board.
export const travelMemories: TravelMemory[] = [
  {
    id: 'travel-shimla',
    location: 'Shimla, Himachal Pradesh',
    dates: '21–23 Feb 2025',
    experience: 'Three days in the hills of Shimla.',
    photos: photosOf('Shimla', ['shimla1.jpg', 'shimla2.jpg', 'shimla3.jpg', 'shimla4.jpg']),
  },
  {
    id: 'travel-palampur',
    location: 'Aadi Himani Chamunda Trek, Palampur',
    dates: '9–10 Nov 2025',
    experience: 'A two-day trek from Palampur up to the Aadi Himani Chamunda temple.',
    photos: photosOf('Aadi Himani Chamunda trek', [
      'palampur1.jpeg',
      'palampur2.jpg',
      'palampur3.jpg',
      'palampur4.jpg',
      'palampur5.jpg',
    ]),
  },
  {
    id: 'travel-yulla-kanda',
    location: 'Yulla Kanda Trek, Kinnaur',
    dates: '9–10 May 2026',
    experience: 'A two-day trek up to the lake at Yulla Kanda.',
    instagramUrl: 'https://www.instagram.com/p/DYsTnAVk74n/',
    photos: photosOf('Yulla Kanda trek', [
      'yullakanda1.jpg',
      'yullakanda2.jpg',
      'yullakanda3.jpg',
      'yullakanda4.jpg',
    ]),
  },
];
