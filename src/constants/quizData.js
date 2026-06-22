// K-POP GALAXY - Expanded Quiz Question Bank
// Minimum 20 questions per category with progressive difficulty
// Difficulty: easy | medium | hard

export const QUIZ_QUESTIONS = {
  'Groupes': [
    // Easy (1-7)
    { id: 1, question: 'Quel groupe a débuté en 2016 avec 4 membres ?', answers: ['BLACKPINK', 'TWICE', 'RED VELVET', 'ITZY'], correctAnswer: 0, difficulty: 'easy' },
    { id: 2, question: 'Quelle agence gère BTS ?', answers: ['YG Entertainment', 'JYP Entertainment', 'HYBE', 'SM Entertainment'], correctAnswer: 2, difficulty: 'easy' },
    { id: 3, question: 'Combien de membres compte BLACKPINK ?', answers: ['3', '4', '5', '9'], correctAnswer: 1, difficulty: 'easy' },
    { id: 4, question: 'Quel groupe est connu pour "TT" et "Cheer Up" ?', answers: ['BLACKPINK', 'TWICE', 'ITZY', 'NewJeans'], correctAnswer: 1, difficulty: 'easy' },
    { id: 5, question: 'Stray Kids est géré par quelle agence ?', answers: ['HYBE', 'JYP Entertainment', 'SM', 'YG'], correctAnswer: 1, difficulty: 'easy' },
    { id: 6, question: 'Quel groupe a débuté en 2022 sous ADOR ?', answers: ['NewJeans', 'IVE', 'LE SSERAFIM', 'NMIXX'], correctAnswer: 0, difficulty: 'easy' },
    { id: 7, question: 'En quelle année BTS a-t-il débuté ?', answers: ['2010', '2013', '2015', '2016'], correctAnswer: 1, difficulty: 'easy' },
    // Medium (8-14)
    { id: 8, question: 'Quel groupe a 13 membres ?', answers: ['NCT', 'SEVENTEEN', 'EXO', 'THE BOYZ'], correctAnswer: 1, difficulty: 'medium' },
    { id: 9, question: 'Quel est le fandom officiel de BTS ?', answers: ['ONCE', 'BLINK', 'ARMY', 'STAY'], correctAnswer: 2, difficulty: 'medium' },
    { id: 10, question: 'Quelle est la plus jeune membre de NewJeans ?', answers: ['Minji', 'Hanni', 'Danielle', 'Hyein'], correctAnswer: 3, difficulty: 'medium' },
    { id: 11, question: 'Quel groupe a sorti "Love Dive" ?', answers: ['IVE', 'aespa', 'ITZY', 'TWICE'], correctAnswer: 0, difficulty: 'medium' },
    { id: 12, question: 'Quel groupe a popularisé le concept "girl crush" avec "Ddu-Ddu Ddu-Ddu" ?', answers: ['TWICE', 'BLACKPINK', 'Red Velvet', 'MAMAMOO'], correctAnswer: 1, difficulty: 'medium' },
    { id: 13, question: 'NCT a combien de sous-unités principales ?', answers: ['2', '3', '4', '5'], correctAnswer: 1, difficulty: 'medium' },
    { id: 14, question: 'Quel groupe a débuté avec le titre "Eleven" ?', answers: ['IVE', 'NewJeans', 'LE SSERAFIM', 'Kep1er'], correctAnswer: 0, difficulty: 'medium' },
    // Hard (15-22+)
    { id: 15, question: 'Quel ancien membre de Wanna One a rejoint AB6IX ?', answers: ['Kang Daniel', 'Park Jihoon', 'Kim Jaehwan', 'Lee Daehwi'], correctAnswer: 3, difficulty: 'hard' },
    { id: 16, question: 'Quel est le nom du fandom de SEVENTEEN ?', answers: ['CARAT', 'MOA', 'ENGENE', 'LUVITY'], correctAnswer: 0, difficulty: 'hard' },
    { id: 17, question: 'Quel groupe a sorti l\'album "The Album" en 2020 ?', answers: ['BLACKPINK', 'TWICE', 'ITZY', 'Red Velvet'], correctAnswer: 0, difficulty: 'hard' },
    { id: 18, question: 'Quelle est la signification de "BTS" ?', answers: ['Bangtan Sonyeondan', 'Beyond The Scene', 'Les deux réponses ci-dessus', 'Bulletproof Boy Scouts uniquement'], correctAnswer: 2, difficulty: 'hard' },
    { id: 19, question: 'Quel est le nom de la première sous-unité de NCT ?', answers: ['NCT U', 'NCT 127', 'NCT Dream', 'WayV'], correctAnswer: 1, difficulty: 'hard' },
    { id: 20, question: 'Lequel de ces groupes a sorti "Fancy" ?', answers: ['BLACKPINK', 'TWICE', 'ITZY', 'MOMOLAND'], correctAnswer: 1, difficulty: 'hard' },
    { id: 21, question: 'Quel groupe a eu un comeback avec "Supernova" en 2024 ?', answers: ['aespa', 'NewJeans', 'IVE', 'LE SSERAFIM'], correctAnswer: 0, difficulty: 'hard' },
    { id: 22, question: 'Combien de membres originaux dans EXO (avant départs) ?', answers: ['9', '10', '11', '12'], correctAnswer: 3, difficulty: 'hard' }
  ],

  'Membres': [
    { id: 101, question: 'Quel membre de BTS est connu sous le nom de "Worldwide Handsome"?', answers: ['RM', 'Jin', 'Suga', 'J-Hope'], correctAnswer: 1, difficulty: 'easy' },
    { id: 102, question: 'Qui est le leader de BLACKPINK ?', answers: ['Jisoo', 'Jennie', 'Rosé', 'Lisa'], correctAnswer: 0, difficulty: 'easy' },
    { id: 103, question: 'Quel membre de Stray Kids est le "maknae" ?', answers: ['Bang Chan', 'Lee Know', 'Hyunjin', 'I.N'], correctAnswer: 3, difficulty: 'easy' },
    { id: 104, question: 'Quel membre de TWICE est japonaise ?', answers: ['Nayeon', 'Momo', 'Sana', 'Mina'], correctAnswer: 1, difficulty: 'medium' },
    { id: 105, question: 'Qui est le principal rappeur et producteur de BTS ?', answers: ['RM', 'Suga', 'J-Hope', 'Jungkook'], correctAnswer: 1, difficulty: 'medium' },
    { id: 106, question: 'Lequel des membres de NewJeans est australienne ?', answers: ['Minji', 'Hanni', 'Haerin', 'Hyein'], correctAnswer: 1, difficulty: 'medium' },
    { id: 107, question: 'Quel membre de SEVENTEEN est le leader ?', answers: ['Jeonghan', 'Joshua', 'S.Coups', 'Wonwoo'], correctAnswer: 2, difficulty: 'medium' },
    { id: 108, question: 'Qui est le "Ace" de Stray Kids ?', answers: ['Felix', 'Hyunjin', 'Han', 'Seungmin'], correctAnswer: 0, difficulty: 'medium' },
    { id: 109, question: 'Quel membre de IVE était dans Produce 48 ?', answers: ['Wonyoung', 'Yujin', 'Gaeul', 'Leeseo'], correctAnswer: 0, difficulty: 'hard' },
    { id: 110, question: 'Lequel est le vrai nom de Lisa (BLACKPINK) ?', answers: ['Lalisa Manobal', 'Pranpriya Manobal', 'Les deux sont corrects', 'Jennie Kim'], correctAnswer: 2, difficulty: 'hard' },
    { id: 111, question: 'Quel membre de ENHYPEN est le leader ?', answers: ['Jay', 'Jake', 'Sunghoon', 'Jungwon'], correctAnswer: 3, difficulty: 'hard' },
    { id: 112, question: 'Quel membre de BTS a composé "Euphoria" ?', answers: ['RM', 'Jimin', 'Jungkook', 'V'], correctAnswer: 2, difficulty: 'hard' },
    { id: 113, question: 'Qui est le seul membre féminin de (G)I-DLE connue pour "LATATA"?', answers: ['Miyeon', 'Minnie', 'Soojin', 'Soyeon'], correctAnswer: 3, difficulty: 'hard' },
    { id: 114, question: 'Quel membre de Stray Kids est australien ?', answers: ['Bang Chan', 'Felix', 'Les deux', 'Ni-ki'], correctAnswer: 2, difficulty: 'hard' },
    { id: 115, question: 'Lequel de ces idols est le plus jeune dans aespa ?', answers: ['Karina', 'Giselle', 'Winter', 'Ningning'], correctAnswer: 3, difficulty: 'medium' }
  ],

  'Comebacks': [
    { id: 201, question: 'Quel est le titre du comeback estival de TWICE en 2018 ?', answers: ['TT', 'Cheer Up', 'Dance the Night Away', 'Yes or Yes'], correctAnswer: 2, difficulty: 'easy' },
    { id: 202, question: 'Quel groupe a fait son comeback avec "How You Like That" en 2020 ?', answers: ['TWICE', 'BLACKPINK', 'ITZY', 'MAMAMOO'], correctAnswer: 1, difficulty: 'easy' },
    { id: 203, question: 'Le titre "Ditto" appartient à quel groupe ?', answers: ['NewJeans', 'IVE', 'LE SSERAFIM', 'NMIXX'], correctAnswer: 0, difficulty: 'easy' },
    { id: 204, question: 'Quel est le nom du premier full album de BLACKPINK ?', answers: ['Square Up', 'The Album', 'Born Pink', 'Kill This Love'], correctAnswer: 1, difficulty: 'medium' },
    { id: 205, question: 'Quel comeback de BTS en 2020 incluait "Dynamite" ?', answers: ['Map of the Soul: 7', 'BE', 'Love Yourself: Answer', 'Wings'], correctAnswer: 0, difficulty: 'medium' },
    { id: 206, question: 'Le mini-album "Crazy in Love" est de quel groupe ?', answers: ['ITZY', 'TWICE', 'BLACKPINK', 'Red Velvet'], correctAnswer: 0, difficulty: 'medium' },
    { id: 207, question: 'Quel est le titre du comeback de SEVENTEEN en 2023 avec "God of Music"?', answers: ['FML', '17 IS RIGHT HERE', 'SEVENTEENTH HEAVEN', 'Face the Sun'], correctAnswer: 2, difficulty: 'hard' },
    { id: 208, question: 'Quel album a popularisé "Anti-Romantic" de TXT ?', answers: ['The Dream Chapter: MAGIC', 'minisode1: Blue Hour', 'The Chaos Chapter: FREEZE', 'minisode 2: Thursday\'s Child'], correctAnswer: 2, difficulty: 'hard' },
    { id: 209, question: 'Le comeback "Supernatural" en 2024 est de ?', answers: ['NewJeans', 'aespa', 'IVE', 'LE SSERAFIM'], correctAnswer: 0, difficulty: 'hard' },
    { id: 210, question: 'Quel single a marqué le retour de Red Velvet après une longue pause ?', answers: ['Psycho', 'Queendom', 'Feel My Rhythm', 'Birthday'], correctAnswer: 2, difficulty: 'medium' }
  ],

  'MVs': [
    { id: 301, question: 'Quel MV de BLACKPINK a dépassé 1 milliard de vues en premier ?', answers: ['Whistle', 'Playing with Fire', 'Ddu-Du Ddu-Du', 'Kill This Love'], correctAnswer: 2, difficulty: 'easy' },
    { id: 302, question: 'Le MV "Dynamite" de BTS est principalement filmé dans quel style ?', answers: ['Noir', 'Disco rétro coloré', 'Horror', 'Cyberpunk'], correctAnswer: 1, difficulty: 'easy' },
    { id: 303, question: 'Quel MV de NewJeans utilise le concept "ditto" et une caméra vintage ?', answers: ['Attention', 'Hype Boy', 'Ditto', 'OMG'], correctAnswer: 2, difficulty: 'easy' },
    { id: 304, question: 'Dans quel MV voit-on des membres de Stray Kids dans un ascenseur géant ?', answers: ['God\'s Menu', 'Back Door', 'Thunderous', 'Case 143'], correctAnswer: 2, difficulty: 'medium' },
    { id: 305, question: 'Le MV "Fancy" de TWICE se déroule dans quel univers thématique ?', answers: ['École', 'Western / Far West stylisé', 'Espace', 'Sous-marin'], correctAnswer: 1, difficulty: 'medium' },
    { id: 306, question: 'Quel MV de ITZY a un concept "sneakers" et confiance en soi ?', answers: ['DALLA DALLA', 'ICY', 'WANNABE', 'SNEAKERS'], correctAnswer: 3, difficulty: 'medium' },
    { id: 307, question: 'Le MV "Next Level" d\'aespa introduit quel concept majeur ?', answers: ['4e dimension / SYNK', 'Pirates', 'Robot', 'Vampires'], correctAnswer: 0, difficulty: 'hard' },
    { id: 308, question: 'Dans "Permission to Dance", le décor principal est ?', answers: ['Un stade', 'Un bureau désert', 'Une route américaine + désert', 'Un club'], correctAnswer: 2, difficulty: 'hard' },
    { id: 309, question: 'Quel MV de SEVENTEEN utilise un style "don\'t wanna cry" mélancolique ?', answers: ['Don\'t Wanna Cry', 'Home', 'Fear', 'Left & Right'], correctAnswer: 0, difficulty: 'medium' },
    { id: 310, question: 'Le clip "Pink Venom" mélange quels univers ?', answers: ['Kung-fu + luxe royal + rap', 'Horreur', 'Sports', 'Animation 3D'], correctAnswer: 0, difficulty: 'hard' }
  ],

  'Agences': [
    { id: 401, question: 'Quelle agence est derrière BTS et TXT ?', answers: ['JYP', 'SM', 'YG', 'HYBE'], correctAnswer: 3, difficulty: 'easy' },
    { id: 402, question: 'BLACKPINK est sous quelle agence ?', answers: ['HYBE', 'JYP Entertainment', 'YG Entertainment', 'SM Entertainment'], correctAnswer: 2, difficulty: 'easy' },
    { id: 403, question: 'Quelle agence gère TWICE et Stray Kids ?', answers: ['HYBE', 'JYP Entertainment', 'YG', 'Pledis'], correctAnswer: 1, difficulty: 'easy' },
    { id: 404, question: 'IVE est géré par quelle agence ?', answers: ['Starship Entertainment', 'HYBE', 'JYP', 'Cube'], correctAnswer: 0, difficulty: 'medium' },
    { id: 405, question: 'Quelle agence est connue pour les groupes "visuals" et Red Velvet ?', answers: ['YG', 'SM Entertainment', 'JYP', 'HYBE'], correctAnswer: 1, difficulty: 'medium' },
    { id: 406, question: 'ENHYPEN appartient à quelle structure ?', answers: ['HYBE', 'Belift Lab (HYBE + CJ)', 'SM', 'JYP'], correctAnswer: 1, difficulty: 'medium' },
    { id: 407, question: 'Quelle agence a créé le système de "trainee" le plus connu historiquement ?', answers: ['HYBE', 'JYP', 'SM Entertainment', 'YG'], correctAnswer: 2, difficulty: 'hard' },
    { id: 408, question: 'Pledis Entertainment est maintenant une filiale de ?', answers: ['SM', 'HYBE', 'JYP', 'YG'], correctAnswer: 1, difficulty: 'hard' },
    { id: 409, question: 'Quelle agence a lancé le projet "Produce" series ?', answers: ['Mnet / CJ E&M (avec diverses agences)', 'HYBE uniquement', 'SM', 'JYP'], correctAnswer: 0, difficulty: 'hard' },
    { id: 410, question: 'Le label ADOR (NewJeans) est une filiale de ?', answers: ['SM', 'HYBE', 'JYP', 'YG'], correctAnswer: 1, difficulty: 'medium' }
  ]
};

// Helper: get questions for a category, optionally filtered by difficulty or shuffled
export function getQuestionsForCategory(categoryName, options = {}) {
  const { count = 20, difficulty = null, shuffle = true } = options;
  let pool = QUIZ_QUESTIONS[categoryName] || [];

  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  if (shuffle) {
    pool = [...pool].sort(() => Math.random() - 0.5);
  }

  return pool.slice(0, count);
}

// Get mixed difficulty progressive quiz (recommended for main play)
export function getProgressiveQuiz(categoryName, total = 20) {
  const all = QUIZ_QUESTIONS[categoryName] || [];
  const easy = all.filter(q => q.difficulty === 'easy').sort(() => Math.random() - 0.5).slice(0, 8);
  const medium = all.filter(q => q.difficulty === 'medium').sort(() => Math.random() - 0.5).slice(0, 8);
  const hard = all.filter(q => q.difficulty === 'hard').sort(() => Math.random() - 0.5).slice(0, 4);

  return [...easy, ...medium, ...hard].slice(0, total);
}

export const QUIZ_CATEGORIES_WITH_META = [
  { id: 1, name: 'Groupes', icon: '👥', color: '#5C3DD9', questionCount: (QUIZ_QUESTIONS['Groupes'] || []).length },
  { id: 2, name: 'Membres', icon: '⭐', color: '#FF2D95', questionCount: (QUIZ_QUESTIONS['Membres'] || []).length },
  { id: 3, name: 'Comebacks', icon: '🎵', color: '#F59E0B', questionCount: (QUIZ_QUESTIONS['Comebacks'] || []).length },
  { id: 4, name: 'MVs', icon: '🎬', color: '#10B981', questionCount: (QUIZ_QUESTIONS['MVs'] || []).length },
  { id: 5, name: 'Agences', icon: '🏢', color: '#3B82F6', questionCount: (QUIZ_QUESTIONS['Agences'] || []).length }
];
