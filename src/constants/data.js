// Liste des groupes K-pop populaires (exemple)
export const KPOP_GROUPS = [
  { id: 1, name: 'BTS', agency: 'HYBE', debutYear: 2013, members: 7, image: null },
  { id: 2, name: 'BLACKPINK', agency: 'YG Entertainment', debutYear: 2016, members: 4, image: null },
  { id: 3, name: 'TWICE', agency: 'JYP Entertainment', debutYear: 2015, members: 9, image: null },
  { id: 4, name: 'SEVENTEEN', agency: 'Pledis Entertainment', debutYear: 2015, members: 13, image: null },
  { id: 5, name: 'Stray Kids', agency: 'JYP Entertainment', debutYear: 2018, members: 8, image: null },
  { id: 6, name: 'ITZY', agency: 'JYP Entertainment', debutYear: 2019, members: 5, image: null },
  { id: 7, name: 'NewJeans', agency: 'ADOR', debutYear: 2022, members: 5, image: null },
  { id: 8, name: 'IVE', agency: 'Starship Entertainment', debutYear: 2021, members: 6, image: null },
  { id: 9, name: 'NCT', agency: 'SM Entertainment', debutYear: 2016, members: 23, image: null },
  { id: 10, name: 'ENHYPEN', agency: 'Belift Lab', debutYear: 2020, members: 7, image: null }
];

// Agences K-pop
export const AGENCIES = [
  'HYBE',
  'SM Entertainment',
  'YG Entertainment',
  'JYP Entertainment',
  'Starship Entertainment',
  'Pledis Entertainment',
  'Belift Lab',
  'ADOR',
  'Cube Entertainment',
  'FNC Entertainment'
];

// Catégories de quiz
export const QUIZ_CATEGORIES = [
  { id: 1, name: 'Groupes', icon: '👥' },
  { id: 2, name: 'Membres', icon: '⭐' },
  { id: 3, name: 'Comebacks', icon: '🎵' },
  { id: 4, name: 'MVs', icon: '🎬' },
  { id: 5, name: 'Agences', icon: '🏢' }
];

// Re-export richer version from dedicated quiz data
export { QUIZ_CATEGORIES_WITH_META } from './quizData';

// Badges
export const BADGES = [
  { id: 1, name: 'Débutant', icon: '🌱', requirement: 'Compléter 1 quiz' },
  { id: 2, name: 'Fan', icon: '⭐', requirement: 'Compléter 5 quiz' },
  { id: 3, name: 'Expert', icon: '🏆', requirement: 'Compléter 10 quiz' },
  { id: 4, name: 'Légende', icon: '👑', requirement: 'Compléter 25 quiz' },
  { id: 5, name: 'K-Pop Master', icon: '💎', requirement: 'Compléter 50 quiz' }
];
