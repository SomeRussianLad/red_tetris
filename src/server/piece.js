const PieceGenerator = require('./piece-generator');

class Piece {
  constructor(shape, nextShape) {
    this.shape = shape;
    this.nextShape = nextShape;
    this.currentView = 0;
    this.x = 3;
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

  nextFigure() {
    return this.nextShape.display;
  }

  updateState() {
    this.shape = this.nextShape;
    this.nextShape = new PieceGenerator().generatePiece();
  }
}

module.exports = Piece;
