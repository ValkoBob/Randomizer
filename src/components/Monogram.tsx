import type { CSSProperties } from 'react';
import { hueFromName, initials } from '../participants/names';

/** Initials on a colour picked from the name: the "photo" of a names-only participant. */
export function Monogram({ name, className = '' }: { name: string; className?: string }) {
  return (
    <div className={`monogram ${className}`} style={{ '--hue': hueFromName(name) } as CSSProperties} aria-hidden="true">
      {initials(name)}
    </div>
  );
}
