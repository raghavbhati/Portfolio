import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { usePreferences } from './Preferences';
import { NAV_ITEM } from './navItem';
import { email, links, resumeUrl } from '../data/profile';

type Group = 'Go to' | 'Open' | 'Actions' | 'Theme';

interface Command {
  id: string;
  group: Group;
  label: string;
  /** Extra words people might type, e.g. "work" for Experience. */
  keywords?: string;
  hint?: string;
  disabled?: boolean;
  /** Return true to keep the palette open afterwards. */
  run: () => boolean | void;
}

const GROUPS: Group[] = ['Go to', 'Open', 'Actions', 'Theme'];
const SECTIONS: Array<[id: string, label: string, keywords: string]> = [
  ['about', 'About', 'intro home'],
  ['experience', 'Experience', 'work ideaclan fabfunnel job'],
  ['stack', 'Stack', 'skills tools tech'],
  ['projects', 'Projects', 'built work'],
  ['education', 'Education', 'certifications masai university'],
  ['github-activity', 'GitHub activity', 'contributions code repositories'],
  ['learning-log', 'Learning log', 'journey'],
  ['footer', 'Contact', 'email social connect'],
];
const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
const SHORTCUT = IS_MAC ? '⌘K' : 'Ctrl K';

function goTo(id: string) {
  // No behaviour given, so it follows the page's smooth scrolling and reduced-motion rules.
  document.getElementById(id)?.scrollIntoView();
  window.history.replaceState(null, '', `#${id}`);
}

function openTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function isTyping(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return (
    !!element &&
    (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName))
  );
}

/** Every word typed must appear; labels that start with the query come first. */
function search(commands: Command[], query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return commands;
  const q = query.trim().toLowerCase();
  return commands
    .filter((command) => {
      const haystack = `${command.label} ${command.group} ${command.keywords ?? ''}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    })
    .sort(
      (a, b) =>
        Number(b.label.toLowerCase().startsWith(q)) - Number(a.label.toLowerCase().startsWith(q))
    );
}

/**
 * ⌘K / Ctrl+K (or "/") opens a small command palette: jump to a section, open the memory
 * boards or profiles, copy the email address, switch theme.
 */
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  function open() {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    // After the dialog is gone; until then the rest of the page is inert.
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const toggle = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const slash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;
      if (!toggle && !slash) return;
      if (isOpen) {
        if (toggle) {
          event.preventDefault();
          close();
        }
        return;
      }
      // Leave typing alone, and don't stack on top of a memory board.
      if ((slash && isTyping(event.target)) || document.querySelector('dialog[open]')) return;
      event.preventDefault();
      open();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open command palette"
        aria-haspopup="dialog"
        aria-keyshortcuts={IS_MAC ? 'Meta+K' : 'Control+K'}
        className={`cursor-pointer bg-transparent py-[3px] px-[7px] font-mono text-[11px] text-muted hover:text-bright max-[680px]:hidden ${NAV_ITEM}`}
      >
        {SHORTCUT}
      </button>
      {isOpen && <Palette onClose={close} />}
    </>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const optionId = (command: Command) => `${listId}-${command.id}`;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<'yes' | 'failed' | null>(null);
  const { preferences, update } = usePreferences();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // Only once the dialog is open can anything inside it take focus.
    inputRef.current?.focus();
  }, []);

  function copyEmail() {
    const write = navigator.clipboard?.writeText(email);
    if (!write) {
      setCopied('failed');
      return true;
    }
    write.then(
      () => {
        setCopied('yes');
        window.setTimeout(onClose, 700);
      },
      () => setCopied('failed')
    );
    return true;
  }

  const theme = (value: 'dark' | 'light' | 'system', label: string): Command => ({
    id: `theme-${value}`,
    group: 'Theme',
    label: `${label} theme`,
    keywords: 'appearance mode colour color',
    hint: preferences.theme === value ? 'current' : undefined,
    run: () => update('theme', value),
  });

  const commands: Command[] = [
    ...SECTIONS.map(
      ([id, label, keywords]): Command => ({
        id: `go-${id}`,
        group: 'Go to',
        label,
        keywords,
        hint: `#${id}`,
        run: () => goTo(id),
      })
    ),
    {
      id: 'open-travel',
      group: 'Open',
      label: 'Travel memories',
      keywords: 'trips places photos board',
      run: () => {
        window.location.hash = 'travel-memory';
      },
    },
    {
      id: 'open-events',
      group: 'Open',
      label: 'Event memories',
      keywords: 'conferences hackathons photos board',
      run: () => {
        window.location.hash = 'memories';
      },
    },
    {
      id: 'open-resume',
      group: 'Open',
      label: 'Resume',
      keywords: 'cv pdf',
      hint: resumeUrl ? '↗' : 'currently not available',
      disabled: !resumeUrl,
      run: () => {
        if (resumeUrl) openTab(resumeUrl);
      },
    },
    {
      id: 'open-github',
      group: 'Open',
      label: 'GitHub',
      keywords: 'code',
      hint: '↗',
      run: () => openTab(links.github),
    },
    {
      id: 'open-linkedin',
      group: 'Open',
      label: 'LinkedIn',
      hint: '↗',
      run: () => openTab(links.linkedin),
    },
    { id: 'open-x', group: 'Open', label: 'X (Twitter)', hint: '↗', run: () => openTab(links.x) },
    {
      id: 'copy-email',
      group: 'Actions',
      label: 'Copy email address',
      keywords: 'contact mail clipboard',
      hint: copied === 'yes' ? 'Copied' : copied === 'failed' ? 'Copy blocked' : email,
      run: copyEmail,
    },
    {
      id: 'send-email',
      group: 'Actions',
      label: 'Send an email',
      keywords: 'contact mail hire',
      run: () => {
        window.location.href = `mailto:${email}`;
      },
    },
    theme('dark', 'Dark'),
    theme('light', 'Light'),
    theme('system', 'System'),
  ];

  const results = search(commands, query);
  // Shown grouped, so the keyboard order follows the groups too.
  const ordered = GROUPS.flatMap((group) => results.filter((command) => command.group === group));
  const current = ordered[Math.min(active, ordered.length - 1)];

  useEffect(() => {
    if (current) document.getElementById(optionId(current))?.scrollIntoView?.({ block: 'nearest' });
  });

  function run(command: Command | undefined) {
    if (!command || command.disabled) return;
    const keepOpen = command.run();
    if (!keepOpen) onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (ordered.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive(
        (index) => (Math.min(index, ordered.length - 1) + step + ordered.length) % ordered.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(current);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-start justify-center border-0 bg-transparent p-4 pt-[14vh] text-text open:flex backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="memory-pop w-full max-w-[560px] origin-top overflow-hidden rounded-[14px] border border-line bg-panel font-sans shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg
            className="h-4 w-4 shrink-0 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={current ? optionId(current) : undefined}
            aria-label="Search commands"
            placeholder="Type a command or search…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-12 min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] text-bright outline-none placeholder:text-muted [body[data-theme=light]_&]:text-heading"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
            esc
          </kbd>
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Commands"
          className="max-h-[min(360px,50vh)] overflow-y-auto p-2"
        >
          {ordered.length === 0 && (
            <p className="m-0 px-2.5 py-6 text-center text-[13px] text-muted">
              No matches for “{query.trim()}”.
            </p>
          )}
          {GROUPS.map((group) => {
            const items = ordered.filter((command) => command.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} role="group" aria-label={group}>
                <div
                  className="px-2.5 pt-2 pb-1 text-[10px] uppercase tracking-[0.5px] text-secondary"
                  aria-hidden="true"
                >
                  {group}
                </div>
                {items.map((command) => {
                  const isActive = command === current;
                  return (
                    <div
                      key={command.id}
                      id={optionId(command)}
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={command.disabled || undefined}
                      onMouseMove={() => setActive(ordered.indexOf(command))}
                      onClick={() => run(command)}
                      className={`flex items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-[13px] ${
                        command.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } ${
                        isActive
                          ? 'bg-tag text-bright [body[data-theme=light]_&]:text-heading'
                          : 'text-text'
                      }`}
                    >
                      <span className="truncate">{command.label}</span>
                      {command.hint && (
                        <span className="shrink-0 truncate font-mono text-[11px] text-muted">
                          {command.hint}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-muted">
          <span>↑↓ move · ↵ open · esc close</span>
          <span>{SHORTCUT}</span>
        </div>
      </div>
    </dialog>
  );
}
