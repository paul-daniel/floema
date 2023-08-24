import { each } from 'lodash';
import GSAP from 'gsap';
import Component from '../classes/Component';

export default class TransitionCanvas extends Component {
  length : number;

  animateOut: gsap.core.Timeline;

  percent : number;

  ctx : CanvasRenderingContext2D;

  constructor() {
    super({
      element: '.transition__canvas',
      elements: {
        images: document.querySelectorAll('img'),
      },
    });

    this.length = 0;

    this.percent = 0;

    this.animateOut = GSAP.timeline();

    this.ctx = (this.element as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;

    this.createLoader();
  }

  drawArc(height: number, arcIntensity: number): void {
    this.ctx.clearRect(-1, -1, (this.element as HTMLCanvasElement).width + 2, (this.element as HTMLCanvasElement).height + 2);

    this.ctx.beginPath();

    // Set the fill style
    this.ctx.fillStyle = '#37384C';
    this.ctx.moveTo(0, (this.element as HTMLCanvasElement).height);
    this.ctx.imageSmoothingEnabled = false;
    // Calculate dynamic arc intensity based on the current height using a power-based formula
    const heightRatio = height / (this.element as HTMLCanvasElement).height;
    const adjustedIntensity = arcIntensity * (1 - heightRatio) ** 2;

    // Draw line up to the beginning of the arc
    this.ctx.lineTo(0, (this.element as HTMLCanvasElement).height - height);

    // Control points for the bezier curve (arc)
    const controlPoint1X: number = (this.element as HTMLCanvasElement).width / 4;
    const controlPoint1Y: number = ((this.element as HTMLCanvasElement).height - height) - adjustedIntensity;
    const controlPoint2X: number = (3 * (this.element as HTMLCanvasElement).width) / 4;
    const controlPoint2Y: number = ((this.element as HTMLCanvasElement).height - height) - adjustedIntensity;

    // Draw bezier curve (arc) from the left side to the right side of the canvas
    this.ctx.bezierCurveTo(controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, (this.element as HTMLCanvasElement).width, (this.element as HTMLCanvasElement).height - height);

    // Continue drawing the line down the right side of the canvas
    console.log((this.element as HTMLCanvasElement).height);
    this.ctx.lineTo((this.element as HTMLCanvasElement).width, (this.element as HTMLCanvasElement).height);

    this.ctx.closePath();
    this.ctx.fill();
  }

  createLoader() {
    this.onBeforeAssetLoaded();

    each(this.elements.images as NodeListOf<HTMLImageElement>, (element) => {
      // element.setAttribute('src', element.getAttribute('data-src') ?? '');
      element.src = element.getAttribute('data-src') ?? '';
      element.onload = () => this.onAssetLoaded();
    });
  }

  onAssetLoaded() {
    this.length += 1;
    this.percent = (this.length / (this.elements.images as NodeListOf<HTMLImageElement>).length);

    if (this.percent === 1) {
      this.onLoaded();
      this.resetPosition();
    }
  }

  onBeforeAssetLoaded() {
    this.animateOut.to(this.element, {
      duration: 2, // durée en secondes
      height: '100%',
      ease: 'expo.out',
      onUpdate: () => {
        // Pendant l'animation, redessinez votre arc
        const heightPercentageString = (this.element as HTMLCanvasElement).style.height;
        const heightPercentage = parseFloat(heightPercentageString.replace('%', ''));

        const totalHeight = (this.element as HTMLCanvasElement).height;
        const currentHeight = (totalHeight * heightPercentage) / 100;

        // const currentHeight = (currentHeightPixelValue * heightPercentage) / 100;
        this.drawArc(currentHeight, 150);
      },
    });
  }

  onLoaded() {
    return new Promise(() => {
      this.animateOut.to(this.element, {
        duration: 2, // durée en secondes
        delay: 1,
        height: '0%',
        ease: 'expo.out',
        onUpdate: () => {
          // Pendant l'animation, redessinez votre arc
          const heightPercentageString = (this.element as HTMLCanvasElement).style.height;
          const heightPercentage = parseFloat(heightPercentageString.replace('%', ''));

          const totalHeight = (this.element as HTMLCanvasElement).height;
          const currentHeight = (totalHeight * heightPercentage) / 100;

          // const currentHeight = (currentHeightPixelValue * heightPercentage) / 100;
          this.drawArc(currentHeight, 100);
        },
      });
      // this.animateOut.set(this.element, {
      //   rotate: '180deg',
      // });
      this.animateOut.call(() => {
        this.emit('completed');
      });
    });
  }

  resetPosition() {
    GSAP.set(this.element, {
      height: 0,
    });
  }

  destroy() {
    (this.element as Element).parentNode?.removeChild(this.element as Element);
  }
}
