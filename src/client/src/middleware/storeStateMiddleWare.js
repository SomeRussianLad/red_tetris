import socketIOClient from 'socket.io-client';
import handleErrors from '../utils/handleErrors';
import { setGame, setList } from '../store/actions/actionGame';

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
  });
  socket.emit('join-game', { id });
};

// eslint-disable-next-line no-unused-vars
export const startGame = () => (dispatch) => {
  socket.on('start-game', (res) => {
    console.log(res);
  });
  socket.emit('start-game');
};
