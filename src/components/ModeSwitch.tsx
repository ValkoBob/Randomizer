import type { ParticipantMode } from '../participants/types';

const MODES: { id: ParticipantMode; label: string }[] = [
  { id: 'photos', label: '📷 Фото' },
  { id: 'names', label: '✍️ Імена' },
];

type ModeSwitchProps = {
  mode: ParticipantMode;
  onChange: (mode: ParticipantMode) => void;
};

/** Photos-only or names-only: two separate participant lists. */
export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-switch" role="radiogroup" aria-label="Режим учасників">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={mode === m.id}
          className={mode === m.id ? 'is-active' : ''}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
