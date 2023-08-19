/* eslint-disable class-methods-use-this */
import { EventEmitter } from 'events';
import { each } from 'lodash';

type ElementOrString = string | Element | null;
export type HTMLElementCollection =
ElementOrString | Element[] | NodeListOf<Element> | NodeList | null;

interface IComponent {
  element: ElementOrString;
  elements: { [x: string]: HTMLElementCollection };
  selectorChildren: { [x: string]: HTMLElementCollection };
  selector: ElementOrString;
}

interface ComponentConstructor {
  element: ElementOrString;
  elements: { [x: string]: HTMLElementCollection };
}

export default class Component extends EventEmitter implements IComponent {
  element: ElementOrString;

  elements: {[x:string]: HTMLElementCollection };

  selectorChildren: {[x:string]: HTMLElementCollection };

  selector: ElementOrString;

  constructor({
    element,
    elements,
  }: ComponentConstructor) {
    super();

    this.selector = element;
    this.selectorChildren = { ...elements };
    this.element = '';
    this.elements = {};

    this.create();

    this.addEventListeners();
  }

  create() {
    if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector as string);
    }
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

  addEventListeners() {

  }

  removeEventListeners() {

  }
}
