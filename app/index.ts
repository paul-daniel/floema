import { each } from 'lodash';
import Canvas from './components/Canvas';
import About from './pages/About';
import Collections from './pages/Collections';
import Detail from './pages/Detail';
import Home from './pages/Home';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';

type Page = Home | About | Collections | Detail;

class App {
  pages : Map<string, Page> = new Map();

  preloader : Preloader | undefined = undefined;

  canvas : Canvas | undefined = undefined;

  content : Element | null = null;

  template : string | null | undefined = 'home';

  page : Page | undefined = undefined;

  navigation : Navigation | undefined = undefined;

  frame : number = 0;

  constructor() {
    this.createContent();

    this.createPreloader();
    this.createNavigation();
    this.createCanvas();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  createNavigation() {
    this.navigation = new Navigation(this.template as string);
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once('completed', this.onPreloaded.bind(this));
  }

  createCanvas() {
    this.canvas = new Canvas();
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content?.getAttribute('data-template');
  }

  createPages() {
    this.pages.set('home', new Home());
    this.pages.set('about', new About());
    this.pages.set('collections', new Collections());
    this.pages.set('detail', new Detail());

    this.page = this.pages.get(this.template ?? 'home');

    if (this.page) { this.page.create(); }

    this.onResize();
  }

  onPreloaded() {
    this.onResize();
    this.preloader?.destroy();
    this.page?.show();
  }

  onResize() {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }

    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  onPopState() {
    this.onChange(window.location.pathname, false);
  }

  /**
   * Define animations and navigation behavior on page change
   *
   * @param url the page we are going to
   * @returns nothing
   */
  async onChange(url : string, push :boolean = true) {
    if (!this.content) {
      console.error('no content found');
      return;
    }
    await this.page?.hide();
    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement('div');
      if (push) {
        window.history.pushState({}, '', url);
      }
      div.innerHTML = html;

      const divContent = div.querySelector('.content');
      this.template = divContent!.getAttribute('data-template') as string;
      this.navigation?.onChange(this.template);
      this.content.setAttribute('data-template', this.template);
      this.page = this.pages.get(this.template ?? '');
      this.content.innerHTML = divContent!.innerHTML as string;

      this.page?.create();
      this.onResize();
      this.page?.update();
      this.page?.show();
      this.addLinkListeners();
    } else {
      console.error('request failed');
    }
  }

  onTouchDown(e) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(e);
    }
  }

  onTouchMove(e) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(e);
    }
  }

  onTouchUp(e) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(e);
    }
  }

  /** LOOPS */

  update() {
    if (this.canvas && this.canvas.update) {
      this.canvas.update();
    }

    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  /** EVENT LISTENERS */

  addEventListeners() {
    window.addEventListener('popstate', this.onPopState.bind(this));

    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));

    window.addEventListener('resize', this.onResize.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      const linkModifier = link;
      linkModifier.onclick = (event) => {
        event.preventDefault();
        const { href } = link;
        this.onChange(href);
      };
    });
  }
}

new App();
