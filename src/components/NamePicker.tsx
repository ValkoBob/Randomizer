import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { parseNames } from '../participants/names';
import type { AddNamesResult } from '../participants/useNameParticipants';

type NamePickerProps = {
  onAddNames: (names: string[]) => AddNamesResult;
};

function describe({ added, skipped }: AddNamesResult): string {
  if (added === 0 && skipped === 0) return 'Імен не знайдено';
  const parts = [`Додано: ${added}`];
  if (skipped > 0) parts.push(`вже є в списку: ${skipped}`);
  return parts.join(', ');
}

/** Type names (one per line or comma-separated) or load them from a .txt / .csv file. */
export function NamePicker({ onAddNames }: NamePickerProps) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const submit = () => {
    const names = parseNames(text);
    if (names.length === 0) {
      setMessage("Впишіть хоча б одне ім'я");
      return;
    }
    setMessage(describe(onAddNames(names)));
    setText('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submit();
    }
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length === 0) return;
    Promise.all(files.map((file) => file.text()))
      .then((texts) => setMessage(describe(onAddNames(parseNames(texts.join('\n'))))))
      .catch((error: Error) => {
        console.error('Failed to read the names file', error);
        setMessage('Не вдалося прочитати файл');
      });
  };

  return (
    <div className="name-picker">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        placeholder={'Олена\nТарас\nМарко, Ірина'}
        aria-label="Імена учасників"
      />
      <div className="photo-picker-buttons">
        <button type="button" className="btn-secondary" onClick={submit} disabled={!text.trim()}>
          ➕ Додати
        </button>
        <label className="btn-secondary">
          📄 Зі списку (.txt, .csv)
          <input type="file" accept=".txt,.csv,text/plain,text/csv" multiple onChange={handleFiles} hidden />
        </label>
      </div>
      <div className="photo-picker-hint">{message ?? "Кожне ім'я — з нового рядка або через кому"}</div>
    </div>
  );
}
