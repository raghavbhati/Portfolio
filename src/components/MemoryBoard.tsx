import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import MemoryStrings from './MemoryStrings';
import type { BoardString } from './MemoryStrings';
import {
  CAPTION,
  CENTRE,
  layoutBoard,
  polaroidHeight,
  reconcileOrder,
  swapPlaces,
} from '../utils/memoryBoardLayout';
import type { CenterRatio, Point } from '../utils/memoryBoardLayout';

export interface BoardImage {
  src: string;
  /** A small copy, used where the photo shows small or blurred. */
  thumb?: string;
  alt: string;
}

export interface BoardItem {
  id: string;
  /** The first photo is pinned to the board; all of them show on the centre card. */
  photos: BoardImage[];
}

/** What the footer says about the memory on the centre card. */
export interface BoardDetails {
  /** What it was, or where. */
  heading: string;
  /** When: a date or a date range. */
  when: string;
  /** What it was like. */
  text: string;
  /** A post with more photos, shown as a button that opens it in a new tab. */
  post?: { href: string; label: string };
}

interface MemoryBoardProps<T extends BoardItem> {
  titleId: string;
  title: string;
  subtitle: string;
  closeLabel: string;
  items: T[];
  /** The memory on the centre card. Bringing up another swaps the two places. */
  activeId: string | null;
  /** Short caption under the polaroid and on the centre card. */
  caption: (item: T) => string;
  /** Accessible name for a polaroid. */
  describe: (item: T) => string;
  onActivate: (item: T) => void;
  onClose: () => void;
  /** What the footer says while `item` is on the centre card. */
  details: (item: T) => BoardDetails;
  /** Shape of the space kept for the centre card. Defaults to 'landscape'. */
  centerRatio?: CenterRatio;
}

interface Drag {
  id: string;
  /** The place on the board it was picked up from. */
  index: number;
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

/**
 * The shape (width over height) of every photo loaded so far, by address. A photo pinned
 * to the board has usually loaded before it's brought up, so the centre card can open at
 * its shape straight away.
 */
const photoShapes = new Map<string, number>();

function Photo({
  image,
  className,
  style,
  hidden,
  decorative,
  small,
  onShape,
}: {
  image: BoardImage;
  className: string;
  style?: CSSProperties;
  hidden?: boolean;
  /** A backdrop copy of a photo, with nothing to say. */
  decorative?: boolean;
  /** Shown small (or blurred), so its thumbnail will do. */
  small?: boolean;
  /** Called with the photo's width over its height once it has loaded. */
  onShape?: (ratio: number) => void;
}) {
  return (
    <img
      src={small ? image.thumb ?? image.src : image.src}
      alt={decorative ? '' : image.alt}
      aria-hidden={hidden || decorative || undefined}
      draggable={false}
      className={className}
      style={style}
      onLoad={(event) => {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        if (naturalWidth <= 0 || naturalHeight <= 0) return;
        photoShapes.set(image.src, naturalWidth / naturalHeight);
        onShape?.(naturalWidth / naturalHeight);
      }}
    />
  );
}

const SWIPE_DISTANCE = 40;

/** The largest size of the given shape (width over height) that fits in `box`. */
export function fitPhoto(ratio: number, box: { width: number; height: number }) {
  return ratio >= box.width / box.height
    ? { width: box.width, height: Math.round(box.width / ratio) }
    : { width: Math.round(box.height * ratio), height: box.height };
}

/**
 * The centre card while a memory is up: a frameless photo viewer, unlike the white
 * polaroids around it, that steps through every photo of that memory. It takes the shape
 * of the photo on show, as large as fits in `box`: wide for a landscape photo, tall for a
 * portrait one.
 */
function PhotoViewer({
  item,
  label,
  box,
}: {
  item: BoardItem;
  label: string;
  box: { width: number; height: number };
}) {
  const [index, setIndex] = useState(0);
  // Each photo's shape, known once it has loaded; until then the card fills the box.
  const [shapes, setShapes] = useState<Record<number, number>>({});
  const swipeFrom = useRef<number | null>(null);
  const count = item.photos.length;
  const show = (next: number) => setIndex((next + count) % count);
  const size = fitPhoto(
    shapes[index] ?? photoShapes.get(item.photos[index].src) ?? box.width / box.height,
    box
  );

  return (
    <figure
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label}, photo ${index + 1} of ${count}`}
      style={size}
      className="memory-pop group/viewer relative m-0 shrink-0 overflow-hidden rounded-[18px] bg-black transition-[width,height] duration-300 ease-out motion-reduce:transition-none shadow-[0_32px_90px_rgba(0,0,0,0.75),0_0_40px_rgba(251,100,116,0.25)] ring-2 ring-string/90 [body[data-theme=light]_&]:ring-string [body[data-theme=light]_&]:shadow-[0_32px_70px_rgba(0,0,0,0.35),0_0_35px_rgba(227,84,105,0.22)]"
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
          // The whole photo, never cropped, over a soft blurred copy of itself that fills
          // whatever space the card's shape leaves around it.
          <div
            key={`${photo.src}-${photoIndex}`}
            className="relative h-full w-full shrink-0 overflow-hidden"
          >
            <Photo
              image={photo}
              decorative
              small
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
            />
            <Photo
              image={photo}
              hidden={photoIndex !== index}
              onShape={(shape) =>
                setShapes((known) =>
                  known[photoIndex] === shape ? known : { ...known, [photoIndex]: shape }
                )
              }
              className="relative block h-full w-full object-contain object-center"
            />
          </div>
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
        <span className="line-clamp-2 min-w-0 font-serif text-xl italic leading-tight text-white drop-shadow-sm">
          {label}
        </span>
        {count > 1 && (
          <span className="shrink-0 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
            {index + 1}/{count}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function Details({ heading, when, text, post }: BoardDetails) {
  return (
    <>
      <div className="min-w-0">
        <p className="m-0 truncate text-[13px] text-bright [body[data-theme=light]_&]:text-heading">
          {heading}
          <span className="text-muted"> · {when}</span>
        </p>
        <p className="m-0 mt-0.5 line-clamp-2 text-xs text-muted">{text}</p>
      </div>
      {post && (
        <a
          href={post.href}
          target="_blank"
          rel="noreferrer"
          aria-label={post.label}
          title={post.label}
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
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r=".6" />
          </svg>
          {/* Just the icon on phones, where the footer is narrow. */}
          <span className="max-[640px]:hidden">{post.label} ↗</span>
        </a>
      )}
    </>
  );
}

/**
 * "Memories on a string": polaroids pinned around a centre card and tied together with
 * thread. Drag a polaroid onto the card — or click it — to bring it up; the memory that
 * was up there takes its place on the board.
 */
export default function MemoryBoard<T extends BoardItem>({
  titleId,
  title,
  subtitle,
  closeLabel,
  items,
  activeId,
  caption,
  describe,
  onActivate,
  onClose,
  details,
  centerRatio = 'landscape',
}: MemoryBoardProps<T>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const centreRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const [size, setSize] = useState(DEFAULT_SIZE);
  // Where each place's photo has been moved to by hand, by place on the board.
  const [offsets, setOffsets] = useState<Record<number, Point>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // The photo moved last sits on top of its neighbours.
  const [raisedId, setRaisedId] = useState<string | null>(null);
  const [overCentre, setOverCentre] = useState(false);

  // Which memory sits in which place. The one on the centre card has no place on the board;
  // bringing up another swaps the two, so the one coming down lands where it was picked up.
  const ids = items.map((item) => item.id);
  const [arrangement, setArrangement] = useState(() => ({
    order: ids,
    centreId: activeId,
    swaps: 0,
    /** The memory that last came down from the centre card. */
    landedId: null as string | null,
  }));
  let { order } = arrangement;
  const reconciled = reconcileOrder(order, ids);
  if (arrangement.centreId !== activeId || reconciled.join('\n') !== order.join('\n')) {
    const from = arrangement.centreId;
    const swapped =
      from !== null &&
      activeId !== null &&
      from !== activeId &&
      reconciled.includes(from) &&
      reconciled.includes(activeId);
    order = swapped ? swapPlaces(reconciled, from, activeId) : reconciled;
    setArrangement({
      order,
      centreId: activeId,
      swaps: arrangement.swaps + (swapped ? 1 : 0),
      landedId: swapped ? from : arrangement.landedId,
    });
  }
  const active = items.find((item) => item.id === activeId) ?? null;
  const pinned = order
    .filter((id) => id !== active?.id)
    .map((id) => items.find((item) => item.id === id)!);

  const layout = layoutBoard(pinned.length, size.width, size.height, centerRatio);
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
  useEffect(() => setOffsets({}), [layout.mode, size.width, pinned.length]);

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
    const offset = offsets[index];
    if (!offset) return slot;
    const { x, y } = onBoard(index, offset);
    return { x: slot.x + x, y: slot.y + y };
  }

  // Strings tie to the middle of the photo, or to the centre card.
  function pinOf(index: number): Point {
    if (index === CENTRE) return centre;
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

  function startDrag(event: PointerEvent<HTMLButtonElement>, item: T, index: number) {
    suppressClick.current = false;
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const origin = offsets[index] ?? { x: 0, y: 0 };
    drag.current = {
      id: item.id,
      index,
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
      [current.index]: { x: current.originX + dx, y: current.originY + dy },
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
    const { index } = current;
    if (!cancelled && isOverCentre(event.clientX, event.clientY)) {
      // The memory coming down from the centre card hangs from this place's own pin.
      setOffsets(({ [index]: _dropped, ...rest }) => rest);
      onActivate(item);
      return;
    }
    // Keep it where it landed on the board, so the next drag starts from there.
    setOffsets((prev) => ({ ...prev, [index]: onBoard(index, prev[index]) }));
  }

  function handleClick(item: T) {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onActivate(item);
  }

  // The place the last memory came down into: its strings twang as it lands.
  const landed = pinned.findIndex((item) => item.id === arrangement.landedId);
  const strings: BoardString[] = layout.links.flatMap(([from, to]) => {
    const a = pinOf(from);
    const b = pinOf(to);
    if (a.x === b.x && a.y === b.y) return [];
    const ends = [from, to];
    const dragged = ends.some((end) => end !== CENTRE && pinned[end].id === draggingId);
    return [
      {
        key: `${from}-${to}`,
        from: a,
        to: b,
        opacity: dragged ? 0.95 : ends.includes(CENTRE) && active ? 0.75 : 0.55,
        twang: ends.includes(CENTRE) || ends.includes(landed) ? arrangement.swaps : 0,
      },
    ];
  });

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
          <div
            ref={surfaceRef}
            className="dot-grid relative w-full"
            style={{ height: layout.height }}
          >
            <MemoryStrings strings={strings} surfaceRef={surfaceRef} />

            <div
              ref={centreRef}
              className={`absolute flex items-center justify-center transition-transform duration-200 ${
                active ? 'z-25' : 'z-20'
              } ${overCentre ? 'scale-[1.04]' : ''}`}
              style={{
                left: centre.x - centre.width / 2,
                top: centre.y - centre.height / 2,
                width: centre.width,
                height: centre.height,
              }}
            >
              {active && (
                <PhotoViewer
                  key={active.id}
                  item={active}
                  label={caption(active)}
                  box={{ width: centre.width, height: centre.height }}
                />
              )}
              {overCentre && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-[16px] ring-2 ring-string"
                  aria-hidden="true"
                />
              )}
            </div>

            {pinned.map((item, index) => {
              const slot = layout.slots[index];
              const position = positionOf(index);
              const isDragging = item.id === draggingId;
              const height = polaroidHeight(slot);
              return (
                // Keyed by place, so focus stays put when a memory swaps in.
                <button
                  key={index}
                  type="button"
                  aria-label={describe(item)}
                  onPointerDown={(event) => startDrag(event, item, index)}
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
                  }`}
                  style={{
                    width: slot.width,
                    transform: `translate(${position.x - slot.width / 2}px, ${
                      position.y - height / 2
                    }px) rotate(${isDragging ? 0 : slot.rotate}deg)`,
                  }}
                >
                  {/* A memory swapping in drops into place on its own; on opening they cascade. */}
                  <span
                    key={item.id}
                    className="memory-drop-in block"
                    style={{ animationDelay: `${arrangement.swaps ? 0 : index * 45}ms` }}
                  >
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
                          small
                          className="pointer-events-none block w-full rounded-[6px] object-cover"
                          style={{ aspectRatio: `${1 / slot.ratio}` }}
                        />
                      </span>
                    </span>
                    <span className="mt-1.5 block truncate text-center font-serif text-[15px] italic leading-5 text-muted">
                      {caption(item)}
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
          {active && <Details {...details(active)} />}
        </footer>
      </div>
    </dialog>
  );
}
