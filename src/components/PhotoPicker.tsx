import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { AddFilesResult } from '../participants/useParticipants';

type PhotoPickerProps = {
  onAddFiles: (files: File[]) => Promise<AddFilesResult>;
};

/** Pick photos (several at once) or a whole folder from the PC. */
export function PhotoPicker({ onAddFiles }: PhotoPickerProps) {
  const folderInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Not in React's typings, so set it directly.
    folderInput.current?.setAttribute('webkitdirectory', '');
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) return;
    setBusy(true);
    setMessage(null);
    onAddFiles(files)
      .then(({ added, skipped }) => {
        const parts = [`Додано: ${added}`];
        if (skipped > 0) parts.push(`пропущено (не фото): ${skipped}`);
        setMessage(parts.join(', '));
      })
      .catch((error: Error) => {
        console.error('Failed to add photos', error);
        setMessage('Не вдалося додати фото');
      })
      .finally(() => setBusy(false));
  };

  return (
    <div className="photo-picker">
      <div className="photo-picker-buttons">
        <label className={`btn-secondary ${busy ? 'is-disabled' : ''}`}>
          📷 Вибрати фото
          <input type="file" accept="image/*" multiple onChange={handleChange} disabled={busy} hidden />
        </label>
        <label className={`btn-secondary ${busy ? 'is-disabled' : ''}`}>
          📂 Вибрати папку
          <input ref={folderInput} type="file" onChange={handleChange} disabled={busy} hidden />
        </label>
      </div>
      <div className="photo-picker-hint">{busy ? 'Додаємо…' : (message ?? "Ім'я учасника береться з назви файлу")}</div>
    </div>
  );
}
