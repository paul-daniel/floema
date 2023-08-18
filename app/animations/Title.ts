import GSAP from 'gsap';
import Animation from '../classes/Animation';
import { split, calculate } from '../utils/text';

export default class Title extends Animation {
  elementLinesSpans : HTMLElement[] | undefined = undefined;

  elementLines : HTMLElement[][] | undefined = undefined;

  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    split({
      element: this.element as HTMLElement,
      append: true,
    });

    split({
      element: this.element as HTMLElement,
      append: true,
    });

    this.elementLinesSpans = this.element.querySelectorAll('span span') as unknown as HTMLElement[];
  }

  animateIn() {
    if (!this.elementLines) return;
    GSAP.set(this.element, {
      autoAlpha: 1,
    });
    GSAP.fromTo(this.elementLines, {
      y: '100%',
    }, {
      autoAlpha: 1,
      delay: 0.3,
      duration: 1,
      stagger: {
        axis: 'x',
        amount: 0.2,
      },
      y: '0%',
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    if (!this.elementLinesSpans) return;
    this.elementLines = calculate(this.elementLinesSpans);
  }
}
