import { projects } from '../data/profile';

export default function GitHubActivity() {
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
              @raghavbhati
            </h3>
            <a
              className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] hover:bg-[#363636]"
              href="https://github.com/raghavbhati"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub ↗
            </a>
          </div>
          <p className="text-[11px] text-muted my-2 mb-[18px]">
            Explore my code and contribution history on GitHub. Live contribution counts are not
            connected here yet.
          </p>
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
                    className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] hover:bg-[#363636]"
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
