import type { CSSProperties } from 'react';
import { seededUnit } from '../../elimination';
import { Smoke } from '../ShuffleFx';
import { Avatar } from './Avatar';
import type { SceneProps } from './EliminationStage';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function Crosshair() {
  return (
    <svg className="crosshair" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="34" />
      <circle cx="50" cy="50" r="18" />
      <path d="M50 4 V30 M50 70 V96 M4 50 H30 M70 50 H96" />
      <circle cx="50" cy="50" r="2.5" className="crosshair-dot" />
    </svg>
  );
}

/** Police line-up: the mafia aims at the suspects one by one; whoever is left standing wins. */
export function ShootingScene({ participants, out, target, winnerId, done }: SceneProps) {
  const n = participants.length;
  const cols = Math.min(6, Math.ceil(Math.sqrt(n * 1.6)));
  const lastShot = out[out.length - 1];

  return (
    <div className="lineup" style={{ '--cols': cols, '--cols-small': Math.min(cols, 3) } as Vars}>
      <div className="lineup-smoke" aria-hidden="true">
        <Smoke />
      </div>
      {/* key = shot count, so the flash replays on every shot */}
      {lastShot && <div key={out.length} className="muzzle-flash" aria-hidden="true" />}
      <div className="lineup-grid">
        {participants.map((p) => {
          const shot = out.includes(p.id);
          const className = ['suspect', shot && 'is-shot', p.id === target && 'is-target', done && p.id === winnerId && 'is-winner']
            .filter(Boolean)
            .join(' ');
          return (
            <div
              key={p.id}
              className={className}
              title={p.name}
              style={{ '--hole-x': `${30 + seededUnit(p.id, 3) * 40}%`, '--hole-y': `${22 + seededUnit(p.id, 4) * 36}%`, '--tilt': `${(seededUnit(p.id, 5) - 0.5) * 24}deg` } as Vars}
            >
              <div className="suspect-photo">
                <Avatar participant={p} />
                {p.id === target && <Crosshair />}
                {shot && <span className="bullet-hole" aria-hidden="true" />}
                {shot && <span className="suspect-stamp">✖</span>}
              </div>
              <span className="suspect-name">{p.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
