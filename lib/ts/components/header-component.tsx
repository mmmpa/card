import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';

export default class HeaderComponent extends Good<{},{}> {
  render() {
    return <header className="game-header">
      <ul>
        <li>
          <a onClick={()=> this.dispatch('route:selector')}>Selector</a>
        </li>
        <li>
          <a onClick={()=> this.dispatch('route:game')}>Game</a>
        </li>
      </ul>
    </header>
  }
}