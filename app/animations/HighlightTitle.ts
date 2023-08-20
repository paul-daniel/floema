import GSAP from 'gsap';
import Animation from '../classes/Animation';

export default class HighlightTitle extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    GSAP.fromTo(this.element, {
      autoAlpha: 0,
      scale: 1.7,
    }, {
      duration: 1.3,
      delay: 0.7,
      scale: 1,
      ease: 'expo.out',
      autoAlpha: 1,
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {

  }
}
