const http = require('http');
const express = require('express');
const SockIO = require('socket.io');
const Game = require('./game');
const Player = require('./player');

class Server {
  constructor() {
    // configs (env for juvenile retards)
    this.port = 5000;
    this.host = '0.0.0.0';
    // server vars
    this.app = express();
    this.http = http.createServer(this.app);
    this.socketApp = new SockIO(this.http);
    // games vars
    this.games = {};
    this.players = {};
  }

  createHttp() {
    this.app.get('/', (req, res) => {
      res.send(`<p style="text-align: center;
                        font-family: 'Comic Sans MS', serif;
                        font-size: 4em;
                        background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
                        -webkit-background-clip: text;
                        color: transparent" >
                         Who are you? I didn't call you. Go fuck yourself!<br/>
                         <img 
                            src="https://memepedia.ru/wp-content/uploads/2018/01/%D0%B2%D1%8B-%D0%BA%D1%82%D0%BE-%D1%82%D0%B0%D0%BA%D0%B8%D0%B5-%D1%8F-%D0%B2%D0%B0%D1%81-%D0%BD%D0%B5-%D0%B7%D0%B2%D0%B0%D0%BB-1.png">
                     </p>`);
    });
    return this;
  }

  createSocketRoutes() {
    this.socketApp.sockets.on('connection', (socket) => {
      this.players[socket.id] = new Player(socket.id);

      socket.on('disconnect', () => {
        if (this.games[`room-by-${socket.id}`]) {
          delete this.games[`room-by-${socket.id}`];
        }
        delete this.players[socket.id];
      });

      socket.on('list-game', () => {
        this.socketApp.sockets.to(socket.id).emit('list-game', {
          data: this.games.map((element) => element.id),
        });
      });

      socket.on('new-game', () => {
        this.games[`room-by-${socket.id}`] = new Game(this.players[socket.id]);
        this.socketApp.sockets.join(`room-by-${socket.id}`);
      });

      socket.on('join-game', (room) => {
        if (!this.games[`room-by-${room.id}`] || this.games[`room-by-${room.id}`].isFull()) {
          this.socketApp.sockets.to(socket.id).emit('join-game', 'sosi zhopu');
        }
        this.games[socket.id].addPlayer(this.players[socket.id]);
        this.socketApp.sockets.join(`room-by-${room.id}`);
      });

      socket.on('start-game', () => {
        if (this.games[`room-by-${socket.id}`] === null) {
          this.socketApp.sockets.to(socket.id).emit('start-game', 'sosi zhopu');
        }

        this.games[`room-by-${socket.id}`].startGame();
        this.socketApp.sockets.to(`room-by-${socket.id}`).emit('start-game', 'run boyz');
        setInterval(() => {
          this.games[`room-by-${socket.id}`].updateState();
          this.socketApp.sockets.to(`room-by-${socket.id}`).emit('new-state', 'state data');
        }, 500);
      });

      socket.on('action', (data) => {
        /**
         * TODO: завтра накидаю
         * Концептуально тут будет приём из даты action и сувание его игроку
         * this.games[`room-by-${data.id}][socket.id].action('rotate');
         * Достатошно изящна
         */
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
