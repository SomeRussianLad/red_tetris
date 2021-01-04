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

  pauseGame() {
    this.isActive = false;
  }

  updateState() {
    const states;

    if(Object.values(this.players).every((player) => !player.isAlive)) {
      return false;
    }

    Object.values(this.players).forEach((player) => {
      player.updateState();
      states[player.id] = {
        field: player.field,
        isAlive: player.isAlive,
      }
    });

    return {
      id: this.id,
      states,
    };
  }

  createPlayer(id) {
    const playerId = `player-${id}`;
    const player = new Player(playerId);

    this.players[player.id] = player;
  }

  removePlayer(id) {
    const playerId = `player-${id}`;

    if (this.players[playerId]) {
      delete this.players[playerId];
    }
  }

  playerAction(action, id) {
    this.players[id].action(action);

    Object.values(this.players).forEach((player) => {
      fields[player.id] = player.field;
    });

    return {
      id: this.id,
      fields,
    };
  }
}

module.exports = Game;
