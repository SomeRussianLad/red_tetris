socketrequire('dotenv').config();

const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const Game = require('./game');

class Server {
  constructor() {
    this.host = process.env.HOST || '0.0.0.0';
    this.port = process.env.PORT || 5000;

    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new SocketIO(this.http);

    this.games = {};
  }

  createHttp() {
    // Взял и красоту закомментил, пёс обсос
    // this.app.get('/', (req, res) => {
    //   res.send(`
    //     <p style="text-align: center;
    //       font-family: 'Comic Sans MS', serif;
    //       font-size: 4em;
    //       background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
    //       -webkit-background-clip: text;
    //       color: transparent" >
    //         Who are you? I didn't call you. Go fuck yourself!<br/>
    //         <img
    //           src="https://memepedia.ru/wp-content/uploads/2018/01/%D0%B2%D1%8B-%D0%BA%D1%82%D0%BE-%D1%82%D0%B0%D0%BA%D0%B8%D0%B5-%D1%8F-%D0%B2%D0%B0%D1%81-%D0%BD%D0%B5-%D0%B7%D0%B2%D0%B0%D0%BB-1.png">
    //     </p>
    //   `);
    // });
    return this;
  }

  createSocketRoutes() {
    this.io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        socket.rooms.forEach((roomName) => {
          if (this.games[roomName]) {
            const game = this.game[roomName];
            if (roomName === socket.id && !this.games[roomName].isStarted()) {
              delete this.games[roomName];
            }
            game.removePlayer(socket.id);
            if (Object.values(game.players).length === 0) {
              delete this.games[roomName];
            }
          }
        });
      });

      socket.on('list-game', () => {
        socket.emit('list-game', {
          data: Object.values(this.games).map((game) => game.id),
        });
      });

      socket.on('new-game', () => {
        const gameId = `game-${socket.id}`;

        if (this.games[gameId]) {
          socket.emit('new-game', {
            id: gameId,
            message: 'Previous session not closed',
            status: 400,
          });
          return;
        }

        const game = new Game(gameId);

        this.games[gameId] = game;
        game.createPlayer(socket.id);
        socket.join(gameId);
      });

      socket.on('join-game', (message) => {
        const { gameId } = message;
        const game = this.games[gameId];

        if (!game || games.isFull()) {
          socket.emit('join-game', {
            id: gameId,
            message: '...',
            status: 400,
          });
        }

        game.createPlayer(socket.id);
        socket.join(gameId);

        socket.emit('join-game', {
          id,
          message: 'Joined game session successfully',
          status: 200,
        });
      });

      socket.on('start-game', () => {
        const gameId = `game-${socket.id}`;

        if (!this.games[gameId]) {
          socket.emit('start-game', {
            id: gameId,
            message: 'No such game',
            status: 400,
          });
          return;
        }

        this.io.broadcast.to(gameId).emit('start-game', {
          // id: `room`,
          message: 'We\'re in boooooooiiiiiiiiiiiiiiis',
          status: 200,
        });

        setInterval(() => {
          const data = this.games[gameId].updateState();
          this.io.broadcast.to(gameId).emit('new-state', data);
        }, 500);
      });

      socket.on('action', (messsage) => {
        /**
         * TODO: завтра накидаю
         * Концептуально тут будет приём из даты action и сувание его игроку
         * this.games[`game-${data.id}][socket.id].action('rotate');
         * Достатошно изящна
         * 
         * {
         *    id: <id>
         *    action: 'up' | 'down' | 'left' | 'right' | 'drop' | 'rotate',
         * }
         */
        const { id, action } = message;
        const game = this.games[id];
        const data = game.action(action, id);

        socket.emit('action', data);
      });
    });
    return this;
  }

  listen() {
    this.http.listen(this.port, this.host, () => {
      process.stdout.write(`Listening on http://${this.host}:${this.port}\n`);
    });
    return this;
  }
}

module.exports = Server;
