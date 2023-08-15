/* eslint-disable no-new */
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
}

new App();
