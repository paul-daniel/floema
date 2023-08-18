import Component, { HTMLElementCollection } from './Component';

interface AnimationCtr{
  element : HTMLElement,
  elements : { [x: string]: HTMLElementCollection };
}

export default class Animation extends Component {
  element : HTMLElement;

  observer : IntersectionObserver | undefined = undefined;

  constructor({ element, elements } : AnimationCtr) {
    super({ element, elements });
    this.element = element;
    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver(this.observerCallBack.bind(this));
    this.observer.observe(this.element);
  }

  observerCallBack(entries : IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.animateIn();
      } else {
        this.animateOut();
      }
    });
  }

  animateIn() {
    // Method overrided
  }

  animateOut() {
    // Method overrided
  }
}
