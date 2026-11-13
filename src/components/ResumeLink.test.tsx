import { fireEvent, render, screen } from '@testing-library/react';
import ResumeLink from './ResumeLink';

describe('ResumeLink', () => {
  test('without a PDF it is not a link, and says so on hover and focus', () => {
    render(<ResumeLink label="Resume ↗" className="chip" href={null} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    const resume = screen.getByText('Resume ↗');
    expect(resume).toHaveAttribute('aria-disabled', 'true');
    expect(resume).toHaveAttribute('tabindex', '0');
    expect(resume).toHaveClass('chip', 'cursor-not-allowed');
    expect(resume).toHaveAccessibleDescription('Resume currently not available');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Resume currently not available');

    // Clicking does nothing: there's nowhere to go.
    fireEvent.click(resume);
    expect(window.location.pathname).toBe('/');
  });

  test('each instance gets its own tooltip', () => {
    render(
      <>
        <ResumeLink label="Resume ↗" className="chip" href={null} />
        <ResumeLink label="Resume ↓" className="footer" href={null} download />
      </>
    );
    const [first, second] = screen.getAllByRole('tooltip');
    expect(first.id).not.toBe(second.id);
    expect(screen.getByText('Resume ↓')).toHaveAttribute('aria-describedby', second.id);
  });

  test('with a PDF it is a real link that opens in a new tab, or downloads', () => {
    render(
      <>
        <ResumeLink label="Resume ↗" className="chip" href="/RaghavBhatiResume.pdf" />
        <ResumeLink label="Resume ↓" className="footer" href="/RaghavBhatiResume.pdf" download />
      </>
    );
    const open = screen.getByRole('link', { name: 'Resume ↗' });
    expect(open).toHaveAttribute('href', '/RaghavBhatiResume.pdf');
    expect(open).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'Resume ↓' })).toHaveAttribute('download');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
