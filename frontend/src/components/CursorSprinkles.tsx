import React, { useEffect } from 'react';
import './CursorSprinkles.css';

const CursorSprinkles: React.FC = () => {
  useEffect(() => {
    // Array of vibrant colors for the sprinkles
    const colors = ['#ff718d', '#fdff6a', '#73ff73', '#6afcff', '#ffb067', '#d884ff'];
    
    let lastTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle sprinkle creation to avoid performance issues
      if (now - lastTime < 30) return;
      lastTime = now;

      // Sometimes skip creating a sprinkle to make it look organic
      if (Math.random() > 0.8) return;

      const sprinkle = document.createElement('div');
      sprinkle.className = 'cursor-sprinkle';
      
      // Randomize color
      sprinkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Set position to mouse coordinates
      sprinkle.style.left = `${e.clientX}px`;
      sprinkle.style.top = `${e.clientY}px`;
      
      // Randomize size
      const size = Math.random() * 8 + 4; // 4px to 12px
      sprinkle.style.width = `${size}px`;
      sprinkle.style.height = `${size}px`;

      // Randomize animation direction
      const tx = (Math.random() - 0.5) * 80;
      const ty = (Math.random() - 0.5) * 80 + 30; // Tend to fall down slightly
      sprinkle.style.setProperty('--tx', `${tx}px`);
      sprinkle.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(sprinkle);

      // Clean up after animation finishes
      setTimeout(() => {
        if (document.body.contains(sprinkle)) {
          sprinkle.remove();
        }
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // This component doesn't render any normal DOM elements
};

export default CursorSprinkles;
