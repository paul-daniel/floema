/* eslint-disable class-methods-use-this */
/* eslint-disable no-new */
import { each } from 'lodash';
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

  content : Element | null = null;

  template : string | null | undefined = 'home';

  page : Page | undefined = undefined;

  navigation : Navigation | undefined = undefined;

  frame : number = 0;

  constructor() {
    this.createContent();

    this.createPreloader();
    this.createNavigation();
    this.createPages();

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
    this.page?.create();

    this.onResize();
  }

  onPreloaded() {
    this.onResize();
    this.preloader?.destroy();
    this.page?.show();
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  /**
   * Define animations and navigation behavior on page change
   *
   * @param url the page we are going to
   * @returns nothing
   */
  async onChange(url : string) {
    if (!this.content) {
      console.error('no content found');
      return;
    }
    await this.page?.hide();
    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement('div');

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

  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      const linkModifier = link;
      linkModifier.onclick = (event) => {
        const { href } = link;
        event.preventDefault();
        this.onChange(href);
      };
    });
  }
}

new App();
