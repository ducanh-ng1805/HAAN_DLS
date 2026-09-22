"use client";

import { useRef, useState } from "react";

export function MarqueeTitle({ href, text }: { href: string; text: string }) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);
  const [duration, setDuration] = useState(0);

  function handleEnter() {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    const diff = textEl.scrollWidth - container.clientWidth;
    if (diff > 0) {
      setOffset(diff);
      setDuration(Math.max(diff / 35, 1));
    }
  }

  function handleLeave() {
    setOffset(0);
  }

  return (
    <a
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="block overflow-hidden whitespace-nowrap hover:text-primary"
    >
      <span
        ref={textRef}
        className="inline-block"
        style={{ transform: `translateX(-${offset}px)`, transition: `transform ${duration}s linear` }}
      >
        {text}
      </span>
    </a>
  );
}
