import { useState } from 'react';
import { learningLogEntries } from '../data/learningLog';

export default function LearningLog() {
  const [index, setIndex] = useState(learningLogEntries.length - 1);
  const entry = learningLogEntries[index];
  const active = 20 + index * 3;

  return (
    <section
      className="overflow-hidden -mx-6 -mb-4 mt-12 bg-[#090909] border-t border-[#1d1d1d] [body[data-theme=light]_&]:bg-surface [body[data-theme=light]_&]:border-line max-[420px]:-mx-[18px]"
      id="learning-log"
      aria-labelledby="log-heading"
    >
      <div className="pt-[38px] px-9 pb-0 max-[680px]:pt-[30px] max-[680px]:px-6 max-[420px]:px-5">
        <h2
          className="m-0 mb-3 font-serif font-normal text-[38px] leading-[1.2] text-[#f1f1f1] max-[680px]:text-[34px] [body[data-theme=light]_&]:text-heading"
          id="log-heading"
        >
          Learning Log
        </h2>
        <p className="text-xs m-0 text-[#888] mb-[38px] max-[420px]:mb-7 [body[data-theme=light]_&]:text-muted">
          Highlights from my learning and work.
        </p>
        <div
          className="min-h-[260px] max-[680px]:min-h-[350px] max-[420px]:min-h-[370px]"
          id="log-entry"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3 className="text-[17px] font-semibold m-0 mb-[18px] tracking-[0.2px] text-[#eee] [body[data-theme=light]_&]:text-heading">
            {entry.title}
          </h3>
          <ul className="list-none m-0 p-0 grid gap-4">
            {entry.items.map((item) => (
              <li
                className="grid items-start text-base leading-[1.65] grid-cols-[19px_1fr] gap-[13px] text-[#c4c4c4] max-[680px]:text-sm max-[680px]:gap-[10px] [body[data-theme=light]_&]:text-muted"
                key={item}
              >
                <span
                  className="grid place-items-center text-[11px] font-semibold w-[17px] h-[17px] border-[1.7px] border-[#00cda0] rounded-full text-[#00cda0] mt-[5px] [body[data-theme=light]_&]:text-[#087c64] [body[data-theme=light]_&]:border-[#087c64]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-3 mt-[30px]">
          <button
            className="grid place-items-center bg-transparent cursor-pointer w-[39px] h-[39px] border border-[#303030] rounded-[14px] text-[#b5b5b5] text-[25px] transition-[border-color,color] duration-150 hover:not-disabled:border-[#999] hover:not-disabled:text-white focus-visible:outline-2 focus-visible:outline-[#9dcaff] focus-visible:outline-offset-2 disabled:opacity-25 disabled:cursor-default [body[data-theme=light]_&]:border-[#aaa] [body[data-theme=light]_&]:text-[#555] [body[data-theme=light]_&]:hover:not-disabled:text-[#111] [body[data-theme=light]_&]:hover:not-disabled:border-[#333]"
            type="button"
            aria-label="Previous learning log entry"
            aria-controls="log-entry"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            ←
          </button>
          <span className="text-center uppercase font-mono font-semibold text-[13px] leading-[1.5] tracking-[1.5px] text-[#a1a1a1] max-[680px]:text-[11px] max-[680px]:tracking-[1px] [body[data-theme=light]_&]:text-muted">
            {entry.period}
          </span>
          <button
            className="grid place-items-center bg-transparent cursor-pointer w-[39px] h-[39px] border border-[#303030] rounded-[14px] text-[#b5b5b5] text-[25px] transition-[border-color,color] duration-150 hover:not-disabled:border-[#999] hover:not-disabled:text-white focus-visible:outline-2 focus-visible:outline-[#9dcaff] focus-visible:outline-offset-2 disabled:opacity-25 disabled:cursor-default [body[data-theme=light]_&]:border-[#aaa] [body[data-theme=light]_&]:text-[#555] [body[data-theme=light]_&]:hover:not-disabled:text-[#111] [body[data-theme=light]_&]:hover:not-disabled:border-[#333]"
            type="button"
            aria-label="Next learning log entry"
            aria-controls="log-entry"
            disabled={index === learningLogEntries.length - 1}
            onClick={() => setIndex((i) => Math.min(learningLogEntries.length - 1, i + 1))}
          >
            →
          </button>
        </div>
        <div
          className="flex items-end justify-between overflow-hidden h-[92px] gap-[7px] mt-[18px] max-[680px]:gap-[5px] max-[420px]:gap-1 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
          aria-hidden="true"
        >
          {Array.from({ length: 47 }, (_, i) => {
            let stateClass = 'bg-[#343434] [body[data-theme=light]_&]:bg-[#bcbcbc]';
            if (i === active) {
              stateClass = 'bg-[#fb6474] [body[data-theme=light]_&]:bg-[#e35469]';
            } else if (i > active + 7) {
              stateClass =
                'bg-[radial-gradient(circle,#242424_2px,transparent_2.5px)_center_bottom/5px_9px_repeat-y] [body[data-theme=light]_&]:bg-[radial-gradient(circle,#ccc_2px,transparent_2.5px)_center_bottom/5px_9px_repeat-y]';
            }
            return (
              <span
                key={i}
                className={`flex-1 max-w-[5px] min-w-[3px] rounded-t-[5px] ${stateClass}`}
                style={{ height: `${27 + 49 * Math.exp(-Math.pow((i - active) / 7, 2))}px` }}
              />
            );
          })}
        </div>
      </div>
      <blockquote className="m-0 text-center grid place-items-center border-t border-[#222] py-[46px] px-9 pb-[50px] min-h-[158px] max-[680px]:py-8 max-[680px]:px-6 [body[data-theme=light]_&]:border-line">
        <p className="m-0 italic text-[17px] leading-[1.65] text-[#a3a3a3] max-[680px]:text-[15px] before:content-['\u201C'] after:content-['\u201D'] [body[data-theme=light]_&]:text-muted">
          {entry.takeaway}
        </p>
      </blockquote>
    </section>
  );
}
