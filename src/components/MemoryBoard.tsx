import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import {
  CAPTION,
  CENTRE,
  FRAME,
  layoutBoard,
  polaroidHeight,
  stringPath,
} from '../utils/memoryBoardLayout';
import type { CenterRatio, Point } from '../utils/memoryBoardLayout';

export interface BoardImage {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export interface BoardItem {
  id: string;
  /** Short caption under the polaroid. */
  label: string;
  /** The first photo is pinned to the board; all of them show on the centre card. */
  photos: BoardImage[];
}

interface MemoryBoardProps<T extends BoardItem> {
  titleId: string;
  title: string;
  subtitle: string;
  /** Shown in the footer while nothing is on the centre card, e.g. "10 places". */
  meta: string;
  /** Second line of the empty centre card, e.g. "see what it sounds like". */
  prompt: string;
  closeLabel: string;
  items: T[];
  activeId: string | null;
  /** Accessible name for a polaroid. */
  describe: (item: T) => string;
  onActivate: (item: T) => void;
  onEject: () => void;
  onClose: () => void;
  /** Footer content while `item` is on the centre card. */
  renderDetails: (item: T) => ReactNode;
  /** Extra overlay on the centre card, next to the caption. */
  renderBadge?: (item: T) => ReactNode;
  /** Aspect ratio for the centre memory card. Defaults to 'landscape'. */
  centerRatio?: CenterRatio;
  /** Whether to show a toggle button to switch between 3:4 and 1:1 on the centre card. */
  allowRatioToggle?: boolean;
}

interface Drag {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
}

// Used until the board has been measured, and in environments without layout.
const DEFAULT_SIZE = { width: 1000, height: 600 };
const DRAG_THRESHOLD = 4;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function Photo({
  image,
  className,
  style,
  hidden,
}: {
  image: BoardImage;
  className: string;
  style?: CSSProperties;
  hidden?: boolean;
}) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      aria-hidden={hidden || undefined}
      draggable={false}
      className={className}
      style={style}
      onError={(event) => {
        const img = event.currentTarget;
        if (image.fallbackSrc && !img.src.endsWith(image.fallbackSrc)) img.src = image.fallbackSrc;
      }}
    />
  );
}

const SWIPE_DISTANCE = 40;

/**
 * The centre card while a memory is up: a frameless photo viewer, unlike the white
 * polaroids around it, that steps through every photo of that memory.
 */
function PhotoViewer({
  item,
  badge,
  onEject,
}: {
  item: BoardItem;
  badge?: ReactNode;
  onEject: () => void;
  ratio?: CenterRatio;
  onToggleRatio?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const swipeFrom = useRef<number | null>(null);
  const count = item.photos.length;
  const show = (next: number) => setIndex((next + count) % count);

  return (
    <figure
      role="group"
      aria-roledescription="carousel"
      aria-label={`${item.label}, photo ${index + 1} of ${count}`}
      className="memory-pop group/viewer relative m-0 h-full w-full overflow-hidden rounded-[18px] bg-black shadow-[0_32px_90px_rgba(0,0,0,0.75),0_0_40px_rgba(251,100,116,0.25)] ring-2 ring-string/90 [body[data-theme=light]_&]:ring-string [body[data-theme=light]_&]:shadow-[0_32px_70px_rgba(0,0,0,0.35),0_0_35px_rgba(227,84,105,0.22)]"
      onKeyDown={(event) => {
        if (count < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }}
      onPointerDown={(event) => {
        swipeFrom.current = event.clientX;
      }}
      onPointerUp={(event) => {
        const from = swipeFrom.current;
        swipeFrom.current = null;
        if (from === null || count < 2) return;
        const dx = event.clientX - from;
        if (Math.abs(dx) > SWIPE_DISTANCE) show(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div
        className="flex h-full touch-pan-y transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {item.photos.map((photo, photoIndex) => (
          <Photo
            key={`${photo.src}-${photoIndex}`}
            image={photo}
            hidden={photoIndex !== index}
            className="block h-full w-full shrink-0 object-cover object-center"
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <div
            className="pointer-events-none absolute top-2 inset-x-3.5 z-10 flex gap-1"
            aria-hidden="true"
          >
            {item.photos.map((photo, photoIndex) => (
              <span
                key={`${photo.src}-${photoIndex}`}
                className={`h-[2px] flex-1 rounded-full transition-colors ${
                  photoIndex === index
                    ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                    : 'bg-white/35'
                }`}
              />
            ))}
          </div>
          {(['Previous', 'Next'] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={`${direction} photo`}
              onClick={() => show(index + (direction === 'Next' ? 1 : -1))}
              className={`absolute top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-black/45 text-lg leading-none text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/viewer:opacity-100 hover:bg-black/70 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 ${
                direction === 'Next' ? 'right-2' : 'left-2'
              }`}
            >
              {direction === 'Next' ? '›' : '‹'}
            </button>
          ))}
        </>
      )}

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 pt-12 pb-3.5">
        <span className="truncate font-serif text-xl italic leading-tight text-white drop-shadow-sm">
          {item.label}
        </span>
        <span className="pointer-events-auto flex shrink-0 items-center gap-2 text-white">
          {badge}
          {count > 1 && (
            <span className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
              {index + 1}/{count}
            </span>
          )}
        </span>
      </figcaption>
      <button
        type="button"
        onClick={onEject}
        aria-label={`Put ${item.label} back`}
        className="absolute top-3.5 right-3.5 z-10 grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-black/55 text-sm leading-none text-white backdrop-blur-sm transition-colors hover:bg-black/80"
      >
        ×
      </button>
    </figure>
  );
}

const NETWORKS = {
  instagram: {
    name: 'Instagram',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".6" />
      </>
    ),
  },
  linkedin: {
    name: 'LinkedIn',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M7 10v7M11 17v-7m0 3c0-4 6-4 6 0v4" />
        <circle cx="7" cy="7" r=".7" />
      </>
    ),
  },
  twitter: { name: 'Twitter', icon: <path d="M4 3h4l12 18h-4zM20 3 4 21" /> },
};

/** "Check the post on …" for a memory's social post; icon-only on narrow screens. */
export function PostLink({ href, network }: { href: string; network: keyof typeof NETWORKS }) {
  const label = `Check the post on ${NETWORKS[network].name}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-text transition-colors hover:border-muted hover:text-bright"
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {NETWORKS[network].icon}
      </svg>
      <span className="max-[1024px]:hidden">{label} ↗</span>
    </a>
  );
}

/**
 * "Memories on a string": polaroids pinned around a centre card and tied together with
 * thread. Drag a polaroid onto the card — or click it — to bring it up.
 */
export default function MemoryBoard<T extends BoardItem>({
  titleId,
  title,
  subtitle,
  meta,
  prompt,
  closeLabel,
  items,
  activeId,
  describe,
  onActivate,
  onEject,
  onClose,
  renderDetails,
  renderBadge,
  centerRatio = 'landscape',
  allowRatioToggle = false,
}: MemoryBoardProps<T>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const centreRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [offsets, setOffsets] = useState<Record<string, Point>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // The photo moved last sits on top of its neighbours.
  const [raisedId, setRaisedId] = useState<string | null>(null);
  const [overCentre, setOverCentre] = useState(false);
  const [ratio, setRatio] = useState<CenterRatio>(centerRatio);

  useEffect(() => {
    setRatio(centerRatio);
  }, [centerRatio]);

  const toggleRatio = allowRatioToggle
    ? () => setRatio((prev) => (prev === '3:4' ? '1:1' : '3:4'))
    : undefined;

  const layout = layoutBoard(items.length, size.width, size.height, ratio);
  const active = items.find((item) => item.id === activeId) ?? null;
  const { centre } = layout;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const measure = () => {
      if (board.clientWidth > 0) setSize({ width: board.clientWidth, height: board.clientHeight });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  // Photos moved by hand only make sense on the board they were moved on.
  useEffect(() => setOffsets({}), [layout.mode, size.width]);

  // On phones the centre card sits above the photos; bring it back into view.
  useEffect(() => {
    if (activeId && layout.mode === 'stack')
      boardRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
  }, [activeId, layout.mode]);

  /** The offset from its pin that keeps polaroid `index` fully on the board. */
  function onBoard(index: number, offset: Point = { x: 0, y: 0 }): Point {
    const slot = layout.slots[index];
    const halfHeight = polaroidHeight(slot) / 2;
    return {
      x: clamp(slot.x + offset.x, slot.width / 2, layout.width - slot.width / 2) - slot.x,
      y: clamp(slot.y + offset.y, halfHeight, layout.height - halfHeight) - slot.y,
    };
  }

  function positionOf(index: number): Point {
    const slot = layout.slots[index];
    const offset = offsets[items[index].id];
    if (!offset) return slot;
    const { x, y } = onBoard(index, offset);
    return { x: slot.x + x, y: slot.y + y };
  }

  // Strings tie to the middle of the photo, or to the centre card while it's up there.
  function pinOf(index: number): Point {
    if (index === CENTRE || items[index].id === activeId) return centre;
    const position = positionOf(index);
    return { x: position.x, y: position.y - CAPTION / 2 };
  }

  function isOverCentre(x: number, y: number) {
    const rect = centreRef.current?.getBoundingClientRect();
    return (
      !!rect &&
      rect.width > 0 &&
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, item: T) {
    suppressClick.current = false;
    if (event.button !== 0 || item.id === activeId) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const origin = offsets[item.id] ?? { x: 0, y: 0 };
    drag.current = {
      id: item.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: origin.x,
      originY: origin.y,
      moved: false,
    };
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      current.moved = true;
      setDraggingId(current.id);
      setRaisedId(current.id);
    }
    setOffsets((prev) => ({
      ...prev,
      [current.id]: { x: current.originX + dx, y: current.originY + dy },
    }));
    setOverCentre(isOverCentre(event.clientX, event.clientY));
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>, item: T, cancelled = false) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!current.moved) return;
    // The click that follows a drag is not a click. A cancelled drag gets no click.
    suppressClick.current = !cancelled;
    setDraggingId(null);
    setOverCentre(false);
    if (!cancelled && isOverCentre(event.clientX, event.clientY)) {
      // Once it's put back, it goes back to its own pin.
      setOffsets(({ [item.id]: _dropped, ...rest }) => rest);
      onActivate(item);
      return;
    }
    // Keep it where it landed on the board, so the next drag starts from there.
    const index = items.indexOf(item);
    setOffsets((prev) => ({ ...prev, [item.id]: onBoard(index, prev[item.id]) }));
  }

  function handleClick(item: T) {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (item.id === activeId) onEject();
    else onActivate(item);
  }

  const strung = (index: number) =>
    index !== CENTRE && (items[index].id === activeId || items[index].id === draggingId);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none place-items-center border-0 bg-transparent p-3 text-text open:grid sm:p-6 backdrop:bg-black/70 backdrop:backdrop-blur-[3px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="relative flex h-full max-h-[800px] w-full max-w-[1180px] flex-col overflow-hidden rounded-[18px] border border-line bg-bg shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-2 max-[640px]:px-4 max-[640px]:pt-4">
          <div>
            <h2
              id={titleId}
              className="m-0 font-serif text-[28px] font-normal leading-none text-bright [body[data-theme=light]_&]:text-heading"
            >
              {title}
            </h2>
            <p className="m-0 mt-1.5 text-xs text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-surface text-lg leading-none text-text transition-colors hover:border-muted hover:text-bright"
          >
            ×
          </button>
        </header>

        <div ref={boardRef} className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="dot-grid relative w-full" style={{ height: layout.height }}>
            <svg
              className="memory-strings pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              {layout.links.map(([from, to]) => {
                const a = pinOf(from);
                const b = pinOf(to);
                if (a.x === b.x && a.y === b.y) return null;
                return (
                  <path
                    key={`${from}-${to}`}
                    d={stringPath(a, b)}
                    className="fill-none stroke-string"
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    strokeOpacity={strung(from) || strung(to) ? 0.95 : 0.55}
                  />
                );
              })}
            </svg>

            <div
              ref={centreRef}
              className={`absolute transition-transform duration-200 ${active ? 'z-25' : 'z-20'} ${
                overCentre ? 'scale-[1.04]' : ''
              }`}
              style={{
                left: centre.x - centre.width / 2,
                top: centre.y - centre.height / 2,
                width: centre.width,
                height: centre.height,
              }}
            >
              {active ? (
                <PhotoViewer
                  key={active.id}
                  item={active}
                  badge={renderBadge?.(active)}
                  onEject={onEject}
                  ratio={ratio}
                  onToggleRatio={toggleRatio}
                />
              ) : (
                <div
                  className={`grid h-full w-full place-items-center rounded-[16px] border border-dashed p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-colors ${
                    overCentre ? 'border-string bg-tag' : 'border-line bg-surface'
                  }`}
                >
                  <p className="m-0 text-[13px] leading-6 text-muted">
                    <span className="block">
                      {layout.mode === 'ring' ? 'drop a memory here' : 'tap a memory below'}
                    </span>
                    <span className="block">{prompt}</span>
                  </p>
                </div>
              )}
              {overCentre && active && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-[16px] ring-2 ring-string"
                  aria-hidden="true"
                />
              )}
            </div>

            {items.map((item, index) => {
              const slot = layout.slots[index];
              const position = positionOf(index);
              const isActive = item.id === activeId;
              const isDragging = item.id === draggingId;
              const height = polaroidHeight(slot);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={describe(item)}
                  aria-pressed={isActive}
                  onPointerDown={(event) => startDrag(event, item)}
                  onPointerMove={moveDrag}
                  onPointerUp={(event) => endDrag(event, item)}
                  onPointerCancel={(event) => endDrag(event, item, true)}
                  onDragStart={(event) => event.preventDefault()}
                  onClick={() => handleClick(item)}
                  className={`group absolute top-0 left-0 block border-0 bg-transparent p-0 text-left select-none focus-visible:outline-offset-4 ${
                    layout.mode === 'ring' ? 'touch-none' : 'touch-pan-y'
                  } ${
                    isDragging
                      ? 'z-30 cursor-grabbing'
                      : `${item.id === raisedId ? 'z-[15]' : 'z-10'} cursor-grab`
                  } ${
                    active && !isActive
                      ? 'opacity-65 saturate-[0.8] hover:opacity-100 hover:saturate-100 transition-all duration-300'
                      : 'opacity-100'
                  }`}
                  style={{
                    width: slot.width,
                    transform: `translate(${position.x - slot.width / 2}px, ${
                      position.y - height / 2
                    }px) rotate(${isDragging ? 0 : slot.rotate}deg)`,
                  }}
                >
                  <span
                    className="memory-drop-in block"
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    {isActive ? (
                      <span
                        className="block rounded-[10px] border border-dashed border-line"
                        style={{ height: slot.width * slot.ratio + FRAME }}
                      />
                    ) : (
                      <span
                        className={`relative block transition-[translate,scale] duration-200 ${
                          isDragging ? 'scale-[1.05]' : 'group-hover:-translate-y-1'
                        }`}
                      >
                        {/* More than one photo: the rest peek out behind, like a little stack. */}
                        {item.photos.slice(1, 3).map((photo, layer) => (
                          <span
                            key={`${photo.src}-${layer}`}
                            aria-hidden="true"
                            className={`absolute inset-0 rounded-[10px] ring-1 ring-black/5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] ${
                              layer === 0
                                ? 'translate-x-[5px] -translate-y-[3px] rotate-[5deg] bg-[#ededed]'
                                : '-translate-x-[4px] -translate-y-[2px] -rotate-[4deg] bg-[#e2e2e2]'
                            }`}
                          />
                        ))}
                        <span
                          className={`relative block rounded-[10px] bg-[#fafafa] p-[5px] ring-1 ring-black/5 ${
                            isDragging
                              ? 'shadow-[0_24px_50px_rgba(0,0,0,0.5)]'
                              : 'shadow-[0_10px_28px_rgba(0,0,0,0.35)]'
                          }`}
                        >
                          <Photo
                            image={item.photos[0]}
                            className="pointer-events-none block w-full rounded-[6px] object-cover"
                            style={{ aspectRatio: `${1 / slot.ratio}` }}
                          />
                        </span>
                      </span>
                    )}
                    <span className="mt-1.5 block truncate text-center font-serif text-[15px] italic leading-5 text-muted">
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <footer
          aria-live="polite"
          className="flex min-h-[60px] items-center justify-between gap-4 border-t border-dashed border-line px-6 py-3 text-xs text-muted max-[640px]:px-4"
        >
          {active ? (
            renderDetails(active)
          ) : (
            <>
              <span>
                {layout.mode === 'ring'
                  ? 'Drag a photo onto the centre, or click one.'
                  : 'Tap a photo to bring it up.'}
              </span>
              <span className="shrink-0 font-mono text-[11px]">{meta}</span>
            </>
          )}
        </footer>
      </div>
    </dialog>
  );
}
