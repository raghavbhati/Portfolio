import { useEffect, useState } from 'react';
import { links, projects } from '../data/profile';
import { GITHUB_LOGIN, isContributions } from '../utils/githubContributions';
import type { Contributions } from '../utils/githubContributions';

type GraphState =
  | { status: 'loading' }
  | { status: 'ready'; data: Contributions }
  | { status: 'unavailable' };

const SKELETON_WEEKS = 53;

const formatWeek = (start: string) =>
  new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
// en-US keeps every month to three letters (en-GB writes "Sept").
const monthOf = (start: string) =>
  new Date(start).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
const plural = (count: number) => `${count} contribution${count === 1 ? '' : 's'}`;

function useContributions() {
  const [state, setState] = useState<GraphState>({ status: 'loading' });
  useEffect(() => {
    if (typeof fetch !== 'function') {
      setState({ status: 'unavailable' });
      return;
    }
    const controller = new AbortController();
    fetch('/api/github-contributions', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: unknown) =>
        setState(
          isContributions(data) && data.weeks.length > 0
            ? { status: 'ready', data }
            : { status: 'unavailable' }
        )
      )
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'unavailable' });
      });
    return () => controller.abort();
  }, []);
  return state;
}

/** A year of GitHub contributions as weekly bars, in the Learning Log's bar style. */
function ContributionGraph({ data }: { data: Contributions }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { weeks, total } = data;
  const busiest = Math.max(1, ...weeks.map((week) => week.count));
  const peak = weeks.reduce((best, week) => (week.count > best.count ? week : best), weeks[0]);
  const thisWeek = weeks[weeks.length - 1];
  const focus = hovered === null ? null : weeks[hovered];
  // A label wherever a new month starts; a sliver of a month at the start gets none.
  const starts = weeks
    .map((week, index) => ({ index, label: monthOf(week.start) }))
    .filter(({ index, label }) => index === 0 || label !== monthOf(weeks[index - 1].start));
  const months = starts.length > 1 && starts[1].index < 3 ? starts.slice(1) : starts;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3 text-[11px] text-muted">
        <span>
          <strong className="font-mono text-[13px] font-medium text-bright [body[data-theme=light]_&]:text-heading">
            {total.toLocaleString('en-IN')}
          </strong>{' '}
          contributions in the last year
        </span>
        <span className="font-mono" aria-live="polite">
          {focus
            ? `Week of ${formatWeek(focus.start)} · ${plural(focus.count)}`
            : `This week · ${plural(thisWeek.count)}`}
        </span>
      </div>
      <div
        role="img"
        aria-label={`${plural(total)} on GitHub in the last year. Busiest week: ${formatWeek(
          peak.start
        )}, with ${plural(peak.count)}.`}
        className="flex h-[92px] items-end justify-between"
        onMouseLeave={() => setHovered(null)}
      >
        {weeks.map((week, index) => {
          const isThisWeek = index === weeks.length - 1;
          const empty = week.count === 0;
          return (
            <span
              key={week.start}
              title={`Week of ${formatWeek(week.start)} · ${plural(week.count)}`}
              onMouseEnter={() => setHovered(index)}
              className={`w-[5px] rounded-t-[5px] transition-colors duration-150 max-[580px]:w-[3px] ${
                isThisWeek
                  ? 'bg-string'
                  : empty
                  ? 'bg-[radial-gradient(circle,var(--tag)_2px,transparent_2.5px)_center_bottom/5px_9px_repeat-y]'
                  : hovered === index
                  ? 'bg-bright'
                  : 'bg-muted/45'
              }`}
              style={{ height: empty ? 18 : 10 + (week.count / busiest) * 78 }}
            />
          );
        })}
      </div>
      <div className="relative mt-2 h-4 font-mono text-[10px] text-muted" aria-hidden="true">
        {months.map(({ index, label }, position) => (
          <span
            key={`${label}-${index}`}
            className={`absolute -translate-x-1/2 ${position % 2 ? 'max-[580px]:hidden' : ''}`}
            style={{ left: `${(index / Math.max(1, weeks.length - 1)) * 100}%` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function GitHubActivity() {
  const graph = useContributions();

  return (
    <section
      className="mb-12 -mx-6 max-[420px]:-mx-[18px]"
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
        <div className="border border-line rounded-[28px] bg-surface pt-[22px] px-[18px] pb-[14px] max-[580px]:rounded-[20px] max-[580px]:p-3 max-[580px]:pt-[18px]">
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
          <div className="mt-4 mb-[18px] rounded-[20px] border border-line bg-bg px-4 pt-4 pb-2 max-[580px]:px-3">
            {graph.status === 'ready' && <ContributionGraph data={graph.data} />}
            {graph.status === 'loading' && (
              <div
                className="flex h-[92px] items-end justify-between motion-safe:animate-pulse"
                aria-label="Loading contribution graph"
                role="status"
              >
                {Array.from({ length: SKELETON_WEEKS }, (_, index) => (
                  <span
                    key={index}
                    className="h-[10px] w-[5px] rounded-t-[5px] bg-tag max-[580px]:w-[3px]"
                  />
                ))}
              </div>
            )}
            {graph.status === 'unavailable' && (
              <p className="m-0 pb-2 text-[11px] text-muted">
                Contribution graph is unavailable right now. The full history is on GitHub.
              </p>
            )}
          </div>
          <details className="group rounded-[20px] border border-line bg-bg" open>
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm px-4 py-[14px] text-text max-[580px]:px-[10px] max-[580px]:py-3 max-[580px]:text-xs max-[580px]:gap-2 [&::-webkit-details-marker]:hidden">
              <span>Project repositories</span>
              <span
                className="grid place-items-center rounded-full w-[26px] h-[26px] border border-line transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ⌄
              </span>
            </summary>
            <ul className="list-none m-0 px-4 pb-3">
              {projects.map((project) => (
                <li
                  className="flex justify-between text-xs gap-[10px] border-t border-line py-[10px] text-text"
                  key={project.name}
                >
                  <a
                    className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-line px-1 py-[1px] text-[#ccc] transition-[border-color] hover:border-muted"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
      <div
        className="h-[30px] border-y border-line opacity-65 max-[480px]:h-6 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_8px,var(--line)_8px,var(--line)_9px,transparent_9px,transparent_16px)]"
        aria-hidden="true"
      />
    </section>
  );
}
