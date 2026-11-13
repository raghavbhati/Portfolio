import { useMemo, useState } from 'react';
import MemoryBoard from './MemoryBoard';
import MemoryFolder from './MemoryFolder';
import { travelMemories } from '../data/travelMemories';
import type { TravelMemory as TravelMemoryItem } from '../data/travelMemories';
import { latestMemoryId } from '../utils/memoryDate';
import { useMemoryDialog } from '../utils/useMemoryDialog';

interface TravelMemoryProps {
  defaultOpen?: boolean;
  memories?: TravelMemoryItem[];
}

/** The place without its region, to fit under a photo: "Rohtang Pass, Himachal Pradesh" → "Rohtang Pass". */
const place = (memory: TravelMemoryItem) => memory.location.split(',')[0].trim();

export default function TravelMemory({
  defaultOpen = false,
  memories = travelMemories,
}: TravelMemoryProps = {}) {
  // The board opens on the latest trip until another one is brought up.
  const [chosenId, setChosenId] = useState<string | null>(null);
  const ids = useMemo(() => memories.map((memory) => memory.id), [memories]);
  const activeId =
    chosenId && ids.includes(chosenId)
      ? chosenId
      : latestMemoryId(memories, (memory) => memory.dates);
  const dialog = useMemoryDialog('travel-memory', ids, defaultOpen, setChosenId);

  function close() {
    setChosenId(null);
    dialog.close();
  }

  return (
    <>
      <MemoryFolder
        id="travel-memory"
        side="left"
        title="Travel"
        meta={`${memories.length} places`}
        photos={memories.slice(0, 3).map(({ photos: [first] }) => first.thumb ?? first.src)}
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
          closeLabel="Close travel memories"
          items={memories}
          activeId={activeId}
          caption={place}
          describe={(memory) => `${memory.location}, ${memory.dates}`}
          onActivate={(memory) => setChosenId(memory.id)}
          onClose={close}
          details={(memory) => ({
            heading: memory.location,
            when: memory.dates,
            text: memory.experience,
            post: memory.instagramUrl
              ? { href: memory.instagramUrl, label: 'See dump on Instagram' }
              : undefined,
          })}
        />
      )}
    </>
  );
}
