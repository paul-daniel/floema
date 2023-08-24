import { map } from 'lodash';

import { OGLRenderingContext, Plane, Transform } from 'ogl';
import Media from './Media';

interface HomeProps{
  gl: OGLRenderingContext;
  scene: Transform;
}

export default class Home {
  medias : NodeListOf<HTMLImageElement> | undefined = undefined;

  geometry: Plane | undefined = undefined;

  gl: OGLRenderingContext;

  group : Transform | undefined = undefined;

  constructor({ gl, scene } : HomeProps) {
    this.group = new Transform();
    this.medias = document.querySelectorAll<HTMLImageElement>('.home__gallery__media__image');
    this.gl = gl;

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

    map(this.medias, (element, index) => new Media({
      element,
      gl: this.gl,
      geometry: this.geometry as Plane,
      scene: this.group as Transform,
      index,
    }));
  }
}
