import type { KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { contributions, leadingDays, months } from '../data/contributions';
export default function GitHubActivity() {
  const [selected, setSelected] = useState<number | null>(null);
  const [focused, setFocused] = useState(contributions.length - 1);
  const [description, setDescription] = useState('Select a day to see its sample activity.');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowLeft: -7,
      ArrowRight: 7,
      ArrowUp: -1,
      ArrowDown: 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(contributions.length - 1, index + moves[event.key]));
    setFocused(next);
    refs.current[next]?.focus();
  }
  return (
    <section className="github-section" id="github-activity" aria-labelledby="github-title">
      <div className="stack-stripe" aria-hidden="true" />
      <div className="stack-header">
        <h2 id="github-title">GitHub Activity</h2>
      </div>
      <div className="github-inset">
        <div className="github-card">
          <div className="github-heading">
            <h3>
              {contributions.reduce((sum, day) => sum + day.count, 0).toLocaleString()} sample
              contributions in 2026
            </h3>
            <span className="github-sample">Sample data</span>
          </div>
          <p className="github-caption">
            A preview of the contribution calendar. Connect your GitHub data to show real activity.
          </p>
          <div
            className="github-calendar"
            tabIndex={0}
            role="region"
            aria-label="Sample contribution calendar. Scroll horizontally to explore dates."
          >
            <div
              className="github-months"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(
                  (leadingDays + contributions.length) / 7
                )},1fr)`,
              }}
              aria-hidden="true"
            >
              {months.map((month) => (
                <span key={month.label} style={{ gridColumn: month.column, gridRow: 1 }}>
                  {month.label}
                </span>
              ))}
            </div>
            <div className="github-grid" aria-label="Daily sample contributions">
              {Array.from({ length: leadingDays }, (_, i) => (
                <span key={`blank-${i}`} />
              ))}
              {contributions.map((day, index) => (
                <button
                  key={day.date}
                  ref={(el) => {
                    refs.current[index] = el;
                  }}
                  type="button"
                  className="github-cell"
                  data-level={day.level}
                  title={day.label}
                  aria-label={day.label}
                  aria-pressed={selected === index}
                  tabIndex={focused === index ? 0 : -1}
                  onMouseEnter={() => setDescription(day.label)}
                  onFocus={() => {
                    setFocused(index);
                    setDescription(day.label);
                  }}
                  onClick={() => {
                    setSelected(index);
                    setFocused(index);
                    setDescription(day.label);
                  }}
                  onKeyDown={(event) => navigate(event, index)}
                />
              ))}
            </div>
          </div>
          <div className="github-key">
            <span role="status">{description}</span>
            <span className="github-legend" aria-label="Contribution intensity from less to more">
              Less{' '}
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} data-level={i} />
              ))}{' '}
              More
            </span>
          </div>
          <details className="github-repos">
            <summary>
              <span>Top contributions in:</span>
              <span className="repo-avatars" aria-hidden="true">
                <i>A</i>
                <i>B</i>
                <i>C</i>
              </span>
              <span className="repo-chevron" aria-hidden="true">
                ⌄
              </span>
            </summary>
            <ul>
              {['Alpha', 'Beta', 'Gamma'].map((name) => (
                <li key={name}>
                  <span>Project {name}</span>
                  <span>Example repository</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
      <div className="stack-stripe" aria-hidden="true" />
    </section>
  );
}
