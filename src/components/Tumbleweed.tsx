import { useId, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { seededUnit } from '../elimination';
import '../themes/tumbleweed.css';

type Twig = { d: string; width: number; color: string };
const point = (a: number, r: number) => [70 + Math.cos(a) * r, 70 + Math.sin(a) * r];
const xy = (p: number[]) => p.map((v) => v.toFixed(1)).join(' ');
const twigs: Twig[] = [];
const colors = ['#78502b', '#a4743c', '#c69650', '#e0bd7c'];

// Branching stems and curved outer twigs form an airy, irregular bush, rather than a ball of chords.
for (let i = 0; i < 22; i++) {
  const rnd = (salt: number) => seededUnit(`tumbleweed:${i}`, salt);
  const a = (i / 22) * Math.PI * 2 + rnd(1) * 0.2;
  const r = 49 + rnd(2) * 12;
  const start = point(a - 0.6, 7 + rnd(3) * 12);
  const middle = point(a + 0.2, r * 0.55);
  const tip = point(a, r);
  twigs.push({ d: `M${xy(start)} Q${xy(middle)} ${xy(tip)}`, width: 1.5 + rnd(4), color: colors[i % 3] });
  for (const side of [-1, 1]) {
    const fork = point(a + side * 0.17, r * 0.63);
    const end = point(a + side * (0.26 + rnd(5) * 0.12), r * (0.82 + rnd(6) * 0.12));
    twigs.push({ d: `M${xy(middle)} Q${xy(fork)} ${xy(end)}`, width: 0.8 + rnd(7) * 0.6, color: colors[(i + 1) % 4] });
    const barb = point(a + side * 0.12, r * 0.84);
    twigs.push({ d: `M${xy(barb)} l${side * 4} -5`, width: 0.75, color: '#bd955b' });
  }
  const next = point(a + 0.68, r * 0.86);
  const bend = point(a + 0.35, r * 1.1);
  twigs.push({ d: `M${xy(tip)} Q${xy(bend)} ${xy(next)}`, width: 0.9 + rnd(8) * 0.4, color: colors[(i + 2) % 4] });
}

for (let i = 0; i < 16; i++) {
  const a = (i / 16) * Math.PI * 2;
  const r = 22 + seededUnit('weed-inner', i) * 18;
  const start = point(a, r);
  const end = point(a + 2.6, r * 0.85);
  const bend = point(a + 1.2, -r * 0.45);
  twigs.push({ d: `M${xy(start)} Q${xy(bend)} ${xy(end)}`, width: 1.1, color: colors[1 + (i % 3)] });
}

function TumbleweedSvg() {
  const shade = `weed-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 140 140" className="tumbleweed-svg" aria-hidden="true">
      <defs>
        <radialGradient id={shade} cx="38%" cy="30%" r="65%">
          <stop offset="0" stopColor="#e3c68c" stopOpacity="0.24" />
          <stop offset="0.65" stopColor="#986b34" stopOpacity="0.18" />
          <stop offset="1" stopColor="#65401d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="58" fill={`url(#${shade})`} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {twigs.map((twig, i) => <path key={i} d={twig.d} stroke={twig.color} strokeWidth={twig.width} />)}
      </g>
    </svg>
  );
}

/** One bounded, full-width passage. Shared by the shuffle and race foreground. */
export function Tumbleweed({ className = '', durationMs = 3500, loop = false }: { className?: string; durationMs?: number; loop?: boolean } = {}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const rail = field.querySelector<HTMLElement>('.tumbleweed-rail')!;
    const ball = field.querySelector<HTMLElement>('.tumbleweed-ball')!;
    const measure = () => {
      // Match rotation to travelled distance, instead of sliding while spinning at a fixed speed.
      const diameter = ball.offsetWidth * (116 / 140);
      const turns = diameter > 0 ? rail.clientWidth / (Math.PI * diameter) : 0;
      field.style.setProperty('--weed-rotation', `${turns * 360}deg`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={fieldRef} className={`tumbleweed-field ${className}`} aria-hidden="true" style={{ '--weed-duration': `${durationMs}ms`, '--weed-repeat': loop ? 'infinite' : 1 } as CSSProperties}>
      <div className="tumbleweed-haze" />
      <div className="tumbleweed-rail">
        <div className="tumbleweed-mover">
          <span className="tumbleweed-shadow" />
          <div className="tumbleweed-dust"><span /><span /><span /></div>
          <div className="tumbleweed-ball"><TumbleweedSvg /></div>
        </div>
      </div>
    </div>
  );
}
