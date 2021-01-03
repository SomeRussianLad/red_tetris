class Piece {
  constructor(shape) {
    this.shape = shape;
    this.currentView = 0;
    this.x = 4;
    this.y = 0;
  }

  rotateFigure() {
    if (this.shape[this.currentView + 1]) {
      this.currentView += 1;
    } else {
      this.currentView = 0;
    }
  }

  currentFigure() {
    return this.shape[this.currentView];
  }
}

module.exports = Piece;
