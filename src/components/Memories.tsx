import { useMemo, useState } from 'react';
import MemoryBoard, { PostLink } from './MemoryBoard';
import MemoryFolder from './MemoryFolder';
import { memories } from '../data/memories';
import type { MemoryEvent } from '../data/memories';
import { useMemoryDialog } from '../utils/useMemoryDialog';

interface MemoriesProps {
  defaultOpen?: boolean;
  events?: MemoryEvent[];
}

export default function Memories({ defaultOpen = false, events = memories }: MemoriesProps = {}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ids = useMemo(() => events.map((event) => event.id), [events]);
  const dialog = useMemoryDialog('memories', ids, defaultOpen, setActiveId);
  const count = `${events.length} ${events.length === 1 ? 'event' : 'events'}`;

  function close() {
    setActiveId(null);
    dialog.close();
  }

  return (
    <>
      <MemoryFolder
        id="memories"
        side="right"
        title="Events"
        meta={count}
        photos={events.slice(0, 3).map((event) => event.photos[0].src)}
        label="Open event memories"
        expanded={dialog.isOpen}
        onOpen={dialog.open}
        buttonRef={dialog.triggerRef}
      />

      {dialog.isOpen && (
        <MemoryBoard
          titleId="memories-title"
          title="Event Memories"
          subtitle="conferences & hackathons, on a string"
          meta={count}
          prompt="see what it was like"
          closeLabel="Close event memories"
          items={events}
          activeId={activeId}
          centerRatio="3:4"
          allowRatioToggle
          describe={(event) => `${event.label}, ${event.title}`}
          onActivate={(event) => setActiveId(event.id)}
          onEject={() => setActiveId(null)}
          onClose={close}
          renderDetails={(event) => (
            <>
              <div className="min-w-0">
                <p className="m-0 truncate text-[13px] text-bright [body[data-theme=light]_&]:text-heading">
                  {event.title}
                  <span className="text-muted">
                    {' '}
                    · {event.organization} · {event.date}
                  </span>
                </p>
                <p className="m-0 mt-0.5 truncate text-xs text-muted">{event.highlight}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {event.linkedInUrl && <PostLink href={event.linkedInUrl} network="linkedin" />}
                {event.twitterUrl && <PostLink href={event.twitterUrl} network="twitter" />}
              </div>
            </>
          )}
        />
      )}
    </>
  );
}
