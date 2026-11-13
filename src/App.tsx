import { useCallback, useEffect, useMemo, useState } from 'react';
import { ModeSwitch } from './components/ModeSwitch';
import { NamePicker } from './components/NamePicker';
import { ParticipantsPanel } from './components/ParticipantsPanel';
import { PhotoPicker } from './components/PhotoPicker';
import { Table } from './components/Table';
import { ThemePicker } from './components/ThemePicker';
import type { Participant, ParticipantMode, WinnerRecord } from './participants/types';
import { useNameParticipants } from './participants/useNameParticipants';
import { useParticipants } from './participants/useParticipants';
import { usePersistentState } from './participants/usePersistentState';
import { ThemeContext } from './themes/ThemeContext';
import { getTheme, seasonalTheme, type ThemeId } from './themes/themes';

function setFavicon(emoji: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) return;
  link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
}

export function App() {
  const photos = useParticipants();
  const names = useNameParticipants();
  const [mode, setMode, modeLoaded] = usePersistentState<ParticipantMode>('participantMode', 'photos');
  const active = mode === 'photos' ? photos : names;
  const participants: Participant[] = active.participants;
  const [winners, setWinners, winnersLoaded] = usePersistentState<WinnerRecord[]>('winners', []);
  const [excludeWinners, setExcludeWinners, excludeLoaded] = usePersistentState('excludeWinners', false);
  // null = the user never picked a theme, so it follows the season.
  const [storedTheme, setStoredTheme, themeLoaded] = usePersistentState<ThemeId | null>('theme', null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const theme = useMemo(() => getTheme(storedTheme ?? seasonalTheme(new Date())), [storedTheme]);

  useEffect(() => {
    if (!themeLoaded) return;
    document.documentElement.dataset.theme = theme.id;
    document.title = theme.title;
    setFavicon(theme.icon);
  }, [theme, themeLoaded]);

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

  if (!photos.loaded || !names.loaded || !modeLoaded || !winnersLoaded || !excludeLoaded || !themeLoaded) {
    return <div className="loading">🎲</div>;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div className="app">
        <header className="header">
          <div>
            <h1>{theme.title}</h1>
            <p className="subtitle">{theme.subtitle}</p>
          </div>
          <div className="header-actions">
            <ThemePicker onChange={setStoredTheme} disabled={busy} />
            <button type="button" className="btn-secondary" onClick={() => setPanelOpen(true)} disabled={busy}>
              👥 Учасники · {participants.length}
            </button>
          </div>
        </header>

        {participants.length === 0 ? (
          <section className="empty-state">
            <div className="empty-state-icon">{theme.emptyIcon}</div>
            <ModeSwitch mode={mode} onChange={setMode} />
            {mode === 'photos' ? (
              <>
                <h2>Додайте фото учасників</h2>
                <p className="muted">Виберіть фото на комп&apos;ютері — по одному чи кілька, або цілу папку.</p>
                <PhotoPicker onAddFiles={photos.addFiles} />
              </>
            ) : (
              <>
                <h2>Впишіть імена учасників</h2>
                <p className="muted">Без фото — на картках будуть ініціали. Список можна завантажити з файлу.</p>
                <NamePicker onAddNames={names.addNames} />
              </>
            )}
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
          mode={mode}
          onModeChange={setMode}
          participants={participants}
          onAddFiles={photos.addFiles}
          onAddNames={names.addNames}
          onRename={active.rename}
          onRemove={active.remove}
          onClear={active.clear}
          excludeWinners={excludeWinners}
          onExcludeWinnersChange={setExcludeWinners}
          winners={winners}
          onClearWinners={clearWinners}
        />
      </div>
    </ThemeContext.Provider>
  );
}
