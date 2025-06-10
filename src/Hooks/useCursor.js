import { useEffect, useRef } from 'react';

export const useCursor = () => {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const sparkleTimeoutRefs = useRef([]);

  useEffect(() => {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursorRef.current = cursor;

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    cursorRingRef.current = cursorRing;

    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    // Mouse move handler
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      
      cursor.style.left = x - 10 + 'px';
      cursor.style.top = y - 10 + 'px';
      
      cursorRing.style.left = x - 20 + 'px';
      cursorRing.style.top = y - 20 + 'px';

      // Create sparkle effect occasionally
      if (Math.random() > 0.95) {
        createSparkle(x, y);
      }
    };

    // Mouse down handler
    const handleMouseDown = () => {
      cursor.classList.add('cursor-click');
      cursorRing.classList.add('cursor-ring-hover');
    };

    // Mouse up handler
    const handleMouseUp = () => {
      cursor.classList.remove('cursor-click');
      cursorRing.classList.remove('cursor-ring-hover');
    };

    // Mouse enter handler for interactive elements
    const handleMouseEnter = (e) => {
      const target = e.target;
      
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        cursor.classList.add('cursor-hover');
        cursorRing.classList.add('cursor-ring-hover');
      } else if (target.matches('p, h1, h2, h3, h4, h5, h6, span, div[contenteditable]')) {
        cursor.classList.add('cursor-text');
        cursorRing.classList.add('cursor-ring-text');
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-hover', 'cursor-text');
      cursorRing.classList.remove('cursor-ring-hover', 'cursor-ring-text');
    };

    // Mouse enter page handler
    const handleMouseEnterPage = () => {
      cursor.classList.remove('cursor-hidden');
      cursorRing.classList.remove('cursor-hidden');
    };

    // Mouse leave page handler
    const handleMouseLeavePage = () => {
      cursor.classList.add('cursor-hidden');
      cursorRing.classList.add('cursor-hidden');
    };

    // Create sparkle effect
    const createSparkle = (x, y) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.style.left = x + (Math.random() - 0.5) * 20 + 'px';
      sparkle.style.top = y + (Math.random() - 0.5) * 20 + 'px';
      
      document.body.appendChild(sparkle);
      
      const timeoutId = setTimeout(() => {
        sparkle.remove();
      }, 600);
      
      sparkleTimeoutRefs.current.push(timeoutId);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnterPage);
    document.addEventListener('mouseleave', handleMouseLeavePage);
    
    // Add hover listeners to interactive elements
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnterPage);
      document.removeEventListener('mouseleave', handleMouseLeavePage);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      
      cursor?.remove();
      cursorRing?.remove();
      
      // Clear sparkle timeouts
      sparkleTimeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  // Return methods to control cursor state
  return {
    setCursorLoading: (loading) => {
      if (cursorRef.current) {
        if (loading) {
          cursorRef.current.classList.add('cursor-loading');
        } else {
          cursorRef.current.classList.remove('cursor-loading');
        }
      }
    },
    hideCursor: () => {
      if (cursorRef.current && cursorRingRef.current) {
        cursorRef.current.classList.add('cursor-hidden');
        cursorRingRef.current.classList.add('cursor-hidden');
      }
    },
    showCursor: () => {
      if (cursorRef.current && cursorRingRef.current) {
        cursorRef.current.classList.remove('cursor-hidden');
        cursorRingRef.current.classList.remove('cursor-hidden');
      }
    }
  };
};