import { useEffect, useState } from 'react';
import { usePreferences } from './Preferences';

export default function FooterClock() {
  const { preferences } = usePreferences();
  const [now, setNow] = useState(() => new Date());
  const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const zone = preferences.timezone === 'local' ? deviceZone : preferences.timezone;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const label =
    zone === 'Asia/Kolkata' ? 'India' : (zone.split('/').pop() || 'UTC').replaceAll('_', ' ');

  return (
    <div className="grid text-right text-[11px] gap-[5px] max-[580px]:text-left">
      <span className="flex items-center justify-end gap-[5px] max-[580px]:justify-start">
        <svg
          className="w-[13px] h-[13px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span id="visitor-region">
          {deviceZone.replaceAll('_', ' ').split('/').reverse().join(' · ')}
        </span>
      </span>
      <span className="text-[10px] text-muted">Based on your device timezone</span>
      <span className="text-text [font-variant-numeric:tabular-nums]">
        <span id="timezone-label">{label}</span> ·{' '}
        <time id="local-time" className="font-mono" dateTime={now.toISOString()}>
          {new Intl.DateTimeFormat('en-IN', {
            timeZone: zone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(now)}
        </time>
      </span>
    </div>
  );
}
