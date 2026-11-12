import React, { useState, useEffect } from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: boolean | string;
  className?: string;
  onClick?: () => void;
}

const ORIGINAL_LOGO_SRC = '/assets/aistudio/WhatsApp_Image_2026-10-27_at_1.54.43_PM_08f3d101.jpeg';
const DEFAULT_SUBTITLE = 'AI Powered Career Intelligence & Employability Platform';

// In-memory module cache for the transparent logo dataURL so all instances reuse it instantly
let cachedTransparentLogo: string | null = null;
const listeners = new Set<(url: string) => void>();

function processTransparentLogo() {
  if (typeof window === 'undefined') return;
  if (cachedTransparentLogo) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = ORIGINAL_LOGO_SRC;

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Anti-aliased white background removal
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Identify pure and near-white background pixels
        if (r > 230 && g > 230 && b > 230) {
          const brightness = (r + g + b) / 3;
          if (brightness >= 248) {
            data[i + 3] = 0; // Fully transparent
          } else {
            // Smooth gradient alpha for soft anti-aliased edges
            const factor = (255 - brightness) / 25; // 0 at 255, 1 at 230
            data[i + 3] = Math.min(255, Math.max(0, Math.round(data[i + 3] * factor)));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentUrl = canvas.toDataURL('image/png');
      cachedTransparentLogo = transparentUrl;
      listeners.forEach((fn) => fn(transparentUrl));
    } catch {
      // Fallback gracefully to original asset
    }
  };
}

// Kick off processing
if (typeof window !== 'undefined') {
  processTransparentLogo();
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = true,
  className = '',
  onClick
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(cachedTransparentLogo || ORIGINAL_LOGO_SRC);

  useEffect(() => {
    if (cachedTransparentLogo) {
      setLogoSrc(cachedTransparentLogo);
      return;
    }

    const handler = (url: string) => setLogoSrc(url);
    listeners.add(handler);
    processTransparentLogo();

    return () => {
      listeners.delete(handler);
    };
  }, []);

  const sizeMap = {
    xs: {
      box: 'w-6 h-6 p-0.5 rounded-md',
      img: 'w-full h-full object-contain',
      title: 'text-sm font-bold',
      sub: 'text-[9px]'
    },
    sm: {
      box: 'w-8 h-8 p-0.5 rounded-lg',
      img: 'w-full h-full object-contain',
      title: 'text-base font-bold',
      sub: 'text-[10px]'
    },
    md: {
      box: 'w-10 h-10 p-1 rounded-xl',
      img: 'w-full h-full object-contain',
      title: 'text-lg font-extrabold',
      sub: 'text-[11px]'
    },
    lg: {
      box: 'w-12 h-12 p-1.5 rounded-2xl',
      img: 'w-full h-full object-contain',
      title: 'text-2xl font-extrabold',
      sub: 'text-xs'
    },
    xl: {
      box: 'w-16 h-16 p-2 rounded-2xl',
      img: 'w-full h-full object-contain',
      title: 'text-3xl font-black',
      sub: 'text-sm'
    }
  };

  const currentSize = sizeMap[size];

  // Resolve custom or default subtitle
  const subtitleText = typeof subtitle === 'string' ? subtitle : DEFAULT_SUBTITLE;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
    >
      {/* Emblem Tile: Beautiful glass container in dark mode, pristine card in light mode */}
      <div
        className={`${currentSize.box} relative flex items-center justify-center shrink-0 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs dark:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all duration-200 group-hover:scale-105 group-hover:shadow-md`}
      >
        <img
          src={logoSrc}
          alt="CareerIQ Logo"
          className={`${currentSize.img} transition-all duration-200 dark:brightness-110 dark:contrast-105 filter`}
          loading="eager"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-1 leading-none">
            <span className={`${currentSize.title} tracking-tight text-slate-900 dark:text-white font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
              Career<span className="text-blue-600 dark:text-blue-400">IQ</span>
            </span>
          </div>

          {subtitle && (
            <p
              title={subtitleText}
              className={`${currentSize.sub} font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate max-w-[200px] xs:max-w-[260px] sm:max-w-xs md:max-w-md lg:max-w-lg`}
            >
              {subtitleText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
