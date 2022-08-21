import { DEFAULT_PAGE_NAME, NO_CONTENT, STORAGE_KEYS } from '../constants';
import { PageName } from '../types';
import Auth from './auth/auth';
import MainPageView from './main-page/view';
import Menu from './menu';
import StudentBookView from './student-book/view';

export default class App {
  private menu: Menu;

  private auth: Auth;

  private pages: {
    main: MainPageView;
    studentBook: StudentBookView;
  };

  constructor() {
    this.menu = new Menu();
    this.auth = new Auth();
    this.pages = {
      main: new MainPageView(),
      studentBook: new StudentBookView(),
    };
  }

  public start(): void {
    this.menu.init((event: Event): void => this.menuHandler(event));
    this.auth.init();

    const currentPage: PageName = this.getCurrentPageName();
    this.menu.setMenuItemActiveState(currentPage);
    this.openPage(currentPage);
  }

  private menuHandler(event: Event): void {
    const menuItem: HTMLElement = event.target as HTMLElement;
    if (!menuItem.classList.contains('nav__item')) return;
    this.menu.resetMenuItemsActiveState();
    menuItem.classList.add('nav__item_active');
    const pageName = menuItem.dataset.pageName as PageName;
    this.openPage(pageName);
    this.saveCurrentPageName(pageName);
    this.menu.closeMenu();
  }

  private openPage(pageName: PageName): void {
    (document.querySelector('#app') as HTMLElement).innerHTML = NO_CONTENT;
    this.pages[pageName].renderPage();
  }

  private saveCurrentPageName(pageName: PageName): void {
    localStorage.setItem(STORAGE_KEYS.currentPage, pageName);
  }

  private getCurrentPageName(): PageName {
    return (localStorage.getItem(STORAGE_KEYS.currentPage) as PageName) || DEFAULT_PAGE_NAME;
  }
}