// src/components/Reveal.js
// Lightweight scroll-reveal wrapper based on IntersectionObserver.

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Reveal = ({ children, delay = 0, style }) => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('reveal-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 && delay <= 3 ? ` reveal-delay-${delay}` : '';

  return (
    <div ref={ref} className={`reveal${delayClass}`} style={style}>
      {children}
    </div>
  );
};

Reveal.propTypes = {
  children: PropTypes.node,
  delay: PropTypes.number,
  style: PropTypes.object,
};

export default Reveal;
