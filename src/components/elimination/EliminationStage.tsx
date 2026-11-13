import { useEffect, useRef, type CSSProperties } from 'react';
import type { Participant } from '../../participants/types';
import type { EliminationKind } from '../../themes/themes';
import { HopakScene } from './HopakScene';
import { RaceScene } from './RaceScene';
import { ShootingScene } from './ShootingScene';
import { TreeScene } from './TreeScene';

export type SceneProps = {
  /** Everyone in the round, in the shuffled order. */
  participants: Participant[];
  /** Knocked-out ids, in the order they went. */
  out: string[];
  /** The one about to go (aimed at, shaken, stumbling, worn out). */
  target: string | null;
  winnerId: string | null;
  /** Only the winner is left. */
  done: boolean;
  /** Length of one knock-out step, for the CSS timings. */
  stepMs: number;
};

const SCENES: Record<EliminationKind, (props: SceneProps) => JSX.Element> = {
  tree: TreeScene,
  shooting: ShootingScene,
  race: RaceScene,
  hopak: HopakScene,
};

/** Replaces the dealt-out cards with the theme's "last one standing" scene. */
export function EliminationStage({ kind, ...props }: SceneProps & { kind: EliminationKind }) {
  const Scene = SCENES[kind];
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = stageRef.current;
    if (!root || kind === 'tree') return;
    const stage = kind === 'race' ? root.querySelector<HTMLElement>('.race-lanes') : root;
    if (!stage) return;
    const active = stage.querySelector<HTMLElement>('.is-target, .is-winner');
    if (!active) return;
    // Scroll only the scene, keeping the controls and the rest of the page still.
    const reveal = () => {
      const bounds = stage.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      // Entrance scaling changes CSS pixels relative to the viewport until it settles.
      const scale = bounds.height > 0 ? stage.clientHeight / bounds.height : 1;
      if (item.bottom > bounds.bottom - 24) stage.scrollTop += (item.bottom - bounds.bottom + 24) * scale;
      else if (item.top < bounds.top + 24) stage.scrollTop += (item.top - bounds.top - 24) * scale;
    };
    reveal();
    // Recheck after the winner's scale/spotlight transition has reached its final size.
    const timer = setTimeout(reveal, 600);
    return () => clearTimeout(timer);
  }, [props.target, props.done, kind]);
  return (
    <div ref={stageRef} className={`scene scene-${kind} ${props.done ? 'is-done' : ''}`} style={{ '--step': `${props.stepMs}ms` } as CSSProperties}>
      <Scene {...props} />
    </div>
  );
}
