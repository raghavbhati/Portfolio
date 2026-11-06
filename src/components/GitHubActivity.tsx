import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { links } from '../data/profile';
import {
  GITHUB_LOGIN,
  PUBLIC_CONTRIBUTIONS_URL,
  calendarWeeks,
  contributionLevels,
  fromPublicContributions,
  isContributions,
  isPublicContributions,
} from '../utils/githubContributions';
import type { ContributionDay, Contributions } from '../utils/githubContributions';

type GraphState =
  | { status: 'loading' }
  | { status: 'ready'; data: Contributions }
  | { status: 'unavailable' };

const SKELETON_WEEKS = 53;
/** Day shades, from no contributions up to the busiest days. */
const SHADES = ['bg-tag', 'bg-string/25', 'bg-string/45', 'bg-string/70', 'bg-string'] as const;
/** Narrowest the calendar gets; on phones it scrolls sideways instead of shrinking further. */
const MIN_WIDTH = 520;
const GRID = 'grid grid-flow-col gap-[3px]';
const gridStyle = (weeks: number) => ({
  gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
  gridTemplateRows: 'repeat(7, auto)',
});

const formatDay = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
// en-US keeps every month to three letters (en-GB writes "Sept").
const monthOf = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
const plural = (count: number) => `${count} contribution${count === 1 ? '' : 's'}`;

async function loadContributions(signal: AbortSignal): Promise<Contributions | null> {
  // The site's own function first: it asks GitHub directly when GITHUB_TOKEN is set.
  try {
    const response = await fetch('/api/github-contributions', { signal });
    if (response.ok) {
      const data: unknown = await response.json();
      if (isContributions(data) && data.days.length > 0) return data;
    }
  } catch (error) {
    // Where the function isn't running, the dev server answers with the page itself.
    if (signal.aborted) throw error;
  }
  // Otherwise GitHub's public calendar, which needs no token.
  const response = await fetch(PUBLIC_CONTRIBUTIONS_URL, { signal });
  if (!response.ok) return null;
  const data: unknown = await response.json();
  if (!isPublicContributions(data)) return null;
  const contributions = fromPublicContributions(data);
  return contributions.days.length > 0 ? contributions : null;
}

function useContributions() {
  const [state, setState] = useState<GraphState>({ status: 'loading' });
  useEffect(() => {
    if (typeof fetch !== 'function') {
      setState({ status: 'unavailable' });
      return;
    }
    const controller = new AbortController();
    loadContributions(controller.signal)
      .then((data) => setState(data ? { status: 'ready', data } : { status: 'unavailable' }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'unavailable' });
      });
    return () => controller.abort();
  }, []);
  return state;
}

/** A year of GitHub contributions, a square a day, as GitHub draws it: a column per week. */
function ContributionGraph({ data }: { data: Contributions }) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const { days, total } = data;
  const weeks = calendarWeeks(days);
  const levelOf = contributionLevels(days);
  const busiest = days.reduce((best, day) => (day.count > best.count ? day : best), days[0]);
  const thisWeek = weeks[weeks.length - 1].reduce((sum, day) => sum + (day?.count ?? 0), 0);
  // A label over the week each month starts in; a sliver of a month at either end gets none.
  const firstDay = (week: Array<ContributionDay | null>) => week.find((day) => day !== null)!;
  const starts = weeks
    .map((week, index) => ({ index, label: monthOf(firstDay(week).date) }))
    .filter(({ label }, index, all) => index === 0 || label !== all[index - 1].label);
  const months = (starts.length > 1 && starts[1].index < 3 ? starts.slice(1) : starts).filter(
    ({ index }) => weeks.length - index >= 3
  );

  // A phone can't fit the whole year, so it shows the latest weeks, including after a
  // rotation or resize changes how much fits.
  useLayoutEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const showLatest = () => {
      element.scrollLeft = element.scrollWidth;
    };
    showLatest();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(showLatest);
    observer.observe(element);
    return () => observer.disconnect();
  }, [weeks.length]);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3 text-[11px] text-muted max-[580px]:flex-wrap">
        <span>
          <strong className="font-mono text-[13px] font-medium text-bright [body[data-theme=light]_&]:text-heading">
            {total.toLocaleString('en-IN')}
          </strong>{' '}
          contributions in the last year
        </span>
        <span className="font-mono" aria-live="polite">
          {hovered
            ? `${formatDay(hovered.date)} · ${plural(hovered.count)}`
            : `This week · ${plural(thisWeek)}`}
        </span>
      </div>
      <div ref={scroller} className="overflow-x-auto pb-1">
        <div style={{ minWidth: MIN_WIDTH }}>
          <div
            role="img"
            aria-label={`${plural(total)} on GitHub in the last year. Busiest day: ${formatDay(
              busiest.date
            )}, with ${plural(busiest.count)}.`}
            className={GRID}
            style={gridStyle(weeks.length)}
            onMouseLeave={() => setHovered(null)}
          >
            {weeks.flatMap((week, column) =>
              week.map((day, row) =>
                day ? (
                  <span
                    key={day.date}
                    title={`${formatDay(day.date)} · ${plural(day.count)}`}
                    onMouseEnter={() => setHovered(day)}
                    className={`aspect-square rounded-[2px] ${SHADES[levelOf(day.count)]} ${
                      hovered?.date === day.date ? 'ring-1 ring-bright' : ''
                    }`}
                  />
                ) : (
                  <span key={`${column}-${row}`} />
                )
              )
            )}
          </div>
          <div className="relative mt-2 h-4 font-mono text-[10px] text-muted" aria-hidden="true">
            {months.map(({ index, label }) => (
              <span
                key={`${label}-${index}`}
                className="absolute"
                style={{ left: `${(index / weeks.length) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="mt-1 flex items-center justify-end gap-[3px] font-mono text-[10px] text-muted"
        aria-hidden="true"
      >
        <span className="mr-1">Less</span>
        {SHADES.map((shade) => (
          <span key={shade} className={`h-[9px] w-[9px] rounded-[2px] ${shade}`} />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}

export default function GitHubActivity() {
  const graph = useContributions();

  return (
    <section
      className="-mx-6 max-[420px]:-mx-[18px]"
      id="github-activity"
      aria-labelledby="github-title"
    >
      <div
        className="h-[30px] border-y border-line opacity-65 max-[480px]:h-6 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_8px,var(--line)_8px,var(--line)_9px,transparent_9px,transparent_16px)]"
        aria-hidden="true"
      />
      <div className="border-b border-line px-6 pt-4 pb-[13px] max-[680px]:px-5">
        <h2
          className="m-0 font-sans font-medium text-[32px] leading-[1.15] -tracking-[1px] text-bright max-[420px]:text-[30px]"
          id="github-title"
        >
          GitHub Activity
        </h2>
      </div>
      <div className="p-6 max-[580px]:px-4 max-[580px]:py-5">
        <div className="border border-line rounded-[28px] bg-surface pt-[22px] px-[18px] pb-[18px] max-[580px]:rounded-[20px] max-[580px]:p-3 max-[580px]:pt-[18px]">
          <div className="flex items-center flex-wrap gap-3">
            <h3 className="m-0 text-bright font-sans font-semibold text-[19px] leading-[1.4] max-[580px]:text-base">
              @{GITHUB_LOGIN}
            </h3>
            <a
              className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-line px-1 py-[1px] text-[#ccc] transition-[border-color] hover:border-muted"
              href={links.github}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub ↗
            </a>
          </div>
          <div className="mt-4 rounded-[20px] border border-line bg-bg px-4 pt-4 pb-2 max-[580px]:px-3">
            {graph.status === 'ready' && <ContributionGraph data={graph.data} />}
            {graph.status === 'loading' && (
              <div
                className="overflow-hidden pb-1 motion-safe:animate-pulse"
                aria-label="Loading contribution graph"
                role="status"
              >
                <div className={GRID} style={{ ...gridStyle(SKELETON_WEEKS), minWidth: MIN_WIDTH }}>
                  {Array.from({ length: SKELETON_WEEKS * 7 }, (_, index) => (
                    <span key={index} className="aspect-square rounded-[2px] bg-tag" />
                  ))}
                </div>
              </div>
            )}
            {graph.status === 'unavailable' && (
              <p className="m-0 pb-2 text-[11px] text-muted">
                Contribution graph is unavailable right now. The full history is on GitHub.
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        className="h-[30px] border-t border-line opacity-65 max-[480px]:h-6 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_8px,var(--line)_8px,var(--line)_9px,transparent_9px,transparent_16px)]"
        aria-hidden="true"
      />
    </section>
  );
}
