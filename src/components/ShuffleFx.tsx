import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { ShuffleFxKind } from '../themes/themes';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ───────────── Мафія: дим ───────────── */

// x/y in % of the table, size in px, delay in s, drift in px, red = lit by the lamp.
const PUFFS = [
  { x: 50, y: 30, s: 220, d: 0, dx: -40 },
  { x: 38, y: 24, s: 180, d: 0.35, dx: -70, red: true },
  { x: 62, y: 26, s: 190, d: 0.6, dx: 60 },
  { x: 45, y: 18, s: 260, d: 0.9, dx: 30 },
  { x: 56, y: 36, s: 160, d: 1.2, dx: -20, red: true },
  { x: 30, y: 32, s: 200, d: 1.5, dx: -50 },
  { x: 70, y: 30, s: 210, d: 1.75, dx: 50 },
  { x: 50, y: 22, s: 240, d: 2.05, dx: -10 },
  { x: 41, y: 34, s: 170, d: 2.35, dx: 40, red: true },
  { x: 60, y: 20, s: 230, d: 2.6, dx: -60 },
  { x: 24, y: 26, s: 190, d: 0.2, dx: -30 },
  { x: 76, y: 24, s: 180, d: 1.0, dx: 30 },
];

function Smoke() {
  return (
    <>
      <div className="fx-fog" />
      {PUFFS.map((p, i) => (
        <span
          key={i}
          className={`fx-puff ${p.red ? 'is-red' : ''}`}
          style={{ '--x': `${p.x}%`, '--y': `${p.y}%`, '--s': `${p.s}px`, '--d': `${p.d}s`, '--dx': `${p.dx}px` } as Vars}
        />
      ))}
    </>
  );
}

/* ───────────── Дикий Захід: перекотиполе і пилюка ───────────── */

const ROLL_SECONDS = 3.6;
const BOUNCE_SECONDS = 0.6;

/** Tiny seeded PRNG so the tangle looks random but is the same on every render. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// A tangle of curved twigs: each runs between two points near the rim, bending through the inside.
const TWIGS = (() => {
  const rnd = seeded(7);
  const point = (r: number) => {
    const a = rnd() * Math.PI * 2;
    const d = r * (0.75 + rnd() * 0.25);
    return [50 + Math.cos(a) * d, 50 + Math.sin(a) * d].map((v) => v.toFixed(1)).join(' ');
  };
  return Array.from({ length: 34 }, (_, i) => ({
    d: `M${point(44)} Q${point(30)} ${point(44)}`,
    width: 1.2 + rnd() * 1.6,
    color: i % 3 === 0 ? '#c9975a' : i % 3 === 1 ? '#8b5a2b' : '#a8743f',
  }));
})();

function TumbleweedSvg() {
  return (
    <svg viewBox="0 0 100 100" className="tumbleweed-svg">
      <g fill="none" strokeLinecap="round">
        {TWIGS.map((t, i) => (
          <path key={i} d={t.d} stroke={t.color} strokeWidth={t.width} />
        ))}
        <path d="M10 42 l-8 -5 M90 60 l8 4 M44 7 l-3 -7 M60 93 l3 6 M18 80 l-7 5 M82 16 l6 -6" stroke="#8b5a2b" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

// A dust puff wherever the tumbleweed hits the ground.
const LANDINGS = Array.from({ length: Math.floor(ROLL_SECONDS / BOUNCE_SECONDS) }, (_, i) => ((i + 1) * BOUNCE_SECONDS) / ROLL_SECONDS);

function Tumbleweed() {
  return (
    <>
      <div className="fx-dust-haze" />
      {LANDINGS.map((f, i) => (
        <span key={i} className="fx-dust-puff" style={{ '--f': f, '--d': `${f * ROLL_SECONDS}s` } as Vars} />
      ))}
      <div className="tumbleweed-track" style={{ '--roll': `${ROLL_SECONDS}s`, '--bounce': `${BOUNCE_SECONDS}s` } as Vars}>
        <div className="tumbleweed-bounce">
          <TumbleweedSvg />
        </div>
      </div>
    </>
  );
}

/* ───────────── Український: козак і козачка танцюють гопака ───────────── */

const SKIN = '#f1c7a0';
const HAIR = '#3a2414';
const RED = '#c8102e';
const BLUE = '#0057b7';
const YELLOW = '#ffd23f';
const LINEN = '#f7f3ea';

function Cossack() {
  return (
    <svg viewBox="0 0 120 200" className="dancer-svg">
      <g className="cossack-body">
        {/* Legs: baggy red sharovary + boots. The back leg first. */}
        <g className="cossack-leg leg-back">
          <path d="M58 116 Q48 150 56 172 L70 172 Q74 146 70 116 Z" fill="#a50d26" />
          <path d="M56 170 L70 170 L71 186 L82 188 L82 193 L56 193 Z" fill="#2b150b" />
        </g>
        <g className="cossack-leg leg-front">
          <path d="M48 116 Q36 150 46 172 L61 172 Q64 146 62 116 Z" fill={RED} />
          <path d="M46 170 L61 170 L62 186 L74 188 L74 193 L46 193 Z" fill="#3a1d10" />
        </g>
        {/* Back arm */}
        <g className="cossack-arm arm-back">
          <path d="M70 72 Q80 92 76 108 L68 108 Q68 92 64 76 Z" fill="#e9e3d6" />
          <circle cx="72" cy="111" r="5" fill={SKIN} />
        </g>
        {/* Shirt with embroidery and a sash */}
        <path d="M42 72 Q60 62 78 72 L82 118 L38 118 Z" fill={LINEN} />
        <rect x="57" y="68" width="6" height="40" fill={RED} />
        <path d="M57 72 h6 M57 80 h6 M57 88 h6 M57 96 h6" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M50 68 Q60 74 70 68" stroke={RED} strokeWidth="3" fill="none" />
        <rect x="36" y="108" width="48" height="10" rx="2" fill={BLUE} />
        <path d="M80 112 L90 136 L84 138 L76 116 Z" fill={BLUE} />
        {/* Front arm */}
        <g className="cossack-arm arm-front">
          <path d="M50 72 Q40 92 44 108 L52 108 Q52 92 56 76 Z" fill={LINEN} />
          <path d="M43 102 h10" stroke={RED} strokeWidth="2.5" />
          <circle cx="48" cy="111" r="5" fill={SKIN} />
        </g>
        {/* Head: shaved with an oseledets lock and a long moustache */}
        <rect x="55" y="56" width="10" height="10" fill={SKIN} />
        <circle cx="60" cy="46" r="15" fill={SKIN} />
        <path d="M60 31 Q74 22 77 38 Q73 31 63 34 Z" fill={HAIR} />
        <circle cx="55" cy="44" r="1.8" fill="#1a1a1a" />
        <circle cx="66" cy="44" r="1.8" fill="#1a1a1a" />
        <path d="M49 52 Q60 47 71 52 Q78 58 76 66 Q70 55 60 56 Q50 55 44 66 Q42 58 49 52 Z" fill={HAIR} />
      </g>
    </svg>
  );
}

function Kozachka() {
  return (
    <svg viewBox="0 0 120 200" className="dancer-svg">
      <g className="kozachka-spin">
        <g className="kozachka-body">
          {/* Red boots peeking out under the skirt */}
          <path className="boot boot-a" d="M48 170 L58 170 L58 190 L44 192 L44 186 Z" fill={RED} />
          <path className="boot boot-b" d="M62 170 L72 170 L76 186 L76 192 L62 190 Z" fill="#a50d26" />
          {/* Ribbons from the wreath, behind the body */}
          <g className="kozachka-ribbons">
            <path d="M66 36 Q80 70 74 104 L70 104 Q76 70 62 38 Z" fill={BLUE} />
            <path d="M68 36 Q88 66 86 98 L82 98 Q84 66 64 38 Z" fill={YELLOW} />
            <path d="M70 34 Q96 60 96 90 L92 90 Q90 60 66 36 Z" fill={RED} />
          </g>
          {/* Braid */}
          <path d="M70 46 Q78 70 70 96" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Skirt with an embroidered hem */}
          <g className="kozachka-skirt">
            <path d="M42 106 L78 106 L98 168 Q60 180 22 168 Z" fill={RED} />
            <path d="M26 160 L34 154 L42 162 L50 154 L58 162 L66 154 L74 162 L82 154 L90 160" stroke="#1a1a1a" strokeWidth="3" fill="none" />
            <path d="M26 166 Q60 176 94 166" stroke={YELLOW} strokeWidth="2.5" fill="none" />
          </g>
          {/* Hand on hip */}
          <path d="M74 74 Q86 86 80 100 L76 104 L72 98 Q80 88 70 80 Z" fill={LINEN} />
          {/* Blouse and dark-blue vest */}
          <path d="M45 70 Q60 62 75 70 L77 108 L43 108 Z" fill={LINEN} />
          <path d="M46 72 L56 108 L42 108 Z M74 72 L64 108 L78 108 Z" fill="#163a7a" />
          <path d="M54 70 Q60 75 66 70" stroke={RED} strokeWidth="3" fill="none" />
          {/* Raised arm waving a handkerchief */}
          <g className="kozachka-arm">
            <path d="M48 74 Q36 90 40 106 L46 106 Q46 92 54 78 Z" fill={LINEN} />
            <path d="M39 100 h8" stroke={RED} strokeWidth="2.5" />
            <circle cx="43" cy="109" r="4.5" fill={SKIN} />
            <path d="M42 112 Q34 124 40 132 Q44 122 48 114 Z" fill={YELLOW} />
          </g>
          {/* Head with a flower wreath */}
          <rect x="55" y="56" width="10" height="10" fill={SKIN} />
          <circle cx="60" cy="46" r="14" fill={SKIN} />
          <path d="M46 44 Q48 30 60 30 Q72 30 74 44 Q68 36 60 37 Q52 36 46 44 Z" fill={HAIR} />
          <circle cx="55" cy="46" r="1.6" fill="#1a1a1a" />
          <circle cx="65" cy="46" r="1.6" fill="#1a1a1a" />
          <path d="M56 52 Q60 55 64 52" stroke="#9c3b2e" strokeWidth="1.5" fill="none" />
          <circle cx="51" cy="50" r="2.5" fill="#f19a8e" opacity="0.6" />
          <circle cx="69" cy="50" r="2.5" fill="#f19a8e" opacity="0.6" />
          <g className="kozachka-wreath">
            <circle cx="46" cy="36" r="5" fill={RED} />
            <circle cx="53" cy="30" r="5.5" fill={YELLOW} />
            <circle cx="60" cy="28" r="6" fill={RED} />
            <circle cx="67" cy="30" r="5.5" fill={BLUE} />
            <circle cx="74" cy="36" r="5" fill={YELLOW} />
            <circle cx="53" cy="30" r="1.8" fill="#7a4a10" />
            <circle cx="60" cy="28" r="2" fill={YELLOW} />
            <circle cx="74" cy="36" r="1.6" fill="#7a4a10" />
            <path d="M42 40 l-3 3 M78 40 l3 3" stroke="#3e7d2c" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Hopak() {
  return (
    <>
      <div className="dancer dancer-cossack">
        <Cossack />
      </div>
      <div className="dancer dancer-kozachka">
        <Kozachka />
      </div>
    </>
  );
}

const CONTENT: Record<ShuffleFxKind, () => JSX.Element> = { smoke: Smoke, tumbleweed: Tumbleweed, hopak: Hopak };

/** Theme decoration shown over the deck while it is being shuffled. Purely visual. */
export function ShuffleFx({ kind }: { kind: ShuffleFxKind }) {
  const Content = CONTENT[kind];
  return (
    <motion.div
      className={`shuffle-fx fx-${kind}`}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.35 } }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <Content />
    </motion.div>
  );
}
