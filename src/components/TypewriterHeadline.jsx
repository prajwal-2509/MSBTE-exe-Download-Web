import React, { useState, useEffect } from 'react';

const FULL_TEXT  = 'Experience liftoff with the next-gen result scraper.';
const SPEED_MS   = 38;

export default function TypewriterHeadline({ className = '' }) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      idx++;
      setText(FULL_TEXT.slice(0, idx));
      if (idx >= FULL_TEXT.length) { clearInterval(id); setDone(true); }
    }, SPEED_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className={`font-sans antialiased font-bold tracking-tight leading-tight text-slate-900 ${className}`}>
      {text}
      {!done && <span className="tw-cursor" aria-hidden="true" />}
    </h1>
  );
}
