import { SET_LIST_GAME, SET_NEW_GAME } from '../actions/actionGame';

const initialState = {
  game: [],
  list: [],
};

const reduserGame = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_GAME:
      return { ...state, game: action.data };
    case SET_LIST_GAME:
      return { ...state, list: action.data };
    default:
      return state;
  }
};

export default reduserGame;
