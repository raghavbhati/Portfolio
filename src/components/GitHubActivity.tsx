import { projects } from '../data/profile';
export default function GitHubActivity() {
  return (
    <section className="github-section" id="github-activity" aria-labelledby="github-title">
      <div className="stack-stripe" aria-hidden="true" />
      <div className="stack-header">
        <h2 id="github-title">GitHub Activity</h2>
      </div>
      <div className="github-inset">
        <div className="github-card">
          <div className="github-heading">
            <h3>@raghavbhatirv</h3>
            <a
              className="inline-link"
              href="https://github.com/raghavbhatirv"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub ↗
            </a>
          </div>
          <p className="github-caption">
            Explore my code and contribution history on GitHub. Live contribution counts are not
            connected here yet.
          </p>
          <details className="github-repos" open>
            <summary>
              <span>Project repositories</span>
              <span className="repo-chevron" aria-hidden="true">
                ⌄
              </span>
            </summary>
            <ul>
              {projects.map((project) => (
                <li key={project.name}>
                  <a className="inline-link" href={project.github} target="_blank" rel="noreferrer">
                    {project.name} ↗
                  </a>
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
