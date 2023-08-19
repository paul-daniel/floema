import GSAP from 'gsap';

class Colors {
  change(backgroundColor : string, color :string) {
    GSAP.to(document.documentElement, {
      backgroundColor,
      color,
    });
  }
}

const colorsManager = new Colors();

export default colorsManager;
