import GSAP from 'gsap';
import Component from '../classes/Component';
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from '../utils/color';

export default class Navigation extends Component {
  constructor(template : string) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link',
        logo: '.navigation__link__icon',
      },
    });

    this.onChange(template);
  }

  /**
   * Will check the current page and update navigation accordingly
   */
  onChange(template : string) {
    if (template === 'about') {
      GSAP.to([this.element, this.elements.logo], {
        color: COLOR_BRIGHT_GRAY,
        duration: 1.5,
      });

      GSAP.to((this.elements.items as NodeList)[0], {
        autoAlpha: 1,
        duration: 0.75,
        delay: 0.75,
        pointerEvents: 'all',
      });

      GSAP.to((this.elements.items as NodeList)[1], {
        autoAlpha: 0,
        pointerEvents: 'none',
      });
    } else if (template === 'collections') {
      GSAP.to([this.element, this.elements.logo], {
        color: COLOR_QUARTER_SPANISH_WHITE,
        duration: 1.5,
      });

      GSAP.to((this.elements.items as NodeList)[1], {
        autoAlpha: 1,
        duration: 0.75,
        delay: 0.75,
        pointerEvents: 'all',
      });

      GSAP.to((this.elements.items as NodeList)[0], {
        autoAlpha: 0,
        duration: 1.5,
        pointerEvents: 'none',
      });
    } else {
      GSAP.to([this.element, this.elements.logo], {
        color: COLOR_QUARTER_SPANISH_WHITE,
        duration: 1.5,
      });

      GSAP.to((this.elements.items as NodeList)[0], {
        autoAlpha: 1,
        duration: 0.75,
        delay: 0.75,
        pointerEvents: 'all',
      });

      GSAP.to((this.elements.items as NodeList)[1], {
        autoAlpha: 0,
        pointerEvents: 'none',
      });
    }

    console.log(template);
  }
}
