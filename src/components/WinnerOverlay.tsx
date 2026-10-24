import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import type { Participant } from '../participants/types';
import { Card } from './Card';

const CONFETTI_COLORS = ['#ff7a1a', '#ffb347', '#8a3ffc', '#c08bff', '#7cff6b'];

function fireConfetti(): () => void {
  const options = { colors: CONFETTI_COLORS, disableForReducedMotion: true, zIndex: 100 };
  confetti({ ...options, particleCount: 150, spread: 100, startVelocity: 45, origin: { y: 0.55 } });
  const timer = setTimeout(() => {
    confetti({ ...options, particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
    confetti({ ...options, particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
  }, 350);
  return () => clearTimeout(timer);
}

type WinnerOverlayProps = {
  winner: Participant;
  onClose: (again: boolean) => void;
};

export function WinnerOverlay({ winner, onClose }: WinnerOverlayProps) {
  useEffect(() => {
    let cancelConfetti = () => {};
    // Fire once the card has flown into the centre.
    const timer = setTimeout(() => {
      cancelConfetti = fireConfetti();
    }, 600);
    return () => {
      clearTimeout(timer);
      cancelConfetti();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <motion.div className="overlay" role="dialog" aria-modal="true" aria-label={`Переможець: ${winner.name}`} exit={{ opacity: 0 }}>
      <motion.div className="overlay-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => onClose(false)} />
      <div className="overlay-content">
        <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          🏆 Переможець!
        </motion.h2>
        <Card participant={winner} className="card-large" transition={{ layout: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }} />
        <motion.div className="overlay-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <button type="button" className="btn-primary" onClick={() => onClose(true)} autoFocus>
            🎃 Ще раз
          </button>
          <button type="button" className="btn-secondary" onClick={() => onClose(false)}>
            Закрити
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
