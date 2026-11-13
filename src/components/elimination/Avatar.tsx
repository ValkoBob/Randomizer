import type { Participant } from '../../participants/types';
import { Monogram } from '../Monogram';

/** The participant's photo, or their initials in the names-only mode, filling its box. */
export function Avatar({ participant, className = '' }: { participant: Participant; className?: string }) {
  return (
    <div className={`avatar ${className}`}>
      {participant.src ? <img src={participant.src} alt="" draggable={false} /> : <Monogram name={participant.name} />}
    </div>
  );
}
