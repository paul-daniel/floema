import { each, map } from 'lodash';
import GSAP from 'gsap';

import Title from '../animations/Title';
import Paragraph from '../animations/Paragraph';
import colorsManager from './Colors';
import HighlightTitle from '../animations/HighlightTitle';
import AsyncLoad from './AsyncLoad';

type ElementOrString = string | Element | null;
type HTMLElementCollection = ElementOrString | Element[] | NodeListOf<Element> | null;

interface IPage {
  id: string;
  element: ElementOrString;
  elements: { [x: string]: HTMLElementCollection };
  selectorChildren: { [x: string]: HTMLElementCollection };
  selector: ElementOrString;
}

interface PageConstructor {
  id: string;
  element: ElementOrString;
  elements: { [x: string]: HTMLElementCollection };
}

interface Scroll {
  current: number,
  target: number,
  last: number,
  limit: number
}

export default class Page implements IPage {
  id: string = '';

  element: ElementOrString;

  elements: {[x:string]: HTMLElementCollection };

  selectorChildren: {[x:string]: HTMLElementCollection };

  selector: ElementOrString;

  animationIn : gsap.core.Timeline;

  animationOut : gsap.core.Timeline;

  scroll : Scroll;

  transformPrefix : string = '';

  animationTitles: Title[];

  animationParagraphs : Paragraph[];

  animationsHighlightTitle : HighlightTitle[];

  constructor({
    element,
    elements,
    id,
  }: PageConstructor) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsDescription: '[data-animation="description"]',
      animationsHighlightTitle: '[data-animation="highlight-title"]',
      preloaders: '[data-src]',
    };
    this.id = id;
    this.element = '';
    this.elements = {};
    this.animationIn = GSAP.timeline();
    this.animationOut = GSAP.timeline();
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };
    this.animationTitles = [];
    this.animationParagraphs = [];
    this.animationsHighlightTitle = [];
  }

  /** CREATION METHODS */

  create() {
    this.element = document.querySelector(this.selector as string);
    this.elements = {};
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof Element || entry instanceof NodeList || Array.isArray(entry)) {
        this.elements[key] = entry;
      } else {
        const selectedElements = document.querySelectorAll(entry as string);

        if (selectedElements.length === 0) {
          this.elements[key] = null;
        } else if (selectedElements.length === 1) {
          this.elements[key] = document.querySelector(entry as string);
        } else {
          this.elements[key] = selectedElements;
        }
      }
    });

    this.createAnimations();
    this.createPreloaders();
  }

  createPreloaders() {
    each(this.elements.preloaders as HTMLElement[], (element) => {
      new AsyncLoad(element);
    });
  }

  createAnimations() {
    this.animationTitles = map(this.elements.animationsTitles as Element[], (element) => new Title({
      element,
      elements: this.elements,
    }));

    this.animationParagraphs = map(
      this.elements.animationsParagraphs as Element[],
      (element) => new Paragraph({
        element,
        elements: this.elements,
      }),
    );

    this.animationParagraphs = map(
      this.elements.animationsHighlightTitle as Element[],
      (element) => new HighlightTitle({
        element,
        elements: this.elements,
      }),
    );

    if (!this.elements.animationsDescription) {
      return;
    }

    each(this.elements.animationsDescription as Element[], (element) => {
      const node = element.querySelectorAll('p');
      each(
        node,
        (pElement : HTMLElement) => this.animationParagraphs.push(
          new Paragraph({
            element: pElement,
            elements: this.elements,
          }),
        ),
      );
    });

    this.animationParagraphs = [
      ...this.animationParagraphs,
      ...map(
        this.elements.animationsDescription[0].querySelectorAll('p'),
        (element) => new Paragraph({
          element,
          elements: this.elements,
        }),
      ),
    ];
  }

  /** ANIMATIONS */

  show() {
    return new Promise((resolve) => {
      colorsManager.change(
        (this.element as Element).getAttribute('data-background') ?? '',
        (this.element as Element).getAttribute('data-color') ?? '',
      );

      this.animationIn.to(this.element, {
        autoAlpha: 1,
        onComplete: resolve,
      });

      this.animationIn.call(() => {
        this.addEventListeners();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  /** EVENT LISTENERS */

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit = (this.elements.wrapper as HTMLElement).clientHeight - window.innerHeight;
    }

    each(this.animationTitles, (animation) => animation.onResize());
    each(this.animationParagraphs, (animation) => animation.onResize());
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  update() {
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1);

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      (this.elements.wrapper as HTMLElement).style.transform = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {

  }

  removeEventListeners() {

  }

  /** DESTROY */

  destroy() {
    this.removeEventListeners();
  }
}
