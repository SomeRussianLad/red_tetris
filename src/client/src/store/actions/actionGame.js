export const SET_NEW_GAME = 'SET_NEW_GAME';
export const SET_LIST_GAME = 'SET_LIST_GAME';

export const setListGame = (data) => ({ type: SET_LIST_GAME, data });
export const setGame = (data) => ({ type: SET_NEW_GAME, data });
