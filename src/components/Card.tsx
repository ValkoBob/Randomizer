import { motion, type MotionStyle, type TargetAndTransition, type Transition } from 'motion/react';
import type { Participant } from '../participants/types';
import { useTheme } from '../themes/ThemeContext';
import { Monogram } from './Monogram';

type CardProps = {
  participant: Participant;
  faceDown?: boolean;
  flipDelay?: number;
  className?: string;
  style?: MotionStyle;
  animate?: TargetAndTransition;
  transition?: Transition;
};

/**
 * Two-sided card: front = photo (or initials in the names-only mode) + owner's name, back = the current theme's pattern.
 * The shared layoutId lets the same card fly between the table, the deck and the winner overlay.
 */
export function Card({ participant, faceDown = false, flipDelay = 0, className = '', style, animate, transition }: CardProps) {
  const theme = useTheme();
  return (
    <motion.div
      layout
      layoutId={`card-${participant.id}`}
      className={`card ${className}`}
      style={style}
      initial={false}
      animate={animate}
      transition={transition}
    >
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: faceDown ? 180 : 0 }}
        transition={{ duration: 0.55, delay: flipDelay, ease: 'easeInOut' }}
      >
        <div className="card-face card-front">
          {participant.src ? (
            <img src={participant.src} alt={participant.name} draggable={false} />
          ) : (
            <Monogram name={participant.name} className="card-monogram" />
          )}
          <div className="card-name">{participant.name}</div>
        </div>
        <div className="card-face card-back" aria-hidden="true">
          <span className="card-back-icon">{theme.cardBackIcon}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
