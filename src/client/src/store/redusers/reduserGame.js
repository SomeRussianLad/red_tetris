import {
  SET_LIST_GAME, SET_NEW_GAME, SET_MAP_GAME, SET_PLAYER_ID,
} from '../actions/actionGame';

const initialState = {
  game: '',
  list: [],
  myMap: {},
  playerId: '',
};

const reduserGame = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_GAME:
      return { ...state, game: action.data };
    case SET_PLAYER_ID:
      return { ...state, playerId: action.data };
    case SET_MAP_GAME:
      // eslint-disable-next-line no-case-declarations
      return { ...state, myMap: action.data[state.playerId] };
    case SET_LIST_GAME:
      return { ...state, list: action.data };
    default:
      return state;
  }
};

export default reduserGame;
