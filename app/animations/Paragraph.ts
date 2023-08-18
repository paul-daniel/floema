import GSAP from 'gsap';
import Animation from '../classes/Animation';

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    GSAP.fromTo(this.element, {
      autoAlpha: 0.3,
    }, {
      duration: 0.6,
      delay: 0.35,
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
