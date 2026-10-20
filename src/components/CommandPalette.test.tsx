import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CommandPalette from './CommandPalette';
import { PreferencesProvider } from './Preferences';

function renderPalette() {
  return render(
    <PreferencesProvider>
      <input aria-label="Some field" />
      <section id="projects">Projects</section>
      <CommandPalette />
    </PreferencesProvider>
  );
}
const palette = () => screen.queryByRole('dialog', { name: 'Command palette' });
const searchBox = () => screen.getByRole('combobox', { name: 'Search commands' });
const press = (key: string, options: KeyboardEventInit = {}) =>
  fireEvent.keyDown(window, { key, ...options });
const type = (text: string) => fireEvent.change(searchBox(), { target: { value: text } });

describe('CommandPalette', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => vi.unstubAllGlobals());

  test('⌘K, Ctrl+K, "/" and the header button all open it; ⌘K again closes it', () => {
    renderPalette();
    expect(palette()).not.toBeInTheDocument();

    press('k', { metaKey: true });
    expect(palette()).toBeInTheDocument();
    expect(searchBox()).toHaveFocus();
    press('k', { metaKey: true });
    expect(palette()).not.toBeInTheDocument();

    press('k', { ctrlKey: true });
    expect(palette()).toBeInTheDocument();
    press('k', { ctrlKey: true });

    press('/');
    expect(palette()).toBeInTheDocument();
    press('k', { metaKey: true });

    fireEvent.click(screen.getByRole('button', { name: 'Open command palette' }));
    expect(palette()).toBeInTheDocument();
  });

  test('"/" is left alone while typing, and nothing opens over a memory board', () => {
    renderPalette();
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Some field' }), { key: '/' });
    expect(palette()).not.toBeInTheDocument();

    const board = document.body.appendChild(document.createElement('dialog'));
    board.setAttribute('open', '');
    press('k', { metaKey: true });
    expect(palette()).not.toBeInTheDocument();
    board.remove();
  });

  test('typing narrows the list; no match says so', () => {
    renderPalette();
    press('k', { metaKey: true });
    type('educ');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Education#education',
    ]);
    type('work');
    expect(screen.getByRole('option', { name: /Experience/ })).toBeInTheDocument();
    type('zzz');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByText('No matches for “zzz”.')).toBeInTheDocument();
  });

  test('arrow keys move the selection and Enter jumps to the section', () => {
    renderPalette();
    press('k', { metaKey: true });
    const first = screen.getAllByRole('option')[0];
    expect(first).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(searchBox(), { key: 'ArrowUp' });
    expect(screen.getAllByRole('option').at(-1)).toHaveAttribute('aria-selected', 'true');

    type('projects');
    fireEvent.keyDown(searchBox(), { key: 'Enter' });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(window.location.hash).toBe('#projects');
    expect(palette()).not.toBeInTheDocument();
  });

  test('opens the travel and event boards through their links', () => {
    renderPalette();
    press('k', { metaKey: true });
    type('travel');
    fireEvent.keyDown(searchBox(), { key: 'Enter' });
    expect(window.location.hash).toBe('#travel-memory');

    press('k', { metaKey: true });
    type('event memories');
    fireEvent.keyDown(searchBox(), { key: 'Enter' });
    expect(window.location.hash).toBe('#memories');
  });

  test('copies the email address and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    renderPalette();
    press('k', { metaKey: true });
    fireEvent.click(screen.getByRole('option', { name: /Copy email address/ }));

    expect(writeText).toHaveBeenCalledWith('workmail.raghav@gmail.com');
    expect(await screen.findByText('Copied')).toBeInTheDocument();
    await waitFor(() => expect(palette()).not.toBeInTheDocument());
  });

  test('switches the theme', () => {
    renderPalette();
    press('k', { metaKey: true });
    type('light');
    fireEvent.keyDown(searchBox(), { key: 'Enter' });
    expect(document.body.dataset.theme).toBe('light');
  });

  test('the résumé is listed but unavailable until there is a PDF', () => {
    renderPalette();
    press('k', { metaKey: true });
    type('resume');
    const resume = screen.getByRole('option', { name: /Resume/ });
    expect(resume).toHaveAttribute('aria-disabled', 'true');
    expect(resume).toHaveTextContent('currently not available');
    fireEvent.keyDown(searchBox(), { key: 'Enter' });
    expect(palette()).toBeInTheDocument();
  });

  test('Escape closes it and puts focus back where it was', async () => {
    renderPalette();
    const trigger = screen.getByRole('button', { name: 'Open command palette' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent(palette()!, new Event('cancel', { cancelable: true }));
    expect(palette()).not.toBeInTheDocument();
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(trigger).toHaveFocus();
  });
});
