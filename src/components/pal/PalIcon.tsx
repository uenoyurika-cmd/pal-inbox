import React from 'react';

type PalVariant = 'sitting' | 'alert' | 'sleeping' | 'thinking' | 'suggesting' | 'jumping' | 'tilting' | 'pawprint';

interface PalIconProps {
  variant?: PalVariant;
  size?: number;
  className?: string;
}

export const PalIcon: React.FC<PalIconProps> = ({ 
  variant = 'sitting', 
  size = 48, 
  className = '' 
}) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  // Sitting - dog sitting, looking ahead
  if (variant === 'sitting') {
    return (
      <svg {...svgProps}>
        {/* Head */}
        <circle cx="24" cy="18" r="8" />
        {/* Ears */}
        <path d="M 16 12 Q 14 6 12 10" />
        <path d="M 32 12 Q 34 6 36 10" />
        {/* Eyes */}
        <circle cx="21" cy="16" r="1.5" fill="currentColor" />
        <circle cx="27" cy="16" r="1.5" fill="currentColor" />
        {/* Snout */}
        <path d="M 24 20 L 24 24" />
        <circle cx="22" cy="25" r="1" fill="currentColor" />
        <circle cx="26" cy="25" r="1" fill="currentColor" />
        {/* Body */}
        <path d="M 18 26 L 18 36" />
        <path d="M 30 26 L 30 36" />
        {/* Front paws */}
        <path d="M 18 36 L 18 40" />
        <path d="M 30 36 L 30 40" />
        {/* Tail */}
        <path d="M 32 30 Q 38 28 40 20" />
      </svg>
    );
  }

  // Alert - dog alert/serious expression
  if (variant === 'alert') {
    return (
      <svg {...svgProps}>
        {/* Head */}
        <circle cx="24" cy="16" r="8" />
        {/* Ears - alert position (up) */}
        <path d="M 16 10 L 14 4" />
        <path d="M 32 10 L 34 4" />
        {/* Eyes - alert/serious */}
        <circle cx="21" cy="14" r="1.5" fill="currentColor" />
        <circle cx="27" cy="14" r="1.5" fill="currentColor" />
        <path d="M 20 12 L 22 12" />
        <path d="M 26 12 L 28 12" />
        {/* Snout - tense */}
        <path d="M 24 18 L 24 22" />
        <path d="M 22 23 L 26 23" />
        {/* Body - alert posture */}
        <path d="M 20 24 L 18 35" />
        <path d="M 28 24 L 30 35" />
        {/* Front paws */}
        <path d="M 18 35 L 18 40" />
        <path d="M 30 35 L 30 40" />
        {/* Tail - alert (straight up) */}
        <path d="M 31 26 L 34 16" />
      </svg>
    );
  }

  // Sleeping - dog lying down relaxed
  if (variant === 'sleeping') {
    return (
      <svg {...svgProps}>
        {/* Head */}
        <circle cx="18" cy="28" r="7" />
        {/* Ears - relaxed down */}
        <path d="M 12 28 Q 10 24 10 20" />
        <path d="M 24 28 Q 26 24 26 20" />
        {/* Eyes - closed */}
        <path d="M 16 26 Q 16 28 18 28" />
        <path d="M 20 26 Q 20 28 22 28" />
        {/* Snout */}
        <circle cx="18" cy="32" r="1.5" fill="currentColor" />
        {/* Body - lying down */}
        <path d="M 25 28 Q 32 28 38 26" />
        {/* Back paws */}
        <path d="M 35 26 L 35 32" />
        <path d="M 38 26 L 38 32" />
        {/* Front paws */}
        <path d="M 13 35 L 13 40" />
        <path d="M 10 35 L 10 40" />
        {/* Z (sleeping) */}
        <path d="M 28 10 L 32 10 L 28 14" />
      </svg>
    );
  }

  // Thinking - dog with pen, thinking
  if (variant === 'thinking') {
    return (
      <svg {...svgProps}>
        {/* Head */}
        <circle cx="24" cy="16" r="8" />
        {/* Ears */}
        <path d="M 16 10 Q 14 4 12 8" />
        <path d="M 32 10 Q 34 4 36 8" />
        {/* Eyes - thinking */}
        <circle cx="21" cy="14" r="1.5" fill="currentColor" />
        <circle cx="27" cy="14" r="1.5" fill="currentColor" />
        {/* Snout - mouth open thinking */}
        <path d="M 24 18 L 24 22" />
        <path d="M 22 22 Q 24 24 26 22" />
        {/* Body */}
        <path d="M 18 24 L 18 36" />
        <path d="M 30 24 L 30 36" />
        {/* Paws */}
        <path d="M 18 36 L 18 40" />
        <path d="M 30 36 L 30 40" />
        {/* Pen in paw */}
        <path d="M 14 32 L 12 38" strokeWidth="1.5" />
        <circle cx="11" cy="40" r="1.5" fill="currentColor" />
        {/* Thought bubble */}
        <circle cx="40" cy="8" r="2" />
        <circle cx="38" cy="12" r="2.5" />
        <circle cx="35" cy="16" r="3" />
      </svg>
    );
  }

  // Suggesting - dog with lightbulb/happy
  if (variant === 'suggesting') {
    return (
      <svg {...svgProps}>
        {/* Head */}
        <circle cx="24" cy="18" r="8" />
        {/* Ears - happy up */}
        <path d="M 16 12 Q 14 6 12 10" />
        <path d="M 32 12 Q 34 6 36 10" />
        {/* Eyes - happy */}
        <circle cx="21" cy="16" r="1.5" fill="currentColor" />
        <circle cx="27" cy="16" r="1.5" fill="currentColor" />
        {/* Mouth - big smile */}
        <path d="M 22 21 Q 24 23 26 21" />
        {/* Body */}
        <path d="M 18 26 L 18 36" />
        <path d="M 30 26 L 30 36" />
        {/* Paws */}
        <path d="M 18 36 L 18 40" />
        <path d="M 30 36 L 30 40" />
        {/* Tail - happy wag */}
        <path d="M 32 30 Q 38 26 40 22" />
        {/* Lightbulb idea */}
        <circle cx="40" cy="10" r="3" />
        <path d="M 38 13 L 42 13" />
        <path d="M 37 15 L 43 15" />
        <path d="M 38 17 L 42 17" />
      </svg>
    );
  }

  // Jumping - dog jumping happily
  if (variant === 'jumping') {
    return (
      <svg {...svgProps} className={`${className} animate-bounce-gentle`}>
        {/* Head */}
        <circle cx="24" cy="12" r="8" />
        {/* Ears - happy up */}
        <path d="M 16 6 Q 14 0 12 4" />
        <path d="M 32 6 Q 34 0 36 4" />
        {/* Eyes - happy */}
        <circle cx="21" cy="10" r="1.5" fill="currentColor" />
        <circle cx="27" cy="10" r="1.5" fill="currentColor" />
        {/* Mouth - big smile */}
        <path d="M 22 15 Q 24 17 26 15" />
        {/* Body */}
        <path d="M 18 20 L 18 30" />
        <path d="M 30 20 L 30 30" />
        {/* Back paws */}
        <path d="M 18 30 L 18 36" />
        <path d="M 30 30 L 30 36" />
        {/* Tail - happy high */}
        <path d="M 32 24 Q 40 20 42 10" />
      </svg>
    );
  }

  // Tilting - dog tilting head (loading)
  if (variant === 'tilting') {
    return (
      <svg {...svgProps} className={`${className} animate-tilt`}>
        {/* Head - tilted */}
        <circle cx="24" cy="18" r="8" />
        {/* Ears - tilted */}
        <path d="M 16 12 Q 14 6 12 10" />
        <path d="M 32 12 Q 34 6 36 10" />
        {/* Eyes - curious */}
        <circle cx="21" cy="16" r="1.5" fill="currentColor" />
        <circle cx="27" cy="16" r="1.5" fill="currentColor" />
        {/* Question mark above */}
        <path d="M 40 6 Q 40 4 42 4 Q 44 4 44 6 Q 44 8 42 9" />
        <circle cx="42" cy="12" r="0.8" fill="currentColor" />
        {/* Snout */}
        <path d="M 24 20 L 24 24" />
        {/* Body */}
        <path d="M 18 26 L 18 36" />
        <path d="M 30 26 L 30 36" />
        {/* Paws */}
        <path d="M 18 36 L 18 40" />
        <path d="M 30 36 L 30 40" />
      </svg>
    );
  }

  // Pawprint - just a pawprint
  if (variant === 'pawprint') {
    return (
      <svg {...svgProps}>
        {/* Main pad */}
        <circle cx="24" cy="28" r="6" />
        {/* Toe pads */}
        <circle cx="12" cy="12" r="3" />
        <circle cx="24" cy="8" r="3" />
        <circle cx="36" cy="12" r="3" />
        <circle cx="40" cy="24" r="3" />
      </svg>
    );
  }

  return null;
};

export default PalIcon;
