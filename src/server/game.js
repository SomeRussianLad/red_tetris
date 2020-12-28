const Player = require('./player');

class Game {
  constructor(id) {
    this.id = id;
    this.players = {};
    this.playerLimit = 8;
    this.isActive = false;
  }

  startGame() {
    this.isActive = true;
  }

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

  createPlayer(id) {
    const player = new Player(id);

    this.players[player.id] = player;
    return player.id;
  }

  removePlayer(id) {
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
