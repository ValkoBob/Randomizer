import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { ShuffleFxKind } from '../themes/themes';
import { Tumbleweed } from './Tumbleweed';

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

export function Smoke() {
  return (
    <>
      <div className="fx-fog" />
      {PUFFS.map((p, i) => (
        <span
          key={i}
          className={`fx-puff ${p.red ? 'is-red' : ''}`}
          style={{ '--x': `${p.x}%`, '--y': `${p.y}%`, '--s': `${p.s}px`, '--d': `${-p.d - 0.8}s`, '--dx': `${p.dx}px`, '--smoke-duration': `${4.4 + (i % 4) * 0.4}s` } as Vars}
        />
      ))}
    </>
  );
}

/* ───────────── Дикий Захід: перекотиполе і пилюка ───────────── */

/* ───────────── Український: козаки танцюють гопака ───────────── */

const SKIN = '#f1c7a0';
const HAIR = '#3a2414';
const RED = '#c8102e';
const BLUE = '#0057b7';
const LINEN = '#f7f3ea';

export function Cossack() {
  return (
    <svg viewBox="0 0 120 200" className="dancer-svg">
      {/* Shadow on the floor: shrinks while he is in the air */}
      <g className="cossack-shadow">
        <ellipse cx="60" cy="195" rx="30" ry="4.5" fill="rgba(0, 0, 0, 0.28)" />
      </g>
      <g className="cossack-body">
        {/* Legs: baggy sharovary + boots, bending at the knee. Hip 114, knee 153, sole 193. */}
        <g className="cossack-leg leg-back">
          <path d="M57 112 Q54 134 56 156 L76 156 Q83 134 74 112 Z" fill="#a50d26" />
          <g className="cossack-shin shin-back">
            <path d="M57 150 Q54 163 58 175 L73 175 Q78 164 75 150 Z" fill="#a50d26" />
            <path d="M58 172 L73 172 L73 185 L84 188 L84 193 L58 193 Z" fill="#2b150b" />
          </g>
          <ellipse cx="66" cy="153" rx="10" ry="7" fill="#a50d26" />
          <path d="M70 122 Q72 138 69 150" stroke="rgba(0, 0, 0, 0.18)" strokeWidth="2" fill="none" />
        </g>
        <g className="cossack-leg leg-front">
          <path d="M46 112 Q37 134 44 156 L64 156 Q66 134 63 112 Z" fill={RED} />
          <g className="cossack-shin shin-front">
            <path d="M45 150 Q42 164 47 175 L62 175 Q66 163 63 150 Z" fill={RED} />
            <path d="M47 172 L62 172 L62 193 L36 193 L36 188 L47 185 Z" fill="#3a1d10" />
          </g>
          <ellipse cx="54" cy="153" rx="10" ry="7" fill={RED} />
          <path d="M50 122 Q48 138 51 150" stroke="rgba(0, 0, 0, 0.18)" strokeWidth="2" fill="none" />
        </g>
        <g className="cossack-torso">
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
          <g className="cossack-sash">
            <path d="M80 112 L90 136 L84 138 L76 116 Z" fill={BLUE} />
          </g>
          {/* Front arm */}
          <g className="cossack-arm arm-front">
            <path d="M50 72 Q40 92 44 108 L52 108 Q52 92 56 76 Z" fill={LINEN} />
            <path d="M43 102 h10" stroke={RED} strokeWidth="2.5" />
            <circle cx="48" cy="111" r="5" fill={SKIN} />
          </g>
          {/* Head: shaved with an oseledets lock and a long moustache */}
          <g className="cossack-head">
            <rect x="55" y="56" width="10" height="10" fill={SKIN} />
            <circle cx="60" cy="46" r="15" fill={SKIN} />
            <g className="cossack-forelock">
              <path d="M60 31 Q74 22 77 38 Q73 31 63 34 Z" fill={HAIR} />
            </g>
            <circle cx="55" cy="44" r="1.8" fill="#1a1a1a" />
            <circle cx="66" cy="44" r="1.8" fill="#1a1a1a" />
            <path d="M49 52 Q60 47 71 52 Q78 58 76 66 Q70 55 60 56 Q50 55 44 66 Q42 58 49 52 Z" fill={HAIR} />
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
      <div className="dancer dancer-cossack-second">
        <Cossack />
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
