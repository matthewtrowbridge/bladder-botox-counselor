import { useState, useEffect } from 'react';

const SIZES = [
  { label: 'A', value: 17, className: 'text-size-default' },
  { label: 'A+', value: 21, className: 'text-size-large' },
  { label: 'A++', value: 25, className: 'text-size-xlarge' },
];

const STORAGE_KEY = 'bladder-guide-font-size';

export function useFontSize() {
  const [sizeIndex, setSizeIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sizeIndex);
    document.documentElement.style.setProperty(
      '--chat-font-size',
      `${SIZES[sizeIndex].value}px`
    );
  }, [sizeIndex]);

  const cycle = () => {
    setSizeIndex((i) => (i + 1) % SIZES.length);
  };

  return {
    sizeLabel: SIZES[sizeIndex].label,
    fontSize: SIZES[sizeIndex].value,
    cycle,
  };
}
