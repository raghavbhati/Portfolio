import { projects, stack } from './data/profile';
import Settings from './components/Settings';
import LearningLog from './components/LearningLog';
import GitHubActivity from './components/GitHubActivity';
import FooterClock from './components/FooterClock';
import { PreferencesProvider } from './components/Preferences';
import './App.css';
export default function App() {
  return (
    <PreferencesProvider>
      <Settings></Settings>

      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="page">
        <header>
          <a className="avatar" href="#about" aria-label="Back to introduction">
            RB
          </a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#github-activity">GitHub</a>
          </nav>
        </header>
        <main id="main">
          <section className="hero" id="about" aria-labelledby="intro-title">
            <h1 id="intro-title">Hi, I'm Raghav Bhati</h1>
            <div className="roles">
              <span>frontend</span>
              <i aria-hidden="true"></i>
              <span>backend</span>
              <i aria-hidden="true"></i>
              <span>distributed systems</span>
            </div>
            <p className="intro">
              I'm a software engineer based in Chandigarh, India, building{' '}
              <strong>backend systems and microservices</strong> with Node.js, TypeScript, and
              GraphQL. At IdeaClan, I work on FabFunnel, taking features from system design to
              production.
            </p>
            <p className="intro">
              My journey started with content creation and WordPress, then full-stack development at
              Masai School. Today I focus on reliable APIs, event-driven services, and data
              pipelines, with React work along the way.
            </p>
            <p className="contact-line">
              Get in touch at{' '}
              <a className="inline-link" href="mailto:workmail.raghav@gmail.com">
                workmail.raghav@gmail.com
              </a>
              .
            </p>
            <p>
              <a className="inline-link" href="https://github.com/raghavbhati">
                GitHub
              </a>{' '}
              ·{' '}
              <a className="inline-link" href="https://www.linkedin.com/in/raghavbhatirv/">
                LinkedIn
              </a>{' '}
              ·{' '}
              <a
                className="inline-link"
                href="/RaghavBhatiResume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume ↗
              </a>
            </p>
          </section>

          <section id="experience" aria-labelledby="experience-title">
            <h2 className="section-title" id="experience-title">
              Where I've Contributed
            </h2>
            <details className="experience" open>
              <summary>
                <div className="company">
                  IdeaClan · FabFunnel{' '}
                  <span className="company-icon" aria-hidden="true">
                    IC
                  </span>
                </div>
                <div className="job-meta">
                  <span>
                    Associate Software Engineer <span className="chip">Chandigarh, India</span>
                  </span>
                  <span className="date">March 2024 – Present</span>
                </div>
              </summary>
              <div className="accomplishments">
                <ul>
                  <li>
                    Developed and maintained backend microservices using Node.js and TypeScript,
                    with optimized GraphQL and REST APIs and GraphQL Federation.
                  </li>
                  <li>
                    Built Facebook and NewsBreak services for in-platform campaign management,
                    integrating ad accounts and synchronizing spend data in near real time. Backend
                    optimizations reduced report processing time by 30%.
                  </li>
                  <li>
                    Built a Kafka pipeline to stream data into ClickHouse and used TypeORM with
                    PostgreSQL for schema design and query optimization.
                  </li>
                  <li>
                    Developed real-time notifications with GraphQL subscriptions, WebSockets, Redis
                    Pub/Sub, and RabbitMQ.
                  </li>
                  <li>
                    Built a User Activity service using Loki APIs and event-driven workflows for
                    background report synchronization.
                  </li>
                  <li>
                    Contributed React features using Apollo Client and GraphQL Codegen for type-safe
                    client applications.
                  </li>
                </ul>
                <p>
                  <strong>Focus:</strong> Backend ownership, performance, reliability, and
                  production delivery.
                </p>
              </div>
            </details>
          </section>
          <section className="stack-section" id="stack" aria-labelledby="stack-title">
            <div className="stack-stripe" aria-hidden="true" />
            <div className="stack-header">
              <h2 id="stack-title">Stack</h2>
              <p>Tools I use across backend systems and the web.</p>
            </div>
            <dl className="stack-grid">
              {stack.map((group, index) => (
                <div className="stack-row" key={group.category}>
                  <dt className="stack-category">
                    <span className="stack-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{group.category}</span>
                  </dt>
                  <dd className="stack-tools">
                    <ul>
                      {group.tools.map((tool) => (
                        <li className="stack-pill" key={tool}>
                          <span className="stack-icon badge" aria-hidden="true">
                            {tool.slice(0, 2)}
                          </span>
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="stack-stripe" aria-hidden="true" />
          </section>
          <section id="projects" aria-labelledby="projects-title">
            <h2 className="section-title" id="projects-title">
              Things I've Built
            </h2>
            {projects.map((project) => (
              <article className="project" key={project.name}>
                <div className="preview">
                  <img
                    className="project-image"
                    src={project.image}
                    alt={`${project.name} website screenshot`}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="project-top">
                    <h3>{project.name}</h3>
                    <div className="project-links">
                      <a href={project.live} target="_blank" rel="noreferrer">
                        Live ↗
                      </a>
                      <span>|</span>
                      <a href={project.github} target="_blank" rel="noreferrer">
                        GitHub ↗
                      </a>
                    </div>
                  </div>
                  <p>{project.description}</p>
                  <div className="stack-label">Technologies used:</div>
                  <div className="tags">
                    {project.tech.map((tech) => (
                      <span className="chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
          <section id="education" aria-labelledby="education-title">
            <h2 className="section-title" id="education-title">
              Education &amp; Certifications
            </h2>
            <div className="accomplishments">
              <h3>Masai School</h3>
              <p>
                Full Stack Web Development, Computer Science · March 2023 – February 2024 · India
              </p>
              <h3>Maharaja Ganga Singh University</h3>
              <p>Bachelor of Arts · July 2020 – June 2023 · Bikaner, India</p>
              <h3>Certifications</h3>
              <ul>
                <li>Building RAG Apps Using MongoDB</li>
                <li>Postman API Fundamentals Student Expert</li>
              </ul>
            </div>
          </section>
          <GitHubActivity></GitHubActivity>
          <LearningLog></LearningLog>
        </main>

        <section className="closing-section" id="closing-quote" aria-label="Closing thought">
          <div className="closing-card">
            <blockquote className="closing-quote">
              <span className="closing-quote-mark" aria-hidden="true">
                ”
              </span>
              <p>Trust the process</p>
            </blockquote>
            <div className="closing-visitors">
              <strong>Chandigarh, India</strong>
              <small>Building reliable systems, one step at a time.</small>
            </div>
          </div>
        </section>

        <footer className="site-footer" id="footer">
          <div className="footer-columns">
            <div>
              <h2 className="footer-label">Navigate</h2>
              <nav className="footer-nav" aria-label="Footer navigation">
                <a href="#about">Home</a>
                <a href="#experience">Work</a>
                <a href="#github-activity">GitHub</a>
                <a href="#projects">Projects</a>
                <a href="#stack">Stack</a>
                <a href="#education">Education</a>
                <a href="/RaghavBhatiResume.pdf" download>
                  Resume ↓
                </a>
                <a href="#learning-log">Learning Log</a>
                <a href="#footer">Contact</a>
              </nav>
            </div>
            <div>
              <h2 className="footer-label">Connect</h2>
              <div className="footer-socials">
                <a
                  href="https://twitter.com/raghavbhatirv/"
                  aria-label="X"
                  title="X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 3h4l12 18h-4zM20 3 4 21"></path>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/raghavbhatirv/"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="1"></rect>
                    <path d="M7 10v7M11 17v-7m0 3c0-4 6-4 6 0v4"></path>
                    <circle cx="7" cy="7" r=".7"></circle>
                  </svg>
                </a>
                <a
                  href="https://github.com/raghavbhati"
                  aria-label="GitHub"
                  title="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 21v-4c-5 1-6-2-6-3m14 7v-4c0-1-1-2-1-2 5-1 6-3 6-6 0-2-1-3-2-4 0-1 0-2-1-3l-4 2h-4L6 2C5 3 5 4 5 5 4 6 3 7 3 9c0 3 1 5 6 6 0 0-1 1-1 2"></path>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@UnboxingForever/"
                  aria-label="YouTube"
                  title="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="4"></rect>
                    <path d="m10 9 6 3-6 3z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.raghavbhatirv.in/"
                  aria-label="Website"
                  title="Website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9"></circle>
                    <ellipse cx="12" cy="12" rx="4" ry="9"></ellipse>
                    <path d="M3 12h18"></path>
                  </svg>
                </a>
                <a href="mailto:workmail.raghav@gmail.com" aria-label="Email" title="Email">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m3 6 9 7 9-7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-meta">
            <p className="footer-copyright">
              © <span id="year">{new Date().getFullYear()}</span> Raghav Bhati. All rights reserved.
            </p>
            <FooterClock></FooterClock>
          </div>
        </footer>
      </div>
    </PreferencesProvider>
  );
}
