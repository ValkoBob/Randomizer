import type { CSSProperties } from 'react';
import { RACE_FINISH, raceProgress, seededUnit } from '../../elimination';
import { hueFromName } from '../../participants/names';
import { Tumbleweed } from '../Tumbleweed';
import { Avatar } from './Avatar';
import { Horse } from './Horse';
import type { SceneProps } from './EliminationStage';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const COATS = ['#7a4a26', '#3b2416', '#a0612d', '#d9c4a0', '#5b5b5b', '#8c3b1e', '#e8e2d6'];
const MANES = ['#2b1a10', '#120c08', '#4a2c16', '#8a7656', '#222222', '#3a1a0c', '#9a948a'];

/** Horse race: each knock-out, a horse stumbles and drops back; whoever reaches the line wins. */
export function RaceScene({ participants, out, target, winnerId, done, stepMs }: SceneProps) {
  const n = participants.length;
  const totalTicks = Math.max(1, 2 * (n - 1));
  const tick = out.length * 2 + (target ? 1 : 0);
  const laneH = Math.max(42, Math.min(76, Math.floor(560 / Math.max(1, n))));

  return (
    <div className="race" style={{ '--lane-h': `${laneH}px`, '--finish': `${RACE_FINISH}%`, '--travel': `${stepMs * (target ? 0.45 : 0.55)}ms` } as Vars}>
      <div className="race-heading" aria-hidden="true"><span>ПРЕРІЯ · ВЕЛИКІ СКАЧКИ</span><span>ФІНІШ 🏁</span></div>
      <div className="race-lanes">
        {participants.map((p) => {
          const outIndex = out.indexOf(p.id);
          const fallen = outIndex >= 0;
          const left = fallen
            ? raceProgress(p.id, 2 * outIndex + 1, totalTicks, false, false)
            : raceProgress(p.id, tick, totalTicks, done, p.id === winnerId);
          const coat = Math.floor(seededUnit(p.id, 7) * COATS.length);
          const className = ['lane', fallen && 'is-fallen', p.id === target && 'is-target', done && p.id === winnerId && 'is-winner']
            .filter(Boolean)
            .join(' ');
          return (
            <div key={p.id} className={className} title={p.name}>
              <div className="lane-label">
                <Avatar participant={p} className="lane-avatar" />
                <span className="lane-name">{p.name}</span>
                {done && p.id === winnerId && <span className="lane-medal" aria-label="Переможець">🏆</span>}
              </div>
              <div className="lane-track">
                <div className="lane-run">
                  <div className="runner" style={{ left: `${left}%`, '--gallop': `${(0.42 + seededUnit(p.id, 8) * 0.12).toFixed(2)}s` } as Vars}>
                    <Horse coat={COATS[coat]} mane={MANES[coat]} bandana={`hsl(${hueFromName(p.name)} 70% 45%)`} />
                    {fallen && <span className="runner-dust" aria-hidden="true" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Tumbleweed className="race-tumbleweed" durationMs={5600} loop />
    </div>
  );
}
