/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Mesh, Program, Transform, Texture, OGLRenderingContext, Plane, ImageRepresentation,
} from 'ogl';
import GSAP from 'gsap';

// @ts-ignore
import vertex from '../../shaders/plane-vertex.glsl';
// @ts-ignore
import fragment from '../../shaders/plane-fragment.glsl';
import { ViewPort } from '.';
import { LerpCoordinates, PlaneCoordinates } from './Home';

interface MediaProps {
  element : HTMLImageElement;
  gl: OGLRenderingContext;
  geometry: Plane;
  scene:Transform;
  index:number;
  sizes: ViewPort
}

export default class Media {
  element: HTMLImageElement;

  scene : Transform | undefined = undefined;

  program: Program | undefined = undefined;

  mesh: Mesh | undefined = undefined;

  texture: Texture | undefined = undefined;

  gl: OGLRenderingContext;

  geometry: Plane;

  image: HTMLImageElement | undefined = undefined;

  index : number;

  sizes: ViewPort;

  bounds: DOMRect | undefined = undefined;

  height : number | undefined = undefined;

  width : number | undefined = undefined;

  x : number = 0;

  y: number = 0;

  extra: PlaneCoordinates;

  constructor({
    element, gl, geometry, scene, index, sizes,
  } : MediaProps) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.index = index;
    this.sizes = sizes;
    this.extra = {
      x: 0,
      y: 0,
    };

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    this.image = new window.Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = this.element.getAttribute('data-src') as string;

    // eslint-disable-next-line no-return-assign
    this.image.onload = () => {
      this.program!.uniforms.uImageSizes.value = [this.image?.naturalWidth, this.image?.naturalHeight];
      this.texture!.image = this.image as ImageRepresentation;
    };
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: this.texture },
        uStrength: { value: 0 },
        uAlpha: { value: 0 },
        uSpeed: { value: 0 },
        uOffset: { value: [0, 0] },
        uViewportSizes: { value: [this.sizes.width, this.sizes.height] },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
      },
      transparent: true,
    });
  }

  createMesh() {
    if (!this.gl || !this.scene) return;

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);

    this.mesh.position.x += this.index * this.mesh.scale.x;
  }

  createBounds() {
    if (!this.mesh) return;
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();

    this.mesh.program.uniforms.uPlaneSizes.value = [this.mesh.scale.x, this.mesh.scale.y];
  }

  updateScale() {
    if (!this.bounds || !this.mesh) return;

    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = (this.sizes.width * this.width);
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updateX(x = 0) {
    if (!this.bounds || !this.mesh) return;
    this.x = (this.bounds.left + x) / window.innerWidth;
    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + ((this.x) * this.sizes.width) + this.extra.x;
  }

  updateY(y = 0) {
    if (!this.bounds || !this.mesh) return;
    this.y = (this.bounds.top + y) / window.innerHeight;
    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - ((this.y) * this.sizes.height) + this.extra.y;
  }

  update(scroll : PlaneCoordinates, y: LerpCoordinates) {
    if (!this.bounds || !this.program || !this.mesh) return;
    this.updateX(scroll.x);
    this.updateY(scroll.y);

    this.mesh.program.uniforms.uStrength.value = ((y.current - y.last) / window.innerWidth) * 10;
    // this.program.uniforms.uspeed.value = speed;
  }

  show() {
    if (!this.program) return;
    GSAP.fromTo(
      this.program.uniforms.uAlpha,
      {
        value: 0,
      },
      {
        value: 0.4,
      },
    );
  }

  hide() {
    if (!this.program) return;
    GSAP.to(this.program.uniforms.uAlpha, {
      value: 0,
    });
  }

  onResize(sizes:ViewPort, scroll :PlaneCoordinates) {
    if (!this.mesh) return;
    this.extra = {
      x: 0,
      y: 0,
    };

    this.sizes = sizes;
    this.mesh.program.uniforms.uOffset.value = [this.sizes.width, this.sizes.height];

    this.createBounds();
    this.updateX(scroll && scroll.x);
    this.updateY(scroll && scroll.y);
  }
}
