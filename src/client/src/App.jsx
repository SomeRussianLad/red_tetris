import React from 'react';
import Router from 'react-router-dom/es/Router';
import { Route } from 'react-router-dom';
import Game from './component/game/game';
import styles from './App.module.scss';
import history from './utils/history';

const paths = {
  game: '/game',
  index: '/',
  list: '/list',
};

const App = () => (
  <Router history={history}>
    <div className={styles.container}>
      <Route
        exact
        path={paths.game}
        component={() => (
          <Game />
        )}
      />
    </div>
  </Router>
);

export default App;
