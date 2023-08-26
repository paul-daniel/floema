import { map } from 'lodash';
import GSAP from 'gsap';
import { OGLRenderingContext, Plane, Transform } from 'ogl';
import Media from './Media';
import { Coordinates, ViewPort } from '.';
import { NormalizedWheel } from '../..';

interface HomeProps{
  gl: OGLRenderingContext;
  scene: Transform;
  sizes: ViewPort;
}

export interface LerpCoordinates{
  current: number,
  target : number,
  lerp : number,
  direction: 'right' | 'left' | 'top' | 'bottom',
  last:number,
}

export interface PlaneCoordinates{
  x: number,
  y: number
}

export default class Home {
  mediasElements : NodeListOf<HTMLImageElement> | undefined = undefined;

  galleryElement : HTMLElement;

  galleryBounds : DOMRect | undefined = undefined;

  geometry: Plane | undefined = undefined;

  gl: OGLRenderingContext;

  group : Transform | undefined = undefined;

  sizes : ViewPort | undefined = undefined;

  medias : Media[] = [];

  speed: number;

  scrollCurrent: PlaneCoordinates;

  scroll: PlaneCoordinates;

  x: LerpCoordinates;

  y: LerpCoordinates;

  gallerySizes: { width: number; height: number; } | undefined = undefined;

  constructor({ gl, scene, sizes } : HomeProps) {
    this.group = new Transform();
    this.galleryElement = document.querySelector('.home__gallery') as HTMLElement;
    this.mediasElements = document.querySelectorAll<HTMLImageElement>('.home__gallery__media__image');
    this.gl = gl;
    this.sizes = sizes;

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: 'bottom',
      last: 0,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: 'left',
      last: 0,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.speed = 2;

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    if (!this.gl) return;
    this.geometry = new Plane(this.gl) as Plane;
  }

  createGallery() {
    if (!this.geometry || !this.group) return;

    this.medias = map(this.mediasElements, (element, index) => new Media({
      element,
      gl: this.gl,
      geometry: this.geometry as Plane,
      scene: this.group as Transform,
      sizes: this.sizes as ViewPort,
      index,
    }));
  }

  onResize(sizes:ViewPort) {
    this.sizes = sizes;

    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.gallerySizes = {
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
      height: (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
    };

    map(this.medias, (media) => (media.onResize(sizes, this.scroll)));
  }

  onTouchDown() {
    this.speed = 0;

    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y } : Coordinates) {
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;

    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp() {
    this.speed = 2;
  }

  onWheel({ pixelX, pixelY } : NormalizedWheel) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  // Animations
  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    map(this.medias, (media) => media.hide());
  }

  isMobile() : boolean {
    return window.innerWidth <= 768;
  }

  isTablet() {

  }

  update() {
    // this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp);
    this.y.target += this.speed;
    this.x.current = 0;
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp);

    if (this.scroll.x < this.x.current) {
      this.x.direction = 'right';
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'left';
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top';
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom';
    }

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media) => {
      if (!media.mesh || !this.sizes || !this.gallerySizes) return;
      if (this.x.direction === 'left') {
        const x = media.mesh.position.x + media.mesh.scale.x / 2;

        if (x < -(this.sizes.width / 2)) {
          media.extra.x += this.gallerySizes.width;
        }
      } else if (this.x.direction === 'right') {
        const x = media.mesh.position.x - media.mesh.scale.x / 2;

        if (x > (this.sizes.width / 2)) {
          media.extra.x -= this.gallerySizes.width;
        }
      }

      if (this.y.direction === 'top') {
        const y = media.mesh.position.y + media.mesh.scale.y / 2;
        this.speed = 2;
        if (y < -(this.sizes.width / 2) + (this.isMobile() ? -0.5 : 0.5)) {
          media.extra.y += this.gallerySizes.height;
        }
      } else if (this.y.direction === 'bottom') {
        const y = media.mesh.position.y - media.mesh.scale.y / 2;
        this.speed = -2;
        if (y > (this.sizes.width / 2) - (this.isMobile() ? -0.5 : 0.5)) {
          media.extra.y -= this.gallerySizes.height;
        }
      }

      media.update(this.scroll, this.y);
    });

    this.y.last = this.y.current;
  }
}
