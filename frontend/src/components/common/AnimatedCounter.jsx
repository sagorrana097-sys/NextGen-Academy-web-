import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value = 0, duration = 1000, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    if (target === 0) {
      setDisplayValue(0);
      return;
    }

    let start = 0;
    const stepTime = 20;
    const totalSteps = Math.max(1, Math.floor(duration / stepTime));
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-mono font-black">
      {prefix}
      {displayValue.toLocaleString('en-BD')}
      {suffix}
    </span>
  );
}
