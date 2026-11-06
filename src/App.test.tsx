import { fireEvent, render, screen, within } from '@testing-library/react';
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
    within(ase.querySelector('summary')!).getByText('March 2024 – March 2026')
  ).toBeInTheDocument();
  expect(within(ase).getByText(/Facebook and NewsBreak services/)).toBeInTheDocument();

  expect(
    within(sde.querySelector('summary')!).getByText('Software Development Engineer 1')
  ).toBeInTheDocument();
  expect(
    within(sde.querySelector('summary')!).getByText('March 2026 – Present')
  ).toBeInTheDocument();
  expect(within(sde).getByText(/Google, Bigo, and Snapchat/)).toBeInTheDocument();
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
  expect(screen.getByText('Claude Code')).toBeInTheDocument();
  expect(screen.getByText('RAG')).toBeInTheDocument();
  expect(screen.getByText('MCP')).toBeInTheDocument();
});

test('lists OpenTelemetry with the other observability tools in Workflow & DevOps', () => {
  render(<App />);
  const row = Array.from(document.querySelectorAll('#stack dt')).find((dt) =>
    dt.textContent!.includes('Workflow & DevOps')
  )!.nextElementSibling!;
  const tools = Array.from(row.querySelectorAll('li')).map((li) => li.textContent!.slice(2));
  expect(tools.slice(3, 6)).toEqual(['Grafana', 'Loki', 'OpenTelemetry']);
});

test('has no projects section, and nothing links to one', () => {
  render(<App />);
  expect(screen.queryByText("Things I've Built")).not.toBeInTheDocument();
  expect(document.getElementById('projects')).toBeNull();
  expect(document.querySelector('a[href="#projects"]')).toBeNull();
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
  // There's no résumé PDF to share yet, so neither Resume link pretends otherwise.
  expect(screen.queryByRole('link', { name: /Resume/ })).not.toBeInTheDocument();
  expect(screen.getByText('Resume ↗')).toHaveAccessibleDescription(
    'Resume currently not available'
  );
  expect(
    within(document.getElementById('github-activity')!).getByRole('link', { name: 'View GitHub ↗' })
  ).toHaveAttribute('href', 'https://github.com/raghavbhati');
  expect(screen.queryByText(/sample contributions|Your Name|Project One/)).not.toBeInTheDocument();
});
