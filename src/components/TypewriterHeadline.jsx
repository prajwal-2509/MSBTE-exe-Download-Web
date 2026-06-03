import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FULL_TEXT = "Experience liftoff with the next-gen result scraper.";
const TYPING_SPEED = 42; // ms per character

export default function TypewriterHeadline() {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(FULL_TEXT.slice(0, i));
      if (i >= FULL_TEXT.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.1] text-slate-900">
      {displayed}
      {!done && <span className="typewriter-cursor" aria-hidden="true" />}
    </h1>
  );
}
