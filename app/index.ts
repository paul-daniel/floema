/* eslint-disable class-methods-use-this */
/* eslint-disable no-new */
import { each } from 'lodash';
import About from './pages/About';
import Collections from './pages/Collections';
import Detail from './pages/Detail';
import Home from './pages/Home';

type Page = Home | About | Collections | Detail;

class App {
  pages : Map<string, Page> = new Map();

  content : Element | null = null;

  template : string | null | undefined = 'home';

  page : Page | undefined = undefined;

  constructor() {
    this.createContent();
    this.createPages();

    this.addLinkListeners();
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
    this.page?.show();
  }

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
      this.content.setAttribute('data-template', this.template);
      this.page = this.pages.get(this.template ?? '');
      this.content.innerHTML = divContent!.innerHTML as string;

      this.page?.create();
      this.page?.show();
    } else {
      console.error('request failed');
    }
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
