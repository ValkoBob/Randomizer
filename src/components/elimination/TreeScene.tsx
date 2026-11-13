import { useMemo, type CSSProperties } from 'react';
import { seededUnit, TREE_FLOOR_Y, TREE_VIEWBOX, treeLayout } from '../../elimination';
import type { Participant } from '../../participants/types';
import { Avatar } from './Avatar';
import type { SceneProps } from './EliminationStage';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const RING_COLORS = ['#e0303a', '#f5c542', '#2f7de1', '#c0c7d0', '#9b3fd6', '#1fae5b'];
// Below this ball size (% of the tree width) names would pile up on each other: they go into a tooltip.
const MIN_LABELLED_SIZE = 7;

const LIGHTS = [
  [118, 92], [150, 100], [182, 92], [100, 160], [134, 170], [166, 170], [200, 160],
  [70, 240], [104, 252], [138, 258], [172, 258], [206, 252], [238, 240], [124, 120], [178, 126],
];

function TreeSvg() {
  return (
    <svg viewBox={`0 0 ${TREE_VIEWBOX.width} ${TREE_VIEWBOX.height}`} className="tree-svg" aria-hidden="true">
      <defs>
        <linearGradient id="tree-green" x1="0" x2="1">
          <stop offset="0" stopColor="#14532d" />
          <stop offset="0.55" stopColor="#1f7a3f" />
          <stop offset="1" stopColor="#12492a" />
        </linearGradient>
      </defs>
      {/* Gifts under the tree */}
      <rect x="34" y="318" width="46" height="34" rx="3" fill="#2f7de1" />
      <path d="M57 318 v34 M34 333 h46" stroke="#f5c542" strokeWidth="5" />
      <rect x="222" y="326" width="40" height="26" rx="3" fill="#9b3fd6" />
      <path d="M242 326 v26 M222 338 h40" stroke="#ffffff" strokeWidth="4" />
      {/* Trunk and the bucket */}
      <rect x="138" y="286" width="24" height="34" fill="#6b3e1f" />
      <path d="M112 314 L188 314 L180 352 L120 352 Z" fill="#b3202a" />
      <rect x="114" y="322" width="72" height="6" fill="#f5c542" />
      {/* Three tiers of branches with scalloped edges */}
      <path d="M150 140 L292 292 Q256 282 221 295 Q186 282 150 295 Q114 282 79 295 Q44 282 8 292 Z" fill="url(#tree-green)" />
      <path d="M150 70 L252 206 Q226 196 201 208 Q176 196 150 208 Q124 196 99 208 Q74 196 48 206 Z" fill="url(#tree-green)" />
      <path d="M150 36 L214 124 Q198 116 182 126 Q166 116 150 126 Q134 116 118 126 Q102 116 86 124 Z" fill="url(#tree-green)" />
      {/* Garland */}
      <g fill="none" stroke="#f5c542" strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round">
        <path d="M100 110 Q150 132 204 104" />
        <path d="M66 190 Q150 222 236 186" />
        <path d="M30 276 Q150 312 272 272" />
      </g>
      <g className="tree-lights">
        {LIGHTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.2" fill={RING_COLORS[i % RING_COLORS.length]} style={{ animationDelay: `${(i % 5) * 0.3}s` }} />
        ))}
      </g>
      {/* Star */}
      <path
        className="tree-star"
        d="M150 6 L155.3 19.7 L169.9 20.5 L158.5 29.7 L162.2 43.9 L150 35.9 L137.8 43.9 L141.5 29.7 L130.1 20.5 L144.7 19.7 Z"
        fill="#ffd54a"
        stroke="#f0a800"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Santa, a little tipsy: one hand shakes the tree, the other holds a bottle. Faces right, towards the tree. */
function Santa({ shaking }: { shaking: boolean }) {
  return (
    <div className={`santa ${shaking ? 'is-shaking' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 140 200" className="santa-svg">
        <g className="santa-body">
          {/* Boots and trousers */}
          <path d="M44 182 h18 v14 h-26 q0 -10 8 -14 z" fill="#1b1b1b" />
          <path d="M70 182 h18 q12 4 12 14 h-30 z" fill="#1b1b1b" />
          <path d="M44 146 h20 v38 h-20 z M68 146 h20 v38 h-20 z" fill="#a8141c" />
          {/* Arm with the bottle, behind the coat */}
          <g className="santa-arm-bottle">
            <path d="M40 90 Q26 110 24 132 L35 134 Q37 113 48 97 Z" fill="#c4232b" />
            <rect x="21" y="128" width="15" height="6" rx="2" fill="#ffffff" />
            <circle cx="29" cy="139" r="6" fill="#1b1b1b" />
            <rect x="26" y="141" width="6" height="11" fill="#2e7d32" />
            <rect x="21" y="150" width="16" height="28" rx="5" fill="#2e7d32" />
            <rect x="21" y="158" width="16" height="9" fill="#f2e6c9" />
            <path d="M25 154 v18" stroke="#a5d6a7" strokeWidth="2" opacity="0.6" />
          </g>
          {/* Coat, fur trim and belt */}
          <path d="M30 96 Q34 78 66 76 Q98 78 102 100 L106 150 Q66 162 26 150 Z" fill="#d42a2a" />
          <path d="M26 146 Q66 160 106 146 L106 157 Q66 171 26 157 Z" fill="#ffffff" />
          <rect x="62" y="80" width="8" height="68" fill="#ffffff" />
          <rect x="27" y="118" width="80" height="11" fill="#1b1b1b" />
          <rect x="58" y="116" width="16" height="15" rx="2" fill="none" stroke="#f2c230" strokeWidth="3" />
          {/* Head */}
          <g className="santa-head">
            <circle cx="72" cy="56" r="17" fill="#f6cfb0" />
            <path d="M54 56 Q52 88 72 96 Q95 89 92 58 Q86 71 72 71 Q60 71 54 56 Z" fill="#ffffff" />
            <circle cx="66" cy="62" r="4.5" fill="#f28b82" opacity="0.7" />
            <path d="M66 67 Q75 60 88 66 Q81 71 75 69 Q70 72 66 67 Z" fill="#f2f2f2" />
            <circle cx="86" cy="60" r="7" fill="#e5483d" />
            <circle cx="84" cy="57.5" r="2" fill="#ffffff" opacity="0.7" />
            {/* Sleepy, half-closed eyes */}
            <path d="M70 52 q4 2.5 8 0" stroke="#2b1a10" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M70 50.5 h8" stroke="#e9b996" strokeWidth="2" />
            <path d="M68 46 q5 -3 10 0" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Hat slipping to the back */}
            <path d="M56 41 Q58 18 38 12 Q26 10 22 28 Q34 20 42 26 Q50 32 90 41 Z" fill="#d42a2a" />
            <rect x="52" y="37" width="42" height="9" rx="4.5" fill="#ffffff" transform="rotate(-6 73 41)" />
            <circle cx="21" cy="31" r="6.5" fill="#ffffff" />
          </g>
          {/* Arm gripping the tree */}
          <g className="santa-arm-grip">
            <path d="M84 86 Q112 94 130 116 L122 123 Q104 106 82 103 Z" fill="#d42a2a" />
            <rect x="118" y="111" width="14" height="7" rx="2" fill="#ffffff" transform="rotate(42 125 114)" />
            <circle cx="132" cy="122" r="7" fill="#1b1b1b" />
          </g>
        </g>
        <text className="santa-hic" x="100" y="26">
          ік!
        </text>
      </svg>
    </div>
  );
}

function Ornament({ participant, index, size, labelled, className }: { participant: Participant; index: number; size: number; labelled: boolean; className: string }) {
  return (
    <>
      <span className="ornament-cap" />
      <Avatar participant={participant} className="ornament-ball" />
      <span className="ornament-gloss" />
      {labelled && <span className="ornament-name">{participant.name}</span>}
      {className.includes('is-fallen') && (
        <>
          <svg className="ornament-crack" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M48 8 L56 34 L40 50 L60 66 L50 92 M56 34 L78 30 M40 50 L18 56" />
          </svg>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="ornament-shard" style={{ '--a': `${i * 60 + index * 17}deg`, '--size': `${size}` } as Vars} />
          ))}
        </>
      )}
    </>
  );
}

export function TreeScene({ participants, out, target, winnerId, done, stepMs }: SceneProps) {
  const { slots, size } = useMemo(() => treeLayout(participants.length), [participants.length]);
  const outSet = new Set(out);
  const labelled = size >= MIN_LABELLED_SIZE;
  const fallSeconds = Math.min(0.8, (stepMs * 0.5) / 1000);
  const floor = (TREE_FLOOR_Y / TREE_VIEWBOX.height) * 100 - (size / 2) * (TREE_VIEWBOX.width / TREE_VIEWBOX.height);
  const box = (p: Participant, i: number): Vars => ({
    width: `${size}%`,
    marginLeft: `${-size / 2}%`,
    marginTop: `${-size / 2}%`,
    '--ring': RING_COLORS[i % RING_COLORS.length],
    '--lag': `${(-seededUnit(p.id) * 2.6).toFixed(2)}s`,
    '--fall': `${fallSeconds}s`,
  });

  return (
    <div className="tree-stage">
      <Santa shaking={target !== null} />
      <div className="tree-area">
        <div className={`tree-sway ${target ? 'is-shaking' : ''}`}>
          <TreeSvg />
          {participants.map((p, i) => {
            if (outSet.has(p.id)) return null;
            const className = `ornament ${p.id === target ? 'is-target' : ''} ${done && p.id === winnerId ? 'is-winner' : ''}`;
            return (
              <div key={p.id} className={className} title={p.name} style={{ ...box(p, i), left: `${slots[i].x}%`, top: `${slots[i].y}%` }}>
                <Ornament participant={p} index={i} size={size} labelled={labelled || (done && p.id === winnerId)} className={className} />
              </div>
            );
          })}
        </div>
        {participants.map((p, i) => {
          if (!outSet.has(p.id)) return null;
          const edge = size / 2 + 2;
          const landX = Math.min(100 - edge, Math.max(edge, slots[i].x + (seededUnit(p.id, 1) - 0.5) * 34));
          return (
            <div
              key={p.id}
              className="ornament is-fallen"
              title={p.name}
              style={{
                ...box(p, i),
                '--x0': `${slots[i].x}%`,
                '--y0': `${slots[i].y}%`,
                '--x1': `${landX}%`,
                '--y1': `${floor}%`,
                '--spin': `${((seededUnit(p.id, 2) - 0.5) * 540).toFixed(0)}deg`,
              } as Vars}
            >
              <Ornament participant={p} index={i} size={size} labelled={false} className="is-fallen" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
