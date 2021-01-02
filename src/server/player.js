const PieceGenerator = require('./piece-generator');

class Player {
  constructor(id) {
    this.id = id;
    this.field = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
    ];
  }

  findFigure() {
    for (const row of this.field) {
      if (row.includes(1)) {
        return true;
      }
    }
    return false;
  }

  fixedFigure() {
    for (let y = this.field.length - 1; y >= 0; --y) {
      for (let x = this.field[y].length - 1; x >= 0; --x) {
        if (this.field[y][x] === 1) {
          this.field[y][x] = 3;
        }
      }
    }
  }

  spawnFigure() {
    const figure = new PieceGenerator().generatePiece();
    for (let y = 0; y < figure[0].length; y++) {
      for (let x = 0; x < figure[0][y].length; x++) {
        this.field[y][x + 4] = figure[0][y][x];
      }
    }
  }

  stepFigureDown() {
    const field = this.field.map((row) => row.slice());
    for (let y = field.length - 1; y >= 0; --y) {
      for (let x = field[y].length - 1; x >= 0; --x) {
        if (field[y][x] === 1) {
          field[y][x] = 0;
          field[y + 1][x] += 1;
          if (field[y + 1][x] !== 0 && field[y + 1][x] % 2 === 0) {
            this.fixedFigure();
            return this.field;
          }
        }
      }
    }

    return field;
  }

  moveLeft() {
    if (!this.findFigure()) {
      return this;
    }
    const field = this.field.map((row) => row.slice());

    for (let x = 0; x < field[0].length; ++x) {
      for (let y = 0; y < field.length; ++y) {
        if (field[y][x] === 1) {
          field[y][x] = 0;
          field[y][x - 1] += 1;
          if (field[y][x - 1] !== 0 && field[y][x - 1] % 2 === 0) {
            return this.field;
          }
        }
      }
    }
    this.field = field;
    console.log('Moved left');
    this.field.forEach((row) => {
      console.log(row.join(' '));
    });
    return this;
  }

  moveRight() {
    if (!this.findFigure()) {
      return this;
    }
    const field = this.field.map((row) => row.slice());

    for (let x = field[0].length - 1; x >= 0; --x) {
      for (let y = field.length - 1; y >= 0; --y) {
        if (field[y][x] === 1) {
          field[y][x] = 0;
          field[y][x + 1] += 1;
          if (field[y][x + 1] !== 0 && field[y][x + 1] % 2 === 0) {
            return this.field;
          }
        }
      }
    }
    this.field = field;
    console.log('Moved right');
    this.field.forEach((row) => {
      console.log(row.join(' '));
    });
    return this;
  }

  updateState() {
    if (this.findFigure()) {
      this.field = this.stepFigureDown();
    } else {
      this.spawnFigure();
    }
    console.log('State updated');
    this.field.forEach((row) => {
      console.log(row.join(' '));
    });
    return this;
  }
}

new Player(1).updateState().updateState().updateState()
  .moveLeft()
  .moveLeft()
  .moveLeft()
  .updateState()
  .updateState()
  .updateState()
  .moveRight()
  .moveRight()
  .moveRight();
