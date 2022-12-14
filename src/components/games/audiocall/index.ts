import { GAMES, NO_CONTENT } from '../../../constants';
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
// eslint-disable-next-line import/no-cycle
import GameFinalPage from '../common/final-page';
import GameResultProcessor from '../common/result-processor';
import AuthController from '../../auth/auth-controller';

export default class AudioCallGame {
  private elementCreator: UIElementsConstructor;

  private container: HTMLDivElement;

  private controller: AudiocallController;

  private auth: AuthController;

  private startingPage: GameStartingPage;

  private finalPage: GameFinalPage;

  private resultProcessor: GameResultProcessor;

  private gameResults: IGameQuestionResult[];

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.controller = new AudiocallController();
    this.auth = new AuthController();
    this.container = this.createGameContainer();
    this.startingPage = new GameStartingPage();
    this.finalPage = new GameFinalPage('audiocall');
    this.resultProcessor = new GameResultProcessor();
    this.gameResults = [];
  }

  public async start(level?: number, levelPage?: number): Promise<void> {
    this.openGameContainer();
    if (this.auth.isUserAuthorized()) await this.resultProcessor.prepareUserStatistic();

    this.startingPage.open(GAMES.audiocall.className as GameName, this.container, level, levelPage);

    this.container.addEventListener('level-selected', async (event: Event): Promise<void> => {
      this.clearGameContainer();
      this.clearGameResults();
      const selectedLevel: number = (event as CustomEvent).detail?.selectedLevel;
      const selectedPage: number = (event as CustomEvent).detail?.selectedPage;
      this.finalPage.updateCurrentLevel(selectedLevel, selectedPage);
      await this.questionSwitcher(selectedLevel, selectedPage);
    });

    this.container.addEventListener('question-answered', async (event: Event): Promise<void> => {
      if (this.auth.isUserAuthorized()) {
        await this.resultProcessor.processAnswer('audiocall', (event as CustomEvent).detail);
      }
    });
  }

  private async questionSwitcher(level: number, levelPage?: number): Promise<void> {
    const questionInfoList: IAudiocallQuestionInfo[] = await this.controller.getQuestionList(
      level,
      levelPage
    );

    if (!questionInfoList.length) {
      this.finalPage.renderReturnPage(this.container, level);
      return;
    }

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

  private clearGameResults(): void {
    this.gameResults = [];
  }
}
