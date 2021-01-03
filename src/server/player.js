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
      [0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
    ];
    this.tempField = undefined;
    this.piece = undefined;
  }

  fixedFigure() {
    const X = this.piece.x;
    const Y = this.piece.y;
    for (let y = 0; y < Y; y += 1) {
      for (let x = 0; x < Y; x += 1) {
        if (this.tempField[Y + y][X + x] === 1) {
          this.tempField[Y + y][X + x] = 3;
        }
      }
    }
    return this;
  }

  spawnFigure() {
    this.piece = new PieceGenerator().generatePiece();
    const figure = this.piece.currentFigure();
    for (let y = 0; y < figure.length; y += 1) {
      for (let x = 0; x < figure[y].length; x += 1) {
        this.field[y][x + 4] = figure[y][x];
      }
    }
  }

  clearField() {
    const X = this.piece.x;
    const Y = this.piece.y;
    const field = this.tempField;
    for (let y = 0; y < this.piece.currentFigure().length; y += 1) {
      for (let x = 0; x < this.piece.currentFigure()[y].length; x += 1) {
        field[Y + y][X + x] = field[Y + y][X + x] === 1 ? 0 : field[Y + y][X + x];
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
            return undefined;
          }
        } else {
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

    if (this.actions[action]) {
      result = this
        .clearField()
        .changeCoordinates(this.actions[action])
        ?.putFigure();
    } else if (action === 'rotate') {
      result = this
        .clearField()
        .rotateFigure()
        ?.putFigure();
    } else if (action === 'update') {
      result = this
        .clearField()
        .changeCoordinates(this.actions.down)
        ?.putFigure();
      if (result === undefined) {
        result = this.fixedFigure();
      }
    } else if (action === 'drop') {
      do {
        result = this
          .clearField()
          .changeCoordinates(this.actions.down)
          ?.putFigure();
      } while (result !== undefined);
      result = this.fixedFigure();
    }
    if (result !== undefined) {
      this.field = this.tempField;
    }
    return this;
  }

  updateState() {
    if (this.piece) {
      this.action('down');
    } else {
      this.spawnFigure();
    }
    return this;
  }
}

new Player(1).updateState().updateState().updateState()
  .action()
  .action()
  .action('rotate');
