const crypto = require('crypto');
const Player = require('./player');

class Game {
  constructor(eventEmitter) {
    this.id = `game#${crypto.randomBytes(8).toString('hex')}`;
    this.players = {};
    this.eventLoop = null;
    this.eventEmitter = eventEmitter;
  }

  startGame() {
    this.eventLoop = setInterval(() => this.nextTick(), 1000);
  }

  pauseGame() {
    this.eventLoop = null;
  }

  nextTick() {
    Object.values(this.players).forEach((player) => { player.moveDown() });
    this.updateState();
  }

  updateState() {
    const fields = {};

    Object.values(this.players).forEach((player) => {
      fields[player.id] = player.field;
    });

    this.eventEmitter.emit('update state', {
      id: this.id,
      fields,
    });
  }

  createPlayer() {
    const player = new Player();

    this.players[player.id] = player;
    return player.id;
  }

  action(action, id) {
    if (!this.players[id]) {
      return;
    }

    const moveSet = {
      moveLeft: this.players[id].moveLeft,
      moveRight: this.players[id].moveRight,
      moveDown: this.players[id].moveDown,
      drop: this.players[id].drop,
      rotate: this.players[id].rotate,
    };
    moveSet[action]();
  }
}

module.exports = Game;
