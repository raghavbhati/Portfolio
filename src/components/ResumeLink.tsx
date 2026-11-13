import { useId } from 'react';
import { resumeUrl } from '../data/profile';

interface ResumeLinkProps {
  label: string;
  className: string;
  /** Where the PDF lives; null while there isn't one to share. */
  href?: string | null;
  /** Footer link downloads; the intro link opens in a new tab. */
  download?: boolean;
}

/** The résumé link, or — while there's no PDF to share — a quiet note saying so. */
export default function ResumeLink({
  label,
  className,
  download = false,
  href = resumeUrl,
}: ResumeLinkProps) {
  const tooltipId = useId();

  if (href) {
    return download ? (
      <a className={className} href={href} download>
        {label}
      </a>
    ) : (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  return (
    <span className="group relative inline-block">
      <span
        className={`${className} cursor-not-allowed opacity-60`}
        tabIndex={0}
        aria-disabled="true"
        aria-describedby={tooltipId}
      >
        {label}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-panel px-2 py-1 font-sans text-[11px] leading-snug text-text opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        Resume currently not available
      </span>
    </span>
  );
}
