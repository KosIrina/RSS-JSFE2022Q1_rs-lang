import { DEFAULT_PAGE_NAME, DISPLAY_MODES, NO_CONTENT, STORAGE_KEYS } from '../constants';
import { PageName } from '../types';
import Auth from './auth/auth';
import GamesHomepage from './games-homepage';
import MainPageView from './main-page/view';
import Menu from './menu';
import StudentBookView from './student-book/view';
import StudentBook from './student-book';
import StatisticPage from './statistic';

export default class App {
  private menu: Menu;

  private auth: Auth;

  private studentBook: StudentBook;

  private pages: {
    main: MainPageView;
    studentBook: StudentBookView;
    games: GamesHomepage;
    statistic: StatisticPage;
  };

  constructor() {
    this.menu = new Menu();
    this.auth = new Auth();
    this.studentBook = new StudentBook();
    this.pages = {
      main: new MainPageView(),
      studentBook: new StudentBookView(),
      games: new GamesHomepage(),
      statistic: new StatisticPage(),
    };
  }

  public start(): void {
    this.menu.init((event: Event): void => this.menuHandler(event));
    this.auth.init();
    this.studentBook.init();

    const currentPage: PageName = this.getCurrentPageName();
    this.menu.setMenuItemActiveState(currentPage);
    this.openPage(currentPage);
  }

  private menuHandler(event: Event): void {
    const menuItem: HTMLElement = event.target as HTMLElement;
    if (!menuItem.classList.contains('nav__item')) return;
    const pageName: PageName = menuItem.dataset.pageName as PageName;
    this.menu.resetMenuItemsActiveState();
    this.menu.setMenuItemActiveState(pageName);
    this.resetMainContainerClassesToDefaults();
    this.openPage(pageName);
    this.saveCurrentPageName(pageName);
    this.menu.closeMenu();
  }

  private openPage(pageName: PageName): void {
    (document.querySelector('#app') as HTMLElement).innerHTML = NO_CONTENT;
    this.pages[pageName].renderPage();
    this.makeFooterVisible();
    document.dispatchEvent(new Event('new-page-opened'));
  }

  private saveCurrentPageName(pageName: PageName): void {
    localStorage.setItem(STORAGE_KEYS.currentPage, pageName);
  }

  private getCurrentPageName(): PageName {
    return (localStorage.getItem(STORAGE_KEYS.currentPage) as PageName) || DEFAULT_PAGE_NAME;
  }

  private makeFooterVisible(): void {
    (document.querySelector('footer') as HTMLElement).style.display =
      DISPLAY_MODES.contentFlexVisible;
  }

  private resetMainContainerClassesToDefaults(): void {
    const mainContainer = document.getElementById('app') as HTMLDivElement;
    const mainContainerClasses: DOMTokenList = mainContainer.classList;
    mainContainerClasses.forEach((mainContainerClass: string): void => {
      if (mainContainerClass.startsWith('page_')) {
        mainContainer.classList.remove(mainContainerClass);
      }
    });
  }
}
