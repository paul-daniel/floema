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

export interface MoveCoordinates {
  start: number,
  distance: number,
  end: number,
}

export interface Coordinates {
  x:MoveCoordinates,
  y:MoveCoordinates
}

export default class Canvas {
  renderer: Renderer | undefined = undefined;

  gl: OGLRenderingContext | undefined = undefined;

  camera : Camera | undefined = undefined;

  scene : Transform | undefined = undefined;

  home: Home | undefined = undefined;

  sizes: ViewPort | undefined = undefined;

  isDown: boolean = false;

  x : MoveCoordinates;

  y : MoveCoordinates;

  constructor() {
    this.x = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };

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

  onTouchDown(e: TouchEvent & MouseEvent) {
    this.isDown = true;

    this.x.start = e.touches ? e.touches[0].clientX : e.clientX;
    this.y.start = e.touches ? e.touches[0].clientY : e.clientY;

    if (this.home) {
      this.home.onTouchDown();
    }
  }

  onTouchMove(e: TouchEvent & MouseEvent) {
    if (!this.isDown) return;

    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    this.x.end = x;
    this.y.end = y;

    const values = {
      x: this.x,
      y: this.y,
    };

    if (this.home) {
      this.home.onTouchMove(values);
    }
  }

  onTouchUp(e: TouchEvent & MouseEvent) {
    this.isDown = false;

    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    this.x.end = x;
    this.y.end = y;

    if (this.home) {
      this.home.onTouchUp();
    }
    console.log('up', { x, y });
  }
  /** UPDATE */

  update() {
    if (this.home) { this.home.update(); }

    this.renderer?.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
