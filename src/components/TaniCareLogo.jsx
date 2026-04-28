import React from 'react';

const TaniCareLogo = ({ size = 'md', theme = 'dark' }) => {
  const sizes = {
    sm: { icon: 28, fontSize: '1rem', gap: 8 },
    md: { icon: 44, fontSize: '1.4rem', gap: 12 },
    lg: { icon: 70, fontSize: '2.2rem', gap: 16 },
    splash: { icon: 100, fontSize: '3rem', gap: 20 },
  };

  const { icon, fontSize, gap } = sizes[size] || sizes.md;
  const textColor = theme === 'dark' ? '#ffffff' : '#0d1a15';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, userSelect: 'none' }}>
      {/* SVG Icon: Simple leaf + circuit dot */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#10B981" opacity="0.12" />
        <circle cx="50" cy="50" r="38" fill="#10B981" opacity="0.08" />

        {/* Stem */}
        <line
          x1="50" y1="80" x2="50" y2="45"
          stroke="#10B981" strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Left leaf */}
        <path
          d="M50 55 C35 50, 22 35, 28 20 C35 10, 52 20, 50 45"
          fill="#10B981"
        />

        {/* Right leaf */}
        <path
          d="M50 55 C65 50, 78 35, 72 20 C65 10, 48 20, 50 45"
          fill="#059669"
        />

        {/* Center glow dot */}
        <circle cx="50" cy="45" r="5" fill="#34D399" />

        {/* Root lines */}
        <line x1="50" y1="80" x2="35" y2="92" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
        <line x1="50" y1="80" x2="65" y2="92" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      </svg>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontSize,
            fontWeight: 900,
            color: textColor,
            letterSpacing: '-0.5px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Agro<span style={{ color: '#10B981' }}>Plus</span>
        </span>
        {(size === 'md' || size === 'lg' || size === 'splash') && (
          <span
            style={{
              fontSize: '0.55em',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            Enterprise
          </span>
        )}
      </div>
    </div>
  );
};

export default TaniCareLogo;
