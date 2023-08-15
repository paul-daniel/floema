interface PageCtr {
  element : string,
  elements : string[]
  id : string
}

export default class Page {
  id: string;

  selector : string = '';

  selectorChildren : string[] = [];

  element : Element | null = null;

  elements : Element[] = [];

  constructor({
    element,
    elements,
    id,
  } : PageCtr) {
    console.log('page');
    this.selector = element;
    this.selectorChildren = elements;
    this.id = id;
  }

  create() {
    this.element = document.querySelector(this.selector);
    console.log('create', this.id, this.element);
  }
}
