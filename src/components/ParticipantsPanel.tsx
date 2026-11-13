import { useEffect, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Participant, ParticipantMode, WinnerRecord } from '../participants/types';
import type { AddNamesResult } from '../participants/useNameParticipants';
import type { AddFilesResult } from '../participants/useParticipants';
import { ModeSwitch } from './ModeSwitch';
import { Monogram } from './Monogram';
import { NamePicker } from './NamePicker';
import { PhotoPicker } from './PhotoPicker';

type ParticipantsPanelProps = {
  open: boolean;
  onClose: () => void;
  mode: ParticipantMode;
  onModeChange: (mode: ParticipantMode) => void;
  participants: Participant[];
  onAddFiles: (files: File[]) => Promise<AddFilesResult>;
  onAddNames: (names: string[]) => AddNamesResult;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  excludeWinners: boolean;
  onExcludeWinnersChange: (value: boolean) => void;
  winners: WinnerRecord[];
  onClearWinners: () => void;
};

export function ParticipantsPanel({
  open,
  onClose,
  mode,
  onModeChange,
  participants,
  onAddFiles,
  onAddNames,
  onRename,
  onRemove,
  onClear,
  excludeWinners,
  onExcludeWinnersChange,
  winners,
  onClearWinners,
}: ParticipantsPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const winnerIds = new Set(winners.map((w) => w.id));

  const commitName = (participant: Participant) => (event: FocusEvent<HTMLInputElement>) => {
    const name = event.target.value.trim();
    if (!name) event.target.value = participant.name;
    else if (name !== participant.name) onRename(participant.id, name);
  };

  const blurOnEnter = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur();
  };

  const confirmRemove = (participant: Participant) => {
    if (window.confirm(`Видалити «${participant.name}» з учасників?`)) onRemove(participant.id);
  };

  const confirmClear = () => {
    if (window.confirm('Видалити всіх учасників?')) onClear();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="panel-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="panel"
            aria-label="Учасники"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            <div className="panel-header">
              <h2>Учасники · {participants.length}</h2>
              <button type="button" className="btn-icon" onClick={onClose} aria-label="Закрити">
                ✕
              </button>
            </div>

            <div className="panel-picker">
              <ModeSwitch mode={mode} onChange={onModeChange} />
              {mode === 'photos' ? <PhotoPicker onAddFiles={onAddFiles} /> : <NamePicker onAddNames={onAddNames} />}
            </div>

            <ul className="participant-list">
              {participants.map((p) => (
                <li key={p.id}>
                  {p.src ? <img src={p.src} alt="" /> : <Monogram name={p.name} />}
                  <input
                    key={p.name}
                    className="participant-name"
                    defaultValue={p.name}
                    maxLength={40}
                    aria-label="Ім'я учасника"
                    onBlur={commitName(p)}
                    onKeyDown={blurOnEnter}
                  />
                  {winnerIds.has(p.id) && <span title="Вже вигравав">🏆</span>}
                  <button type="button" className="btn-icon danger" onClick={() => confirmRemove(p)} aria-label={`Видалити ${p.name}`}>
                    🗑
                  </button>
                </li>
              ))}
              {participants.length === 0 && <li className="empty">Нікого немає 👻</li>}
            </ul>
            {participants.length > 0 && (
              <button type="button" className="btn-link" onClick={confirmClear}>
                Видалити всіх
              </button>
            )}

            <section className="panel-section">
              <h3>Переможці</h3>
              <label className="toggle">
                <input type="checkbox" checked={excludeWinners} onChange={(e) => onExcludeWinnersChange(e.target.checked)} />
                Виключати переможців з наступних раундів
              </label>
              {winners.length > 0 ? (
                <>
                  <ol className="winner-list">
                    {winners.map((w, i) => (
                      <li key={`${w.id}-${i}`}>{w.name}</li>
                    ))}
                  </ol>
                  <button type="button" className="btn-link" onClick={onClearWinners}>
                    Очистити історію
                  </button>
                </>
              ) : (
                <p className="muted">Ще ніхто не вигравав.</p>
              )}
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
