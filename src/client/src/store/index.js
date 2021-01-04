import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import reduserGame from './redusers/reduserGame';

const rootReducers = combineReducers({
  game: reduserGame,
});

export default createStore(rootReducers, applyMiddleware(thunkMiddleWare));
