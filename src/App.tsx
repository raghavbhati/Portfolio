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
            YN
          </a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#github-activity">GitHub</a>
          </nav>
        </header>
        <main id="main">
          <section className="hero" id="about" aria-labelledby="intro-title">
            <h1 id="intro-title">Hi, I'm Your Name</h1>
            <div className="roles">
              <span>frontend</span>
              <i aria-hidden="true"></i>
              <span>backend</span>
              <i aria-hidden="true"></i>
              <span>devops</span>
            </div>
            <p className="intro">
              A short introduction, in your own words. Share <strong>what you build</strong>, what
              you care about, and the kind of problems you enjoy solving.
            </p>
            <p className="contact-line">
              Your availability goes here. Get in touch through{' '}
              <a className="inline-link" href="#footer">
                ↗ Socials
              </a>{' '}
              or{' '}
              <a className="inline-link" href="mailto:workmail.raghav@gmail.com">
                ✉ Email
              </a>
              .
            </p>
            <p>
              <a className="inline-link" href="#footer">
                GitHub
              </a>{' '}
              ,{' '}
              <a className="inline-link" href="#footer">
                LinkedIn
              </a>{' '}
              ,{' '}
              <a className="inline-link" href="#footer">
                Resume
              </a>{' '}
              — a little more about my work.
            </p>
          </section>

          <section id="experience" aria-labelledby="experience-title">
            <h2 className="section-title" id="experience-title">
              Where I've Contributed
            </h2>
            <details className="experience">
              <summary>
                <div className="company">
                  Company Name{' '}
                  <span className="company-icon" aria-hidden="true">
                    C
                  </span>
                </div>
                <div className="job-meta">
                  <span>
                    Your most recent role <span className="chip">Remote</span>
                  </span>
                  <span className="date">▦ Start date – Present</span>
                </div>
              </summary>
              <div className="accomplishments">
                <ul>
                  <li>
                    Describe a feature or system you owned, the problem it solved, and your specific
                    contribution.
                  </li>
                  <li>Explain a technical decision or challenge and how you approached it.</li>
                  <li>Add a measurable outcome where you have verified evidence.</li>
                </ul>
                <p>
                  <strong>Tech stack:</strong> Your primary tools and technologies
                </p>
              </div>
            </details>
            <details className="experience">
              <summary>
                <div className="company">
                  Previous Company{' '}
                  <span className="company-icon" aria-hidden="true">
                    P
                  </span>
                </div>
                <div className="job-meta">
                  <span>
                    Your previous role <span className="chip">Hybrid</span>
                  </span>
                  <span className="date">▦ Start date – End date</span>
                </div>
              </summary>
              <div className="accomplishments">
                <ul>
                  <li>Describe your responsibilities and an important project you worked on.</li>
                  <li>Share what improved as a result of your work.</li>
                </ul>
                <p>
                  <strong>Tech stack:</strong> Tools used in this role
                </p>
              </div>
            </details>
          </section>

          <section className="stack-section" id="stack" aria-labelledby="stack-title">
            <div className="stack-stripe" aria-hidden="true"></div>
            <div className="stack-header">
              <h2 id="stack-title">Stack</h2>
              <p>Sample stack · replace with the technologies you use.</p>
            </div>
            <dl className="stack-grid">
              <div className="stack-row">
                <dt className="stack-category">
                  <span className="stack-number" aria-hidden="true">
                    01
                  </span>
                  <span>Language</span>
                </dt>
                <dd className="stack-tools">
                  <ul>
                    <li className="stack-pill">
                      <span className="stack-icon badge" aria-hidden="true">
                        TS
                      </span>
                      <span>TypeScript</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon badge" aria-hidden="true">
                        JS
                      </span>
                      <span>JavaScript</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 11V6c0-5 12-5 12 0v6H7c-5 0-5 8 0 8h4M18 13v5c0 5-12 5-12 0M6 11H4c-4 0-4-7 0-7m14 9h2c4 0 4 7 0 7"></path>
                          <circle cx="10" cy="5" r=".5"></circle>
                          <circle cx="14" cy="19" r=".5"></circle>
                        </svg>
                      </span>
                      <span>Python</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div className="stack-row">
                <dt className="stack-category">
                  <span className="stack-number" aria-hidden="true">
                    02
                  </span>
                  <span>Frontend</span>
                </dt>
                <dd className="stack-tools">
                  <ul>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <ellipse cx="12" cy="12" rx="10" ry="4"></ellipse>
                          <ellipse
                            cx="12"
                            cy="12"
                            rx="10"
                            ry="4"
                            transform="rotate(60 12 12)"
                          ></ellipse>
                          <ellipse
                            cx="12"
                            cy="12"
                            rx="10"
                            ry="4"
                            transform="rotate(120 12 12)"
                          ></ellipse>
                          <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
                        </svg>
                      </span>
                      <span>React</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M8 17V7l10 13M16 7v7"></path>
                        </svg>
                      </span>
                      <span>Next.js</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 9q4-7 10-2t10-2M2 17q4-7 10-2t10-2" strokeWidth="3"></path>
                        </svg>
                      </span>
                      <span>Tailwind CSS</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m4 17 13-13M12 20l8-8" strokeWidth="3"></path>
                        </svg>
                      </span>
                      <span>shadcn/ui</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9"></circle>
                          <path d="M12 3v18M3 12h18"></path>
                        </svg>
                      </span>
                      <span>Radix UI</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9"></circle>
                          <path d="M12 3v18M3 12h18"></path>
                        </svg>
                      </span>
                      <span>Base UI</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m4 17 13-13M12 20l8-8" strokeWidth="3"></path>
                        </svg>
                      </span>
                      <span>Motion</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 3 23 21H1Z" fill="currentColor"></path>
                        </svg>
                      </span>
                      <span>Expo</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m2 7 10-5 10 5-10 5zM2 12l10 5 10-5M2 17l10 5 10-5"></path>
                        </svg>
                      </span>
                      <span>TanStack</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m2 7 10-5 10 5-10 5zM2 12l10 5 10-5M2 17l10 5 10-5"></path>
                        </svg>
                      </span>
                      <span>MobX-State-Tree</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div className="stack-row">
                <dt className="stack-category">
                  <span className="stack-number" aria-hidden="true">
                    03
                  </span>
                  <span>Backend &amp; Database</span>
                </dt>
                <dd className="stack-tools">
                  <ul>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m12 2 9 5v10l-9 5-9-5V7z"></path>
                          <path d="M9 9v7H6m11-7h-4v3h4v4h-4"></path>
                        </svg>
                      </span>
                      <span>Node.js</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9"></circle>
                          <path d="M12 3v18M3 12h18"></path>
                        </svg>
                      </span>
                      <span>Bun</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                          <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"></path>
                        </svg>
                      </span>
                      <span>PostgreSQL</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2C2 12 8 19 12 21c4-2 10-9 0-19Z" fill="currentColor"></path>
                          <path d="M12 9v14"></path>
                        </svg>
                      </span>
                      <span>MongoDB</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m2 7 10-5 10 5-10 5zM2 12l10 5 10-5M2 17l10 5 10-5"></path>
                        </svg>
                      </span>
                      <span>Redis</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon badge" aria-hidden="true">
                        N
                      </span>
                      <span>nginx</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div className="stack-row">
                <dt className="stack-category">
                  <span className="stack-number" aria-hidden="true">
                    04
                  </span>
                  <span>Workflow &amp; AI</span>
                </dt>
                <dd className="stack-tools">
                  <ul>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M12 2c0 7-3 10-10 10 7 0 10 3 10 10 0-7 3-10 10-10-7 0-10-3-10-10Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <span>Claude</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m12 2 10 5v10l-10 5-10-5V7zM2 7l10 5 10-5M12 12v10M7 4l10 5"></path>
                        </svg>
                      </span>
                      <span>Cursor</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M12 2c0 7-3 10-10 10 7 0 10 3 10 10 0-7 3-10 10-10-7 0-10-3-10-10Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <span>Gemini</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9"></circle>
                          <path d="M12 3v18M3 12h18"></path>
                        </svg>
                      </span>
                      <span>ChatGPT</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m12 2 10 10-10 10L2 12z"></path>
                          <path d="m8 6 8 8M10 8v9"></path>
                          <circle cx="16" cy="14" r="1.5"></circle>
                          <circle cx="10" cy="17" r="1.5"></circle>
                        </svg>
                      </span>
                      <span>Git</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 21v-4c-5 1-6-2-6-3m14 7v-4c0-1-1-2-1-2 5-1 6-3 6-6 0-2-1-3-2-4 0-1 0-2-1-3l-4 2h-4L6 2C5 3 5 4 5 5 4 6 3 7 3 9c0 3 1 5 6 6 0 0-1 1-1 2"></path>
                        </svg>
                      </span>
                      <span>GitHub</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12h16c3 0 4-2 4-3-2-1-3 0-3 1-1 0-2-1-2-2-2 1-1 3 0 4M2 12c0 10 15 10 18 0"></path>
                          <path d="M4 8h3v4H4zm4 0h3v4H8zm4 0h3v4h-3zM8 4h3v4H8z"></path>
                        </svg>
                      </span>
                      <span>Docker</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 3 23 21H1Z" fill="currentColor"></path>
                        </svg>
                      </span>
                      <span>Vercel</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div className="stack-row">
                <dt className="stack-category">
                  <span className="stack-number" aria-hidden="true">
                    05
                  </span>
                  <span>Analytics</span>
                </dt>
                <dd className="stack-tools">
                  <ul>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19V9h3v10m4 0V3h3v16m4 0v-6h3v6"></path>
                        </svg>
                      </span>
                      <span>OpenPanel</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19V9h3v10m4 0V3h3v16m4 0v-6h3v6"></path>
                        </svg>
                      </span>
                      <span>PostHog</span>
                    </li>
                  </ul>
                </dd>
              </div>
              <div className="stack-row">
                <dt className="stack-category">
                  <span className="stack-number" aria-hidden="true">
                    06
                  </span>
                  <span>Design</span>
                </dt>
                <dd className="stack-tools">
                  <ul>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3H8a4 4 0 0 0 0 8h4V3Zm0 0h4a4 4 0 0 1 0 8h-4M12 11H8a4 4 0 0 0 0 8h4M12 19v1a4 4 0 1 1-4-1"></path>
                          <circle cx="16" cy="15" r="4"></circle>
                        </svg>
                      </span>
                      <span>Figma</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M3 3h10v10H3zM13 3h8v8h-8zM3 13h8v8H3z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <span>Paper</span>
                    </li>
                    <li className="stack-pill">
                      <span className="stack-icon badge" aria-hidden="true">
                        Ps
                      </span>
                      <span>Photoshop</span>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="stack-stripe" aria-hidden="true"></div>
          </section>

          <section id="projects" aria-labelledby="projects-title">
            <h2 className="section-title" id="projects-title">
              Things I've Built
            </h2>
            <article className="project">
              <div className="preview" role="img" aria-label="Placeholder preview for Project One">
                <div className="mini-window">
                  <div className="mini-eyebrow">Project one · preview</div>
                  <h4>
                    A small idea.
                    <br />A thoughtful solution.
                  </h4>
                  <p>A space for your next project screenshot.</p>
                  <span className="mini-button">Made with purpose ↗</span>
                  <div className="mini-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div>
                <div className="project-top">
                  <h3>Project One</h3>
                  <div className="project-links">
                    <button disabled title="Add your live project URL">
                      Live
                    </button>
                    <span>|</span>
                    <button disabled title="Add your repository URL">
                      GitHub
                    </button>
                  </div>
                </div>
                <p>
                  Introduce the problem this project solves, who it is for, and the most useful
                  thing it does. Replace this with a concise description of your own work.
                </p>
                <div className="stack-label">Technologies used:</div>
                <div className="tags">
                  <span className="chip">React</span>
                  <span className="chip">TypeScript</span>
                  <span className="chip">Node.js</span>
                  <span className="chip">PostgreSQL</span>
                  <span className="chip">Docker</span>
                </div>
              </div>
            </article>
            <article className="project">
              <div
                className="preview dark"
                role="img"
                aria-label="Placeholder preview for Project Two"
              >
                <div className="dark-content">
                  <small>✧ PROJECT TWO · PREVIEW</small>
                  <h4>
                    Less friction.
                    <br />
                    More possibility.
                  </h4>
                  <p>Your product, its purpose, and a glimpse of the experience.</p>
                  <span>Explore the idea ↗</span>
                </div>
              </div>
              <div>
                <div className="project-top">
                  <h3>Project Two</h3>
                  <div className="project-links">
                    <button disabled title="Add your live project URL">
                      Live
                    </button>
                    <span>|</span>
                    <button disabled title="Add your repository URL">
                      GitHub
                    </button>
                  </div>
                </div>
                <p>
                  Show another side of your skills. Explain what you built, one interesting
                  technical challenge, and what makes this project worth exploring.
                </p>
                <div className="stack-label">Technologies used:</div>
                <div className="tags">
                  <span className="chip">Your framework</span>
                  <span className="chip">Your database</span>
                  <span className="chip">Your tools</span>
                </div>
              </div>
            </article>
            <div className="section-end">
              <span>More projects coming soon ↗</span>
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
              You are visitor <strong aria-label="Visitor count unavailable">—</strong>
              <small>Visitor counter not connected yet</small>
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
                  href="https://github.com/Raghavbhati"
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
                  href="https://raghavbhati.github.io/"
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
              © <span id="year">{new Date().getFullYear()}</span> Your Name. All rights reserved.
            </p>
            <FooterClock></FooterClock>
          </div>
        </footer>
      </div>
    </PreferencesProvider>
  );
}
