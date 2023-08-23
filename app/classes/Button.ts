import GSAP from 'gsap';
import Component from './Component';

export default class Button extends Component {
  timeline : gsap.core.Timeline;

  path : SVGPathElement;

  pathLength : number;

  onMouseEnterEvent: EventListenerOrEventListenerObject | undefined = undefined;

  onMouseLeaveEvent: EventListenerOrEventListenerObject | undefined = undefined;

  constructor(element) {
    super({ element });

    this.path = element.querySelector('path:last-child') as SVGPathElement;
    this.pathLength = this.path.getTotalLength();

    this.timeline = GSAP.timeline({ paused: true, defaults: { duration: 1, ease: 'expo.out' } });

    this.timeline.fromTo(
      this.path,
      {
        strokeDashoffset: this.pathLength,
        strokeDasharray: `${this.pathLength} ${this.pathLength}`,
      },
      {
        strokeDashoffset: 0,
        strokeDasharray: `${this.pathLength} ${this.pathLength}`,
      },
    );
  }

  onMouseEnter() {
    this.timeline.play();
  }

  onMouseLeave() {
    this.timeline.reverse();
  }

  addEventListeners() {
    (this.element as Element).addEventListener('mouseenter', this.onMouseEnter.bind(this));
    (this.element as Element).addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  removeEventListeners() {
    (this.element as Element).removeEventListener('mouseenter', this.onMouseEnter);
    (this.element as Element).removeEventListener('mouseleave', this.onMouseLeave);
  }
}
