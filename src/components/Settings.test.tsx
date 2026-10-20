import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Settings from './Settings';
import { PreferencesProvider } from './Preferences';

const gear = () => screen.getByRole('button', { name: 'Open settings' });
const panel = () => screen.queryByRole('dialog', { name: 'Settings' });

function renderSettings() {
  return render(
    <PreferencesProvider>
      <p>Page content</p>
      <Settings />
    </PreferencesProvider>
  );
}

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  test('is a closed gear until clicked', () => {
    renderSettings();
    expect(gear()).toHaveAttribute('aria-expanded', 'false');
    expect(panel()).not.toBeInTheDocument();
  });

  test('the gear opens the panel under it and moves focus inside', () => {
    renderSettings();
    fireEvent.click(gear());
    expect(gear()).toHaveAttribute('aria-expanded', 'true');
    expect(panel()).toHaveFocus();

    fireEvent.click(gear());
    expect(panel()).not.toBeInTheDocument();
  });

  test('Escape and the close button put it away and return focus to the gear', () => {
    renderSettings();
    fireEvent.click(gear());
    fireEvent.keyDown(panel()!, { key: 'Escape' });
    expect(panel()).not.toBeInTheDocument();
    expect(gear()).toHaveFocus();

    fireEvent.click(gear());
    fireEvent.click(screen.getByRole('button', { name: 'Close settings' }));
    expect(panel()).not.toBeInTheDocument();
    expect(gear()).toHaveFocus();
  });

  test('clicking elsewhere on the page closes it; clicking inside does not', () => {
    renderSettings();
    fireEvent.click(gear());

    fireEvent.pointerDown(screen.getByRole('radio', { name: /Light/ }));
    expect(panel()).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByText('Page content'));
    expect(panel()).not.toBeInTheDocument();
  });

  test('changing a preference still applies it to the page', () => {
    renderSettings();
    fireEvent.click(gear());
    fireEvent.click(screen.getByRole('radio', { name: /Light/ }));
    expect(document.body.dataset.theme).toBe('light');
    expect(panel()).toBeInTheDocument();
  });
});
