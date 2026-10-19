import { useState, useRef, useEffect, useCallback } from 'react';
import { memories, MemoryEvent, MemoryImage } from '../data/memories';

interface EventImageGalleryProps {
  images: MemoryImage[];
  eventTitle: string;
  onImageClick: (image: MemoryImage, index: number) => void;
}

function EventImageGallery({ images, eventTitle, onImageClick }: EventImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(images.length - 1, index));
      setActiveIndex(clampedIndex);
      if (containerRef.current) {
        const target = containerRef.current.children[clampedIndex] as HTMLElement | undefined;
        if (target) {
          const scrollTarget = target.offsetLeft - containerRef.current.offsetLeft;
          if (typeof containerRef.current.scrollTo === 'function') {
            containerRef.current.scrollTo({
              left: scrollTarget,
              behavior: 'smooth',
            });
          } else {
            containerRef.current.scrollLeft = scrollTarget;
          }
        }
      }
    },
    [images.length]
  );

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex >= 0 && newIndex < images.length && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <div className="relative group my-3" onKeyDown={handleKeyDown}>
      {/* Scrollable track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none"
        tabIndex={0}
        aria-label={`Scrollable images for ${eventTitle}`}
      >
        {images.map((image, idx) => (
          <div
            key={image.src}
            className="shrink-0 w-full snap-center relative rounded-[6px] overflow-hidden border border-line bg-bg cursor-pointer transition-transform duration-200 hover:border-muted"
            onClick={() => onImageClick(image, idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onImageClick(image, idx);
              }
            }}
            aria-label={`View photo ${idx + 1} of ${images.length} from ${eventTitle}: ${
              image.alt
            }`}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111] [body[data-theme=light]_&]:bg-[#e5e5e5]">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 right-3 text-[11px] text-[#eee] flex items-center justify-between pointer-events-none">
                <span className="truncate pr-2 font-sans">{image.caption || image.alt}</span>
                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-black/70 font-mono text-muted">
                  {idx + 1}/{images.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows & pagination dots */}
      {images.length > 1 && (
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Photo pagination">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToIndex(dotIdx)}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  dotIdx === activeIndex
                    ? 'w-5 bg-bright [body[data-theme=light]_&]:bg-heading'
                    : 'w-1.5 bg-muted/40 hover:bg-muted'
                }`}
                aria-label={`Jump to image ${dotIdx + 1}`}
                aria-selected={dotIdx === activeIndex}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => scrollToIndex(activeIndex - 1)}
              className="w-6 h-6 rounded flex items-center justify-center border border-line bg-surface text-text hover:text-bright disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              disabled={activeIndex === images.length - 1}
              onClick={() => scrollToIndex(activeIndex + 1)}
              className="w-6 h-6 rounded flex items-center justify-center border border-line bg-surface text-text hover:text-bright disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next image"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MemoriesProps {
  defaultOpen?: boolean;
}

export default function Memories({ defaultOpen = false }: MemoriesProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(defaultOpen);
  const [selectedEventId, setSelectedEventId] = useState<string>(memories[0].id);
  const [lightboxState, setLightboxState] = useState<{
    image: MemoryImage;
    galleryIndex: number;
    event: MemoryEvent;
  } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'showcase' | 'timeline'>('showcase');

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lightboxDialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setLightboxState(null);
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'memories' || memories.some((m) => m.id === hash)) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    triggerButtonRef.current?.focus();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Sync hash on mount and hashchange to open modal if #memories or an event id is targeted
  useEffect(() => {
    const checkHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '');
      if (hash === 'memories') {
        setIsModalOpen(true);
      } else {
        const match = memories.find((m) => m.id === hash);
        if (match) {
          setSelectedEventId(match.id);
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
        if (lightboxState) {
          closeLightbox();
        } else if (isModalOpen) {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, lightboxState, closeModal]);

  const openLightbox = (image: MemoryImage, galleryIndex: number, event: MemoryEvent) => {
    setLightboxState({ image, galleryIndex, event });
    if (lightboxDialogRef.current && typeof lightboxDialogRef.current.showModal === 'function') {
      try {
        lightboxDialogRef.current.showModal();
      } catch {
        // Fallback handled by React state
      }
    }
  };

  const closeLightbox = () => {
    if (lightboxDialogRef.current && typeof lightboxDialogRef.current.close === 'function') {
      try {
        lightboxDialogRef.current.close();
      } catch {
        // Fallback handled by React state
      }
    }
    setLightboxState(null);
  };

  const nextLightboxImage = () => {
    if (!lightboxState) return;
    const { event, galleryIndex } = lightboxState;
    if (galleryIndex < event.images.length - 1) {
      const nextIndex = galleryIndex + 1;
      setLightboxState({
        image: event.images[nextIndex],
        galleryIndex: nextIndex,
        event,
      });
    }
  };

  const prevLightboxImage = () => {
    if (!lightboxState) return;
    const { event, galleryIndex } = lightboxState;
    if (galleryIndex > 0) {
      const prevIndex = galleryIndex - 1;
      setLightboxState({
        image: event.images[prevIndex],
        galleryIndex: prevIndex,
        event,
      });
    }
  };

  const filteredMemories =
    filterType === 'all' ? memories : memories.filter((m) => m.category === filterType);

  const activeEvent =
    filteredMemories.find((m) => m.id === selectedEventId) || filteredMemories[0] || memories[0];

  return (
    <>
      {/* FLOATING FIXED MEMORY CARD / FOLDER WIDGET AT BOTTOM-RIGHT CORNER */}
      <aside
        id="memories"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none"
        aria-label="Memories timeline trigger"
      >
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={openModal}
          className="group relative flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Click to view memories"
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
        >
          {/* Folder Back Tab */}
          <div className="w-12 h-3.5 bg-gradient-to-r from-sky-400 to-sky-500 rounded-t-[7px] self-start ml-2 -mb-[1px] shadow-sm pointer-events-none" />

          {/* Folder Body Base */}
          <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-2xl rounded-tl-[4px] bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-1.5 shadow-[0_14px_35px_rgba(14,165,233,0.38)] border border-sky-300/50 flex flex-col justify-end overflow-visible">
            {/* Peeking Polaroid Photo 1 (Left - ClickUp) */}
            <div
              className="absolute left-2.5 -top-4 sm:-top-6 w-11 sm:w-13 aspect-[4/5] bg-white p-[3px] pb-[6px] rounded-[3px] shadow-md -rotate-12 group-hover:-rotate-[16deg] group-hover:-translate-y-2.5 transition-all duration-300 ease-out overflow-hidden z-10"
              aria-hidden="true"
            >
              <img
                src="/memories/clickup-1.jpg"
                alt=""
                className="w-full h-full object-cover rounded-[1px]"
              />
            </div>

            {/* Peeking Polaroid Photo 2 (Center - MongoDB) */}
            <div
              className="absolute left-8 sm:left-9 -top-6 sm:-top-8 w-11 sm:w-13 aspect-[4/5] bg-white p-[3px] pb-[6px] rounded-[3px] shadow-lg rotate-2 group-hover:-translate-y-3.5 group-hover:scale-105 transition-all duration-300 ease-out overflow-hidden z-20"
              aria-hidden="true"
            >
              <img
                src="/memories/mongodb-1.jpg"
                alt=""
                className="w-full h-full object-cover rounded-[1px]"
              />
            </div>

            {/* Peeking Polaroid Photo 3 (Right - Google Hackathon) */}
            <div
              className="absolute right-2.5 -top-4 sm:-top-6 w-11 sm:w-13 aspect-[4/5] bg-white p-[3px] pb-[6px] rounded-[3px] shadow-md rotate-12 group-hover:rotate-[16deg] group-hover:-translate-y-2.5 transition-all duration-300 ease-out overflow-hidden z-10"
              aria-hidden="true"
            >
              <img
                src="/memories/google-1.jpg"
                alt=""
                className="w-full h-full object-cover rounded-[1px]"
              />
            </div>

            {/* Front Frosted Pocket Flap */}
            <div className="relative z-30 w-full h-11 sm:h-13 rounded-b-[12px] rounded-t-[3px] bg-sky-300/35 backdrop-blur-md border-t border-sky-100/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] flex items-center justify-between px-2.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-white font-semibold drop-shadow-sm">
                Memories
              </span>
              <span className="text-[10px] text-white/95 font-mono drop-shadow-sm">3 events</span>
            </div>
          </div>

          {/* Badge Pill: "click to view memories" */}
          <div className="absolute -bottom-2 -left-2 sm:-left-3 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-zinc-900 border border-zinc-200 shadow-[0_6px_20px_rgba(0,0,0,0.22)] text-[11px] sm:text-xs font-mono font-medium whitespace-nowrap group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.28)] group-hover:scale-105 transition-all duration-200 [body[data-theme=light]_&]:bg-zinc-900 [body[data-theme=light]_&]:text-white [body[data-theme=light]_&]:border-zinc-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>click to view memories</span>
          </div>
        </button>
      </aside>

      {/* POPUP MODAL DIALOG WITH CONNECTED DOTS TIMELINE */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-memories-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#111114] [body[data-theme=light]_&]:bg-[#ffffff] text-text rounded-[24px] border border-[#2b2b30] [body[data-theme=light]_&]:border-line shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden focus:outline-none"
          >
            {/* Modal Top Header (Board Title, Filter Pills, View Toggles, Close Button) */}
            <div className="p-4 sm:p-6 pb-3 border-b border-line/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-xs text-muted">the board</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500/80 animate-pulse" />
                  <span className="font-mono text-[10px] text-muted">memories, on a string</span>
                </div>
                <h2
                  id="modal-memories-title"
                  className="m-0 font-serif text-2xl sm:text-3xl text-bright font-normal [body[data-theme=light]_&]:text-heading mt-0.5 tracking-tight flex items-baseline gap-2 flex-wrap"
                >
                  <span>Memories &amp; Timeline</span>
                  <span className="font-serif italic text-base sm:text-lg text-muted/70 font-normal">
                    — the board
                  </span>
                </h2>
              </div>

              {/* View Toggle & Category Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* View Mode Toggle */}
                <div className="flex items-center rounded-[6px] border border-line bg-surface p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('showcase')}
                    className={`px-2.5 py-[3px] rounded-[4px] transition-colors cursor-pointer text-xs font-mono ${
                      viewMode === 'showcase'
                        ? 'bg-tag text-bright font-medium [body[data-theme=light]_&]:text-heading'
                        : 'text-muted hover:text-bright'
                    }`}
                  >
                    Showcase
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('timeline')}
                    className={`px-2.5 py-[3px] rounded-[4px] transition-colors cursor-pointer text-xs font-mono ${
                      viewMode === 'timeline'
                        ? 'bg-tag text-bright font-medium [body[data-theme=light]_&]:text-heading'
                        : 'text-muted hover:text-bright'
                    }`}
                  >
                    All Events
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'all'
                        ? 'bg-tag border-muted text-bright [body[data-theme=light]_&]:text-heading'
                        : 'bg-transparent border-line text-muted hover:text-bright'
                    }`}
                  >
                    All ({memories.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterType('Conference');
                      const confMatch = memories.find((m) => m.category === 'Conference');
                      if (confMatch) setSelectedEventId(confMatch.id);
                    }}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'Conference'
                        ? 'bg-tag border-muted text-bright [body[data-theme=light]_&]:text-heading'
                        : 'bg-transparent border-line text-muted hover:text-bright'
                    }`}
                  >
                    Conferences
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterType('Hackathon');
                      const hackMatch = memories.find((m) => m.category === 'Hackathon');
                      if (hackMatch) setSelectedEventId(hackMatch.id);
                    }}
                    className={`px-2 py-[2px] rounded-[4px] border transition-colors cursor-pointer text-xs ${
                      filterType === 'Hackathon'
                        ? 'bg-tag border-muted text-bright [body[data-theme=light]_&]:text-heading'
                        : 'bg-transparent border-line text-muted hover:text-bright'
                    }`}
                  >
                    Hackathons
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 sm:w-9 sm:h-9 ml-1 rounded-full border border-line bg-surface hover:bg-tag text-bright text-lg flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close memories modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* CONNECTED DOTS STRING RIBBON (Across the top of the modal) */}
            <div className="relative px-4 sm:px-6 py-2.5 border-b border-dashed border-line bg-surface/40 shrink-0">
              <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                {/* Connecting Line String between dots */}
                <div
                  className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#7b68ee] via-[#00ed64] to-[#4285f4] opacity-50 z-0"
                  aria-hidden="true"
                />

                {memories.map((event) => {
                  const isSelected = event.id === activeEvent.id;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => {
                        setSelectedEventId(event.id);
                        if (viewMode === 'timeline') {
                          document.getElementById(`timeline-${event.id}`)?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }
                      }}
                      className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-tag border border-muted text-bright scale-105 shadow-md [body[data-theme=light]_&]:text-heading'
                          : 'bg-surface border border-line text-muted hover:text-bright hover:border-muted/50'
                      }`}
                      aria-label={`Jump to ${event.title} (${event.date})`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                        style={{
                          backgroundColor: event.accentColor,
                          boxShadow: isSelected ? `0 0 8px ${event.accentColor}` : undefined,
                        }}
                      />
                      <span className="hidden sm:inline font-sans font-medium">{event.title}</span>
                      <span className="text-[10px] text-muted">{event.formattedDate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MODAL MAIN SCROLLABLE CONTENT */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* VIEW 1: INTERACTIVE SHOWCASE WITH THE BOARD & CONNECTED DOTS */}
              {viewMode === 'showcase' && activeEvent && (
                <div className="space-y-6">
                  {/* THE BOARD: MEMORIES ON A STRING CANVAS (From Reference Screenshot 3) */}
                  <div className="relative rounded-[16px] p-4 sm:p-5 bg-gradient-to-br from-[#18181d] via-[#141418] to-[#121215] [body[data-theme=light]_&]:from-[#fafafa] [body[data-theme=light]_&]:via-[#f5f5f7] [body[data-theme=light]_&]:to-[#efeff2] border border-[#2e2e36] [body[data-theme=light]_&]:border-line shadow-inner overflow-hidden select-none">
                    {/* Board Canvas Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-dashed border-line/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        <span className="text-[11px] font-mono tracking-wider uppercase text-muted font-medium">
                          The Memory Board · Connected Milestones
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted/80 hidden sm:inline">
                        Click any polaroid to view
                      </span>
                    </div>

                    {/* SVG Pink Connected String Web */}
                    <div className="relative min-h-[170px] sm:min-h-[190px]">
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-0"
                        preserveAspectRatio="none"
                        viewBox="0 0 600 180"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="pinkString" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        {/* Upper graceful string curve */}
                        <path
                          d="M 100,60 Q 300,140 500,60"
                          fill="none"
                          stroke="url(#pinkString)"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        {/* Secondary supporting loop */}
                        <path
                          d="M 100,60 Q 300,165 500,60"
                          fill="none"
                          stroke="#f472b6"
                          strokeWidth="1.2"
                          strokeOpacity="0.45"
                        />
                      </svg>

                      {/* 3 Connected Polaroid Cards on the String */}
                      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
                        {memories.map((event, idx) => {
                          const isSelected = event.id === activeEvent.id;
                          const rotationClass =
                            idx === 0
                              ? '-rotate-2 hover:rotate-0'
                              : idx === 1
                              ? 'rotate-1 hover:rotate-0'
                              : 'rotate-2 hover:rotate-0';

                          return (
                            <div
                              key={event.id}
                              onClick={() => setSelectedEventId(event.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedEventId(event.id);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              aria-pressed={isSelected}
                              aria-label={`View ${event.title} (${event.date}) on board`}
                              className={`group/card relative cursor-pointer rounded-[12px] p-2.5 transition-all duration-300 transform ${rotationClass} ${
                                isSelected
                                  ? 'bg-[#222228] [body[data-theme=light]_&]:bg-white shadow-[0_12px_30px_rgba(236,72,153,0.25)] border-2 border-pink-500 scale-[1.03]'
                                  : 'bg-[#1b1b20] [body[data-theme=light]_&]:bg-white/90 shadow-md border border-line/60 hover:scale-[1.02] hover:border-pink-400/50'
                              }`}
                            >
                              {/* Top Pin Dot connecting to string */}
                              <div
                                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white [body[data-theme=dark]_&]:border-[#111] flex items-center justify-center shadow-md z-20"
                                style={{ backgroundColor: isSelected ? '#ec4899' : '#888' }}
                                aria-hidden="true"
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isSelected ? 'bg-white animate-ping' : 'bg-white/80'
                                  }`}
                                />
                              </div>

                              {/* Polaroid Image Thumbnail */}
                              <div className="aspect-[16/10] w-full rounded-[6px] overflow-hidden bg-black/40 mb-2 relative">
                                <img
                                  src={event.images[0]?.src}
                                  alt=""
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                                />
                                <span
                                  className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium backdrop-blur-md text-white bg-black/60 border border-white/20"
                                  style={{ borderColor: `${event.accentColor}80` }}
                                >
                                  {event.formattedDate}
                                </span>
                              </div>

                              {/* Card Title & Category Tag */}
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-xs font-serif italic truncate ${
                                    isSelected
                                      ? 'text-bright font-semibold [body[data-theme=light]_&]:text-heading'
                                      : 'text-text [body[data-theme=light]_&]:text-muted'
                                  }`}
                                >
                                  {event.title.toLowerCase()}
                                </span>
                                <span
                                  className="text-[9px] font-mono px-1 py-[1px] rounded border uppercase shrink-0"
                                  style={{
                                    borderColor: `${event.accentColor}50`,
                                    color: event.accentColor,
                                    backgroundColor: `${event.accentColor}15`,
                                  }}
                                >
                                  {event.category}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE EVENT DETAILS CONTAINER */}
                  <div className="relative border border-dashed border-line bg-surface/70 rounded-[12px] p-4 sm:p-6 transition-all duration-200">
                    {/* Active Event Header */}
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="m-0 font-serif text-[24px] sm:text-[28px] leading-tight text-bright [body[data-theme=light]_&]:text-heading">
                          {activeEvent.title}
                        </h3>
                        <span
                          className="rounded-[3px] text-[10px] uppercase font-mono px-1.5 py-[2px] border text-bright"
                          style={{
                            borderColor: `${activeEvent.accentColor}55`,
                            backgroundColor: `${activeEvent.accentColor}15`,
                            color: activeEvent.accentColor,
                          }}
                        >
                          {activeEvent.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted">
                        <span className="rounded-[3px] bg-tag border border-line px-1.5 py-[1px] text-muted">
                          {activeEvent.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-bright/90 mb-3 [body[data-theme=light]_&]:text-heading">
                      {activeEvent.highlight}
                    </p>

                    {/* Scrollable Images Gallery */}
                    <EventImageGallery
                      key={activeEvent.id}
                      images={activeEvent.images}
                      eventTitle={activeEvent.title}
                      onImageClick={(image, idx) => openLightbox(image, idx, activeEvent)}
                    />

                    {/* Details Grid: Left Column Details, Right Column Connected Dots List */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 mt-4 pt-4 border-t border-dashed border-line">
                      {/* Left Column: Description, Takeaways, Tags, LinkedIn Button */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-muted leading-relaxed mb-4 [body[data-theme=light]_&]:text-muted">
                            {activeEvent.description}
                          </p>

                          {/* Key Highlights & Learnings */}
                          <div className="mb-4">
                            <div className="text-[11px] uppercase font-mono text-muted mb-2 tracking-wider">
                              Key Highlights &amp; Learnings:
                            </div>
                            <ul className="list-none m-0 p-0 space-y-1.5">
                              {activeEvent.takeaways.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-xs text-text leading-relaxed [body[data-theme=light]_&]:text-muted"
                                >
                                  <span
                                    className="grid place-items-center shrink-0 text-[10px] font-semibold w-4 h-4 border border-[#00cda0] rounded-full text-[#00cda0] mt-[1px] [body[data-theme=light]_&]:text-[#087c64] [body[data-theme=light]_&]:border-[#087c64]"
                                    aria-hidden="true"
                                  >
                                    ✓
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Tags & LinkedIn Button */}
                        <div className="pt-3 border-t border-dashed border-line flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {activeEvent.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-[3px] whitespace-nowrap text-[11px] bg-tag border border-[#2b2b2b] px-1.5 py-[1px] text-[#ccc] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Redirect to LinkedIn Button */}
                          {activeEvent.linkedInUrl && (
                            <a
                              href={activeEvent.linkedInUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-[4px] whitespace-nowrap text-xs bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/40 hover:border-[#0a66c2] text-[#5cb0ff] hover:text-[#9cd1ff] px-2.5 py-1 transition-all duration-150 [body[data-theme=light]_&]:bg-[#0a66c2]/10 [body[data-theme=light]_&]:text-[#005a9e] [body[data-theme=light]_&]:border-[#0a66c2]/30"
                              aria-label={`View LinkedIn post for ${activeEvent.title}`}
                            >
                              <svg
                                className="w-3.5 h-3.5 fill-currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                              </svg>
                              <span>View LinkedIn Post ↗</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Connected Dots Milestone Trail at Bottom-Right */}
                      <div
                        className="border border-dashed border-line bg-bg/50 rounded-[8px] p-3.5 flex flex-col justify-between"
                        aria-label="List of events with connected dots"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider mb-3 pb-2 border-b border-dashed border-line">
                          <span>CONNECTED EVENTS</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-tag border border-line">
                            {memories.findIndex((m) => m.id === activeEvent.id) + 1} /{' '}
                            {memories.length}
                          </span>
                        </div>

                        {/* Connected Dots List */}
                        <div className="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#7b68ee] before:via-[#00ed64] before:to-[#4285f4] before:opacity-40">
                          {memories.map((event) => {
                            const isSelected = event.id === activeEvent.id;
                            return (
                              <div
                                key={event.id}
                                id={event.id}
                                onClick={() => setSelectedEventId(event.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedEventId(event.id);
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                                aria-label={`Select event: ${event.title} (${event.date})`}
                                className={`relative cursor-pointer rounded-[4px] p-2 transition-all duration-150 select-none ${
                                  isSelected
                                    ? 'bg-surface border border-line shadow-sm'
                                    : 'bg-transparent hover:bg-surface/60 border border-transparent hover:border-line/40'
                                }`}
                              >
                                {/* Connected Dot Node */}
                                <div
                                  className="absolute -left-[17px] top-3 w-4 h-4 rounded-full border-2 bg-bg flex items-center justify-center transition-all duration-200"
                                  style={{
                                    borderColor: isSelected ? event.accentColor : '#444',
                                    transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                                  }}
                                  aria-hidden="true"
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isSelected ? 'animate-pulse' : ''
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? event.accentColor : '#666',
                                    }}
                                  />
                                </div>

                                {/* Event item summary */}
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`text-xs font-medium font-sans truncate ${
                                      isSelected
                                        ? 'text-bright [body[data-theme=light]_&]:text-heading'
                                        : 'text-text [body[data-theme=light]_&]:text-muted'
                                    }`}
                                  >
                                    {event.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-muted shrink-0">
                                    {event.formattedDate}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5 text-[10px] text-muted font-mono">
                                  <span>{event.organization}</span>
                                  <span
                                    className="text-[9px] px-1 py-[0.5px] rounded border"
                                    style={{
                                      borderColor: `${event.accentColor}40`,
                                      color: isSelected ? event.accentColor : undefined,
                                    }}
                                  >
                                    {event.category}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="text-[10px] text-muted text-center pt-2 mt-2 border-t border-dashed border-line font-mono">
                          Click any milestone to explore
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: CONTINUOUS TIMELINE OF CONNECTED EVENTS */}
              {viewMode === 'timeline' && (
                <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#7b68ee] before:via-[#00ed64] before:to-[#4285f4] before:opacity-50">
                  {filteredMemories.map((event) => (
                    <article
                      key={event.id}
                      id={`timeline-${event.id}`}
                      className="relative scroll-mt-24 p-5 sm:p-6 border border-dashed border-line bg-surface rounded-[8px] transition-all duration-200 hover:border-muted/60"
                    >
                      {/* Connected Dot Anchor Node */}
                      <div
                        className="absolute -left-[30px] sm:-left-[39px] top-6 w-6 h-6 rounded-full border-2 bg-surface flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                        style={{ borderColor: event.accentColor }}
                        aria-hidden="true"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full animate-pulse"
                          style={{ backgroundColor: event.accentColor }}
                        />
                      </div>

                      {/* Event Header */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="m-0 font-serif text-[24px] sm:text-[26px] leading-tight text-bright [body[data-theme=light]_&]:text-heading">
                            {event.title}
                          </h3>
                          <span
                            className="rounded-[3px] text-[10px] uppercase font-mono px-1.5 py-[2px] border text-bright"
                            style={{
                              borderColor: `${event.accentColor}55`,
                              backgroundColor: `${event.accentColor}15`,
                              color: event.accentColor,
                            }}
                          >
                            {event.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-muted">
                          <span className="rounded-[3px] bg-tag border border-line px-1.5 py-[1px] text-muted">
                            {event.date}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-bright/90 mb-2 [body[data-theme=light]_&]:text-heading">
                        {event.highlight}
                      </p>

                      <p className="text-xs text-muted leading-relaxed mb-3 [body[data-theme=light]_&]:text-muted">
                        {event.description}
                      </p>

                      {/* Scrollable Images Gallery */}
                      <EventImageGallery
                        images={event.images}
                        eventTitle={event.title}
                        onImageClick={(image, idx) => openLightbox(image, idx, event)}
                      />

                      {/* Takeaways with checkmarks */}
                      <div className="mt-3 pt-3 border-t border-dashed border-line">
                        <div className="text-[11px] uppercase font-mono text-muted mb-2 tracking-wider">
                          Key Highlights &amp; Learnings:
                        </div>
                        <ul className="list-none m-0 p-0 space-y-1.5">
                          {event.takeaways.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-xs text-text leading-relaxed [body[data-theme=light]_&]:text-muted"
                            >
                              <span
                                className="grid place-items-center shrink-0 text-[10px] font-semibold w-4 h-4 border border-[#00cda0] rounded-full text-[#00cda0] mt-[1px] [body[data-theme=light]_&]:text-[#087c64] [body[data-theme=light]_&]:border-[#087c64]"
                                aria-hidden="true"
                              >
                                ✓
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer with Tags and LinkedIn Redirect Button */}
                      <div className="mt-4 pt-3 border-t border-dashed border-line flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-[3px] whitespace-nowrap text-[11px] bg-tag border border-[#2b2b2b] px-1.5 py-[1px] text-[#ccc] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Redirect to LinkedIn Button */}
                        {event.linkedInUrl && (
                          <a
                            href={event.linkedInUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-[4px] whitespace-nowrap text-xs bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/40 hover:border-[#0a66c2] text-[#5cb0ff] hover:text-[#9cd1ff] px-2.5 py-1 transition-all duration-150 [body[data-theme=light]_&]:bg-[#0a66c2]/10 [body[data-theme=light]_&]:text-[#005a9e] [body[data-theme=light]_&]:border-[#0a66c2]/30"
                            aria-label={`View LinkedIn post for ${event.title}`}
                          >
                            <svg
                              className="w-3.5 h-3.5 fill-currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                            </svg>
                            <span>View LinkedIn Post ↗</span>
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX DIALOG FOR EXPANDED IMAGE PREVIEW */}
      <dialog
        ref={lightboxDialogRef}
        open={Boolean(lightboxState)}
        onClose={closeLightbox}
        onCancel={closeLightbox}
        onClick={(e) => {
          if (e.target === lightboxDialogRef.current) closeLightbox();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextLightboxImage();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevLightboxImage();
          }
        }}
        className={`fixed inset-0 m-auto p-4 sm:p-6 rounded-[12px] border border-line bg-panel text-text max-w-3xl w-[92vw] shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop:bg-black/80 backdrop:backdrop-blur-sm z-[60] ${
          lightboxState ? 'block' : 'hidden'
        }`}
        aria-label="Image preview lightbox"
      >
        {lightboxState && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-muted">
                <span className="text-bright font-medium">{lightboxState.event.title}</span>
                <span>·</span>
                <span>
                  Photo {lightboxState.galleryIndex + 1} of {lightboxState.event.images.length}
                </span>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="w-7 h-7 rounded flex items-center justify-center border border-line hover:border-muted text-bright hover:bg-surface transition-colors cursor-pointer text-base"
                aria-label="Close photo preview"
              >
                ×
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-black flex items-center justify-center">
              <img
                src={lightboxState.image.src}
                alt={lightboxState.image.alt}
                className="w-full h-full object-contain"
              />

              {lightboxState.event.images.length > 1 && (
                <>
                  <button
                    type="button"
                    disabled={lightboxState.galleryIndex === 0}
                    onClick={prevLightboxImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={lightboxState.galleryIndex === lightboxState.event.images.length - 1}
                    onClick={nextLightboxImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                    aria-label="Next photo"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-bright/90 m-0 [body[data-theme=light]_&]:text-heading font-sans">
              {lightboxState.image.caption || lightboxState.image.alt}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
