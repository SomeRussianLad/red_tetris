import { SET_LIST_GAME, SET_NEW_GAME, SET_MAP_GAME } from '../actions/actionGame';

const initialState = {
  game: '',
  list: [],
  myMap: {},
};

const reduserGame = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_GAME:
      return { ...state, game: action.data };
    case SET_MAP_GAME:
      // eslint-disable-next-line no-case-declarations
      const user = state.game.split('-');
      return { ...state, myMap: action.data[user[1]] };
    case SET_LIST_GAME:
      return { ...state, list: action.data };
    default:
      return state;
  }
};

export default reduserGame;
