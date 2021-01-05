import socketIOClient from 'socket.io-client';
import handleErrors from '../utils/handleErrors';
import { setGame, setList, setMap } from '../store/actions/actionGame';

const socket = socketIOClient();

export const setNewGame = () => (dispatch) => {
  socket.on('new-game', (res) => {
    if (res.status !== 200) handleErrors(res);
    dispatch(setGame(res.id));
    socket.off('new-game');
  });
  socket.emit('new-game');
};

export const setListGame = () => (dispatch) => {
  socket.on('list-games', (res) => {
    dispatch(setList(res.data));
  });
  socket.emit('list-games');
};

// eslint-disable-next-line no-unused-vars
export const joinGame = (id) => (dispatch) => {
  socket.on('join-game', (res) => {
    console.log(res);
    // id: "game-2y3PSr0iqVtmVp4nAAAB"
    // message: "Joined game session successfully"
    // playerId: "player-rHRTqE1MljOEnWglAAAH"
    // status: 200
  });
  socket.emit('join-game', { id });
};

// eslint-disable-next-line no-unused-vars
export const getMap = () => (dispatch) => {
  socket.on('new-state', (message) => {
    console.log(message);
    if (message.status === 200) {
      setMap(message.states);
    } else handleErrors(message);
    // id: "game-2y3PSr0iqVtmVp4nAAAB"
    // states:
    // 2y3PSr0iqVtmVp4nAAAB:
    // eslint-disable-next-line max-len
    // field: (20) [Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10), Array(10)]
    // isAlive: true
    // __proto__: Object
    // rHRTqE1MljOEnWglAAAH: {field: Array(20), isAlive: true}
  });
};

// eslint-disable-next-line no-unused-vars
export const startGame = () => (dispatch) => {
  socket.on('start-game', (res) => {
    console.log(res);
  });
  socket.emit('start-game');
};
