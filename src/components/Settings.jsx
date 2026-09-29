import { useRef } from 'react';
import { usePreferences } from './Preferences';
export default function Settings() {
  const dialog = useRef(null);
  const { preferences, update, reset, status } = usePreferences();
  function closeBackdrop(event) {
    if (event.target !== dialog.current) return;
    const r = dialog.current.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.current.close();
  }
  return (
    <>
      <button
        className="settings-launch"
        id="settings-open"
        onClick={() => dialog.current.showModal()}
        type="button"
        aria-label="Open sidebar settings"
        aria-haspopup="dialog"
        aria-controls="settings-dialog"
      >
        <svg
          className="desktop-sidebar"
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
          className="mobile-gear"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 1 3h4l1-3 3-1 2-3-2-2 1-3-3-2-1-3z"></path>
          <circle cx="10.5" cy="11.5" r="3"></circle>
        </svg>
        <span className="launch-label">Open sidebar</span>
      </button>
      <dialog
        className="settings-dialog"
        id="settings-dialog"
        ref={dialog}
        onClick={closeBackdrop}
        aria-labelledby="settings-title"
      >
        <div className="settings-heading">
          <h2 id="settings-title">Sidebar</h2>
          <button
            className="settings-close"
            id="settings-close"
            onClick={() => dialog.current.close()}
            aria-label="Close settings"
            type="button"
          >
            ×
          </button>
        </div>
        <fieldset className="settings-group">
          <legend>Theme</legend>
          <label className="theme-choice">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={preferences.theme === 'dark'}
              onChange={() => update('theme', 'dark')}
            />
            <span className="theme-symbol" aria-hidden="true">
              ☾
            </span>{' '}
            Dark
          </label>
          <label className="theme-choice">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={preferences.theme === 'light'}
              onChange={() => update('theme', 'light')}
            />
            <span className="theme-symbol" aria-hidden="true">
              ☼
            </span>{' '}
            Light
          </label>
          <label className="theme-choice">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={preferences.theme === 'system'}
              onChange={() => update('theme', 'system')}
            />
            <span className="theme-symbol" aria-hidden="true">
              ▣
            </span>{' '}
            System
          </label>
        </fieldset>
        <div className="settings-group">
          <div className="setting-block">
            <label className="settings-label" htmlFor="settings-font">
              Font
            </label>
            <select
              className="settings-select"
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
          <div className="setting-block">
            <span className="settings-label" id="background-label">
              Background colour
            </span>
            <div className="swatches" role="group" aria-labelledby="background-label">
              <button
                className="swatch"
                type="button"
                data-background="neutral"
                aria-label="Neutral background"
                aria-pressed={preferences.background === 'neutral'}
                onClick={() => update('background', 'neutral')}
                style={{ '--swatch': '#181818' }}
              ></button>
              <button
                className="swatch"
                type="button"
                data-background="warm"
                aria-label="Warm background"
                aria-pressed={preferences.background === 'warm'}
                onClick={() => update('background', 'warm')}
                style={{ '--swatch': '#45352c' }}
              ></button>
              <button
                className="swatch"
                type="button"
                data-background="blue"
                aria-label="Blue background"
                aria-pressed={preferences.background === 'blue'}
                onClick={() => update('background', 'blue')}
                style={{ '--swatch': '#263d51' }}
              ></button>
              <button
                className="swatch"
                type="button"
                data-background="green"
                aria-label="Green background"
                aria-pressed={preferences.background === 'green'}
                onClick={() => update('background', 'green')}
                style={{ '--swatch': '#2e453b' }}
              ></button>
            </div>
            <p className="settings-help">Colours adapt to your light or dark theme.</p>
          </div>
        </div>
        <div className="settings-group">
          <label className="settings-label" htmlFor="settings-timezone">
            Timezone
          </label>
          <select
            className="settings-select"
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
          <p className="settings-help">
            Updates the footer clock. Learning log dates stay as written.
          </p>
        </div>
        <button className="settings-reset" id="settings-reset" onClick={reset} type="button">
          ↺   Reset all
        </button>
        <p className="settings-status" id="settings-status" role="status">
          {status}
        </p>
      </dialog>
    </>
  );
}
