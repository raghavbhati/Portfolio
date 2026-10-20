import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
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

test('learning log navigation stops at both boundaries', () => {
  render(<App />);
  const previous = screen.getByRole('button', { name: 'Previous learning log entry' });
  const next = screen.getByRole('button', { name: 'Next learning log entry' });
  expect(next).toBeDisabled();
  fireEvent.click(previous);
  fireEvent.click(previous);
  expect(
    screen.getByRole('heading', { name: 'Learning · From WordPress to full-stack development' })
  ).toBeInTheDocument();
  expect(previous).toBeDisabled();
  fireEvent.click(next);
  expect(
    screen.getByRole('heading', { name: 'Building · Backend systems at FabFunnel' })
  ).toBeInTheDocument();
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
