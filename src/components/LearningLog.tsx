import { useState } from 'react';
import { learningLogEntries } from '../data/learningLog';
export default function LearningLog() {
  const [index, setIndex] = useState(learningLogEntries.length - 1);
  const entry = learningLogEntries[index];
  const active = 20 + index * 3;
  return (
    <section className="learning-log" id="learning-log" aria-labelledby="log-heading">
      <div className="log-body">
        <h2 id="log-heading">Learning Log</h2>
        <p className="log-subtitle">Highlights from my learning and work.</p>
        <div className="log-entry" id="log-entry" aria-live="polite" aria-atomic="true">
          <h3>{entry.title}</h3>
          <ul className="log-list">
            {entry.items.map((item) => (
              <li key={item}>
                <span className="log-check" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="log-controls">
          <button
            className="log-arrow"
            type="button"
            aria-label="Previous learning log entry"
            aria-controls="log-entry"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            ←
          </button>
          <span className="log-date">{entry.period}</span>
          <button
            className="log-arrow"
            type="button"
            aria-label="Next learning log entry"
            aria-controls="log-entry"
            disabled={index === learningLogEntries.length - 1}
            onClick={() => setIndex((i) => Math.min(learningLogEntries.length - 1, i + 1))}
          >
            →
          </button>
        </div>
        <div className="log-wave" aria-hidden="true">
          {Array.from({ length: 47 }, (_, i) => (
            <span
              key={i}
              className={i === active ? 'active' : i > active + 7 ? 'future' : undefined}
              style={{ '--height': `${27 + 49 * Math.exp(-Math.pow((i - active) / 7, 2))}px` }}
            />
          ))}
        </div>
      </div>
      <blockquote className="log-takeaway">
        <p>{entry.takeaway}</p>
      </blockquote>
    </section>
  );
}
