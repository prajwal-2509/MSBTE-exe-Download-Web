import React, { useState, useEffect } from 'react';

const TEXT  = 'Experience liftoff with the next-gen result scraper.';
const SPEED = 40; // ms per character

export default function Typewriter({ className = '' }) {
  const [chars, setChars] = useState('');
  const [done,  setDone]  = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setChars(TEXT.slice(0, i));
      if (i >= TEXT.length) { clearInterval(id); setDone(true); }
    }, SPEED);
    return () => clearInterval(id);
  }, []);

  return (
    <h1
      className={`font-bold tracking-tight leading-tight text-slate-900 ${className}`}
      aria-label={TEXT}
    >
      {chars}
      {!done && <span className="tw-cursor" aria-hidden="true" />}
    </h1>
  );
}
