'use client';

import { useEffect } from 'react';

export default function SecurityProtection() {
  useEffect(() => {
    // Block right-click (context menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Block keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.shiftKey && e.key === 'K') ||
        (e.ctrlKey && e.shiftKey && e.key === 'k')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Detect dev tools via debugger
    const detectDevTools = () => {
      const devtools = /./ as any;
      devtools.toString = function() {
        this.opened = true;
        return '';
      };
      console.log('%c', devtools);
      if (devtools.opened) {
        // Dev tools detected - could redirect or take action
        console.clear();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);

    // ⚠️ LEFT-CLICK BLOCKING ENABLED - Your site will be unusable
    // To enable: uncomment the line below
    // document.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);

    // Run dev tools detection
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      clearInterval(devToolsInterval);
    };
  }, []);

  return null;
}
