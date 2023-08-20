import Component, { ElementOrString } from './Component';

export default class AsyncLoad extends Component {
  observer : IntersectionObserver | undefined = undefined;

  constructor(element : ElementOrString) {
    super({ element, elements: {} });

    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!(this.element as HTMLImageElement).src) {
            (this.element as HTMLImageElement).src = (this.element as HTMLImageElement).getAttribute('data-src') ?? '';
            (this.element as HTMLImageElement).onload = () => {
              (this.element as HTMLImageElement).classList.add('loaded');
            };
          }
        }
      });
    });

    this.observer.observe(this.element as HTMLImageElement);
  }
}
