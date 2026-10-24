import { useCallback, useMemo, useState } from 'react';
import { ParticipantsPanel } from './components/ParticipantsPanel';
import { PhotoPicker } from './components/PhotoPicker';
import { Table } from './components/Table';
import type { Participant, WinnerRecord } from './participants/types';
import { useParticipants } from './participants/useParticipants';
import { usePersistentState } from './participants/usePersistentState';

export function App() {
  const { participants, loaded, addFiles, rename, remove, clear } = useParticipants();
  const [winners, setWinners, winnersLoaded] = usePersistentState<WinnerRecord[]>('winners', []);
  const [excludeWinners, setExcludeWinners, excludeLoaded] = usePersistentState('excludeWinners', false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const pool = useMemo(() => {
    if (!excludeWinners) return participants;
    const winnerIds = new Set(winners.map((w) => w.id));
    return participants.filter((p) => !winnerIds.has(p.id));
  }, [participants, winners, excludeWinners]);

  const handleRoundEnd = useCallback(
    (winner: Participant) => setWinners((prev) => [...prev, { id: winner.id, name: winner.name }]),
    [setWinners],
  );
  const clearWinners = useCallback(() => setWinners([]), [setWinners]);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  if (!loaded || !winnersLoaded || !excludeLoaded) {
    return <div className="loading">🎃</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Halloween Randomizer</h1>
          <p className="subtitle">Тасуємо колоду — і доля обирає одного 🦇</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => setPanelOpen(true)} disabled={busy}>
          👥 Учасники · {participants.length}
        </button>
      </header>

      {participants.length === 0 ? (
        <section className="empty-state">
          <div className="empty-state-icon">🎃</div>
          <h2>Додайте фото учасників</h2>
          <p className="muted">Виберіть фото на комп&apos;ютері — по одному чи кілька, або цілу папку.</p>
          <PhotoPicker onAddFiles={addFiles} />
        </section>
      ) : (
        <Table
          pool={pool}
          allExcluded={pool.length === 0}
          onRoundEnd={handleRoundEnd}
          onBusyChange={setBusy}
          onResetWinners={clearWinners}
        />
      )}

      <ParticipantsPanel
        open={panelOpen && !busy}
        onClose={closePanel}
        participants={participants}
        onAddFiles={addFiles}
        onRename={rename}
        onRemove={remove}
        onClear={clear}
        excludeWinners={excludeWinners}
        onExcludeWinnersChange={setExcludeWinners}
        winners={winners}
        onClearWinners={clearWinners}
      />
    </div>
  );
}
