import { fireEvent, render, screen, within } from '@testing-library/react';
import { existsSync, readFileSync } from 'fs';
import { vi } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});

test('renders the personal sections and preserves valid section links', () => {
  const { container } = render(<App />);
  expect(screen.getByRole('heading', { name: 'GitHub Activity' })).toBeInTheDocument();
  expect(screen.queryByText('Notes Along the Way')).not.toBeInTheDocument();
  expect(screen.queryByText("Have something in mind? Let's talk.")).not.toBeInTheDocument();
  expect(container.querySelectorAll('footer')).toHaveLength(1);
  container
    .querySelectorAll('a[href^="#"]')
    .forEach((link) =>
      expect(document.getElementById(link.getAttribute('href')!.slice(1))).not.toBeNull()
    );
});

test('shows each IdeaClan role as its own section, with its dates and its work', () => {
  render(<App />);
  const roles = screen.getByRole('region', { name: "Where I've Contributed" });
  // The current role comes first.
  const [sde, ase] = Array.from(roles.querySelectorAll('details'));

  expect(
    within(ase.querySelector('summary')!).getByText('Associate Software Engineer')
  ).toBeInTheDocument();
  expect(
    within(ase.querySelector('summary')!).getByText('March 2024 – February 2026')
  ).toBeInTheDocument();
  expect(within(ase).getByText(/Facebook and NewsBreak services/)).toBeInTheDocument();
  expect(within(ase).getByText(/Kafka-to-ClickHouse analytics pipeline/)).toBeInTheDocument();

  expect(
    within(sde.querySelector('summary')!).getByText('Software Development Engineer 1')
  ).toBeInTheDocument();
  expect(
    within(sde.querySelector('summary')!).getByText('March 2026 – Present')
  ).toBeInTheDocument();
  expect(
    within(sde).getByText(/4 ad-platform integrations \(Google Ads, Snapchat, BIGO, SmartNews\)/)
  ).toBeInTheDocument();
  expect(within(sde).getByText(/cutting API calls by 90%/)).toBeInTheDocument();
  expect(roles).not.toHaveTextContent('Focus:');
  expect(within(roles).queryByText('IC')).not.toBeInTheDocument();
});

test('links FabFunnel to its site, from the intro and the experience card', () => {
  render(<App />);
  const fabfunnel = screen.getAllByRole('link', { name: /^FabFunnel/ });
  expect(fabfunnel).toHaveLength(2);
  fabfunnel.forEach((link) => {
    expect(link).toHaveAttribute('href', 'https://fabfunnel.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});

test('lists AI tools in their own row of the stack, before Web & Design', () => {
  render(<App />);
  const rows = Array.from(document.querySelectorAll('#stack dt')).map((dt) => dt.textContent);
  expect(rows).toEqual([
    '01Languages',
    '02Backend & APIs',
    '03Data & Messaging',
    '04Frontend',
    '05Workflow & DevOps',
    '06AI',
    '07Web & Design',
  ]);
  const stack = within(document.getElementById('stack')!);
  expect(stack.getByText('Claude Code')).toBeInTheDocument();
  expect(stack.getByText('Codex')).toBeInTheDocument();
  expect(stack.getByText('RAG')).toBeInTheDocument();
  expect(stack.getByText('MCP')).toBeInTheDocument();
});

/** The tool names in one row of the stack, without the two-letter badge. */
function stackRow(category: string) {
  const row = Array.from(document.querySelectorAll('#stack dt')).find((dt) =>
    dt.textContent!.includes(category)
  )!.nextElementSibling!;
  return Array.from(row.querySelectorAll('li')).map((li) => li.textContent!.slice(2));
}

test('adds the résumé’s newer skills and keeps the ones it trimmed', () => {
  render(<App />);
  expect(stackRow('Languages')).toEqual(['TypeScript', 'JavaScript', 'SQL', 'Python', 'Java']);
  expect(stackRow('Backend & APIs')).toEqual(
    expect.arrayContaining([
      'Hono.js',
      'GraphQL Federation',
      'Apollo Server',
      'OAuth 2.0',
      'Prisma',
    ])
  );
  expect(stackRow('Data & Messaging')).toContain('BullMQ');
  expect(stackRow('Frontend')).toEqual(
    expect.arrayContaining(['React Native', 'Expo', 'GraphQL Codegen', 'Bootstrap'])
  );
  expect(stackRow('Workflow & DevOps')).toEqual(expect.arrayContaining(['AWS', 'Cloudflare']));
  expect(stackRow('Web & Design')).toEqual(['WordPress', 'Firebase', 'Figma']);
});

test('lists OpenTelemetry with the other observability tools in Workflow & DevOps', () => {
  render(<App />);
  const tools = stackRow('Workflow & DevOps');
  const grafana = tools.indexOf('Grafana');
  expect(tools.slice(grafana, grafana + 3)).toEqual(['Grafana', 'Loki', 'OpenTelemetry']);
});

test('shows each project with its live link, and no GitHub link while the repos are private', () => {
  render(<App />);
  const section = screen.getByRole('region', { name: "Things I've Built" });
  expect(document.querySelector('header a[href="#projects"]')).not.toBeNull();
  expect(document.querySelector('footer a[href="#projects"]')).not.toBeNull();

  const evenout = within(section).getByRole('article', { name: 'EvenOut' });
  expect(within(evenout).getByText('A Splitwise alternative for India')).toBeInTheDocument();
  expect(within(evenout).getByRole('link', { name: 'EvenOut Live ↗' })).toHaveAttribute(
    'href',
    'https://evenout.in/'
  );
  expect(within(evenout).getByRole('list', { name: 'EvenOut built with' })).toHaveTextContent(
    'React Native'
  );

  const moneynify = within(section).getByRole('article', { name: 'MoneyNify' });
  expect(within(moneynify).getByRole('link', { name: 'MoneyNify Live ↗' })).toHaveAttribute(
    'href',
    'https://app.zeherkhanekapaisanahihai.in/'
  );
  expect(within(moneynify).getByText('Cloudflare Workers')).toBeInTheDocument();

  expect(within(section).queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();
});

test('introduces the work from the résumé summary, with the YouTube channel', () => {
  render(<App />);
  const about = within(document.getElementById('about')!);
  expect(about.getByText(/backend-focused full stack engineer/)).toHaveTextContent(
    /with \d+(\.5)?\+ years of building/
  );
  expect(
    about.getByText(/Facebook, NewsBreak,\s+Google Ads, Snapchat, BIGO, and SmartNews/)
  ).toBeInTheDocument();
  expect(about.getByRole('link', { name: '@UnboxingForever' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/@UnboxingForever/'
  );
  expect(about.getByText(/to 32K subscribers/)).toBeInTheDocument();
});

test('keeps both certifications', () => {
  render(<App />);
  const education = within(document.getElementById('education')!);
  expect(education.getByText('Building RAG Apps Using MongoDB')).toBeInTheDocument();
  expect(education.getByText('Postman API Fundamentals Student Expert')).toBeInTheDocument();
});

test('shows each school with its dates on the right of its name', () => {
  render(<App />);
  const school = screen.getByRole('heading', { name: 'Masai School' });
  const row = school.parentElement!;
  expect(row).toHaveClass('justify-between');
  expect(row.lastElementChild).toHaveTextContent(/^March 2023 – February 2024$/);
  expect(row.nextElementSibling).toHaveTextContent(
    /^Full Stack Web Development, Computer Science · India$/
  );
});

test('points at raghavbhatirv.in, never the www address that does not serve the site', () => {
  render(<App />);
  expect(document.querySelector('a[href*="www.raghavbhatirv.in"]')).toBeNull();
  expect(screen.getByRole('link', { name: 'Website' })).toHaveAttribute(
    'href',
    'https://raghavbhatirv.in/'
  );
  const html = readFileSync('index.html', 'utf8');
  expect(html).not.toContain('www.raghavbhatirv.in');
  expect(html).toContain('<link rel="canonical" href="https://raghavbhatirv.in/" />');
  expect(html).toContain('<meta property="og:image" content="https://raghavbhatirv.in/og.png" />');
});

test('has no learning log', () => {
  render(<App />);
  expect(screen.queryByText(/learning log/i)).not.toBeInTheDocument();
  expect(document.getElementById('learning-log')).toBeNull();
});

test('preferences persist across remounts and reset', () => {
  const first = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Light', exact: true }));
  fireEvent.click(screen.getByRole('button', { name: 'Warm background' }));
  expect(document.body.dataset.theme).toBe('light');
  first.unmount();
  render(<App />);
  expect(document.body.dataset.theme).toBe('light');
  fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
  expect(screen.getByRole('button', { name: 'Warm background' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  fireEvent.click(screen.getByRole('button', { name: /Reset all/ }));
  expect(document.body.dataset.theme).toBe('dark');
  expect(screen.getByRole('button', { name: 'Neutral background' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  // Only theme and background are visitor choices; the fonts and clock are fixed.
  expect(screen.queryByLabelText('Font')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Timezone')).not.toBeInTheDocument();
});

test('shows personal content and resume without fabricated activity', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: "Hi, I'm Raghav Bhati" })).toBeInTheDocument();
  // The intro opens the résumé in a new tab, the footer downloads it, and the file is there.
  expect(screen.getByRole('link', { name: 'Resume ↗' })).toHaveAttribute(
    'href',
    '/RaghavBhatiResume.pdf'
  );
  expect(screen.getByRole('link', { name: 'Resume ↗' })).toHaveAttribute('target', '_blank');
  expect(screen.getByRole('link', { name: 'Resume ↓' })).toHaveAttribute('download');
  expect(existsSync('public/RaghavBhatiResume.pdf')).toBe(true);
  expect(screen.queryByText('Resume currently not available')).not.toBeInTheDocument();
  expect(
    within(document.getElementById('github-activity')!).getByRole('link', { name: 'View GitHub ↗' })
  ).toHaveAttribute('href', 'https://github.com/raghavbhati');
  expect(screen.queryByText(/sample contributions|Your Name|Project One/)).not.toBeInTheDocument();
});
