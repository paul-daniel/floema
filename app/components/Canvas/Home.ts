import { map } from 'lodash';

import { OGLRenderingContext, Plane, Transform } from 'ogl';
import Media from './Media';
import { ViewPort } from '.';

interface HomeProps{
  gl: OGLRenderingContext;
  scene: Transform;
  sizes: ViewPort;
}

export default class Home {
  mediasElements : NodeListOf<HTMLImageElement> | undefined = undefined;

  geometry: Plane | undefined = undefined;

  gl: OGLRenderingContext;

  group : Transform | undefined = undefined;

  sizes : ViewPort | undefined = undefined;

  medias : Media[] = [];

  constructor({ gl, scene, sizes } : HomeProps) {
    this.group = new Transform();
    this.mediasElements = document.querySelectorAll<HTMLImageElement>('.home__gallery__media__image');
    this.gl = gl;
    this.sizes = sizes;

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
}
