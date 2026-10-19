export interface TravelMemoryImage {
  src: string;
  fallbackSrc?: string;
  alt: string;
  caption?: string;
}

export interface TravelMemory {
  id: string;
  title: string;
  label: string;
  category: 'Mountains' | 'Road Trips' | 'Sunsets' | 'Trails' | 'Campfire';
  location: string;
  elevation?: string;
  date: string;
  formattedDate: string;
  tagline: string;
  story: string;
  highlights: string[];
  tags: string[];
  image: TravelMemoryImage;
  accentColor: string;
  // Percentage coordinates on the 1000x640 board canvas
  boardX: number; // 0 - 100%
  boardY: number; // 0 - 100%
  initialRotation: number; // in degrees
  floatClass: string;
  soundType: 'wind' | 'stream' | 'birds' | 'campfire' | 'highway';
  soundTitle: string;
  zigzagIndex: number; // 1 to 10 sequential order along the zigzag string
}

export const travelMemories: TravelMemory[] = [
  {
    id: 'travel-mountains',
    title: 'Rohtang Pass Summit',
    label: 'mountains',
    category: 'Mountains',
    location: 'Rohtang Pass, Himachal Pradesh',
    elevation: '13,058 ft',
    date: 'October 2024',
    formattedDate: 'Oct 2024',
    tagline: 'Standing in freezing winds at the gateway to Lahaul & Spiti',
    story:
      'After navigating through the engineering wonder of Atal Tunnel, we pushed upwards toward the Rohtang Pass crest. At over 13,000 feet, the wind howled with icy bite, and the panoramic vistas of snow-dusted peaks stretched infinitely into the blue horizon. A thumb up for conquering the summit.',
    highlights: [
      'Crossed the 9.02 km Atal Tunnel connecting Kullu to the Lahaul Valley',
      'Endured -2°C gusting mountain winds at 13,058 ft altitude',
      'Panoramic 360-degree views of the Pir Panjal mountain range',
    ],
    tags: ['RohtangPass', 'Himachal', 'Himalayas', 'SnowSummit', 'Altitude'],
    image: {
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/mountains.svg',
      alt: 'Snowy Himalayan peaks at Rohtang Pass',
      caption: 'Freezing altitude, endless peaks, and a summit thumbs up at 13,058 ft',
    },
    accentColor: '#38bdf8',
    boardX: 13,
    boardY: 18,
    initialRotation: -4,
    floatClass: 'travel-float-0',
    soundType: 'wind',
    soundTitle: 'High Altitude Gusts & Prayer Flags',
    zigzagIndex: 1,
  },
  {
    id: 'travel-chai-peaks',
    title: 'Cutting Chai at Old Manali',
    label: 'cutting chai',
    category: 'Mountains',
    location: 'Old Manali Ridge, Himachal Pradesh',
    elevation: '6,725 ft',
    date: 'October 2024',
    formattedDate: 'Oct 2024',
    tagline: 'Hot cardamom tea with friends against snowy horizons',
    story:
      'There is no luxury quite like clutching a piping hot glass of ginger-cardamom chai when morning frost clings to the wooden balcony railing. Four glasses clinked together in celebration of mountain silence and spontaneous getaways.',
    highlights: [
      'Morning chai ritual overlooking the Beas river basin',
      'Wood smoke and pine-scented morning crispness',
      'Deep conversations on life, code, and wanderlust',
    ],
    tags: ['OldManali', 'CuttingChai', 'Friends', 'MorningRitual', 'SlowTravel'],
    image: {
      src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/chai.svg',
      alt: 'Toast of hot cutting chai glasses in the mountains',
      caption: 'Cardamom chai toasts in freezing mountain mornings',
    },
    accentColor: '#fb923c',
    boardX: 32,
    boardY: 28,
    initialRotation: -2,
    floatClass: 'travel-float-1',
    soundType: 'stream',
    soundTitle: 'Morning Stream & Forest Murmur',
    zigzagIndex: 3,
  },
  {
    id: 'travel-alter-ego',
    title: 'The Wandering Lens',
    label: 'alter ego',
    category: 'Trails',
    location: 'McLeodGanj & Dharamkot Trails',
    elevation: '6,830 ft',
    date: 'May 2024',
    formattedDate: 'May 2024',
    tagline: 'When the developer steps away, the photographer takes over',
    story:
      'Roaming through the stone alleys of Dharamkot with a heavy 35mm lens. Between lines of fluttering Tibetan prayer flags and ancient deodar groves, the camera becomes a second pair of eyes that pauses time and captures unscripted human stories.',
    highlights: [
      'Capturing monks spinning prayer wheels in peaceful courtyards',
      'Framing cedar silhouettes against early morning mist',
      'Documenting cobblestone alleyways and Tibetan heritage',
    ],
    tags: ['Photography', 'AlterEgo', 'McLeodGanj', 'VisualStorytelling', 'Monochrome'],
    image: {
      src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/alter-ego.svg',
      alt: 'Photographer holding camera on mountain trail',
      caption: 'The alter ego behind the viewfinder, catching candid moments in mist',
    },
    accentColor: '#e879f9',
    boardX: 68,
    boardY: 26,
    initialRotation: 3,
    floatClass: 'travel-float-2',
    soundType: 'birds',
    soundTitle: 'Himalayan Songbirds & Windchimes',
    zigzagIndex: 4,
  },
  {
    id: 'travel-cloudburst',
    title: 'Triund Ridge Cloudburst',
    label: 'cloudburst',
    category: 'Mountains',
    location: 'Triund Ridge, Dhauladhar Range',
    elevation: '9,350 ft',
    date: 'May 2024',
    formattedDate: 'May 2024',
    tagline: 'Witnessing massive storm clouds engulf the jagged granite cliffs',
    story:
      'We reached the Triund ridge right as an ocean of vapor began rising from the Kangra valley. Within ten minutes, sunny skies turned dramatic and atmospheric as billowing storm clouds collided with the towering Moon Peak. Pure raw nature in motion.',
    highlights: [
      'Trek through rhododendron and oak forests up to 9,350 ft',
      'Front-row seat to dramatic Dhauladhar cloud formations',
      'The electric stillness just before mountain rain begins',
    ],
    tags: ['TriundTrek', 'Dhauladhar', 'StormClouds', 'RidgeWalk', 'HimalayanWeather'],
    image: {
      src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/cloudburst.svg',
      alt: 'Dramatic storm clouds enveloping granite mountain peak',
      caption: 'Towering Dhauladhar peaks engulfed in swirling ocean of clouds',
    },
    accentColor: '#818cf8',
    boardX: 83,
    boardY: 20,
    initialRotation: 3,
    floatClass: 'travel-float-3',
    soundType: 'wind',
    soundTitle: 'Mountain Thunder & Rushing Wind',
    zigzagIndex: 2,
  },
  {
    id: 'travel-sunsets',
    title: 'Violet Dusk Horizon',
    label: 'sunsets',
    category: 'Sunsets',
    location: 'Sunset Point, Kasauli Hills',
    elevation: '5,900 ft',
    date: 'August 2024',
    formattedDate: 'Aug 2024',
    tagline: 'Where the sky turns into a molten canvas of gold, violet, and indigo',
    story:
      'Perched on a quiet pine bluff as the sun dipped behind the Shivalik foothills. The sky morphed from fiery tangerine into deep amethyst and violet clouds. Moments like this remind you to breathe, slow down, and soak in the stillness.',
    highlights: [
      'Golden hour reflection over the plains of northern India',
      'Serene quietude away from city sirens and screen notifications',
      'Watching the evening star emerge in the purple twilight',
    ],
    tags: ['Kasauli', 'GoldenHour', 'MountainSunset', 'Twilight', 'Solitude'],
    image: {
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/sunsets.svg',
      alt: 'Golden and violet sunset clouds over layered hills',
      caption: 'Twilight fading into shades of violet over the Shivalik ridge',
    },
    accentColor: '#f43f5e',
    boardX: 86,
    boardY: 50,
    initialRotation: 2,
    floatClass: 'travel-float-4',
    soundType: 'wind',
    soundTitle: 'Evening Breeze & Distant Crickets',
    zigzagIndex: 6,
  },
  {
    id: 'travel-uno',
    title: 'UNO Under the Stars',
    label: 'UNO',
    category: 'Campfire',
    location: 'Tirthan Valley Riverside Camp',
    elevation: '5,250 ft',
    date: 'November 2024',
    formattedDate: 'Nov 2024',
    tagline: 'Intense card battles on stone tables by the rushing river',
    story:
      'No cell reception, no Slack pings, just a battle-worn deck of UNO cards spread across a mossy stone table. Friendships were tested over repeated +4 wild cards while pine logs crackled in the campfire pit nearby.',
    highlights: [
      'Zero cellular reception and zero distractions for 48 hours',
      'Roasting marshmallows over deodar pine wood embers',
      'Fierce rivalries settled under the glow of kerosene lanterns',
    ],
    tags: ['TirthanValley', 'Campfire', 'BoardGames', 'UNO', 'RiversideCamp'],
    image: {
      src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/uno.svg',
      alt: 'UNO game cards spread on outdoor stone table',
      caption: 'Rivalries and laughter over wild +4s at the riverside campsite',
    },
    accentColor: '#f59e0b',
    boardX: 81,
    boardY: 75,
    initialRotation: 3,
    floatClass: 'travel-float-5',
    soundType: 'campfire',
    soundTitle: 'Crackling Campfire & River Rushing',
    zigzagIndex: 8,
  },
  {
    id: 'travel-yes-sir',
    title: 'Hairpin Mirror Reflection',
    label: 'Yes sir',
    category: 'Road Trips',
    location: 'Solang Valley Hairpin Bend',
    elevation: '8,400 ft',
    date: 'October 2024',
    formattedDate: 'Oct 2024',
    tagline: 'Reflecting through the curves of the mountain pass',
    story:
      'Every hairpin turn on the climb up to Solang brings a safety convex mirror. Paused the motorcycle right at the edge of bend #7 to capture this surreal bubble reflection — road, riders, towering cedar trees, and sheer blue skies.',
    highlights: [
      'Mastering steep 180-degree hairpin switchbacks on two wheels',
      'Curved optical reflection framing the mountain expanse',
      'Crisp mountain air cutting through leather riding gloves',
    ],
    tags: ['SolangValley', 'MotoTouring', 'HairpinBend', 'Reflections', 'RoadTrip'],
    image: {
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/yes-sir.svg',
      alt: 'Convex safety mirror at mountain hairpin bend',
      caption: 'Fish-eye convex mirror reflection high above Solang Valley',
    },
    accentColor: '#10b981',
    boardX: 63,
    boardY: 82,
    initialRotation: 2,
    floatClass: 'travel-float-6',
    soundType: 'highway',
    soundTitle: 'Exhaust Reverberation & Alpine Wind',
    zigzagIndex: 10,
  },
  {
    id: 'travel-forest-trail',
    title: 'The Deodar Canopy Ride',
    label: 'forest trail',
    category: 'Trails',
    location: 'Shimla-Mashobra Pine Sanctuary',
    elevation: '7,040 ft',
    date: 'September 2024',
    formattedDate: 'Sep 2024',
    tagline: 'Arms wide open cycling down the endless deodar tunnel',
    story:
      'Early Sunday morning descent down the old forest road connecting Mashobra to the sanctuary. Sunlight pierced through the century-old pine canopy in divine god-rays. Coasting downhill hands-free with the smell of wet earth and resin.',
    highlights: [
      'Downhill coast through protected Himalayan cedar reserve',
      'God-rays filtering through early morning pine needles',
      'The pure exhilarating feeling of wind against open arms',
    ],
    tags: ['Mashobra', 'PineForest', 'Cycling', 'GodRays', 'WildNature'],
    image: {
      src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/forest-trail.svg',
      alt: 'Cyclist riding down lush green forest road canopy',
      caption: 'Coasting hands-free through emerald deodar tunnels and morning sun',
    },
    accentColor: '#22c55e',
    boardX: 40,
    boardY: 84,
    initialRotation: -3,
    floatClass: 'travel-float-7',
    soundType: 'birds',
    soundTitle: 'Pine Forest Rustle & Morning Birds',
    zigzagIndex: 9,
  },
  {
    id: 'travel-notes-harmony',
    title: 'Parvati Notes & Harmony',
    label: 'notes & harmony',
    category: 'Campfire',
    location: 'Kasol Riverside, Parvati Valley',
    elevation: '5,180 ft',
    date: 'June 2024',
    formattedDate: 'Jun 2024',
    tagline: 'Acoustic melodies, street art, and bohemian riverside vibes',
    story:
      'Walking past vibrant cafe murals and handmade music signs near the river crossing. Travelers from across the world jamming with acoustic guitars, cajóns, and flutes while turquoise glacial water rushed beside us.',
    highlights: [
      'Impromptu acoustic jam session with fellow travelers',
      'Turquoise glacial waters of the roaring Parvati River',
      'Bohemian cafe culture and warm mountain hospitality',
    ],
    tags: ['Kasol', 'ParvatiValley', 'MusicWall', 'AcousticVibes', 'HippieTrail'],
    image: {
      src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/notes-harmony.svg',
      alt: 'Friends in front of colorful music cafe wall',
      caption: 'Acoustic melodies and bohemian colors beside the Parvati river',
    },
    accentColor: '#ec4899',
    boardX: 23,
    boardY: 74,
    initialRotation: -2,
    floatClass: 'travel-float-8',
    soundType: 'stream',
    soundTitle: 'Acoustic Guitar & Rushing River',
    zigzagIndex: 7,
  },
  {
    id: 'travel-spiderman',
    title: 'Expressway Pitstop Selfie',
    label: 'spiderman',
    category: 'Road Trips',
    location: 'Himalayan Expressway Overlook',
    elevation: '4,200 ft',
    date: 'October 2024',
    formattedDate: 'Oct 2024',
    tagline: 'Checking the camera at the mountain expressway rest stop',
    story:
      'A mandatory pitstop along the Himalayan Expressway as the flat plains of Punjab give way to the rising foothills. Taking the mirror selfie with camera held up — ready for 500 kilometers of high-altitude curves and mountain passes ahead.',
    highlights: [
      'Transitioning from highway speed to winding mountain elevation',
      'Checking gear, SD cards, and camera straps before the climb',
      'The electric anticipation that begins every road journey',
    ],
    tags: ['HimalayanExpressway', 'RoadTripStart', 'Selfie', 'Pitstop', 'Adventure'],
    image: {
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
      fallbackSrc: '/travel/spiderman.svg',
      alt: 'Mirror selfie check with camera before mountain climb',
      caption: 'Gear check and selfie before the steep climb into the Himalayas',
    },
    accentColor: '#06b6d4',
    boardX: 14,
    boardY: 52,
    initialRotation: -3,
    floatClass: 'travel-float-9',
    soundType: 'highway',
    soundTitle: 'Expressway Hum & Open Air',
    zigzagIndex: 5,
  },
];
