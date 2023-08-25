import { map } from 'lodash';
import GSAP from 'gsap';
import { OGLRenderingContext, Plane, Transform } from 'ogl';
import Media from './Media';
import { Coordinates, MoveCoordinates, ViewPort } from '.';

interface HomeProps{
  gl: OGLRenderingContext;
  scene: Transform;
  sizes: ViewPort;
}

interface LerpCoordinates{
  current: number,
  target : number,
  lerp : number,
  direction: 'right' | 'left' | 'top' | 'bottom'
}

interface PlaneCoordinates{
  x: number,
  y: number
}

export default class Home {
  mediasElements : NodeListOf<HTMLImageElement> | undefined = undefined;

  geometry: Plane | undefined = undefined;

  gl: OGLRenderingContext;

  group : Transform | undefined = undefined;

  sizes : ViewPort | undefined = undefined;

  medias : Media[] = [];

  speed: LerpCoordinates;

  scrollCurrent: PlaneCoordinates;

  scroll: PlaneCoordinates;

  x: LerpCoordinates;

  y: LerpCoordinates;

  constructor({ gl, scene, sizes } : HomeProps) {
    this.group = new Transform();
    this.mediasElements = document.querySelectorAll<HTMLImageElement>('.home__gallery__media__image');
    this.gl = gl;
    this.sizes = sizes;

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: 'top',
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: 'left',
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: 'top',
    };

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

  onResize(size:ViewPort) {
    map(this.medias, (media) => (media.onResize(size)));
  }

  onTouchDown() {
    this.speed.target = 1;

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
    this.speed.target = 0;
  }

  update() {
    this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp); // prettier-ignore

    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp); // prettier-ignore
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp); // prettier-ignore

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

    map(this.medias, (media) => media.update({
      x: this.x.current,
      y: this.y.current,
    }));
  }
}
