import { useEffect, useRef, type CSSProperties } from 'react';
import { seededUnit } from '../../elimination';
import { Cossack } from '../ShuffleFx';
import { Avatar } from './Avatar';
import type { SceneProps } from './EliminationStage';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Length of one dance cycle in themes.css (`--beat`): the dancers' phases are spread over it. */
const BEAT_S = 2.4;
/** The tired dancer's dance slows down in these steps, ~120 ms apart. */
const TIRED_RATES = [0.75, 0.5, 0.32];

/** Hopak till you drop: the dancers wear out one by one; the last one still dancing wins. */
export function HopakScene({ participants, out, target, winnerId, done }: SceneProps) {
  const n = participants.length;
  const cols = Math.min(8, Math.max(2, Math.ceil(Math.sqrt(n * 2))));
  const floorRef = useRef<HTMLDivElement>(null);

  // Running out of steam: slow the dance down from wherever it is. Swapping to another
  // CSS animation would snap the limbs into a new pose; changing the playback rate doesn't.
  useEffect(() => {
    if (!target) return;
    const svg = floorRef.current?.querySelector('.hopak-dancer.is-target .dancer-svg');
    if (!svg || typeof svg.getAnimations !== 'function') return;
    const animations = svg.getAnimations({ subtree: true });
    const timers = TIRED_RATES.map((rate, i) =>
      window.setTimeout(() => animations.forEach((a) => a.updatePlaybackRate(rate)), i * 120),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [target]);

  return (
    <div ref={floorRef} className="hopak-floor" style={{ '--cols': cols, '--cols-small': Math.min(cols, 3) } as Vars}>
      {participants.map((p) => {
        const fallen = out.includes(p.id);
        const className = ['hopak-dancer', fallen && 'is-fallen', p.id === target && 'is-target', done && p.id === winnerId && 'is-winner']
          .filter(Boolean)
          .join(' ');
        const style = {
          '--lag': `${(-seededUnit(p.id, 9) * BEAT_S).toFixed(2)}s`,
          // Which side they collapse to
          '--dir': seededUnit(p.id, 10) < 0.5 ? -1 : 1,
        } as Vars;
        return (
          <div key={p.id} className={className} title={p.name} style={style}>
            <div className="hopak-figure">
              <div className="hopak-performer" aria-hidden="true">
                <Cossack />
              </div>
              {p.id === target && <span className="hopak-sweat" aria-hidden="true">💦</span>}
              {fallen && <span className="hopak-dizzy" aria-hidden="true">💫</span>}
            </div>
            <div className="hopak-name">
              <Avatar participant={p} className="hopak-avatar" />
              <span>{p.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
