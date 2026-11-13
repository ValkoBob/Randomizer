import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, useReducedMotion, type TargetAndTransition, type Transition } from 'motion/react';
import type { Participant } from '../participants/types';
import { ELIMINATION_FINALE_MS, ELIMINATION_INTRO_MS, eliminationStepMs } from '../elimination';
import { buildScanSchedule, interleave, randomInt, riffleCut, shuffle } from '../random';
import { useTheme } from '../themes/ThemeContext';
import type { LabelledPhase } from '../themes/themes';
import { Card } from './Card';
import { EliminationStage } from './elimination/EliminationStage';
import { ShuffleFx } from './ShuffleFx';
import { WinnerOverlay } from './WinnerOverlay';

type Phase = 'idle' | LabelledPhase | 'eliminate' | 'result';

const SHUFFLE_PASSES = 3;
const EASE: [number, number, number, number] = [0.3, 0.7, 0.2, 1];

class RoundCancelled extends Error {}

/** Grid columns: as few rows as possible with at most 6 cards per row, balanced (8 → 4×2). */
function columnsFor(count: number): number {
  if (count <= 1) return 1;
  const rows = Math.ceil(count / 6);
  return Math.ceil(count / rows);
}

type DeckSize = { cardWidth: number; cardHeight: number; tableHeight: number };

type TableProps = {
  pool: Participant[];
  allExcluded: boolean;
  onRoundEnd: (winner: Participant) => void;
  onBusyChange: (busy: boolean) => void;
  onResetWinners: () => void;
};

export function Table({ pool, allExcluded, onRoundEnd, onBusyChange, onResetWinners }: TableProps) {
  const theme = useTheme();
  const [phase, setPhase] = useState<Phase>('idle');
  const [order, setOrder] = useState<string[]>(() => pool.map((p) => p.id));
  const [faceDown, setFaceDown] = useState(false);
  const [splitLeft, setSplitLeft] = useState<Set<string> | null>(null);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [deckSize, setDeckSize] = useState<DeckSize | null>(null);
  const [autoStart, setAutoStart] = useState(false);
  // Elimination scenes: who is already out (in order), who is about to go, and the pace.
  const [out, setOut] = useState<string[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [eliminationDone, setEliminationDone] = useState(false);
  const [stepMs, setStepMs] = useState(1000);

  const tableRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);
  const running = useRef(false);
  const roundController = useRef<AbortController | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const speed = reducedMotion ? 0.35 : 1;

  const byId = useMemo(() => new Map(pool.map((p) => [p.id, p])), [pool]);
  const cards = useMemo(
    () =>
      order.flatMap((id) => {
        const participant = byId.get(id);
        return participant ? [participant] : [];
      }),
    [order, byId],
  );

  // The async round reads the latest values through refs, so it can stay a stable callback.
  const latest = useRef({ cards, speed, elimination: theme.elimination });
  latest.current = { cards, speed, elimination: theme.elimination };

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      roundController.current?.abort();
    };
  }, []);

  useEffect(() => onBusyChange(phase !== 'idle'), [phase, onBusyChange]);

  // Keep the current card order when participants are added/removed between rounds.
  useEffect(() => {
    if (phase !== 'idle') return;
    setOrder((prev) => {
      const poolIds = new Set(pool.map((p) => p.id));
      const kept = prev.filter((id) => poolIds.has(id));
      const keptIds = new Set(kept);
      const next = [...kept, ...pool.filter((p) => !keptIds.has(p.id)).map((p) => p.id)];
      return next.length === prev.length && next.every((id, i) => id === prev[i]) ? prev : next;
    });
  }, [pool, phase]);

  const runRound = useCallback(async () => {
    const controller = new AbortController();
    roundController.current = controller;
    const { cards: roundCards, speed: roundSpeed, elimination } = latest.current;
    const wait = async (ms: number) => {
      await new Promise<void>((resolve, reject) => {
        const cancel = () => {
          clearTimeout(timer);
          reject(new RoundCancelled());
        };
        const timer = setTimeout(() => {
          controller.signal.removeEventListener('abort', cancel);
          resolve();
        }, ms * roundSpeed);
        controller.signal.addEventListener('abort', cancel, { once: true });
      });
      if (!alive.current || controller.signal.aborted) throw new RoundCancelled();
    };

    const ids = roundCards.map((p) => p.id);
    if (ids.length === 0) return;
    // The winner is decided up front with crypto randomness; the animation just lands on it.
    const winner = ids[randomInt(ids.length)];
    setWinnerId(winner);
    if (ids.length === 1) {
      setPhase('result');
      return;
    }

    setPhase('flipDown');
    setFaceDown(true);
    await wait(550 + ids.length * 60);

    const table = tableRef.current;
    const card = table?.querySelector<HTMLElement>('.card');
    if (table && card) {
      setDeckSize({ cardWidth: card.offsetWidth, cardHeight: card.offsetHeight, tableHeight: table.offsetHeight });
    }
    setPhase('gather');
    await wait(900);

    setPhase('shuffle');
    let current = ids;
    for (let pass = 0; pass < SHUFFLE_PASSES; pass++) {
      const cut = riffleCut(current.length);
      const left = current.slice(0, cut);
      setSplitLeft(new Set(left));
      await wait(400);
      current = interleave(left, current.slice(cut));
      setOrder(current);
      setSplitLeft(null);
      await wait(550);
    }

    if (elimination) {
      // Everyone but the winner is knocked out one by one, in random order; the last one standing wins.
      const losers = shuffle(current.filter((id) => id !== winner));
      const step = eliminationStepMs(losers.length);
      setStepMs(step * roundSpeed);
      setPhase('eliminate');
      await wait(ELIMINATION_INTRO_MS);
      for (const id of losers) {
        setTarget(id);
        await wait(step * 0.45);
        setOut((prev) => [...prev, id]);
        setTarget(null);
        await wait(step * 0.55);
      }
      setEliminationDone(true);
      await wait(ELIMINATION_FINALE_MS);
      setPhase('result');
      return;
    }

    setPhase('deal');
    await wait(800 + current.length * 60);

    setPhase('scan');
    for (const step of buildScanSchedule(current.length, current.indexOf(winner))) {
      setHighlight(step.pos);
      await wait(step.delay);
    }

    setPhase('reveal');
    await wait(1400);
    setPhase('result');
  }, []);

  const startRound = useCallback(() => {
    // The ref locks synchronously, before React has disabled the button.
    if (running.current || latest.current.cards.length === 0) return;
    running.current = true;
    runRound().catch((error: Error) => {
      running.current = false;
      if (!(error instanceof RoundCancelled)) {
        console.error('Round failed', error);
        if (alive.current) {
          setPhase('idle');
          setFaceDown(false);
          setWinnerId(null);
          setSplitLeft(null);
          setDeckSize(null);
          setOut([]);
          setTarget(null);
          setEliminationDone(false);
        }
      }
    });
  }, [runRound]);

  const finishRound = useCallback(
    (again: boolean) => {
      if (!running.current) return;
      running.current = false;
      const winner = winnerId ? byId.get(winnerId) : undefined;
      setPhase('idle');
      setFaceDown(false);
      setHighlight(null);
      setWinnerId(null);
      setDeckSize(null);
      setSplitLeft(null);
      setOut([]);
      setTarget(null);
      setEliminationDone(false);
      if (winner) onRoundEnd(winner);
      if (again) setAutoStart(true);
    },
    [winnerId, byId, onRoundEnd],
  );

  // "Ще раз": wait for the winner card to fly back and for the pool to update.
  useEffect(() => {
    if (!autoStart || phase !== 'idle') return;
    const timer = setTimeout(() => {
      setAutoStart(false);
      startRound();
    }, 700);
    return () => clearTimeout(timer);
  }, [autoStart, phase, startRound]);

  const isDeck = phase === 'gather' || phase === 'shuffle';
  const winner = winnerId ? byId.get(winnerId) : undefined;
  const showScene = Boolean(theme.elimination) && (phase === 'eliminate' || (phase === 'result' && out.length > 0));

  function eliminationStatus(): string {
    const labels = theme.elimination;
    if (!labels) return '';
    if (eliminationDone) return labels.lastLabel;
    const last = out.length > 0 ? byId.get(out[out.length - 1]) : undefined;
    if (!last) return labels.startLabel;
    return `${labels.outLabel.replace('{name}', last.name)} · у грі: ${cards.length - out.length}`;
  }

  const status =
    phase === 'idle' || phase === 'result' ? undefined : phase === 'eliminate' ? eliminationStatus() : theme.phaseLabels[phase];

  const tableStyle = {
    '--cols': columnsFor(cards.length),
    '--cols-md': Math.min(columnsFor(cards.length), 3),
    ...(deckSize && {
      minHeight: deckSize.tableHeight,
      '--card-w': `${deckSize.cardWidth}px`,
      '--card-h': `${deckSize.cardHeight}px`,
    }),
  } as CSSProperties;

  function cardMotion(id: string, index: number): { animate: TargetAndTransition; transition: Transition; className: string; zIndex: number } {
    if (isDeck) {
      const side = splitLeft ? (splitLeft.has(id) ? -1 : 1) : 0;
      const spread = (deckSize?.cardWidth ?? 160) * 0.62;
      return {
        animate: { x: side * spread, y: -index * 1.5, rotate: side ? side * 6 : ((index % 3) - 1) * 2, scale: 1, opacity: 1 },
        transition: {
          duration: 0.35 * speed,
          delay: splitLeft ? 0 : index * 0.025 * speed,
          layout: { duration: 0.7 * speed, delay: index * 0.03 * speed, ease: EASE },
        },
        className: '',
        zIndex: index,
      };
    }

    const lit = phase === 'scan' && highlight === index;
    const isRevealed = phase === 'reveal' && id === winnerId;
    return {
      animate: {
        x: 0,
        y: lit || isRevealed ? -10 : 0,
        rotate: 0,
        scale: isRevealed ? 1.1 : lit ? 1.06 : 1,
        opacity: phase === 'reveal' && !isRevealed ? 0.3 : 1,
      },
      transition: {
        duration: phase === 'scan' ? 0.12 : 0.4,
        layout: { duration: 0.7 * speed, delay: phase === 'deal' ? index * 0.06 * speed : 0, ease: EASE },
      },
      className: isRevealed ? 'is-winner' : lit ? 'is-lit' : '',
      zIndex: lit || isRevealed ? 2 : 0,
    };
  }

  return (
    <section className="stage">
      <div className="controls">
        <button type="button" className="btn-primary" onClick={startRound} disabled={phase !== 'idle' || autoStart || cards.length === 0}>
          {theme.shuffleButton}
        </button>
        <div className="status" aria-live="polite">
          {status ??
            (cards.length === 0
              ? allExcluded
                ? theme.allWonText
                : 'Додайте учасників, щоб почати'
              : `${cards.length} у грі`)}
          {phase === 'idle' && allExcluded && (
            <button type="button" className="btn-link" onClick={onResetWinners}>
              Скинути переможців
            </button>
          )}
        </div>
      </div>

      {showScene && theme.elimination ? (
        <EliminationStage
          kind={theme.elimination.kind}
          participants={cards}
          out={out}
          target={target}
          winnerId={winnerId}
          done={eliminationDone}
          stepMs={stepMs}
        />
      ) : (
        <div ref={tableRef} className={`table ${isDeck ? 'is-deck' : ''}`} style={tableStyle}>
          {cards.map((participant, index) => {
            if (phase === 'result' && participant.id === winnerId) {
              return <div key={participant.id} className="card-slot" />;
            }
            const { animate, transition, className, zIndex } = cardMotion(participant.id, index);
            return (
              <Card
                key={participant.id}
                participant={participant}
                faceDown={faceDown && !(participant.id === winnerId && (phase === 'reveal' || phase === 'result'))}
                flipDelay={phase === 'flipDown' ? index * 0.06 * speed : 0}
                className={className}
                style={{ zIndex }}
                animate={animate}
                transition={transition}
              />
            );
          })}
          <AnimatePresence>{isDeck && theme.shuffleFx && !reducedMotion && <ShuffleFx key="fx" kind={theme.shuffleFx} />}</AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {phase === 'result' && winner && <WinnerOverlay key={winner.id} winner={winner} onClose={finishRound} />}
      </AnimatePresence>
    </section>
  );
}
