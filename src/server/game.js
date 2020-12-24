// const crypto = require('crypto');
const Player = require('./player');

class Game {
  constructor(gameId) {
    this.id = gameId;
    this.players = {};
    // this.eventLoop = null;
    // this.eventEmitter = null;
  }

  // startGame() {
  //   this.eventLoop = setInterval(() => this.nextTick(), 1000);
  // }

  // pauseGame() {
  //   this.eventLoop = null;
  // }

  // nextTick() {
  //   Object.values(this.players).forEach((player) => { player.moveDown(); });
  //   this.updateState();
  // }

  updateState() {
    const fields = {};

    Object.values(this.players).forEach((player) => {
      fields[player.id] = player.field;
    });

    return {
      id: this.id,
      fields,
    };
  }

  createPlayer(socketId) {
    const player = new Player(socketId);

    this.players[player.id] = player;
    return player.id;
  }

  removePlayer(socketId) {
    this.players;
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
    return moveSet[action]();
  }
}

module.exports = Game;
