import Page from '../../classes/Page';
import Button from '../../classes/Button';

export default class Home extends Page {
  link : Button | undefined = undefined;

  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.home__link ',
      },
    });
  }

  create() {
    super.create();

    this.link = new Button(this.elements.link);
  }

  destroy() {
    super.destroy();
    if (this.link) { this.link.removeEventListeners(); }
  }
}
