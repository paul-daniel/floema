import Button from '../../classes/Button';
import Page from '../../classes/Page';

export default class Detail extends Page {
  link : Button | undefined = undefined;

  constructor() {
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.detail__button',
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
