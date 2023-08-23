import { each } from 'lodash';
import GSAP from 'gsap';
import Component from '../classes/Component';

import { split } from '../utils/text';

export default class Preloader extends Component {
  length : number;

  animateOut: gsap.core.Timeline;

  constructor() {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img'),
      },
    });

    split({
      element: this.elements.title as HTMLElement,
      expression: '<br>',
    });

    split({
      element: this.elements.title as HTMLElement,
      expression: '<br>',
    });

    this.elements.titleSpans = (this.elements.title as HTMLElement).querySelectorAll('span span');

    this.length = 0;

    this.animateOut = GSAP.timeline();

    this.createLoader();
  }

  createLoader() {
    each(this.elements.images as NodeListOf<HTMLImageElement>, (element) => {
      element.src = element.getAttribute('data-src') ?? '';
      element.onload = () => this.onAssetLoaded();
    });
  }

  onAssetLoaded() {
    this.length += 1;
    const percent = (this.length / (this.elements.images as NodeListOf<HTMLImageElement>).length);
    (this.elements.numberText as HTMLElement).innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise(() => {
      this.animateOut.to(this.element, {
        delay: 2,
      });

      this.animateOut.to(this.elements.titleSpans, {
        autoAlpha: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%',
      });

      this.animateOut.to(this.elements.numberText, {
        autoAlpha: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%',
      }, '-=1.4');

      this.animateOut.to(this.element, {
        duration: 1.5,
        ease: 'expo.out',
        scaleY: 0,
        transformOrigin: '100% 100%',
      }, '-=0.7');

      this.animateOut.call(() => {
        this.emit('completed');
      });
    });
  }

  destroy() {
    (this.element as Element).parentNode?.removeChild(this.element as Element);
  }
}
