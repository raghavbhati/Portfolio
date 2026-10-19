import { useState, useRef, useEffect, useCallback } from 'react';
import { travelMemories, TravelMemory as TravelMemoryItem } from '../data/travelMemories';
import { travelAudio, SoundType } from '../utils/travelAudio';

interface TravelMemoryProps {
  defaultOpen?: boolean;
}

// Physics oscillation parameters for organic floating & swaying physics
interface NodePhysics {
  ampX: number;
  ampY: number;
  ampRot: number;
  freqX: number;
  freqY: number;
  freqRot: number;
  phaseX: number;
  phaseY: number;
  phaseRot: number;
}

const nodePhysicsParams: NodePhysics[] = [
  {
    ampX: 4.0,
    ampY: 7.5,
    ampRot: 2.2,
    freqX: 0.19,
    freqY: 0.24,
    freqRot: 0.21,
    phaseX: 0.4,
    phaseY: 1.1,
    phaseRot: 0.8,
  },
  {
    ampX: 4.5,
    ampY: 8.5,
    ampRot: 2.8,
    freqX: 0.17,
    freqY: 0.22,
    freqRot: 0.18,
    phaseX: 2.1,
    phaseY: 3.2,
    phaseRot: 1.5,
  },
  {
    ampX: 3.5,
    ampY: 7.0,
    ampRot: 2.0,
    freqX: 0.22,
    freqY: 0.25,
    freqRot: 0.23,
    phaseX: 4.3,
    phaseY: 0.9,
    phaseRot: 2.9,
  },
  {
    ampX: 4.2,
    ampY: 9.0,
    ampRot: 3.0,
    freqX: 0.18,
    freqY: 0.21,
    freqRot: 0.19,
    phaseX: 1.2,
    phaseY: 4.5,
    phaseRot: 0.3,
  },
  {
    ampX: 3.8,
    ampY: 8.0,
    ampRot: 2.4,
    freqX: 0.2,
    freqY: 0.23,
    freqRot: 0.2,
    phaseX: 3.5,
    phaseY: 2.2,
    phaseRot: 4.1,
  },
  {
    ampX: 4.6,
    ampY: 7.8,
    ampRot: 2.6,
    freqX: 0.16,
    freqY: 0.26,
    freqRot: 0.22,
    phaseX: 5.1,
    phaseY: 1.7,
    phaseRot: 3.3,
  },
  {
    ampX: 3.4,
    ampY: 8.2,
    ampRot: 2.1,
    freqX: 0.21,
    freqY: 0.22,
    freqRot: 0.24,
    phaseX: 0.9,
    phaseY: 5.0,
    phaseRot: 1.9,
  },
  {
    ampX: 4.4,
    ampY: 9.2,
    ampRot: 3.2,
    freqX: 0.18,
    freqY: 0.25,
    freqRot: 0.17,
    phaseX: 2.8,
    phaseY: 3.8,
    phaseRot: 5.2,
  },
  {
    ampX: 3.6,
    ampY: 7.2,
    ampRot: 2.3,
    freqX: 0.23,
    freqY: 0.2,
    freqRot: 0.25,
    phaseX: 4.7,
    phaseY: 2.9,
    phaseRot: 2.4,
  },
  {
    ampX: 4.1,
    ampY: 8.8,
    ampRot: 2.7,
    freqX: 0.19,
    freqY: 0.23,
    freqRot: 0.19,
    phaseX: 1.8,
    phaseY: 0.5,
    phaseRot: 4.6,
  },
];

function generateCatenaryPath(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  sag: number
): string {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const cx1 = p1.x + dx * 0.35;
  const cy1 = p1.y + dy * 0.35 + sag;
  const cx2 = p1.x + dx * 0.65;
  const cy2 = p1.y + dy * 0.65 + sag;
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(
    1
  )}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

export default function TravelMemory({ defaultOpen = false }: TravelMemoryProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(defaultOpen);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>(travelMemories[0].id);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'board' | 'journal'>('board');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);
  const [lightboxMemory, setLightboxMemory] = useState<TravelMemoryItem | null>(null);

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const glowPathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Sequential order along the zigzag string path
  const zigzagMemories = [...travelMemories].sort((a, b) => a.zigzagIndex - b.zigzagIndex);

  const activeMemory = travelMemories.find((m) => m.id === selectedMemoryId) || travelMemories[0];

  const filteredMemories =
    filterType === 'all' ? travelMemories : travelMemories.filter((m) => m.category === filterType);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setLightboxMemory(null);
    travelAudio.stop();
    setIsSoundEnabled(false);
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'travel-memory' || travelMemories.some((m) => m.id === hash)) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    triggerButtonRef.current?.focus();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Sync hash on mount and hashchange to open modal if #travel-memory or memory id is targeted
  useEffect(() => {
    const checkHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '');
      if (hash === 'travel-memory') {
        setIsModalOpen(true);
      } else {
        const match = travelMemories.find((m) => m.id === hash);
        if (match) {
          setSelectedMemoryId(match.id);
          setIsModalOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isModalOpen]);

  // Handle Escape key to close modal or lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxMemory) {
          setLightboxMemory(null);
        } else if (isModalOpen) {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, lightboxMemory, closeModal]);

  // Handle ambient sound playback when active memory changes and sound is enabled
  useEffect(() => {
    if (isModalOpen && isSoundEnabled && activeMemory) {
      travelAudio.play(activeMemory.soundType);
    } else if (!isSoundEnabled || !isModalOpen) {
      travelAudio.stop();
    }
  }, [isModalOpen, isSoundEnabled, activeMemory]);

  // Pause ambient audio when browser tab is inactive / hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        travelAudio.stop();
      } else if (isModalOpen && isSoundEnabled && activeMemory) {
        travelAudio.play(activeMemory.soundType);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isModalOpen, isSoundEnabled, activeMemory]);

  // Real-time gentle organic floating & swaying physics animation loop
  // Keeps polaroid items, pinned nodes, and zigzag SVG string paths organically moving in sync
  useEffect(() => {
    if (!isModalOpen || viewMode !== 'board') return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let animationFrameId: number;
    const width = 1000;
    const height = 640;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const currentPoints: { x: number; y: number }[] = [];

      zigzagMemories.forEach((memory, idx) => {
        const phys = nodePhysicsParams[idx % nodePhysicsParams.length];
        const dx = phys.ampX * Math.sin(2 * Math.PI * phys.freqX * elapsed + phys.phaseX);
        const dy = phys.ampY * Math.cos(2 * Math.PI * phys.freqY * elapsed + phys.phaseY);
        const dRot = phys.ampRot * Math.sin(2 * Math.PI * phys.freqRot * elapsed + phys.phaseRot);

        const baseX = (memory.boardX / 100) * width;
        const baseY = (memory.boardY / 100) * height;
        currentPoints.push({ x: baseX + dx, y: baseY + dy });

        const nodeEl = nodeRefs.current[memory.id];
        if (nodeEl) {
          nodeEl.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), ${dy.toFixed(
            1
          )}px) rotate(${(memory.initialRotation + dRot).toFixed(1)}deg)`;
        }
      });

      pathRefs.current.forEach((pathEl, segIdx) => {
        if (!pathEl) return;
        if (segIdx < currentPoints.length - 1) {
          const p1 = currentPoints[segIdx];
          const p2 = currentPoints[segIdx + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const sag =
            Math.max(16, Math.min(50, dist * 0.08)) + 3 * Math.sin(elapsed * 1.8 + segIdx * 0.7);
          const newD = generateCatenaryPath(p1, p2, sag);
          pathEl.setAttribute('d', newD);
          const glowEl = glowPathRefs.current[segIdx];
          if (glowEl) {
            glowEl.setAttribute('d', newD);
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isModalOpen, viewMode, zigzagMemories]);

  const toggleSound = () => {
    if (isSoundEnabled) {
      travelAudio.stop();
      setIsSoundEnabled(false);
    } else {
      setIsSoundEnabled(true);
      travelAudio.play(activeMemory.soundType);
    }
  };

  const selectMemory = (memory: TravelMemoryItem) => {
    setSelectedMemoryId(memory.id);
    if (isSoundEnabled) {
      travelAudio.play(memory.soundType);
    }
  };

  const nextLightboxItem = () => {
    if (!lightboxMemory) return;
    const currentIndex = travelMemories.findIndex((m) => m.id === lightboxMemory.id);
    if (currentIndex < travelMemories.length - 1) {
      setLightboxMemory(travelMemories[currentIndex + 1]);
    } else {
      setLightboxMemory(travelMemories[0]); // wrap around
    }
  };

  const prevLightboxItem = () => {
    if (!lightboxMemory) return;
    const currentIndex = travelMemories.findIndex((m) => m.id === lightboxMemory.id);
    if (currentIndex > 0) {
      setLightboxMemory(travelMemories[currentIndex - 1]);
    } else {
      setLightboxMemory(travelMemories[travelMemories.length - 1]); // wrap around
    }
  };

  // Generate SVG zigzag catenary curves connecting items one by one across the board
  const getInitialZigzagPaths = () => {
    const width = 1000;
    const height = 640;

    const points = zigzagMemories.map((m) => ({
      x: (m.boardX / 100) * width,
      y: (m.boardY / 100) * height,
    }));

    const pathSegments: string[] = [];

    // Connect sequentially: 0->1, 1->2, ..., 8->9 across the canvas
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const sag = Math.max(16, Math.min(50, dist * 0.08));

      pathSegments.push(generateCatenaryPath(p1, p2, sag));
    }

    return pathSegments;
  };

  return (
    <>
      {/* FLOATING FIXED TRAVEL MEMORY FOLDER WIDGET AT BOTTOM-LEFT CORNER */}
      <aside
        id="travel-memory"
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 select-none"
        aria-label="Travel Memory trigger"
      >
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={openModal}
          className="group relative flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Click to view travel memories"
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
        >
          {/* Folder Back Tab */}
          <div className="w-12 h-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-t-[7px] self-start ml-2 -mb-[1px] shadow-sm pointer-events-none" />

          {/* Folder Body Base */}
          <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-2xl rounded-tl-[4px] bg-gradient-to-br from-[#1c1c22] via-[#141419] to-[#0a0a0d] p-1.5 shadow-[0_14px_35px_rgba(0,0,0,0.7)] border border-pink-500/30 flex flex-col justify-end overflow-visible">
            {/* Peeking Polaroid Photo 1 (Left - Mountains) */}
            <div
              className="absolute left-2.5 -top-4 sm:-top-6 w-11 sm:w-13 aspect-[4/5] bg-white p-[3px] pb-[6px] rounded-[3px] shadow-md -rotate-12 group-hover:-rotate-[16deg] group-hover:-translate-y-2.5 transition-all duration-300 ease-out overflow-hidden z-10"
              aria-hidden="true"
            >
              <img
                src="/travel/mountains.svg"
                alt=""
                className="w-full h-full object-cover rounded-[1px]"
              />
            </div>

            {/* Peeking Polaroid Photo 2 (Center - Sunsets) */}
            <div
              className="absolute left-8 sm:left-9 -top-6 sm:-top-8 w-11 sm:w-13 aspect-[4/5] bg-white p-[3px] pb-[6px] rounded-[3px] shadow-lg rotate-2 group-hover:-translate-y-3.5 group-hover:scale-105 transition-all duration-300 ease-out overflow-hidden z-20"
              aria-hidden="true"
            >
              <img
                src="/travel/sunsets.svg"
                alt=""
                className="w-full h-full object-cover rounded-[1px]"
              />
            </div>

            {/* Peeking Polaroid Photo 3 (Right - Forest Trail) */}
            <div
              className="absolute right-2.5 -top-4 sm:-top-6 w-11 sm:w-13 aspect-[4/5] bg-white p-[3px] pb-[6px] rounded-[3px] shadow-md rotate-12 group-hover:rotate-[16deg] group-hover:-translate-y-2.5 transition-all duration-300 ease-out overflow-hidden z-10"
              aria-hidden="true"
            >
              <img
                src="/travel/forest-trail.svg"
                alt=""
                className="w-full h-full object-cover rounded-[1px]"
              />
            </div>

            {/* Front Frosted Pocket Flap */}
            <div className="relative z-30 w-full h-11 sm:h-13 rounded-b-[12px] rounded-t-[3px] bg-pink-950/40 backdrop-blur-md border-t border-pink-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-between px-2.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-pink-200 font-semibold drop-shadow-sm">
                Travel Memory
              </span>
              <span className="text-[10px] text-pink-300/90 font-mono drop-shadow-sm">
                {travelMemories.length} places
              </span>
            </div>
          </div>

          {/* Badge Pill: "click to view travel memory" (responsive width guard for mobile) */}
          <div className="absolute -bottom-2 left-0 sm:left-1 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121216] text-white border border-[#2d2d38] shadow-[0_6px_20px_rgba(0,0,0,0.45)] text-[11px] sm:text-xs font-mono font-medium whitespace-nowrap group-hover:shadow-[0_8px_25px_rgba(244,63,94,0.3)] group-hover:scale-105 transition-all duration-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="hidden sm:inline">click to view travel memory</span>
            <span className="sm:hidden">travel memory</span>
          </div>
        </button>
      </aside>

      {/* POPUP MODAL DIALOG - THE BOARD ON A STRING (DEEP BLACK AESTHETIC #0b0b0e) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-travel-memory-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-[#0b0b0e] text-[#e5e5e7] rounded-[24px] border border-[#22222a] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden focus:outline-none"
          >
            {/* Modal Top Header (Board Title, Filter Pills, Sound Toggle, View Toggles, Close Button) */}
            <div className="p-4 sm:p-5 pb-3 border-b border-[#1c1c24] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-[#0d0d12]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-xs text-pink-400">the board</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-muted">memories, on a string</span>
                </div>
                <h2
                  id="modal-travel-memory-title"
                  className="m-0 font-serif text-2xl sm:text-3xl text-white font-normal mt-0.5 tracking-tight flex items-baseline gap-2 flex-wrap"
                >
                  <span>Travel Memory</span>
                  <span className="font-serif italic text-base sm:text-lg text-neutral-400 font-normal">
                    — the wanderlust board
                  </span>
                </h2>
              </div>

              {/* Controls: View Mode, Filter Pills, Sound Toggle & Close Button */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* View Mode Toggle */}
                <div className="flex items-center rounded-[6px] border border-[#282834] bg-[#14141c] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('board')}
                    className={`px-2.5 py-[3px] rounded-[4px] transition-colors cursor-pointer text-xs font-mono ${
                      viewMode === 'board'
                        ? 'bg-pink-600 text-white font-medium shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    The Board
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('journal')}
                    className={`px-2.5 py-[3px] rounded-[4px] transition-colors cursor-pointer text-xs font-mono ${
                      viewMode === 'journal'
                        ? 'bg-pink-600 text-white font-medium shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Travel Journal
                  </button>
                </div>

                {/* Ambient Sound Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono transition-all cursor-pointer ${
                    isSoundEnabled
                      ? 'bg-pink-950/60 border-pink-500/80 text-pink-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-[#14141c] border-[#282834] text-neutral-400 hover:text-white'
                  }`}
                  aria-label={
                    isSoundEnabled ? 'Mute ambient soundscape' : 'Play ambient soundscape'
                  }
                >
                  <span className="text-xs">{isSoundEnabled ? '🔊' : '🔇'}</span>
                  <span>{isSoundEnabled ? 'Sound ON' : 'Ambient'}</span>
                  {isSoundEnabled && (
                    <span className="flex items-center gap-[2px] h-3 ml-0.5">
                      <span className="w-0.5 h-2 bg-pink-400 animate-pulse" />
                      <span className="w-0.5 h-3 bg-pink-400 animate-pulse [animation-delay:150ms]" />
                      <span className="w-0.5 h-1.5 bg-pink-400 animate-pulse [animation-delay:300ms]" />
                    </span>
                  )}
                </button>

                {/* Category Filters */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'all'
                        ? 'bg-white/10 border-pink-400/80 text-white font-medium'
                        : 'bg-transparent border-[#242430] text-neutral-400 hover:text-white'
                    }`}
                  >
                    All ({travelMemories.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('Mountains')}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'Mountains'
                        ? 'bg-white/10 border-pink-400/80 text-white font-medium'
                        : 'bg-transparent border-[#242430] text-neutral-400 hover:text-white'
                    }`}
                  >
                    Mountains
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('Trails')}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'Trails'
                        ? 'bg-white/10 border-pink-400/80 text-white font-medium'
                        : 'bg-transparent border-[#242430] text-neutral-400 hover:text-white'
                    }`}
                  >
                    Trails
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('Road Trips')}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'Road Trips'
                        ? 'bg-white/10 border-pink-400/80 text-white font-medium'
                        : 'bg-transparent border-[#242430] text-neutral-400 hover:text-white'
                    }`}
                  >
                    Road Trips
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 sm:w-9 sm:h-9 ml-1 rounded-full border border-[#2b2b38] bg-[#161620] hover:bg-pink-600 hover:border-pink-500 text-white text-base flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close travel memory modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* MODAL MAIN CONTENT */}
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-5">
              {/* VIEW 1: THE BOARD - ZIGZAG CONNECTED STRING WITH FLOATING POLAROIDS */}
              {viewMode === 'board' && (
                <div className="space-y-4">
                  {/* Canvas Container */}
                  <div
                    ref={boardContainerRef}
                    className="relative rounded-[20px] bg-gradient-to-b from-[#0e0e13] via-[#09090c] to-[#07070a] border border-[#1f1f28] p-3 sm:p-5 overflow-x-auto overflow-y-hidden min-h-[580px] sm:min-h-[640px] select-none shadow-inner"
                  >
                    {/* Inner board layout: min-w-[840px] on small screens ensures polaroids and string don't squash */}
                    <div className="relative w-full min-w-[800px] h-[580px] sm:h-[620px]">
                      {/* Canvas Header Subtitle */}
                      <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 pointer-events-none z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ec4899]" />
                          <span className="tracking-wider uppercase text-neutral-300 font-medium">
                            THE TRAVEL BOARD · MEMORIES ON A ZIGZAG STRING
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400/80">
                          Click any polaroid to explore details &amp; soundscapes
                        </span>
                      </div>

                      {/* SVG ZIGZAG STRING WEB CONNECTING POLAROIDS ONE BY ONE ACROSS THE CANVAS */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-0 travel-string-glow"
                        viewBox="0 0 1000 640"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="travelPinkString" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.85" />
                          </linearGradient>
                          <filter id="stringGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Render Zigzag Segments connecting photo 1 to 2 to 3 to 4... across the canvas */}
                        {getInitialZigzagPaths().map((pathD, idx) => (
                          <g key={`zigzag-segment-${idx}`}>
                            {/* Outer soft glow strand */}
                            <path
                              ref={(el) => {
                                glowPathRefs.current[idx] = el;
                              }}
                              d={pathD}
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="4.5"
                              strokeOpacity="0.3"
                              filter="url(#stringGlow)"
                            />
                            {/* Main vibrant pink string that connects pins dynamically */}
                            <path
                              ref={(el) => {
                                pathRefs.current[idx] = el;
                              }}
                              d={pathD}
                              fill="none"
                              stroke="url(#travelPinkString)"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                            />
                            {/* Secondary delicate dashed weave */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#ffe4e6"
                              strokeWidth="0.8"
                              strokeDasharray="5 3"
                              strokeOpacity="0.75"
                            />
                          </g>
                        ))}
                      </svg>

                      {/* CENTER INTERACTIVE CARD ("drop a memory here / see what it sounds like") */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-72 p-4 sm:p-5 rounded-[22px] bg-[#14141c]/95 border border-[#2b2b38] shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md z-20 flex flex-col items-center text-center transition-all duration-300"
                        aria-label="Active memory sound & story hub"
                      >
                        {/* Audio Wave / Pulse Disc */}
                        <div
                          className="w-12 h-12 rounded-full mb-3 flex items-center justify-center border border-pink-500/40 bg-pink-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-transform duration-300 hover:scale-110 cursor-pointer"
                          onClick={toggleSound}
                          role="button"
                          tabIndex={0}
                          aria-label={isSoundEnabled ? 'Mute audio' : 'Play ambient sound'}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleSound();
                            }
                          }}
                        >
                          <span className="text-xl">{isSoundEnabled ? '🔊' : '🎵'}</span>
                        </div>

                        {/* Title & Prompt */}
                        <div className="space-y-1">
                          <p className="font-serif italic text-base sm:text-lg text-white m-0">
                            {activeMemory.label}
                          </p>
                          <p className="font-sans text-xs text-neutral-300 m-0">
                            {activeMemory.location}
                          </p>
                          <p className="font-mono text-[10px] text-pink-400 mt-1">
                            {isSoundEnabled
                              ? `Playing: ${activeMemory.soundTitle}`
                              : 'drop a memory here · see what it sounds like'}
                          </p>
                        </div>

                        {/* Button: View Full Story & Photo in Lightbox */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setLightboxMemory(activeMemory)}
                            className="px-3 py-1.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                            aria-label={`View full story for ${activeMemory.label}`}
                          >
                            <span>Explore Story</span>
                            <span>↗</span>
                          </button>
                          <button
                            type="button"
                            onClick={toggleSound}
                            className="px-2.5 py-1.5 rounded-full border border-[#333342] bg-[#1a1a24] hover:bg-[#252532] text-xs font-mono text-neutral-300 transition-colors cursor-pointer"
                            aria-label={isSoundEnabled ? 'Turn off sound' : 'Turn on sound'}
                          >
                            {isSoundEnabled ? 'Mute' : 'Play'}
                          </button>
                        </div>
                      </div>

                      {/* 10 FLOATING POLAROID CARDS RUNNING & MAKING MOVES */}
                      {travelMemories.map((memory) => {
                        const isSelected = memory.id === activeMemory.id;
                        const isVisible = filterType === 'all' || memory.category === filterType;

                        return (
                          <div
                            key={memory.id}
                            ref={(el) => {
                              nodeRefs.current[memory.id] = el;
                            }}
                            style={{
                              left: `${memory.boardX}%`,
                              top: `${memory.boardY}%`,
                              transform: `translate(-50%, 0) rotate(${memory.initialRotation}deg)`,
                              transformOrigin: 'top center',
                            }}
                            className={`absolute z-10 transition-opacity duration-300 ${
                              isVisible ? 'opacity-100' : 'opacity-25 pointer-events-none'
                            }`}
                          >
                            {/* Pinned Tack connecting to String Node */}
                            <div
                              className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center justify-center z-30 pointer-events-none"
                              style={{
                                backgroundColor: isSelected ? '#ec4899' : '#e2e8f0',
                                boxShadow: isSelected
                                  ? '0 0 14px #ec4899'
                                  : '0 2px 6px rgba(0,0,0,0.5)',
                              }}
                              aria-hidden="true"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? 'bg-white animate-ping' : 'bg-[#475569]'
                                }`}
                              />
                            </div>

                            {/* Sequential Zigzag Badge (#01, #02, etc.) */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded-full bg-[#0d0d12]/95 border border-pink-500/40 text-[9px] font-mono font-bold text-pink-300 shadow-sm pointer-events-none z-30 whitespace-nowrap">
                              #{String(memory.zigzagIndex).padStart(2, '0')}
                            </div>

                            {/* Polaroid Card with Organic Floating Sway Physics */}
                            <div
                              onClick={() => selectMemory(memory)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  selectMemory(memory);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              aria-pressed={isSelected}
                              aria-label={`View ${memory.label} - ${memory.location} on board`}
                              className={`group/polaroid relative w-24 sm:w-28 md:w-32 bg-[#f8f8fa] text-[#111] p-1.5 sm:p-2 pb-2.5 sm:pb-3 rounded-[6px] shadow-[0_12px_28px_rgba(0,0,0,0.65)] border border-white/40 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-40 ${
                                memory.floatClass
                              } ${
                                isSelected
                                  ? 'ring-2 ring-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.65)] scale-105 z-30'
                                  : 'hover:border-pink-300'
                              }`}
                            >
                              {/* Polaroid Image Container */}
                              <div className="aspect-[4/3] w-full rounded-[3px] overflow-hidden bg-black/60 relative mb-1.5">
                                <img
                                  src={memory.image.src}
                                  alt={memory.image.alt}
                                  loading="lazy"
                                  onError={(e) => {
                                    if (memory.image.fallbackSrc) {
                                      e.currentTarget.src = memory.image.fallbackSrc;
                                    }
                                  }}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/polaroid:scale-105"
                                />
                                {memory.elevation && (
                                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[8px] font-mono bg-black/75 text-white backdrop-blur-sm">
                                    {memory.elevation}
                                  </span>
                                )}
                              </div>

                              {/* Polaroid Label below Photo */}
                              <div className="text-center">
                                <span className="font-sans text-[11px] sm:text-xs text-[#222] font-medium tracking-tight block truncate">
                                  {memory.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE MEMORY QUICK DETAILS BAR */}
                  <div className="p-4 sm:p-5 rounded-[16px] bg-[#111116] border border-[#22222a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="m-0 font-serif text-xl sm:text-2xl text-white">
                          {activeMemory.title}
                        </h3>
                        <span
                          className="rounded-[4px] text-[10px] uppercase font-mono px-2 py-0.5 border"
                          style={{
                            borderColor: `${activeMemory.accentColor}60`,
                            color: activeMemory.accentColor,
                            backgroundColor: `${activeMemory.accentColor}15`,
                          }}
                        >
                          {activeMemory.category}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          {activeMemory.formattedDate}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 m-0 leading-relaxed max-w-2xl">
                        {activeMemory.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setLightboxMemory(activeMemory)}
                        className="px-3.5 py-1.5 rounded-[6px] bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono transition-colors shadow cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Full Photo &amp; Story</span>
                        <span>↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: TRAVEL JOURNAL FEED (VERTICAL CONNECTED TIMELINE) */}
              {viewMode === 'journal' && (
                <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#f43f5e] via-[#ec4899] to-[#fb7185] before:opacity-60">
                  {filteredMemories.map((memory) => {
                    return (
                      <article
                        key={memory.id}
                        id={`journal-${memory.id}`}
                        className="relative p-5 sm:p-6 border border-[#252530] bg-[#121217] rounded-[16px] transition-all duration-200 hover:border-pink-500/50"
                      >
                        {/* Connected Dot Node */}
                        <div
                          className="absolute -left-[30px] sm:-left-[39px] top-6 w-6 h-6 rounded-full border-2 bg-[#0b0b0e] flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.5)] z-10"
                          style={{ borderColor: memory.accentColor }}
                          aria-hidden="true"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full animate-pulse"
                            style={{ backgroundColor: memory.accentColor }}
                          />
                        </div>

                        {/* Memory Journal Header */}
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="m-0 font-serif text-[24px] sm:text-[26px] leading-tight text-white">
                              {memory.title}
                            </h3>
                            <span
                              className="rounded-[3px] text-[10px] uppercase font-mono px-1.5 py-[2px] border"
                              style={{
                                borderColor: `${memory.accentColor}55`,
                                backgroundColor: `${memory.accentColor}15`,
                                color: memory.accentColor,
                              }}
                            >
                              {memory.category}
                            </span>
                            {memory.elevation && (
                              <span className="rounded-[3px] text-[10px] font-mono px-1.5 py-[2px] border border-neutral-700 bg-neutral-800 text-neutral-300">
                                ⛰️ {memory.elevation}
                              </span>
                            )}
                          </div>
                          <span className="rounded-[3px] bg-[#1a1a24] border border-[#2c2c3a] px-2 py-0.5 text-xs font-mono text-neutral-400">
                            {memory.date}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-pink-300 mb-2 font-mono">
                          📍 {memory.location} — {memory.tagline}
                        </p>

                        {/* Photo Preview */}
                        <div
                          className="relative aspect-[16/9] w-full rounded-[10px] overflow-hidden bg-black/60 my-3 cursor-pointer group border border-[#292936]"
                          onClick={() => setLightboxMemory(memory)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Enlarge photo for ${memory.title}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setLightboxMemory(memory);
                            }
                          }}
                        >
                          <img
                            src={memory.image.src}
                            alt={memory.image.alt}
                            onError={(e) => {
                              if (memory.image.fallbackSrc) {
                                e.currentTarget.src = memory.image.fallbackSrc;
                              }
                            }}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                            <span className="truncate pr-2 font-sans font-medium">
                              {memory.image.caption || memory.image.alt}
                            </span>
                            <span className="shrink-0 px-2 py-0.5 rounded bg-black/70 border border-white/20 text-[10px] font-mono">
                              Click to expand ↗
                            </span>
                          </div>
                        </div>

                        {/* Story narrative */}
                        <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                          {memory.story}
                        </p>

                        {/* Highlights List */}
                        <div className="mb-4 pt-3 border-t border-dashed border-[#262634]">
                          <div className="text-[11px] uppercase font-mono text-neutral-400 mb-2 tracking-wider">
                            Moments &amp; Notes:
                          </div>
                          <ul className="list-none m-0 p-0 space-y-1.5">
                            {memory.highlights.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed"
                              >
                                <span
                                  className="grid place-items-center shrink-0 text-[10px] font-semibold w-4 h-4 border border-pink-400 rounded-full text-pink-400 mt-[1px]"
                                  aria-hidden="true"
                                >
                                  ✓
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tags and Sound Play Button */}
                        <div className="pt-3 border-t border-dashed border-[#262634] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {memory.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-[4px] whitespace-nowrap text-[11px] bg-[#1a1a24] border border-[#2b2b3a] px-2 py-0.5 text-neutral-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              selectMemory(memory);
                              if (!isSoundEnabled) {
                                setIsSoundEnabled(true);
                                travelAudio.play(memory.soundType);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-[6px] text-xs bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/40 text-pink-300 px-3 py-1 transition-colors cursor-pointer"
                          >
                            <span>🔊</span>
                            <span>Listen to {memory.soundTitle}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX DIALOG FOR EXPANDED PHOTO & STORY */}
      {lightboxMemory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Travel photo lightbox"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxMemory(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              nextLightboxItem();
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              prevLightboxItem();
            }
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#111116] border border-[#2b2b3a] rounded-[20px] p-4 sm:p-6 text-white shadow-2xl overflow-y-auto">
            {/* Lightbox Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262634] mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-pink-400 font-medium">{lightboxMemory.title}</span>
                <span>·</span>
                <span>{lightboxMemory.location}</span>
                {lightboxMemory.elevation && (
                  <>
                    <span>·</span>
                    <span>{lightboxMemory.elevation}</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxMemory(null)}
                className="w-8 h-8 rounded-full border border-[#333342] bg-[#1a1a24] hover:bg-pink-600 text-white flex items-center justify-center text-base transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </div>

            {/* Lightbox Large Image Preview */}
            <div className="relative aspect-[16/10] w-full rounded-[10px] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxMemory.image.src}
                alt={lightboxMemory.image.alt}
                onError={(e) => {
                  if (lightboxMemory.image.fallbackSrc) {
                    e.currentTarget.src = lightboxMemory.image.fallbackSrc;
                  }
                }}
                className="w-full h-full object-contain"
              />

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={prevLightboxItem}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                type="button"
                onClick={nextLightboxItem}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next photo"
              >
                →
              </button>
            </div>

            {/* Lightbox Caption & Narrative */}
            <div className="mt-4 space-y-2">
              <p className="font-serif italic text-lg text-white m-0">
                {lightboxMemory.image.caption || lightboxMemory.tagline}
              </p>
              <p className="text-xs text-neutral-300 leading-relaxed m-0 font-sans">
                {lightboxMemory.story}
              </p>
              <div className="flex items-center justify-between pt-2 text-xs font-mono text-neutral-400">
                <span>{lightboxMemory.date}</span>
                <span className="text-pink-400">Soundscape: {lightboxMemory.soundTitle}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
