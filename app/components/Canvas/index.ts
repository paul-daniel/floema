import {
  OGLRenderingContext,
  Renderer,
  Camera,
  Transform,
} from 'ogl';

import Home from './Home';

export interface ViewPort {
  height: number;
  width: number;
}

export default class Canvas {
  renderer: Renderer | undefined = undefined;

  gl: OGLRenderingContext | undefined = undefined;

  camera : Camera | undefined = undefined;

  scene : Transform | undefined = undefined;

  home: Home | undefined = undefined;

  sizes: ViewPort | undefined = undefined;

  constructor() {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createHome();
  }

  /** CREATE METHODS */

  createRenderer() {
    this.renderer = new Renderer();

    this.gl = this.renderer.gl;

    // this.gl.canvas.width = 1024;
    // this.gl.canvas.height = 784;
    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    if (!this.gl) return;

    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    if (!this.scene || !this.gl || !this.sizes) return;
    console.log(this.sizes);
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  /** ON EVENT METHOD */

  onResize() {
    if (!this.camera) return;

    this.renderer?.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      height,
      width,
    };

    this.home?.onResize(this.sizes);
  }

  /** UPDATE */

  update() {
    this.renderer?.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
