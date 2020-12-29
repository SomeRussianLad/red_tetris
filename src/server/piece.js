class Piece {
  constructor(shape) {
    this.shape = shape;
    this.currentView = 0;
    this.x = 0;
    this.y = 0;
  }

  rotate() {
    if (this.currentView < this.shape.length) {
      this.currentView += 1;
    }
    this.currentView = 0;
  }

  currentFigure() {
    return this.shape[this.currentView];
  }
}

module.exports = Piece;
