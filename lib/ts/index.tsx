import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MainContext from "./contexts/main-context";
import GameContext from "./contexts/game-context";
import GameSelectorContext from "./contexts/game-selector-context";

import HeaderComponent from "./components/header-component";
import FooterComponent from "./components/footer-component";
import GameComponent from "./components/game-component";
import GameSelectorComponent from "./components/game-selector-component";

import {Route} from './constants/route'

class Starter {
  static run(dom) {
    ReactDOM.render(
      <article className="game-body">
        <MainContext>
          <HeaderComponent/>
          <GameSelectorContext route={Route.Selector}>
            <GameSelectorComponent/>
          </GameSelectorContext>
          <GameContext route={Route.Game}>
            <GameComponent/>
          </GameContext>
          <FooterComponent/>
        </MainContext>
      </article>
      , dom);
  }
}

window.Starter = Starter;
