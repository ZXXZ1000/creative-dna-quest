import React, { useEffect, useMemo, useState } from 'react';

interface LogoProps {
  src: string;
  alt?: string;
  height?: string | number; // e.g. '24px' or number for px
  className?: string;
  style?: React.CSSProperties;
}

// Convert white background of a raster logo to transparent at runtime via Canvas
export const Logo: React.FC<LogoProps> = ({ src, alt = 'Logo', height, className, style }) => {
  const cacheKey = useMemo(() => `logo-transparent:${src}`, [src]);
  const [transparentSrc, setTransparentSrc] = useState<string | null>(() => {
    try {
      return localStorage.getItem(cacheKey);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (transparentSrc) return;

    const img = new Image();
    // Same-origin by default; anonymous avoids accidental credentialed requests
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        // Treat near-white (very light) pixels as background and make transparent
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          // Threshold for white background; adjust if needed
          if (r > 245 && g > 245 && b > 245) {
            d[i + 3] = 0; // alpha -> 0
          }
        }
        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL('image/png');
        try {
          localStorage.setItem(cacheKey, url);
        } catch {}
        setTransparentSrc(url);
      } catch {
        // Fallback silently; we'll keep original src
        setTransparentSrc(src);
      }
    };
    img.onerror = () => setTransparentSrc(src);
  }, [src, cacheKey, transparentSrc]);

  const computedStyle: React.CSSProperties = { ...(style || {}) };
  if (height !== undefined) {
    // Accept number (px) or string value
    computedStyle.height = typeof height === 'number' ? `${height}px` : height;
    computedStyle.width = 'auto';
  }

  return (
    <img
      src={transparentSrc || src}
      alt={alt}
      className={className}
      style={computedStyle}
    />
  );
};

