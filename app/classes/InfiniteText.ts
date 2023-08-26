import GSAP from 'gsap';
import Component from './Component';

export default class InfiniteText extends Component {
  element: HTMLElement;

  constructor(element) {
    super({ element });

    this.element = element;
    console.log(element);

    this.createInfinite();
  }

  createInfinite() {
    const { width } = this.element.getBoundingClientRect();
    const itemWidth = this.element.children[0].getBoundingClientRect().width;
    const yTranslation = ((3.5 * itemWidth) / width) * 100 * 1 + 345;
    GSAP.set(this.element, {
      yPercent: yTranslation,
    });

    GSAP.to(this.element, {
      ease: 'none',
      yPercent: 0,
      duration: 25,
      repeat: -1,
    });
  }
}
