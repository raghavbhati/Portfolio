import { useMemo, useState } from 'react';
import MemoryBoard from './MemoryBoard';
import MemoryFolder from './MemoryFolder';
import { memories } from '../data/memories';
import type { MemoryEvent } from '../data/memories';
import { latestMemoryId } from '../utils/memoryDate';
import { useMemoryDialog } from '../utils/useMemoryDialog';

interface MemoriesProps {
  defaultOpen?: boolean;
  events?: MemoryEvent[];
}

export default function Memories({ defaultOpen = false, events = memories }: MemoriesProps = {}) {
  // The board opens on the latest event until another one is brought up.
  const [chosenId, setChosenId] = useState<string | null>(null);
  const ids = useMemo(() => events.map((event) => event.id), [events]);
  const activeId =
    chosenId && ids.includes(chosenId) ? chosenId : latestMemoryId(events, (event) => event.date);
  const dialog = useMemoryDialog('memories', ids, defaultOpen, setChosenId);
  const count = `${events.length} ${events.length === 1 ? 'event' : 'events'}`;

  function close() {
    setChosenId(null);
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
          closeLabel="Close event memories"
          items={events}
          activeId={activeId}
          centerRatio="3:4"
          caption={(event) => event.title}
          describe={(event) => `${event.title}, ${event.date}`}
          onActivate={(event) => setChosenId(event.id)}
          onClose={close}
          details={(event) => ({ heading: event.title, when: event.date, text: event.description })}
        />
      )}
    </>
  );
}
