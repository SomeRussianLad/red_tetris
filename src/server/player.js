const PieceGenerator = require('./piece-generator');

class Player {
  constructor(id) {
    this.id = id;
    this.actions = {
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      down: { x: 0, y: 1 },
    };
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
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.tempField = undefined;
    this.piece = undefined;
    this.reducer = (accumulator, value) => accumulator + value;
    this.isAlive = true;
  }

  fixedFigure() {
    let count = 4;
    for (let y = this.tempField.length - 1; y >= 0; y -= 1) {
      for (let x = this.tempField[y].length; x >= 0; x -= 1) {
        if (this.tempField[y][x] === 1) {
          this.tempField[y][x] = 3;
          count += 1;
          if (count === 4) { break; }
        }
      }
    }
    this.piece = undefined;
    return this;
  }

  clearFullLine() {
    let count = 0;
    let clearY = 0;
    for (let y = this.field.length - 1; y >= 0; y -= 1) {
      if (this.field[y].reduce(this.reducer) === 30) {
        for (let x = 0; x < this.field[y].length; x += 1) {
          for (clearY = y; clearY > 0; clearY -= 1) {
            this.field[clearY][x] = this.field[clearY - 1][x];
          }
          this.field[clearY][x] = 0;
        }
        count += 1;
        y += 1;
      }
    }
    return count;
  }

  addPenaltyLine(lines) {
    if ((lines - 1) === 0) {
      return this;
    }
    for (let i = 0; i < lines - 1; i += 1) {
      this.field.shift();
      this.field.push(
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      );
    }
    return this;
  }

  spawnFigure() {
    this.piece = new PieceGenerator().generatePiece();
    const figure = this.piece.currentFigure();
    const X = this.piece.x;
    const Y = this.piece.y;
    for (let y = 0; y < figure.length; y += 1) {
      for (let x = 0; x < figure[0].length; x += 1) {
        if (x >= 0 && x < this.field[0].length
          && y >= 0 && y < this.field.length) {
          this.field[Y + y][X + x] = figure[y][x];
          if (this.field[Y + y][X + x] !== 0 && this.field[Y + y][X + x] % 2 === 0) {
            return undefined;
          }
        } else {
          return undefined;
        }
      }
    }
    return this;
  }

  clearField() {
    const X = this.piece.x;
    const Y = this.piece.y;
    const field = this.tempField;
    for (let y = 0; y < this.piece.currentFigure().length; y += 1) {
      for (let x = 0; x < this.piece.currentFigure()[y].length; x += 1) {
        if ((x + X) >= 0 && (x + X) < field[0].length
        && (y + Y) >= 0 && (y + Y) < field.length) {
          field[Y + y][X + x] = field[Y + y][X + x] === 1 ? 0 : field[Y + y][X + x];
        }
      }
    }
    return this;
  }

  changeCoordinates(coords) {
    let X = this.piece.x;
    let Y = this.piece.y;
    const { x, y } = coords;
    X += x;
    Y += y;
    if (X >= 0 && X < this.tempField[0].length
    && Y >= 0 && Y < this.tempField.length) {
      this.piece.x = X;
      this.piece.y = Y;
      return this;
    }
    return undefined;
  }

  putFigure() {
    const X = this.piece.x;
    const Y = this.piece.y;
    for (let y = 0; y < this.piece.currentFigure().length; y += 1) {
      for (let x = 0; x < this.piece.currentFigure()[y].length; x += 1) {
        if ((X + x) >= 0 && (X + x) < this.tempField[0].length
            && (Y + y) >= 0 && (Y + y) < this.tempField.length) {
          this.tempField[Y + y][X + x] = this.piece.currentFigure()[y][x];
          if (this.tempField[Y + y][X + x] !== 0 && this.tempField[Y + y][X + x] % 2 === 0) {
            this.tempField = this.field;
            return undefined;
          }
        } else {
          if (this.piece.currentFigure()[y][x] === 0) {
            // eslint-disable-next-line no-continue
            continue;
          }
          this.tempField = this.field;
          return undefined;
        }
      }
    }
    return this;
  }

  rotateFigure() {
    this.piece.rotateFigure();
    return this;
  }

  action(action = 'left') {
    this.tempField = this.field.map((row) => row.slice());
    let result;

    if (action === 'down') {
      result = this
        .clearField()
        .changeCoordinates(this.actions.down)
        ?.putFigure();
      if (result === undefined) {
        result = this.fixedFigure();
      }
    } else if (this.actions[action]) {
      result = this
        .clearField()
        .changeCoordinates(this.actions[action])
        ?.putFigure();
    } else if (action === 'rotate') {
      result = this
        .clearField()
        .rotateFigure()
        ?.putFigure();
    } else if (action === 'drop') {
      do {
        result = this
          .clearField()
          .changeCoordinates(this.actions.down)
          ?.putFigure();
        if (result !== undefined) {
          this.field = this.tempField.map((row) => row.slice());
        }
      } while (result !== undefined);
      result = this.fixedFigure();
    }
    if (result !== undefined) {
      this.field = this.tempField;
    }
    return this.clearFullLine();
  }

  updateState() {
    if (this.piece) {
      this.action('down');
    } else if (!this.spawnFigure()) {
      this.isAlive = false;
    }
    return this.clearFullLine();
  }
}

module.exports = Player;
