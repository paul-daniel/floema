/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Mesh, Program, Transform, Texture, OGLRenderingContext, Plane, ImageRepresentation,
} from 'ogl';

// @ts-ignore
import vertex from '../../shaders/plane-vertex.glsl';
// @ts-ignore
import fragment from '../../shaders/plane-fragment.glsl';

interface MediaProps {
  element : HTMLImageElement;
  gl: OGLRenderingContext;
  geometry: Plane;
  scene:Transform;
  index:number
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

  constructor({
    element, gl, geometry, scene, index,
  } : MediaProps) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.index = index;

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
    this.image.onload = () => (
      this.texture!.image = this.image as ImageRepresentation
    );
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: this.texture },
      },
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
}
