import { projects, stack } from './data/profile';
import Settings from './components/Settings';
import LearningLog from './components/LearningLog';
import GitHubActivity from './components/GitHubActivity';
import FooterClock from './components/FooterClock';
import { PreferencesProvider } from './components/Preferences';

export default function App() {
  return (
    <PreferencesProvider>
      <Settings />

      <a className="absolute z-20 bg-white text-black p-2 left-3 -top-20 focus:top-3" href="#main">
        Skip to content
      </a>

      <div className="max-w-3xl min-h-screen mx-auto border-x border-dashed border-line">
        <header className="h-16 flex items-center justify-between py-4 px-6 border-b border-dashed border-line max-[420px]:px-[18px]">
          <a
            className="grid place-items-center w-8 h-8 rounded-full border border-[#444] bg-[radial-gradient(circle_at_30%_20%,#515151,#101010_75%)] font-serif italic text-lg text-[#ddd]"
            href="#about"
            aria-label="Back to introduction"
          >
            RB
          </a>
          <nav className="flex gap-2 max-[420px]:gap-[5px]" aria-label="Main navigation">
            <a
              className="text-[13px] py-[3px] px-[7px] border border-dashed border-line hover:bg-[#171717] [body[data-theme=light]_&]:hover:bg-tag [body[data-theme=light]_&]:hover:text-[#111] max-[420px]:text-xs"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[13px] py-[3px] px-[7px] border border-dashed border-line hover:bg-[#171717] [body[data-theme=light]_&]:hover:bg-tag [body[data-theme=light]_&]:hover:text-[#111] max-[420px]:text-xs"
              href="#projects"
            >
              Projects
            </a>
            <a
              className="text-[13px] py-[3px] px-[7px] border border-dashed border-line hover:bg-[#171717] [body[data-theme=light]_&]:hover:bg-tag [body[data-theme=light]_&]:hover:text-[#111] max-[420px]:text-xs"
              href="#github-activity"
            >
              GitHub
            </a>
          </nav>
        </header>

        <main className="p-6 max-[420px]:py-6 max-[420px]:px-[18px]" id="main">
          <section
            className="mb-14 scroll-mt-6 max-[680px]:mb-11"
            id="about"
            aria-labelledby="intro-title"
          >
            <h1
              className="m-0 mb-0.5 font-serif font-normal text-[38px] leading-[1.15] text-bright -tracking-[1px] max-[680px]:text-4xl [body[data-theme=light]_&]:text-heading"
              id="intro-title"
            >
              Hi, I'm Raghav Bhati
            </h1>
            <div className="flex gap-2 items-center text-base text-muted max-[420px]:text-sm">
              <span>frontend</span>
              <i
                className="w-[5px] h-[5px] rounded-full bg-[#454545] inline-block"
                aria-hidden="true"
              ></i>
              <span>backend</span>
              <i
                className="w-[5px] h-[5px] rounded-full bg-[#454545] inline-block"
                aria-hidden="true"
              ></i>
              <span>distributed systems</span>
            </div>
            <p className="max-w-[510px] my-2.5 mt-2.5 mb-[18px] text-muted [body[data-theme=light]_&]:text-muted">
              I'm a software engineer based in Chandigarh, India, building{' '}
              <strong className="font-medium text-[#ddd] [body[data-theme=light]_&]:text-heading">
                backend systems and microservices
              </strong>{' '}
              with Node.js, TypeScript, and GraphQL. At IdeaClan, I work on FabFunnel, taking
              features from system design to production.
            </p>
            <p className="max-w-[510px] my-2.5 mt-2.5 mb-[18px] text-muted [body[data-theme=light]_&]:text-muted">
              My journey started with content creation and WordPress, then full-stack development at
              Masai School. Today I focus on reliable APIs, event-driven services, and data
              pipelines, with React work along the way.
            </p>
            <p className="mb-[3px] text-[15px]">
              Get in touch at{' '}
              <a
                className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] hover:bg-[#363636] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                href="mailto:workmail.raghav@gmail.com"
              >
                workmail.raghav@gmail.com
              </a>
              .
            </p>
            <p className="mt-[3px]">
              <a
                className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] hover:bg-[#363636] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                href="https://github.com/raghavbhati"
              >
                GitHub
              </a>{' '}
              ·{' '}
              <a
                className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] hover:bg-[#363636] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                href="https://www.linkedin.com/in/raghavbhatirv/"
              >
                LinkedIn
              </a>{' '}
              ·{' '}
              <a
                className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] hover:bg-[#363636] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                href="/RaghavBhatiResume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume ↗
              </a>
            </p>
          </section>

          <section
            className="mb-14 scroll-mt-6 max-[680px]:mb-11"
            id="experience"
            aria-labelledby="experience-title"
          >
            <h2
              className="relative table text-base font-normal leading-normal mb-6 m-0 bg-[#242424] text-[#ddd] py-[2px] px-[6px] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141] before:content-[''] before:absolute before:-top-[2px] before:-left-[2px] before:w-1 before:h-1 before:bg-[#777] before:rounded-full before:[box-shadow:0_29px_#777] after:content-[''] after:absolute after:-top-[2px] after:-right-[2px] after:w-1 after:h-1 after:bg-[#777] after:rounded-full after:[box-shadow:0_29px_#777]"
              id="experience-title"
            >
              Where I've Contributed
            </h2>
            <details className="group mb-[18px] border border-dashed border-line bg-surface" open>
              <summary className="list-none cursor-pointer relative p-4 pr-6 select-none [&::-webkit-details-marker]:hidden after:content-['⌄'] after:absolute after:right-[17px] after:top-[18px] after:text-[#777] group-open:after:content-['⌃']">
                <div className="pr-6 font-medium text-bright [body[data-theme=light]_&]:text-heading">
                  IdeaClan · FabFunnel{' '}
                  <span
                    className="text-[10px] px-1 py-[1px] border border-line rounded bg-tag ml-1 text-muted"
                    aria-hidden="true"
                  >
                    IC
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted mt-1 max-[680px]:flex-wrap max-[680px]:gap-[5px]">
                  <span>
                    Associate Software Engineer{' '}
                    <span className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]">
                      Chandigarh, India
                    </span>
                  </span>
                  <span className="text-muted max-[680px]:w-full max-[680px]:mt-[3px]">
                    March 2024 – Present
                  </span>
                </div>
              </summary>
              <div className="p-4 pt-0 text-sm text-text border-t border-dashed border-line mt-3 pt-3 [body[data-theme=light]_&]:text-muted">
                <ul className="list-disc pl-5 my-2 space-y-1.5">
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
                <p className="mt-2 text-xs">
                  <strong className="font-semibold text-[#ddd] [body[data-theme=light]_&]:text-heading">
                    Focus:
                  </strong>{' '}
                  Backend ownership, performance, reliability, and production delivery.
                </p>
              </div>
            </details>
          </section>

          <section
            className="mb-14 -mx-6 border-y border-line max-[420px]:-mx-[18px]"
            id="stack"
            aria-labelledby="stack-title"
          >
            <div
              className="h-[30px] border-y border-line opacity-65 max-[480px]:h-6 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_8px,var(--line)_8px,var(--line)_9px,transparent_9px,transparent_16px)]"
              aria-hidden="true"
            />
            <div className="border-b border-line px-6 pt-4 pb-[13px] max-[680px]:px-5">
              <h2
                className="m-0 font-sans font-medium text-[32px] leading-[1.15] -tracking-[1px] text-bright max-[420px]:text-[30px]"
                id="stack-title"
              >
                Stack
              </h2>
              <p className="m-0 font-sans text-[11px] leading-[1.4] text-muted mt-[7px]">
                Tools I use across backend systems and the web.
              </p>
            </div>
            <dl className="m-0">
              {stack.map((group, index) => (
                <div
                  className="grid grid-cols-[192px_minmax(0,1fr)] border-b border-line last:border-b-0 max-[680px]:grid-cols-[150px_minmax(0,1fr)] max-[480px]:grid-cols-1"
                  key={group.category}
                >
                  <dt className="m-0 flex items-start text-sm py-[23px] pl-6 pr-[15px] gap-[9px] leading-7 text-bright border-r border-dashed border-line max-[680px]:text-xs max-[680px]:pl-5 max-[680px]:pr-[10px] max-[680px]:gap-[7px] max-[480px]:border-r-0 max-[480px]:text-sm max-[480px]:pt-[15px] max-[480px]:px-5 max-[480px]:pb-0">
                    <span
                      className="italic font-mono text-sm leading-7 text-muted"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{group.category}</span>
                  </dt>
                  <dd className="m-0 py-5 px-[18px] max-[680px]:py-[18px] max-[680px]:px-[14px] max-[480px]:pt-[10px] max-[480px]:px-5 max-[480px]:pb-5">
                    <ul className="flex items-center flex-wrap gap-2 m-0 p-0 list-none max-[680px]:gap-[7px] max-[480px]:gap-2">
                      {group.tools.map((tool) => (
                        <li
                          className="inline-flex items-center gap-[6px] whitespace-nowrap border border-line rounded-full bg-surface py-1 px-[9px] text-bright font-mono text-xs leading-[1.35] transition-[border-color,background-color] duration-150 hover:border-muted hover:bg-tag max-[680px]:text-[11px] max-[480px]:text-xs motion-reduce:transition-none"
                          key={tool}
                        >
                          <span
                            className="w-4 h-4 shrink-0 inline-flex items-center justify-center rounded-[2px] bg-muted text-bg font-sans font-bold text-[9px] leading-none -tracking-[0.5px]"
                            aria-hidden="true"
                          >
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
            <div
              className="h-[30px] border-y border-line opacity-65 max-[480px]:h-6 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_8px,var(--line)_8px,var(--line)_9px,transparent_9px,transparent_16px)]"
              aria-hidden="true"
            />
          </section>

          <section
            className="mb-14 scroll-mt-6 max-[680px]:mb-11"
            id="projects"
            aria-labelledby="projects-title"
          >
            <h2
              className="relative table text-base font-normal leading-normal mb-6 m-0 bg-[#242424] text-[#ddd] py-[2px] px-[6px] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141] before:content-[''] before:absolute before:-top-[2px] before:-left-[2px] before:w-1 before:h-1 before:bg-[#777] before:rounded-full before:[box-shadow:0_29px_#777] after:content-[''] after:absolute after:-top-[2px] after:-right-[2px] after:w-1 after:h-1 after:bg-[#777] after:rounded-full after:[box-shadow:0_29px_#777]"
              id="projects-title"
            >
              Things I've Built
            </h2>
            {projects.map((project) => (
              <article
                className="grid grid-cols-[200px_minmax(0,1fr)] gap-5 p-4 border border-dashed border-line bg-surface mb-4 max-[680px]:grid-cols-1 max-[420px]:p-3"
                key={project.name}
              >
                <div className="flex items-center justify-center relative overflow-hidden rounded-[3px] min-h-[206px] border border-[#171f1c] p-5 bg-[radial-gradient(ellipse_at_70%_85%,#126347,#03241c_60%,#061511)] max-[680px]:min-h-[225px]">
                  <img
                    className="block w-full h-full object-cover object-top"
                    src={project.image}
                    alt={`${project.name} website screenshot`}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                    <h3 className="m-0 text-bright font-serif text-[26px] leading-tight max-[420px]:text-[22px] [body[data-theme=light]_&]:text-heading">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <a
                        className="text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live ↗
                      </a>
                      <span>|</span>
                      <a
                        className="text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub ↗
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed my-2 [body[data-theme=light]_&]:text-muted">
                    {project.description}
                  </p>
                  <div className="text-[11px] text-muted mt-3 mb-1.5">Technologies used:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        className="rounded-[3px] whitespace-nowrap text-xs bg-tag border border-[#2b2b2b] px-1 py-[1px] text-[#ccc] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141]"
                        key={tech}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section
            className="mb-14 scroll-mt-6 max-[680px]:mb-11"
            id="education"
            aria-labelledby="education-title"
          >
            <h2
              className="relative table text-base font-normal leading-normal mb-6 m-0 bg-[#242424] text-[#ddd] py-[2px] px-[6px] [body[data-theme=light]_&]:bg-tag [body[data-theme=light]_&]:border-line [body[data-theme=light]_&]:text-[#414141] before:content-[''] before:absolute before:-top-[2px] before:-left-[2px] before:w-1 before:h-1 before:bg-[#777] before:rounded-full before:[box-shadow:0_29px_#777] after:content-[''] after:absolute after:-top-[2px] after:-right-[2px] after:w-1 after:h-1 after:bg-[#777] after:rounded-full after:[box-shadow:0_29px_#777]"
              id="education-title"
            >
              Education &amp; Certifications
            </h2>
            <div className="text-sm text-text border-dashed border-line pl-0 [body[data-theme=light]_&]:text-muted">
              <h3 className="m-0 text-base font-medium text-bright [body[data-theme=light]_&]:text-heading">
                Masai School
              </h3>
              <p className="text-xs text-muted mt-1">
                Full Stack Web Development, Computer Science · March 2023 – February 2024 · India
              </p>
              <h3 className="mt-6 text-base font-medium text-bright [body[data-theme=light]_&]:text-heading">
                Maharaja Ganga Singh University
              </h3>
              <p className="text-xs text-muted mt-1">
                Bachelor of Arts · July 2020 – June 2023 · Bikaner, India
              </p>
              <h3 className="mt-6 text-base font-medium text-bright [body[data-theme=light]_&]:text-heading">
                Certifications
              </h3>
              <ul className="list-disc pl-5 my-2 space-y-1 text-xs text-muted">
                <li>Building RAG Apps Using MongoDB</li>
                <li>Postman API Fundamentals Student Expert</li>
              </ul>
            </div>
          </section>

          <GitHubActivity />
          <LearningLog />
        </main>

        <section
          className="m-0 py-[38px] px-6 pb-[42px] border-t border-line bg-bg bg-[size:80px_80px] bg-[linear-gradient(color-mix(in_srgb,var(--line)_35%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--line)_35%,transparent)_1px,transparent_1px)] max-[580px]:py-7 max-[580px]:px-[18px] max-[580px]:pb-8"
          id="closing-quote"
          aria-label="Closing thought"
        >
          <div className="grid items-center grid-cols-[1fr_auto] gap-6 border border-line rounded-[15px] py-7 px-[26px] bg-bg max-[580px]:grid-cols-1 max-[580px]:gap-5 max-[580px]:p-6">
            <blockquote className="flex items-center m-0 min-w-0 gap-[18px] max-[580px]:gap-[14px]">
              <span
                className="self-start font-serif font-semibold text-[40px] leading-none text-muted opacity-60"
                aria-hidden="true"
              >
                ”
              </span>
              <p className="m-0 font-sans font-normal text-xl leading-[1.45] text-text max-[580px]:text-xl">
                Trust the process
              </p>
            </blockquote>
            <div className="text-center text-sm leading-normal border-l border-line py-2 pl-[25px] pr-0 text-text max-[580px]:border-l-0 max-[580px]:border-t max-[580px]:pt-[18px] max-[580px]:px-0 max-[580px]:pb-0 max-[580px]:text-left">
              <strong className="font-semibold text-bright [font-variant-numeric:tabular-nums]">
                Chandigarh, India
              </strong>
              <small className="block mt-1 text-[10px] text-muted">
                Building reliable systems, one step at a time.
              </small>
            </div>
          </div>
        </section>

        <footer
          className="text-sm leading-[1.6] py-11 px-8 pb-7 bg-surface border-t border-line border-b-[3px] border-b-[#efb99a] text-muted font-sans text-[14px] max-[580px]:py-8 max-[580px]:px-[22px] max-[580px]:pb-[26px]"
          id="footer"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_190px] gap-9 max-[580px]:grid-cols-1 max-[580px]:gap-7">
            <div>
              <h2 className="m-0 uppercase font-sans font-medium text-xs leading-[1.4] tracking-[0.5px] text-muted mb-5 max-[580px]:mb-[15px]">
                Navigate
              </h2>
              <nav
                className="flex flex-wrap gap-x-[23px] gap-y-[10px] content-start max-[580px]:gap-x-[22px] max-[580px]:gap-y-[9px]"
                aria-label="Footer navigation"
              >
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#about"
                >
                  Home
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#experience"
                >
                  Work
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#github-activity"
                >
                  GitHub
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#projects"
                >
                  Projects
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#stack"
                >
                  Stack
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#education"
                >
                  Education
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="/RaghavBhatiResume.pdf"
                  download
                >
                  Resume ↓
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#learning-log"
                >
                  Learning Log
                </a>
                <a
                  className="text-sm text-muted hover:text-bright [body[data-theme=light]_&]:hover:text-[#111]"
                  href="#footer"
                >
                  Contact
                </a>
              </nav>
            </div>
            <div>
              <h2 className="m-0 uppercase font-sans font-medium text-xs leading-[1.4] tracking-[0.5px] text-muted mb-5 max-[580px]:mb-[15px]">
                Connect
              </h2>
              <div className="grid grid-cols-[repeat(4,38px)] gap-2.5 max-[580px]:grid-cols-[repeat(6,38px)] max-[370px]:grid-cols-[repeat(4,38px)]">
                <a
                  className="grid place-items-center w-[38px] h-[38px] border border-line rounded-[9px] bg-bg text-muted transition-[color,border-color] duration-150 hover:text-bright hover:border-muted"
                  href="https://twitter.com/raghavbhatirv/"
                  aria-label="X"
                  title="X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-[19px] h-[19px]"
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
                  className="grid place-items-center w-[38px] h-[38px] border border-line rounded-[9px] bg-bg text-muted transition-[color,border-color] duration-150 hover:text-bright hover:border-muted"
                  href="https://www.linkedin.com/in/raghavbhatirv/"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-[19px] h-[19px]"
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
                  className="grid place-items-center w-[38px] h-[38px] border border-line rounded-[9px] bg-bg text-muted transition-[color,border-color] duration-150 hover:text-bright hover:border-muted"
                  href="https://github.com/raghavbhati"
                  aria-label="GitHub"
                  title="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-[19px] h-[19px]"
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
                  className="grid place-items-center w-[38px] h-[38px] border border-line rounded-[9px] bg-bg text-muted transition-[color,border-color] duration-150 hover:text-bright hover:border-muted"
                  href="https://www.youtube.com/@UnboxingForever/"
                  aria-label="YouTube"
                  title="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-[19px] h-[19px]"
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
                  className="grid place-items-center w-[38px] h-[38px] border border-line rounded-[9px] bg-bg text-muted transition-[color,border-color] duration-150 hover:text-bright hover:border-muted"
                  href="https://www.raghavbhatirv.in/"
                  aria-label="Website"
                  title="Website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-[19px] h-[19px]"
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
                <a
                  className="grid place-items-center w-[38px] h-[38px] border border-line rounded-[9px] bg-bg text-muted transition-[color,border-color] duration-150 hover:text-bright hover:border-muted"
                  href="mailto:workmail.raghav@gmail.com"
                  aria-label="Email"
                  title="Email"
                >
                  <svg
                    className="w-[19px] h-[19px]"
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
          <div className="flex items-end justify-between mt-[38px] pt-6 border-t border-line gap-5 max-[580px]:items-start max-[580px]:flex-col max-[580px]:mt-7 max-[580px]:gap-[18px]">
            <p className="text-xs m-0 text-muted">
              © <span id="year">{new Date().getFullYear()}</span> Raghav Bhati. All rights reserved.
            </p>
            <FooterClock />
          </div>
        </footer>
      </div>
    </PreferencesProvider>
  );
}
