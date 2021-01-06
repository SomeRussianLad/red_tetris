require('dotenv').config();

const http = require('http');
const express = require('express');
const io = require('socket.io');
const Game = require('./game');

class Server {
  constructor() {
    this.host = process.env.HOST || '0.0.0.0';
    this.port = process.env.PORT || 5000;

    this.app = express();
    this.http = http.createServer(this.app);
    this.io = io(this.http, {
      cors: {
        origin: '*',
      },
    });

    this.games = {};
  }

  createHttp() {
    return this;
  }

  createSocketRoutes() {
    this.io.on('connection', (socket) => {
      socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => {
          const game = this.games[room];

          if (game) {
            const hostRoom = `game-${socket.id}`;

            game.removePlayer(socket.id);

            // Если вышел хост, удалить игру
            if (room === hostRoom && !game.isActive) {
              this.io.of('/').in(room).sockets.forEach((s) => {
                s.leave(room);
              });
              delete this.games[room];
            }

            // Если все игроки неактивны/проиграли, удалить игру
            if (Object.values(game.players).every((player) => !player.isAlive)) {
              this.io.of('/').in(room).sockets.forEach((s) => {
                s.leave(room);
              });
              delete this.games[room];
            }
          }
        });
      });

      socket.on('list-games', () => {
        socket.emit('list-games', {
          data: Object.values(this.games).map((game) => game.id),
          status: 200,
        });
      });

      socket.on('new-game', () => {
        const id = `game-${socket.id}`;

        if (this.games[id]) {
          socket.emit('new-game', {
            id: null,
            message: 'Previous session not closed',
            status: 400,
          });
          return;
        }

        const game = new Game(id);

        this.games[id] = game;
        game.createPlayer(socket.id);

        socket.join(id);
        socket.emit('new-game', {
          id,
          message: 'Game created successfully',
          status: 200,
        });
      });

      socket.on('join-game', (message) => {
        const { id } = message;
        const game = this.games[id];

        if (!game) {
          socket.emit('join-game', {
            id,
            message: 'No such game',
            status: 400,
          });
          return;
        }

        if (socket.rooms[id]) {
          socket.emit('join-game', {
            id,
            message: 'Already joined',
            status: 400,
          });
          return;
        }

        if (Object.values(game.players).length === game.playerLimit) {
          socket.emit('join-game', {
            id,
            message: 'Room full',
            status: 400,
          });
          return;
        }

        const playerId = `player-${socket.id}`;

        game.createPlayer(socket.id);
        socket.join(id);

        this.io.in(id).emit('join-game', {
          id,
          playerId,
          message: 'Joined game session successfully',
          status: 200,
        });
      });

      socket.on('quit-game', (message) => {
        const { id } = message;
        const game = this.games[id];
        const playerId = `player-${socket.id}`;

        if (!game) {
          socket.emit('quit-game', {
            id,
            message: 'You are not in this game',
            status: 400,
          });
          return;
        }

        game.removePlayer(socket.id);

        socket.emit('quit-game', {
          id,
          message: 'You left the game',
          status: 200,
        });
        socket.leave(id);

        io.to(id).emit('quit-game', {
          id,
          playerId,
          message: `One of the players left: ${playerId}`,
          status: 200,
        });

        // Если вышел хост, удалить игру
        if (`game-${socket.id}` === id && !game.isActive) {
          this.io.sockets.clients(id).forEach((s) => {
            s.leave(id);
          });
          delete this.games[id];
          return;
        }

        // Если все игроки неактивны/проиграли, удалить игру
        if (Object.values(game.players).every((player) => !player.isAlive)) {
          this.io.sockets.clients(id).forEach((s) => {
            s.leave(id);
          });
          delete this.games[id];
        }
      });

      socket.on('start-game', () => {
        const id = `game-${socket.id}`;
        const game = this.games[id];

        if (!game) {
          socket.emit('start-game', {
            id,
            message: 'No opened sessions to start',
            status: 400,
          });
          return;
        }

        if (game.isActive) {
          socket.emit('start-game', {
            id,
            message: 'Already started',
            status: 400,
          });
          return;
        }

        game.startGame();

        this.io.in(id).emit('start-game', {
          id,
          message: 'Game session started successfully',
          status: 200,
        });

        const interval = setInterval(() => {
          const data = game.updateState();

          if (!data) {
            this.io.in(id).emit('new-state', {
              id,
              message: 'Game session terminated',
              status: 0,
            });
            this.io.of('/').in(id).sockets.forEach((s) => {
              s.leave(id);
            });
            clearInterval(interval);
            return;
          }

          this.io.in(id).emit('new-state', data);
        }, 1000);
      });

      socket.on('player-action', (message) => {
        /**
         * Концептуально тут будет приём из даты action и сувание его игроку
         * this.games[`game-${data.id}][socket.id].action('rotate');
         *
         * {
         *    id: <id>
         *    action: 'up' | 'down' | 'left' | 'right' | 'drop' | 'rotate',
         * }
         */
        const { id, action } = message;
        const game = this.games[id];
        const playerId = `player-${socket.id}`;

        if (!game) {
          socket.emit('player-action', {
            id,
            message: 'No such game',
            status: 400,
          });
          return;
        }

        if (!socket.rooms[id]) {
          socket.emit('player-action', {
            id,
            message: 'No permission to access this game session',
            status: 400,
          });
          return;
        }
        this.io.in(id).emit('new-state', game.playerAction(action, playerId));
      });
    });
    return this;
  }

  listen() {
    return this.http.listen(this.port, this.host, () => {
      process.stdout.write(`Listening on http://${this.host}:${this.port}\n`);
    });
  }

  close() {
    return this.http.close();
  }
}

module.exports = Server;
