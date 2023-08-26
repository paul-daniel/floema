import Page from '../../classes/Page';
import Button from '../../classes/Button';
import InfiniteText from '../../classes/InfiniteText';

export default class Home extends Page {
  link : Button | undefined = undefined;

  title : InfiniteText | undefined = undefined;

  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.home__link ',
        title: '.home__titles__wrapper',
      },
    });
  }

  create() {
    super.create();

    this.link = new Button(this.elements.link);

    this.title = new InfiniteText(this.elements.title);
  }

  destroy() {
    super.destroy();
    if (this.link) { this.link.removeEventListeners(); }
  }
}
