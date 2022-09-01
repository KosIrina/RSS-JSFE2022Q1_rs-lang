import UIElementsConstructor from '../../../utils/ui-elements-creator';
import {
  PAGE_TITLES,
  GAMES,
  BOOK_SECTIONS,
  PAGINATION_BUTTONS,
  MAX_PAGES_IN_BOOK_SECTION,
  DISPLAY_MODES,
  NO_CONTENT,
  DIFFICULT_WORDS_CONTAINER_MESSAGES,
  STORAGE_KEYS,
} from '../../../constants';
import { IBookSectionInfo, Numbers, IWord, IUserTokens } from '../../../types';
import StudentBookController from '../controller';
import WordCard from './words';
import WordsAPI from '../../../api/words-api';
import AuthController from '../../auth/auth-controller';

export default class StudentBookView {
  readonly elementCreator: UIElementsConstructor;

  readonly bookController: StudentBookController;

  readonly authController: AuthController;

  readonly wordsAPI: WordsAPI;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.bookController = new StudentBookController();
    this.authController = new AuthController();
    this.wordsAPI = new WordsAPI();
  }

  public renderPage(): void {
    const previousOpenedSection = this.bookController.getSection();
    const previousOpenedPage = this.bookController.getPage();
    if (previousOpenedSection && previousOpenedPage) {
      this.updatePageContainer(previousOpenedSection, previousOpenedPage);
      this.bookController.removeSectionAndPageFromStorage();
    } else {
      this.updatePageContainer();
    }
  }

  private async updatePageContainer(
    section = BOOK_SECTIONS.beginner,
    page = Numbers.One
  ): Promise<void> {
    const pageContainer = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_student-book');

    pageContainer.append(
      this.createPageTitle(),
      this.createGamesContainer(),
      this.createBookSectionsContainer(section.className),
      this.createPaginationContainer(section, page),
      await this.createWordsContainer(section, page)
    );
  }

  private createPageTitle(): HTMLHeadingElement {
    const pageTitle: HTMLHeadingElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h2',
      classNames: ['page__title'],
      innerText: PAGE_TITLES.studentBook,
    });
    return pageTitle;
  }

  private createGameLink(gameClass: string, gameName: string, gameLink: string): HTMLAnchorElement {
    const gameLinkElement: HTMLAnchorElement =
      this.elementCreator.createUIElement<HTMLAnchorElement>({
        tag: 'a',
        classNames: ['games__game-link', gameClass],
        innerText: gameName,
      });
    gameLinkElement.setAttribute('href', gameLink);
    return gameLinkElement;
  }

  private createGamesContainer(): HTMLDivElement {
    const gamesContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__games', 'games'],
    });
    gamesContainer.append(
      this.createGameLink(GAMES.audiocall.className, GAMES.audiocall.name, GAMES.audiocall.link),
      this.createGameLink(GAMES.sprint.className, GAMES.sprint.name, GAMES.sprint.link)
    );
    return gamesContainer;
  }

  private createBookSection(sectionName: string): HTMLDivElement {
    const bookSection: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['sections__book-section', sectionName.toLowerCase()],
      innerText: sectionName,
    });
    bookSection.addEventListener('click', async (event: Event): Promise<void> => {
      const newSection: IBookSectionInfo = this.bookController.switchSection(event);
      const wordsContainer = document.querySelector('.page__words') as HTMLDivElement;
      wordsContainer.innerHTML = NO_CONTENT;
      wordsContainer.append(this.createLoader(newSection));
      await this.fillWordsContainer(newSection, Numbers.One, wordsContainer);
    });
    return bookSection;
  }

  private createBookSectionsContainer(sectionClass: string): HTMLDivElement {
    const sectionsContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__sections', 'sections'],
    });
    const sections: IBookSectionInfo[] = Object.values(BOOK_SECTIONS);
    sections.forEach((sectionInfo: IBookSectionInfo): void => {
      const bookSection: HTMLDivElement = this.createBookSection(sectionInfo.text);
      if (sectionInfo.className === sectionClass) {
        bookSection.classList.add('active');
      }
      sectionsContainer.append(bookSection);
    });
    return sectionsContainer;
  }

  private createPaginationButton(buttonClass: string, page: number): HTMLButtonElement {
    const paginationButton: HTMLButtonElement =
      this.elementCreator.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['pagination__button', buttonClass],
      });
    if (page === Numbers.One && buttonClass === PAGINATION_BUTTONS.previous.className) {
      paginationButton.setAttribute('disabled', '');
    }
    if (page === MAX_PAGES_IN_BOOK_SECTION && buttonClass === PAGINATION_BUTTONS.next.className) {
      paginationButton.setAttribute('disabled', '');
    }
    paginationButton.addEventListener('click', async (event: Event): Promise<void> => {
      const newSectionAndPage: { page: number; section: IBookSectionInfo } =
        this.bookController.switchPage(event);
      const wordsContainer = document.querySelector('.page__words') as HTMLDivElement;
      wordsContainer.innerHTML = NO_CONTENT;
      wordsContainer.append(this.createLoader(newSectionAndPage.section));
      await this.fillWordsContainer(
        newSectionAndPage.section,
        newSectionAndPage.page,
        wordsContainer
      );
    });
    return paginationButton;
  }

  private createPaginationContainer(
    section: IBookSectionInfo,
    currentPage: number
  ): HTMLDivElement {
    const paginationContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>(
      {
        tag: 'div',
        classNames: ['page__pagination', 'pagination'],
      }
    );

    const currentPageElement: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['pagination__current-page'],
      innerText: `${currentPage}`,
    });

    paginationContainer.append(
      this.createPaginationButton(PAGINATION_BUTTONS.previous.className, currentPage),
      currentPageElement,
      this.createPaginationButton(PAGINATION_BUTTONS.next.className, currentPage)
    );

    if (section === BOOK_SECTIONS.difficultWords) {
      paginationContainer.style.display = DISPLAY_MODES.contentNotVisible;
    }
    return paginationContainer;
  }

  private async createWordsContainer(
    section: IBookSectionInfo,
    page: number
  ): Promise<HTMLDivElement> {
    const wordsContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__words', 'words'],
    });
    wordsContainer.style.backgroundColor = section.color;
    await this.fillWordsContainer(section, page, wordsContainer);
    return wordsContainer;
  }

  private async createWordsCards(
    section: IBookSectionInfo,
    page: number
  ): Promise<HTMLDivElement[]> {
    const words: IWord[] = await this.wordsAPI.getWords(section.group, page);
    const wordsCards: HTMLDivElement[] = words.map(
      (word: IWord): HTMLDivElement => new WordCard(word).createWordCard()
    );
    return wordsCards;
  }

  private async createDifficultWordsCards(): Promise<HTMLDivElement[]> {
    const userInfo: IUserTokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) as string);
    const words: IWord[] = await this.wordsAPI.getDifficultWords(userInfo.userId);
    const wordsCards: HTMLDivElement[] = words.map(
      (word: IWord): HTMLDivElement => new WordCard(word).createWordCard()
    );
    return wordsCards;
  }

  private async fillWordsContainer(
    section: IBookSectionInfo,
    page: number,
    container: HTMLDivElement
  ): Promise<void> {
    if (section.text === BOOK_SECTIONS.difficultWords.text) {
      container.classList.add('difficult-words');
      if (!this.authController.isUserAuthorized()) {
        container.textContent = DIFFICULT_WORDS_CONTAINER_MESSAGES.forAnauthorized;
      } else {
        const difficultWordsCards = await this.createDifficultWordsCards();
        difficultWordsCards.length
          ? container.append(...difficultWordsCards)
          : (container.textContent = DIFFICULT_WORDS_CONTAINER_MESSAGES.noWords);
      }
    } else {
      container.classList.remove('difficult-words');
      container.append(...(await this.createWordsCards(section, page)));
    }
    const loader: HTMLDivElement | null = document.querySelector('.loader');
    if (loader) loader.remove();
  }

  private createLoader(sectionInfo: IBookSectionInfo): HTMLDivElement {
    const loaderContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['loader', `loader-${sectionInfo.className}`],
    });
    loaderContainer.style.backgroundImage = `linear-gradient(to right, #212121 10%, ${sectionInfo.color} 50%)`;
    return loaderContainer;
  }
}
