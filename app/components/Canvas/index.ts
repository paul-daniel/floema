import {
  OGLRenderingContext,
  Renderer,
  Camera,
  Transform,
} from 'ogl';

import Home from './Home';

export default class Canvas {
  renderer: Renderer | undefined = undefined;

  gl: OGLRenderingContext | undefined = undefined;

  camera : Camera | undefined = undefined;

  scene : Transform | undefined = undefined;

  home: Home | undefined = undefined;

  constructor() {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createHome();
  }

  /** CREATE METHODS */

  createRenderer() {
    this.renderer = new Renderer();

    this.gl = this.renderer.gl;

    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    if (!this.gl) return;

    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });
  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    if (!this.scene || !this.gl) return;

    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
    });
  }

  /** ON EVENT METHOD */

  onResize() {
    if (!this.camera) return;

    this.renderer?.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });
  }

  /** UPDATE */

  update() {
    this.renderer?.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
