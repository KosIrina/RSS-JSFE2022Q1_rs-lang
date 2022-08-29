import { DISPLAY_MODES, GAMES, NO_CONTENT } from '../../../constants';
import {
  GameName,
  IAudiocallQuestionInfo,
  IGameQuestionResult,
  Numbers,
  StringifiedBoolean,
} from '../../../types';
import UIElementsConstructor from '../../../utils/ui-elements-creator';
import AudiocallController from './controller/controller';
import AudiocallQuestion from './question-card';
import GameStartingPage from '../common/starting-page';
import GameFinalPage from '../common/final-page';

export default class AudioCallGame {
  private elementCreator: UIElementsConstructor;

  private container: HTMLDivElement;

  private controller: AudiocallController;

  private startingPage: GameStartingPage;

  private finalPage: GameFinalPage;

  private gameResults: IGameQuestionResult[];

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.controller = new AudiocallController();
    this.container = this.createGameContainer();
    this.startingPage = new GameStartingPage();
    this.finalPage = new GameFinalPage();
    this.gameResults = [];
  }

  public async start(level?: number, levelPage?: number): Promise<void> {
    this.openGameContainer();
    this.hideFooter();

    if (level !== undefined && levelPage !== undefined) {
      this.startingPage.open(
        GAMES.audiocall.className as GameName,
        this.container,
        level.toString()
      );
      this.container.addEventListener('level-selected', async (): Promise<void> => {
        this.clearGameContainer();
        await this.questionSwitcher(level, levelPage);
      });
    } else {
      this.startingPage.open(GAMES.audiocall.className as GameName, this.container);
      this.container.addEventListener('level-selected', async (event: Event): Promise<void> => {
        this.clearGameContainer();
        const selectedLevel: number =
          Number((event as CustomEvent).detail?.selectedLevel as string) - Numbers.One;
        await this.questionSwitcher(selectedLevel);
      });
    }
  }

  private async questionSwitcher(level: number, levelPage?: number): Promise<void> {
    const questionInfoList: IAudiocallQuestionInfo[] = await this.controller.getQuestionList(
      level,
      levelPage
    );

    new AudiocallQuestion(questionInfoList[Numbers.Zero], Numbers.Zero).makeQuestion(
      this.container
    );

    this.container.addEventListener('question-closed', (): void => {
      const questionNumber = Number(
        (this.container.firstElementChild as HTMLDivElement).dataset.questionNumber as string
      );

      this.gameResults.push({
        correctAnswer: questionInfoList[questionNumber].correctAnswer,
        isCorrect:
          (this.container.querySelector('.question') as HTMLDivElement).dataset
            .isUserAnswerCorrect === StringifiedBoolean.True,
      });

      this.clearGameContainer();

      if (questionNumber === questionInfoList.length - Numbers.One) {
        this.finalPage.renderResults(this.container, this.gameResults);
      } else {
        const nextQuestionNumber: number = questionNumber + Numbers.One;
        new AudiocallQuestion(
          questionInfoList[nextQuestionNumber],
          nextQuestionNumber
        ).makeQuestion(this.container);
      }
    });
  }

  private createGameContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game', 'audiocall'],
    });
  }

  private openGameContainer(): void {
    this.clearGameContainer();
    (document.querySelector('#app') as HTMLElement).append(this.container);
  }

  private clearGameContainer(): void {
    this.container.innerHTML = NO_CONTENT;
  }

  private closeGameContainer(): void {
    this.container.remove();
  }

  private hideFooter(): void {
    (document.querySelector('.footer') as HTMLElement).style.display =
      DISPLAY_MODES.contentNotVisible;
  }
}
