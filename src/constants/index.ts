import { AuthMode } from '../types';

export const BASE_URL = 'http://127.0.0.1:4000';

export const PATHS = {
  words: 'words',
  users: 'users',
  signIn: 'signin',
  tokens: 'tokens',
  aggregatedWords: 'aggregatedWords',
  statistics: 'statistics',
  settings: 'settings',
};

export const QUERY_KEYS = {
  group: 'group',
  page: 'page',
  wordsPerPage: 'wordsPerPage',
  filter: 'filter',
};

export const REQUEST_HEADERS = {
  contentType: 'Content-Type',
  accept: 'Accept',
  authorization: 'Authorization',
};

export const MODAL_TITLES = {
  signIn: 'Вход',
  signUp: 'Регистрация',
  learningProgress: 'Прогресс изучения',
};

export const AUTH_FORM = {
  email: {
    label: 'Электронная почта',
    name: 'email',
    placeholder: 'user@email.com',
  },
  password: {
    label: 'Пароль',
    name: 'password',
    placeholder: '********',
  },
};

export const BUTTON_TEXT = {
  signIn: 'Войти',
  signUp: 'Зарегистрироваться',
};

export const REDIRECTION_LINK_TEXT = {
  signIn: 'У меня уже есть аккаунт',
  signUp: 'Создать аккаунт',
};

export const NO_CONTENT = '';

export const STORAGE_KEYS = {
  user: '77-user',
  currentPage: '77-currentPage',
  bookSection: '77-bookSection',
  bookPage: '77-bookPage',
};

export const AUTH_MODAL_MODES: { [K in AuthMode]: AuthMode } = {
  signIn: 'signIn',
  signUp: 'signUp',
};

export const DEFAULT_AUTH_MODAL_MODE = 'signIn';
export const DEFAULT_PAGE_NAME = 'main';

export const AUTH_ERROR_MESSAGE = {
  email: 'Некорректный email',
  password: 'Длина пароля должна быть не менее 8 символов',
  userExists: 'Пользователь с таким email уже существует',
  invalidCredentials: 'Неверный логин или пароль',
  later: 'Ошибка, повторите попытку позже',
};

export const DISPLAY_MODES = {
  contentNotVisible: 'none',
  contentBlockVisible: 'block',
  contentFlexVisible: 'flex',
};

export const PAGE_TITLES = {
  about: 'Наша команда',
  studentBook: 'Учебник',
  games: 'Игры',
  statistics: 'Статистика',
};

export const GAMES = {
  audiocall: {
    name: 'Аудиовызов',
    className: 'audiocall',
  },
  sprint: {
    name: 'Спринт',
    className: 'sprint',
  },
};

export const BOOK_SECTIONS = {
  beginner: {
    text: 'A1',
    className: 'a1',
    color: '#FFDFDF',
    group: 0,
  },
  elementary: {
    text: 'A2',
    className: 'a2',
    color: '#FDDEC1',
    group: 1,
  },
  intermediate: {
    text: 'B1',
    className: 'b1',
    color: '#FFFCBE',
    group: 2,
  },
  upperIntermediate: {
    text: 'B2',
    className: 'b2',
    color: '#DBFFC5',
    group: 3,
  },
  advanced: {
    text: 'C1',
    className: 'c1',
    color: '#DDFBFF',
    group: 4,
  },
  proficient: {
    text: 'C2',
    className: 'c2',
    color: '#D5EAFE',
    group: 5,
  },
  difficultWords: {
    text: 'Superhero',
    className: 'superhero',
    color: '#E2DDFF',
    group: 6,
  },
};

export const CARD_BUTTON = {
  difficulty: '#C55',
  learned: '#53C60B',
};

export const PAGINATION_BUTTONS = {
  previous: {
    className: 'button-previous',
  },
  next: {
    className: 'button-next',
  },
};

export const MAX_PAGES_IN_BOOK_SECTION = 30;

export const GAME_INFO_HEADINGS = {
  selectionGame: 'Выберите игру:',
  selectionLevel: 'Выберите уровень:',
  results: 'Результаты:',
  resultOptions: {
    correct: 'Верно',
    incorrect: 'Неверно',
  },
  startGame: 'Поехали!',
};

export const GAME_ANSWER_STATUS = {
  correct: 'correct',
  incorrect: 'incorrect',
};

export const AUDIOCALL_AUDIO_BUTTON_PLACEMENT = {
  inQuestion: 'question',
  inAnswer: 'answer',
};

export const AUDIOCALL_ANSWER_OPTIONS_NUMBER = 5;

export const DATE_KEY_SEPARATOR = '/';

export const MS_PER_DAY = 86400000;

export const UNAUTHORIZED_MESSAGE = 'Для просмотра этой страницы необходимо авторизироваться';

export const DIFFICULT_WORDS_CONTAINER_MESSAGES = {
  forUnauthorized: 'Доступно только авторизованным пользователям',
  noWords:
    'Вы ещё не отмечали слова как сложные. Для того, чтобы сделать это, нажмите на кнопку "Добавить в сложные" рядом со словом',
};

export const MAX_WORDS_IN_BOOK = 3600;

export const NUMBER_OF_CORRECT_ANSWERS_TO_LEARN = {
  forEasyWords: 3,
  forHardWords: 5,
};

export const NO_DATA = 'no_data';

export const ERRORS_MESSAGES = {
  unauthorized: 'Unauthorized',
};

export const AUDIOCALL_QUESTIONS_NUMBER = 20;

export const SPRINT_INFO = {
  pointsTotal: 'Общее количество баллов:',
  defaultPointsPerWord: '+10 баллов за слово',
  pointsPerWord: 'баллов за слово',
  maxSeconds: '60',
  incorrect: 'Неверно',
  correct: 'Верно',
  crossMark: '✗',
  checkMark: '✓',
  waitMessage: 'Идёт загрузка слов ...',
};

export const FIVE_SECONDS = 5;

export const SPRINT_BREAKPOINTS = {
  forTwentyPoints: 4,
  forFourtyPoints: 8,
  forEightyPoints: 12,
};

export const ONE_SECOND = 1000;

export const GAME_FINAL_PAGE_MESSAGES = {
  forDifficuldWords:
    'У вас нет сложных слов. Пожалуйста, вернитесь в учебник и выберите другой раздел.',
  forBookSections:
    'Все слова с текущей и предыдущих страниц данного раздела изучены или являются сложными. Пожалуйста, вернитесь в учебник и выберите другой раздел.',
};

export const PROGRESS_TABLE_HEADINGS = ['Игра', 'Верные ответы', 'Неверные ответы'];

export const WORDS_PER_PAGE = 20;
