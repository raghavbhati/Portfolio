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

test('renders the draft sections and preserves valid section links', () => {
  const { container } = render(<App />);
  expect(screen.getByRole('heading', { name: 'GitHub Activity' })).toBeInTheDocument();
  expect(screen.queryByText('Notes Along the Way')).not.toBeInTheDocument();
  expect(screen.queryByText("Have something in mind? Let's talk.")).not.toBeInTheDocument();
  expect(container.querySelectorAll('footer')).toHaveLength(1);
  container
    .querySelectorAll('a[href^="#"]')
    .forEach((link) =>
      expect(document.getElementById(link.getAttribute('href').slice(1))).not.toBeNull()
    );
});

test('learning log navigation stops at both boundaries', () => {
  render(<App />);
  const previous = screen.getByRole('button', { name: 'Previous learning log entry' });
  const next = screen.getByRole('button', { name: 'Next learning log entry' });
  expect(next).toBeDisabled();
  fireEvent.click(previous);
  fireEvent.click(previous);
  expect(screen.getByRole('heading', { name: 'Learning Log #001 · Learning' })).toBeInTheDocument();
  expect(previous).toBeDisabled();
  fireEvent.click(next);
  expect(
    screen.getByRole('heading', { name: 'Learning Log #002 · Contributing' })
  ).toBeInTheDocument();
});

test('preferences persist across remounts and reset', () => {
  const first = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Open sidebar settings' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Light', exact: true }));
  fireEvent.change(screen.getByLabelText('Font', { exact: true }), { target: { value: 'mono' } });
  fireEvent.change(screen.getByLabelText('Timezone', { exact: true }), {
    target: { value: 'UTC' },
  });
  expect(document.body.dataset.theme).toBe('light');
  first.unmount();
  render(<App />);
  expect(document.body.dataset.theme).toBe('light');
  fireEvent.click(screen.getByRole('button', { name: 'Open sidebar settings' }));
  expect(screen.getByLabelText('Font', { exact: true })).toHaveValue('mono');
  expect(screen.getByLabelText('Timezone', { exact: true })).toHaveValue('UTC');
  fireEvent.click(screen.getByRole('button', { name: /Reset all/ }));
  expect(document.body.dataset.theme).toBe('dark');
  expect(screen.getByLabelText('Timezone', { exact: true })).toHaveValue('Asia/Kolkata');
});

test('calendar supports selecting and keyboard navigation', () => {
  render(<App />);
  const day = screen.getByRole('button', { name: '1 sample contribution on Mar 29, 2026' });
  fireEvent.click(day);
  expect(day).toHaveAttribute('aria-pressed', 'true');
  fireEvent.keyDown(day, { key: 'ArrowRight' });
  expect(document.activeElement).toHaveAttribute(
    'aria-label',
    expect.stringContaining('Apr 5, 2026')
  );
  expect(within(document.getElementById('github-activity')).getByRole('status')).toHaveTextContent(
    'Apr 5, 2026'
  );
});
