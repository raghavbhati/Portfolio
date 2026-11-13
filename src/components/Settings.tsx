import { useEffect, useRef, useState } from 'react';
import { usePreferences } from './Preferences';
import { NAV_ITEM } from './navItem';

/**
 * Visitor preferences behind a gear in the header nav. Opens as a small panel under the
 * gear rather than a modal, so the page and its corner folders stay usable.
 */
export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const gear = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { preferences, update, reset, status } = usePreferences();

  function close() {
    setIsOpen(false);
    gear.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;
    panel.current?.focus();
    // Clicking anywhere else puts it away, without stealing focus from what was clicked.
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  return (
    <div
      ref={wrapper}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={gear}
        className={`grid h-full cursor-pointer place-items-center bg-transparent py-[3px] px-[7px] text-text ${NAV_ITEM} ${
          isOpen ? 'bg-tag text-bright' : ''
        }`}
        id="settings-open"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        type="button"
        aria-label="Open settings"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="settings-panel"
      >
        <svg
          className="h-[15px] w-[15px] max-[420px]:h-[14px] max-[420px]:w-[14px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      {isOpen && (
        <div
          ref={panel}
          id="settings-panel"
          role="dialog"
          aria-labelledby="settings-title"
          tabIndex={-1}
          className="memory-pop absolute top-[calc(100%+10px)] right-0 z-40 max-h-[calc(100dvh-160px)] w-[300px] max-w-[calc(100vw-32px)] origin-top-right overflow-auto rounded-[14px] border border-line bg-panel p-5 font-sans text-sm leading-normal text-text shadow-[0_15px_60px_#0003] focus:outline-none"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 font-sans text-base font-medium text-bright" id="settings-title">
              Settings
            </h2>
            <button
              className="cursor-pointer border-0 bg-transparent px-[5px] text-xl leading-none text-text"
              id="settings-close"
              onClick={close}
              aria-label="Close settings"
              type="button"
            >
              ×
            </button>
          </div>
          <fieldset className="border-0 p-0 m-0 min-w-0 pb-5 mb-5 border-b border-line">
            <legend className="block text-[11px] uppercase mb-3 tracking-[0.5px] text-secondary">
              Theme
            </legend>
            <label className="flex items-center gap-[10px] cursor-pointer py-[6px] px-0 text-text">
              <input
                className="accent-[#389df5]"
                type="radio"
                name="theme"
                value="dark"
                checked={preferences.theme === 'dark'}
                onChange={() => update('theme', 'dark')}
              />
              <span className="w-[18px] text-center text-[19px]" aria-hidden="true">
                ☾
              </span>{' '}
              Dark
            </label>
            <label className="flex items-center gap-[10px] cursor-pointer py-[6px] px-0 text-text">
              <input
                className="accent-[#389df5]"
                type="radio"
                name="theme"
                value="light"
                checked={preferences.theme === 'light'}
                onChange={() => update('theme', 'light')}
              />
              <span className="w-[18px] text-center text-[19px]" aria-hidden="true">
                ☼
              </span>{' '}
              Light
            </label>
            <label className="flex items-center gap-[10px] cursor-pointer py-[6px] px-0 text-text">
              <input
                className="accent-[#389df5]"
                type="radio"
                name="theme"
                value="system"
                checked={preferences.theme === 'system'}
                onChange={() => update('theme', 'system')}
              />
              <span className="w-[18px] text-center text-[19px]" aria-hidden="true">
                ▣
              </span>{' '}
              System
            </label>
          </fieldset>
          <div className="border-0 p-0 m-0 min-w-0 pb-5 mb-5 border-b border-line">
            <div>
              <span
                className="block text-[11px] uppercase mb-3 tracking-[0.5px] text-secondary"
                id="background-label"
              >
                Background colour
              </span>
              <div className="flex gap-[10px]" role="group" aria-labelledby="background-label">
                <button
                  className="w-[38px] h-[38px] rounded-full cursor-pointer border-2 border-[#777] bg-[#181818] aria-pressed:outline-2 aria-pressed:outline-[#389df5] aria-pressed:outline-offset-[3px]"
                  type="button"
                  data-background="neutral"
                  aria-label="Neutral background"
                  aria-pressed={preferences.background === 'neutral'}
                  onClick={() => update('background', 'neutral')}
                ></button>
                <button
                  className="w-[38px] h-[38px] rounded-full cursor-pointer border-2 border-[#777] bg-[#45352c] aria-pressed:outline-2 aria-pressed:outline-[#389df5] aria-pressed:outline-offset-[3px]"
                  type="button"
                  data-background="warm"
                  aria-label="Warm background"
                  aria-pressed={preferences.background === 'warm'}
                  onClick={() => update('background', 'warm')}
                ></button>
                <button
                  className="w-[38px] h-[38px] rounded-full cursor-pointer border-2 border-[#777] bg-[#263d51] aria-pressed:outline-2 aria-pressed:outline-[#389df5] aria-pressed:outline-offset-[3px]"
                  type="button"
                  data-background="blue"
                  aria-label="Blue background"
                  aria-pressed={preferences.background === 'blue'}
                  onClick={() => update('background', 'blue')}
                ></button>
                <button
                  className="w-[38px] h-[38px] rounded-full cursor-pointer border-2 border-[#777] bg-[#2e453b] aria-pressed:outline-2 aria-pressed:outline-[#389df5] aria-pressed:outline-offset-[3px]"
                  type="button"
                  data-background="green"
                  aria-label="Green background"
                  aria-pressed={preferences.background === 'green'}
                  onClick={() => update('background', 'green')}
                ></button>
              </div>
              <p className="text-[11px] text-muted mt-3 m-0">
                Colours adapt to your light or dark theme.
              </p>
            </div>
          </div>
          <button
            className="w-full bg-transparent cursor-pointer border border-line rounded-lg p-[10px] text-text hover:bg-control"
            id="settings-reset"
            onClick={reset}
            type="button"
          >
            ↺ &nbsp; Reset all
          </button>
          <p
            className="text-[11px] text-muted mt-[14px] m-0 min-h-[34px]"
            id="settings-status"
            role="status"
          >
            {status}
          </p>
        </div>
      )}
    </div>
  );
}
