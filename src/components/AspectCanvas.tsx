import React, { useEffect, useRef, useState } from 'react';
import { CanvasContext } from '../contexts/CanvasContext';

interface AspectCanvasProps {
  children: React.ReactNode;
}

// A centered 9:18 canvas with letterbox background
export const AspectCanvas: React.FC<AspectCanvasProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-screen h-[100dvh] bg-white flex items-center justify-center overflow-hidden">
      <div ref={ref} className="relative aspect-[9/18] h-full max-w-full w-auto">
        <CanvasContext.Provider value={size}>
          <div className="absolute inset-0">
            {children}
          </div>
        </CanvasContext.Provider>
      </div>
    </div>
  );
};

