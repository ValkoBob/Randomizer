/** Side-on silhouette, with separate hip and knee joints for the gallop. */
function Leg({ x, y, front, far }: { x: number; y: number; front?: boolean; far?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={far ? 0.65 : 1}>
      <g className={`horse-leg ${front ? 'horse-front' : 'horse-back'} ${far ? 'horse-far' : ''}`}>
        <path d="M-5 -3 Q5 -5 5 3 L3 17 L-2 18 L-5 6 Z" fill="currentColor" />
        <g transform="translate(1 16)">
          <g className="horse-knee">
            <path d="M-3 -2 L3 -1 L1 15 L-4 16 Z" fill="currentColor" />
            <path d="M-5 13 L2 13 L5 18 Q0 20 -6 18 Z" fill="#30251e" />
          </g>
        </g>
      </g>
    </g>
  );
}

export function Horse({ coat, mane, bandana }: { coat: string; mane: string; bandana: string }) {
  return (
    <svg viewBox="0 0 170 116" className="horse-svg" aria-hidden="true">
      <ellipse className="horse-shadow" cx="91" cy="110" rx="60" ry="3" fill="#5a3214" opacity="0.18" />
      <g className="horse-body" stroke="#422a1c" strokeWidth="1.3" strokeLinejoin="round" color={coat}>
        <Leg x={60} y={76} far />
        <Leg x={118} y={75} front far />
        <path className="horse-tail" d="M47 64 Q32 57 22 65 Q16 72 6 68 Q15 82 28 75 L45 73 Z" fill={mane} />
        {/* Rump, barrel, chest and the rising neck form one continuous outline. */}
        <path d="M42 64 Q46 52 65 55 L104 58 Q117 57 123 44 L133 27 L145 31 L142 48 Q138 67 130 78 Q121 90 103 86 L64 86 Q43 88 40 77 Q37 70 42 64 Z" fill={coat} />
        <path d="M131 32 L130 19 L136 24 L139 16 L143 29 L155 34 L166 44 Q168 50 161 53 L147 49 L137 44" fill={coat} />
        <path d="M157 40 L166 44 Q169 50 162 53 L155 50 Z" fill="#d4b48c" stroke="none" />
        <path d="M133 27 Q125 32 121 45 L115 55 L124 52 Q130 43 136 35 Z" fill={mane} />
        <path d="M137 28 Q147 25 150 32 L141 34 Z" fill={mane} />
        <path d="M147 33 L150 39 L147 44 L144 38 Z" fill="#f9e8ce" stroke="none" />
        <circle cx="151" cy="36" r="1.7" fill="#18130e" stroke="none" />
        <circle cx="163" cy="46" r="1.2" fill="#65472f" stroke="none" />
        <path d="M145 43 L158 47 L160 40 M142 47 Q130 50 124 70" fill="none" stroke={mane} strokeWidth="2" />
        <path d="M48 64 Q44 74 53 80 M121 68 Q130 74 121 82" fill="none" opacity="0.3" />
        <Leg x={55} y={78} />
        <Leg x={114} y={78} front />
        {/* Blanket, saddle and stirrup. */}
        <path d="M70 57 L103 59 L101 76 Q86 82 70 73 Z" fill={bandana} />
        <path d="M71 71 Q86 78 100 73" fill="none" stroke="#f8deb1" strokeWidth="2" />
        <path d="M72 56 Q84 62 97 56 L104 54 L103 63 Q88 69 73 63 Z" fill="#58331e" />
        <path d="M100 55 L100 50 L104 50" fill="none" strokeWidth="3" />
        <g className="horse-rider">
          <path d="M85 56 L95 64 L92 82 L85 82 L85 68 L77 62 Z" fill="#315b76" />
          <path d="M85 80 L93 80 L97 85 L97 88 L84 88 Z" fill="#3c2921" />
          <path d="M80 32 Q87 28 96 33 L99 49 L91 59 L77 55 Z" fill="#bd8b4b" />
          <path d="M93 35 L104 44 L117 43 L118 48 L102 50 L90 42" fill="#bd8b4b" />
          <circle cx="118" cy="45" r="3" fill="#efc29a" />
          <path d="M83 31 L94 33 L89 41 Z" fill={bandana} stroke="none" />
          <path d="M84 28 L92 28 L92 34 L84 33 Z" fill="#efc29a" />
          <path d="M80 18 Q90 12 96 20 L96 28 Q90 34 83 28 Z" fill="#efc29a" />
          <path d="M81 20 L84 27 L80 26 Z" fill={mane} stroke="none" />
          <path d="M74 18 Q86 20 103 17 L105 20 Q88 25 73 21 Z" fill="#76502c" />
          <path d="M80 19 L81 9 Q87 6 91 11 L95 9 L98 19 Z" fill="#a77a41" />
          <path d="M81 17 L97 17" stroke="#4d3322" strokeWidth="2.5" />
        </g>
        <path d="M118 46 Q137 60 157 46" fill="none" stroke="#543b26" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
