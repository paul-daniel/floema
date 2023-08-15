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

export default class Page implements IPage {
  id: string = '';

  element: ElementOrString;

  elements: {[x:string]: HTMLElementCollection };

  selectorChildren: {[x:string]: HTMLElementCollection };

  selector: ElementOrString;

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
  }

  create() {
    this.element = document.querySelector(this.selector as string);
    this.elements = {};

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
      GSAP.from(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      GSAP.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }
}
