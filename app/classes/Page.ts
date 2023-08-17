import { each } from 'lodash';
import GSAP from 'gsap';

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

  constructor({
    element,
    elements,
    id,
  }: PageConstructor) {
    this.selector = element;
    this.selectorChildren = { ...elements };
    this.id = id;
    this.element = '';
    this.elements = {};
    this.animationIn = GSAP.timeline();
    this.animationOut = GSAP.timeline();
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 1000,
    };
  }

  create() {
    this.element = document.querySelector(this.selector as string);
    this.elements = {};
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 1000,
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
  }

  show() {
    return new Promise((resolve) => {
      this.animationIn.fromTo(this.element, {
        autoAlpha: 0,
      }, {
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
      this.removeEventListeners();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onResize() {
    this.scroll.limit = (this.elements.wrapper as HTMLElement).clientHeight - window.innerHeight;
  }

  onMouseWheel(event : unknown | WheelEvent) {
    const { deltaY } = event as WheelEvent;
    this.scroll.target += deltaY;
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
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener('mousewheel', this.onMouseWheel.bind(this));
  }
}
