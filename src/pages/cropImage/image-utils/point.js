// /* ===========================================================
// # Point
// =========================================================== */
export default class Point {
    x;
    y;
  
    constructor(x = 0, y = 0) {
      this.x = x || 0;
      this.y = y || 0;
    }
    static distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    static interpolate(p1, p2, t) {
      let x = p1.x * (1 - t) + p2.x * t;
      let y = p1.y * (1 - t) + p2.y * t;
      return new Point(x, y);
    }
    add(p) {
      this.x += p.x;
      this.y += p.y;
      return this;
    }
    subtract(p){
      this.x -= p.x;
      this.y -= p.y;
      return this;
    }
    clone(){
      return new Point(this.x, this.y);
    }
    diff(p) {
      return new Point(Math.abs((this.x -= p.x)), Math.abs((this.y -= p.y)));
    }
    rounded() {
      this.x = Math.round(this.x * 10000) / 10000;
      this.y = Math.round(this.y * 10000) / 10000;
      return this;
    }
  }
  