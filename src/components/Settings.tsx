import type { MouseEvent } from 'react';
import { useRef } from 'react';
import { usePreferences } from './Preferences';

export default function Settings() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { preferences, update, reset, status } = usePreferences();

  function closeBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (!dialog.current || event.target !== dialog.current) return;
    const r = dialog.current.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.current?.close();
  }

  return (
    <>
      <button
        className="fixed z-10 flex items-center cursor-pointer left-6 top-6 border border-line bg-panel text-bright rounded-xl py-[11px] px-[14px] gap-[9px] shadow-[0_4px_20px_#0001] max-[1100px]:left-3 max-[1100px]:top-auto max-[1100px]:bottom-5 max-[1100px]:p-3 max-[680px]:left-auto max-[680px]:right-4 max-[680px]:bottom-[18px] max-[680px]:rounded-full max-[680px]:w-[46px] max-[680px]:h-[46px] max-[680px]:justify-center"
        id="settings-open"
        onClick={() => dialog.current?.showModal()}
        type="button"
        aria-label="Open sidebar settings"
        aria-haspopup="dialog"
        aria-controls="settings-dialog"
      >
        <svg
          className="w-[18px] h-[18px] max-[680px]:hidden"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <path d="M9 4v16M5.5 8h1M5.5 12h1"></path>
        </svg>
        <svg
          className="w-[18px] h-[18px] hidden max-[680px]:block"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 1 3h4l1-3 3-1 2-3-2-2 1-3-3-2-1-3z"></path>
          <circle cx="10.5" cy="11.5" r="3"></circle>
        </svg>
        <span className="max-[1100px]:hidden">Open sidebar</span>
      </button>
      <dialog
        className="fixed m-0 overflow-auto inset-[16px_auto_16px_20px] w-[300px] max-w-[calc(100vw-32px)] h-[calc(100dvh-32px)] max-h-[calc(100dvh-32px)] border border-line rounded-[18px] p-6 bg-panel text-text shadow-[0_15px_60px_#0003] font-sans text-sm leading-normal backdrop:bg-[#0005] backdrop:backdrop-blur-[2px] max-[680px]:inset-[12px_auto_12px_12px] max-[680px]:h-[calc(100dvh-24px)] max-[680px]:max-h-[calc(100dvh-24px)] max-[680px]:w-[310px] max-[680px]:p-[22px]"
        id="settings-dialog"
        ref={dialog}
        onClick={closeBackdrop}
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between mb-[22px]">
          <h2 className="m-0 font-sans font-medium text-xl text-bright" id="settings-title">
            Sidebar
          </h2>
          <button
            className="border-0 bg-transparent cursor-pointer text-2xl text-text px-[5px]"
            id="settings-close"
            onClick={() => dialog.current?.close()}
            aria-label="Close settings"
            type="button"
          >
            ×
          </button>
        </div>
        <fieldset className="border-0 p-0 m-0 min-w-0 pb-6 mb-6 border-b border-line">
          <legend className="block text-[11px] uppercase mb-3 tracking-[0.5px] text-secondary">
            Theme
          </legend>
          <label className="flex items-center gap-[10px] cursor-pointer py-[9px] px-0 text-text">
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
          <label className="flex items-center gap-[10px] cursor-pointer py-[9px] px-0 text-text">
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
          <label className="flex items-center gap-[10px] cursor-pointer py-[9px] px-0 text-text">
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
        <div className="border-0 p-0 m-0 min-w-0 pb-6 mb-6 border-b border-line">
          <div>
            <label
              className="block text-[11px] uppercase mb-3 tracking-[0.5px] text-secondary"
              htmlFor="settings-font"
            >
              Font
            </label>
            <select
              className="w-full p-[10px] bg-control text-bright border border-line rounded-lg font-sans text-[13px]"
              id="settings-font"
              value={preferences.font}
              onChange={(event) => update('font', event.target.value)}
            >
              <option value="editorial">Editorial · original</option>
              <option value="sans">Modern sans-serif</option>
              <option value="serif">Classic serif</option>
              <option value="mono">Monospace</option>
            </select>
          </div>
          <div className="mt-5">
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
        <div className="border-0 p-0 m-0 min-w-0 pb-6 mb-6 border-b border-line">
          <label
            className="block text-[11px] uppercase mb-3 tracking-[0.5px] text-secondary"
            htmlFor="settings-timezone"
          >
            Timezone
          </label>
          <select
            className="w-full p-[10px] bg-control text-bright border border-line rounded-lg font-sans text-[13px]"
            id="settings-timezone"
            value={preferences.timezone}
            onChange={(event) => update('timezone', event.target.value)}
          >
            <option value="Asia/Kolkata">India · Kolkata</option>
            <option value="local">Your device timezone</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York</option>
            <option value="America/Los_Angeles">Los Angeles</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Dubai">Dubai</option>
            <option value="Asia/Singapore">Singapore</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Australia/Sydney">Sydney</option>
          </select>
          <p className="text-[11px] text-muted mt-3 m-0">
            Updates the footer clock. Learning log dates stay as written.
          </p>
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
      </dialog>
    </>
  );
}
