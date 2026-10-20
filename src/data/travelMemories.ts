import type { SoundType } from '../utils/travelAudio';

export interface TravelMemory {
  id: string;
  /** Short caption written under the polaroid. */
  label: string;
  title: string;
  location: string;
  date: string;
  note: string;
  /** Two or three photos read best; the first one is pinned to the board. */
  photos: Array<{
    src: string;
    fallbackSrc?: string;
    alt: string;
  }>;
  /** Shows a "Check the post on Instagram" button when set. */
  instagramUrl?: string;
  sound: {
    type: SoundType;
    title: string;
  };
}

// Board order: each memory is strung to the next one around the board.
export const travelMemories: TravelMemory[] = [
  {
    id: 'travel-mountains',
    label: 'mountains',
    title: 'Rohtang Pass Summit',
    location: 'Rohtang Pass, Himachal Pradesh',
    date: 'Oct 2024',
    note: 'Standing in freezing winds at the gateway to Lahaul & Spiti',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/mountains.svg',
        alt: 'Snowy Himalayan peaks at Rohtang Pass',
      },
    ],
    sound: { type: 'wind', title: 'High altitude gusts & prayer flags' },
  },
  {
    id: 'travel-cloudburst',
    label: 'cloudburst',
    title: 'Triund Ridge Cloudburst',
    location: 'Triund Ridge, Dhauladhar Range',
    date: 'May 2024',
    note: 'Witnessing massive storm clouds engulf the jagged granite cliffs',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/cloudburst.svg',
        alt: 'Dramatic storm clouds enveloping granite mountain peak',
      },
    ],
    sound: { type: 'wind', title: 'Mountain thunder & rushing wind' },
  },
  {
    id: 'travel-chai-peaks',
    label: 'cutting chai',
    title: 'Cutting Chai at Old Manali',
    location: 'Old Manali Ridge, Himachal Pradesh',
    date: 'Oct 2024',
    note: 'Hot cardamom tea with friends against snowy horizons',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/chai.svg',
        alt: 'Toast of hot cutting chai glasses in the mountains',
      },
    ],
    sound: { type: 'stream', title: 'Morning stream & forest murmur' },
  },
  {
    id: 'travel-alter-ego',
    label: 'alter ego',
    title: 'The Wandering Lens',
    location: 'McLeodGanj & Dharamkot Trails',
    date: 'May 2024',
    note: 'When the developer steps away, the photographer takes over',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/alter-ego.svg',
        alt: 'Photographer holding camera on mountain trail',
      },
    ],
    sound: { type: 'birds', title: 'Himalayan songbirds & windchimes' },
  },
  {
    id: 'travel-spiderman',
    label: 'spiderman',
    title: 'Expressway Pitstop Selfie',
    location: 'Himalayan Expressway Overlook',
    date: 'Oct 2024',
    note: 'Checking the camera at the mountain expressway rest stop',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/spiderman.svg',
        alt: 'Mirror selfie check with camera before mountain climb',
      },
    ],
    sound: { type: 'highway', title: 'Expressway hum & open air' },
  },
  {
    id: 'travel-sunsets',
    label: 'sunsets',
    title: 'Violet Dusk Horizon',
    location: 'Sunset Point, Kasauli Hills',
    date: 'Aug 2024',
    note: 'Where the sky turns into a molten canvas of gold, violet, and indigo',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/sunsets.svg',
        alt: 'Golden and violet sunset clouds over layered hills',
      },
    ],
    sound: { type: 'wind', title: 'Evening breeze & distant crickets' },
  },
  {
    id: 'travel-notes-harmony',
    label: 'notes & harmony',
    title: 'Parvati Notes & Harmony',
    location: 'Kasol Riverside, Parvati Valley',
    date: 'Jun 2024',
    note: 'Acoustic melodies, street art, and bohemian riverside vibes',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/notes-harmony.svg',
        alt: 'Friends in front of colorful music cafe wall',
      },
    ],
    sound: { type: 'stream', title: 'Acoustic guitar & rushing river' },
  },
  {
    id: 'travel-uno',
    label: 'UNO',
    title: 'UNO Under the Stars',
    location: 'Tirthan Valley Riverside Camp',
    date: 'Nov 2024',
    note: 'Intense card battles on stone tables by the rushing river',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/uno.svg',
        alt: 'UNO game cards spread on outdoor stone table',
      },
    ],
    sound: { type: 'campfire', title: 'Crackling campfire & river' },
  },
  {
    id: 'travel-forest-trail',
    label: 'forest trail',
    title: 'The Deodar Canopy Ride',
    location: 'Shimla-Mashobra Pine Sanctuary',
    date: 'Sep 2024',
    note: 'Arms wide open cycling down the endless deodar tunnel',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/forest-trail.svg',
        alt: 'Cyclist riding down lush green forest road canopy',
      },
    ],
    sound: { type: 'birds', title: 'Pine forest rustle & morning birds' },
  },
  {
    id: 'travel-yes-sir',
    label: 'Yes sir',
    title: 'Hairpin Mirror Reflection',
    location: 'Solang Valley Hairpin Bend',
    date: 'Oct 2024',
    note: 'Reflecting through the curves of the mountain pass',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        fallbackSrc: '/travel/yes-sir.svg',
        alt: 'Convex safety mirror at mountain hairpin bend',
      },
    ],
    sound: { type: 'highway', title: 'Exhaust echo & alpine wind' },
  },
];
