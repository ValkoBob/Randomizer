import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { THEMES, type ThemeId } from '../themes/themes';
import { useTheme } from '../themes/ThemeContext';

type ThemePickerProps = {
  onChange: (id: ThemeId) => void;
  disabled?: boolean;
};

/** "Тема" button in the header with a drop-down list of all themes. */
export function ThemePicker({ onChange, disabled = false }: ThemePickerProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (id: ThemeId) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="theme-picker" ref={root}>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {theme.icon} Тема
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="theme-menu"
            role="menu"
            aria-label="Тема"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {THEMES.map((t) => (
              <li key={t.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={t.id === theme.id}
                  className={t.id === theme.id ? 'is-current' : ''}
                  onClick={() => choose(t.id)}
                >
                  <span className="theme-menu-icon">{t.icon}</span>
                  {t.label}
                  {t.id === theme.id && <span className="theme-menu-check">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
