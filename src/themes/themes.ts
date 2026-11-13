export type ThemeId = 'halloween' | 'mafia' | 'newyear' | 'medieval' | 'wildwest' | 'ukrainian';

/** Round phases that show a status line while the cards move. */
export type LabelledPhase = 'flipDown' | 'gather' | 'shuffle' | 'deal' | 'scan' | 'reveal';

/** Extra animation layered over the deck while it is being shuffled. */
export type ShuffleFxKind = 'smoke' | 'tumbleweed' | 'hopak';

/** Scene that knocks participants out one by one after the shuffle; the last one standing wins. */
export type EliminationKind = 'tree' | 'shooting' | 'race' | 'hopak';

export type Elimination = {
  kind: EliminationKind;
  /** Status while the scene starts. */
  startLabel: string;
  /** Status after someone is out; `{name}` is replaced with their name. */
  outLabel: string;
  /** Status once only the winner is left. */
  lastLabel: string;
};

export type Theme = {
  id: ThemeId;
  /** Name in the theme menu. */
  label: string;
  /** Emoji for the menu, favicon and loader. */
  icon: string;
  title: string;
  subtitle: string;
  cardBackIcon: string;
  emptyIcon: string;
  shuffleButton: string;
  againButton: string;
  winnerHeading: string;
  allWonText: string;
  phaseLabels: Record<LabelledPhase, string>;
  confetti: { colors: string[]; emojis?: string[] };
  shuffleFx?: ShuffleFxKind;
  /** Without it the round ends with the cards dealt out and a highlight running over them. */
  elimination?: Elimination;
};

export const THEMES: Theme[] = [
  {
    id: 'halloween',
    label: 'Хеллоуїн',
    icon: '🎃',
    title: 'Halloween Randomizer',
    subtitle: 'Тасуємо колоду — і доля обирає одного 🦇',
    cardBackIcon: '🎃',
    emptyIcon: '🎃',
    shuffleButton: '🎃 Тасувати!',
    againButton: '🎃 Ще раз',
    winnerHeading: '🏆 Переможець!',
    allWonText: 'Усі вже виграли 🎉',
    phaseLabels: {
      flipDown: 'Перевертаємо картки…',
      gather: 'Збираємо колоду…',
      shuffle: 'Тасуємо…',
      deal: 'Роздаємо…',
      scan: 'Хто ж це буде?..',
      reveal: 'Є!',
    },
    confetti: { colors: ['#ff7a1a', '#ffb347', '#8a3ffc', '#c08bff', '#7cff6b'] },
  },
  {
    id: 'mafia',
    label: 'Мафія',
    icon: '🎩',
    title: 'Хто сьогодні мафія?',
    subtitle: 'Місто засинає — ведучий тасує ролі 🌙',
    cardBackIcon: '🎩',
    emptyIcon: '🕵️',
    shuffleButton: '🃏 Роздати ролі',
    againButton: '🌙 Наступна ніч',
    winnerHeading: '🕵️ Хто вижив — той і переміг!',
    allWonText: 'Ролі отримали всі — місто порожнє 🌆',
    phaseLabels: {
      flipDown: 'Місто засинає…',
      gather: 'Ведучий збирає ролі…',
      shuffle: 'Тасуємо ролі…',
      deal: 'Роздаємо ролі…',
      scan: 'Мафія обирає…',
      reveal: 'Місто прокидається!',
    },
    confetti: { colors: ['#c0141e', '#e8c26a', '#f3ead8', '#1a1a1a'], emojis: ['🃏', '♠️', '🌹'] },
    shuffleFx: 'smoke',
    elimination: {
      kind: 'shooting',
      startLabel: 'Мафія заряджає револьвер…',
      outLabel: '🔫 Постріл! Вибуває {name}',
      lastLabel: 'Набої скінчились — хтось таки вижив!',
    },
  },
  {
    id: 'newyear',
    label: 'Новий рік / Різдво',
    icon: '🎄',
    title: 'Новорічний жереб',
    subtitle: 'Кому дістанеться подарунок? 🎁',
    cardBackIcon: '🎄',
    emptyIcon: '🎅',
    shuffleButton: '🎁 Перемішати!',
    againButton: '🎄 Ще подарунок',
    winnerHeading: '🎁 Подарунок отримує…',
    allWonText: 'Подарунки отримали всі 🎉',
    phaseLabels: {
      flipDown: 'Ховаємо подарунки…',
      gather: 'Складаємо в мішок…',
      shuffle: 'Перемішуємо в мішку…',
      deal: 'Розкладаємо під ялинкою…',
      scan: 'Чий же подарунок?..',
      reveal: 'Ось він!',
    },
    confetti: { colors: ['#e0303a', '#1f8a4c', '#f5c542', '#ffffff'], emojis: ['❄️', '⭐', '🎁'] },
    elimination: {
      kind: 'tree',
      startLabel: 'Санта трохи перебрав і вчепився в ялинку…',
      outLabel: '💥 Дзень! Впала іграшка «{name}»',
      lastLabel: 'Остання іграшка вистояла! 🎄',
    },
  },
  {
    id: 'medieval',
    label: 'Середньовіччя',
    icon: '🏰',
    title: 'Лицарський жереб',
    subtitle: 'Тягнемо тайл — хто захопить замок? 🏰',
    cardBackIcon: '🏰',
    emptyIcon: '🛡️',
    shuffleButton: '🏰 Тягнути тайл!',
    againButton: '⚔️ Ще раунд',
    winnerHeading: '👑 Володар замку!',
    allWonText: 'Усі замки вже захоплено 🏳️',
    phaseLabels: {
      flipDown: 'Перевертаємо тайли…',
      gather: 'Складаємо в мішечок…',
      shuffle: 'Перемішуємо тайли…',
      deal: 'Викладаємо землі…',
      scan: 'Хто захопить замок?..',
      reveal: 'Замок захоплено!',
    },
    confetti: { colors: ['#4f7a2a', '#d9a531', '#9e2a2b', '#f1e3c2'], emojis: ['🛡️', '👑', '⚔️'] },
  },
  {
    id: 'wildwest',
    label: 'Дикий Захід',
    icon: '🤠',
    title: 'Дикий Захід',
    subtitle: 'Шериф тасує колоду в салуні 🌵',
    cardBackIcon: '⭐',
    emptyIcon: '🌵',
    shuffleButton: '🤠 Тасувати!',
    againButton: '🌵 Ще раунд',
    winnerHeading: '⭐ РОЗШУКУЄТЬСЯ!',
    allWonText: 'Усіх уже спіймано 🐎',
    phaseLabels: {
      flipDown: 'Ховаємо карти в рукав…',
      gather: 'Збираємо колоду…',
      shuffle: 'Шериф тасує…',
      deal: 'Роздаємо карти в салуні…',
      scan: 'Хто ж розшукується?..',
      reveal: 'Попався!',
    },
    confetti: { colors: ['#c8742f', '#e9c27a', '#7a4a24', '#f4e2b8'], emojis: ['⭐', '💰', '🌵'] },
    shuffleFx: 'tumbleweed',
    elimination: {
      kind: 'race',
      startLabel: 'На старт! Коні рвуться в прерію… 🐎',
      outLabel: '💨 Кінь спіткнувся — вибуває {name}',
      lastLabel: 'Фініш! 🏁',
    },
  },
  {
    id: 'ukrainian',
    label: 'Український',
    icon: '🌻',
    title: 'Козацький жереб',
    subtitle: 'Тягнемо жереб — кому пощастить? 🌻',
    cardBackIcon: '🌻',
    emptyIcon: '🌾',
    shuffleButton: '🌻 Тягнути жереб!',
    againButton: '🌾 Ще раз',
    winnerHeading: '🎉 Щасливчик!',
    allWonText: 'Пощастило всім 💙💛',
    phaseLabels: {
      flipDown: 'Перевертаємо картки…',
      gather: 'Збираємо до купи…',
      shuffle: 'Тасуємо, як козаки…',
      deal: 'Розкладаємо на рушнику…',
      scan: 'Кому ж пощастить?..',
      reveal: 'Є!',
    },
    confetti: { colors: ['#0057b7', '#ffd700', '#c8102e', '#ffffff'], emojis: ['🌻', '💙', '💛'] },
    shuffleFx: 'hopak',
    elimination: {
      kind: 'hopak',
      startLabel: 'Гопак! Хто дотанцює до кінця?',
      outLabel: '😵 Вибивається з сил: {name}',
      lastLabel: 'Хтось таки дотанцював! 🌻',
    },
  },
];

const DEFAULT_THEME = THEMES[0];

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((theme) => theme.id === id) ?? DEFAULT_THEME;
}

/** Theme for users who never picked one: New Year from 15 Dec to 15 Jan, Halloween otherwise. */
export function seasonalTheme(date: Date): ThemeId {
  const month = date.getMonth();
  const day = date.getDate();
  if ((month === 11 && day >= 15) || (month === 0 && day <= 15)) return 'newyear';
  return 'halloween';
}
