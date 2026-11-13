import type { Ref } from 'react';

interface MemoryFolderProps {
  id: string;
  side: 'left' | 'right';
  title: string;
  meta: string;
  /** Up to three photos peeking out of the folder. */
  photos: string[];
  label: string;
  expanded: boolean;
  onOpen: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}

// Each peeking photo fans out a little further on hover.
const FAN = [
  'left-[9px] -rotate-[9deg] group-hover:-translate-x-1 group-hover:-rotate-[16deg]',
  'left-[25px] rotate-[2deg] group-hover:-translate-y-1',
  'left-[41px] rotate-[10deg] group-hover:translate-x-1 group-hover:rotate-[17deg]',
];

// Below 1180px the page column leaves no room for a label, so only the folder shows.
const PLACEMENT = {
  left: 'left-6 bottom-6 max-[680px]:left-3 max-[680px]:bottom-3',
  right: 'right-6 bottom-6 max-[680px]:right-3 max-[680px]:bottom-3',
};

export default function MemoryFolder({
  id,
  side,
  title,
  meta,
  photos,
  label,
  expanded,
  onOpen,
  buttonRef,
}: MemoryFolderProps) {
  return (
    <div id={id} className={`fixed z-30 ${PLACEMENT[side]}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        className={`group flex cursor-pointer items-end gap-3 rounded-xl border-0 bg-transparent p-1 select-none ${
          side === 'right' ? 'flex-row-reverse text-right' : 'text-left'
        }`}
      >
        <span className="relative block h-[58px] w-[76px] shrink-0" aria-hidden="true">
          <span className="absolute top-0 left-0 h-3 w-8 rounded-t-[6px] border border-b-0 border-line bg-control" />
          <span className="absolute inset-x-0 top-[10px] bottom-0 rounded-[9px] rounded-tl-none border border-line bg-control" />
          {photos.slice(0, 3).map((src, index) => (
            <span
              key={src}
              className={`absolute bottom-[14px] block h-[36px] w-[28px] rounded-[3px] bg-[#fafafa] p-[2px] shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-[translate,rotate] duration-300 ease-out group-hover:-translate-y-2.5 ${FAN[index]}`}
            >
              <img
                src={src}
                alt=""
                decoding="async"
                className="block h-full w-full rounded-[2px] object-cover"
              />
            </span>
          ))}
          <span className="absolute inset-x-0 bottom-0 h-[30px] origin-bottom rounded-[9px] border border-line bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-transform duration-300 ease-out group-hover:[transform:perspective(220px)_rotateX(-22deg)]" />
        </span>
        <span className="pb-0.5 leading-tight max-[1180px]:hidden">
          <span className="block text-[13px] text-bright [body[data-theme=light]_&]:text-heading">
            {title}
          </span>
          <span className="block font-mono text-[11px] text-muted">{meta}</span>
        </span>
      </button>
    </div>
  );
}
