import { useEffect, useMemo, useState } from 'react';
import MemoryBoard, { PostLink } from './MemoryBoard';
import MemoryFolder from './MemoryFolder';
import { travelMemories } from '../data/travelMemories';
import type { TravelMemory as TravelMemoryItem } from '../data/travelMemories';
import { travelAudio } from '../utils/travelAudio';
import { useMemoryDialog } from '../utils/useMemoryDialog';

interface TravelMemoryProps {
  defaultOpen?: boolean;
  memories?: TravelMemoryItem[];
}

function Equalizer() {
  return (
    <span className="memory-eq inline-flex h-3 items-end gap-[2px]" aria-hidden="true">
      <span className="h-full w-[2px] rounded-full bg-current" />
      <span className="h-full w-[2px] rounded-full bg-current" />
      <span className="h-full w-[2px] rounded-full bg-current" />
    </span>
  );
}

export default function TravelMemory({
  defaultOpen = false,
  memories = travelMemories,
}: TravelMemoryProps = {}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ids = useMemo(() => memories.map((memory) => memory.id), [memories]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // A link can't start sound on its own; the visitor presses play.
  const dialog = useMemoryDialog('travel-memory', ids, defaultOpen, (id) => {
    setActiveId(id);
    stop();
  });
  const active = memories.find((memory) => memory.id === activeId) ?? null;

  function play(memory: TravelMemoryItem) {
    travelAudio.play(memory.sound.type);
    setIsPlaying(true);
  }

  function stop() {
    travelAudio.stop();
    setIsPlaying(false);
  }

  function activate(memory: TravelMemoryItem) {
    setActiveId(memory.id);
    if (isMuted) stop();
    else play(memory);
  }

  function eject() {
    setActiveId(null);
    stop();
  }

  function close() {
    eject();
    dialog.close();
  }

  function toggleSound() {
    if (!active) return;
    if (isPlaying) stop();
    else play(active);
    setIsMuted(isPlaying);
  }

  // Never keep playing in a background tab.
  useEffect(() => {
    if (!isPlaying || !active) return;
    const onVisibilityChange = () => {
      if (document.hidden) travelAudio.stop();
      else travelAudio.play(active.sound.type);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [isPlaying, active]);

  useEffect(() => () => travelAudio.stop(), []);

  return (
    <>
      <MemoryFolder
        id="travel-memory"
        side="left"
        title="Travel"
        meta={`${memories.length} places`}
        photos={memories.slice(0, 3).map((memory) => memory.photos[0].src)}
        label="Open travel memories"
        expanded={dialog.isOpen}
        onOpen={dialog.open}
        buttonRef={dialog.triggerRef}
      />

      {dialog.isOpen && (
        <MemoryBoard
          titleId="travel-memory-title"
          title="Travel Memory"
          subtitle="memories, on a string"
          meta={`${memories.length} places`}
          prompt="see what it sounds like"
          closeLabel="Close travel memories"
          items={memories}
          activeId={activeId}
          describe={(memory) => `${memory.label}, ${memory.location}`}
          onActivate={activate}
          onEject={eject}
          onClose={close}
          renderBadge={(memory) =>
            isPlaying && memory.id === activeId ? (
              <span className="text-white">
                <Equalizer />
              </span>
            ) : null
          }
          renderDetails={(memory) => (
            <>
              <div className="min-w-0">
                <p className="m-0 truncate text-[13px] text-bright [body[data-theme=light]_&]:text-heading">
                  {memory.title}
                  <span className="text-muted">
                    {' '}
                    · {memory.location} · {memory.date}
                  </span>
                </p>
                <p className="m-0 mt-0.5 truncate text-xs text-muted">{memory.note}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {memory.instagramUrl && <PostLink href={memory.instagramUrl} network="instagram" />}
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={isPlaying ? 'Mute sound' : 'Play sound'}
                  title={memory.sound.title}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-line bg-transparent px-3 py-1.5 font-mono text-[11px] text-text transition-colors hover:border-muted hover:text-bright"
                >
                  {isPlaying ? <Equalizer /> : <span aria-hidden="true">♪</span>}
                  <span className="max-[640px]:hidden">{isPlaying ? 'playing' : 'play sound'}</span>
                </button>
              </div>
            </>
          )}
        />
      )}
    </>
  );
}
