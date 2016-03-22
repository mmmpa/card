import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';

interface P{

}

interface S{

}

export default class GameSelectorComponent extends Good<{},{}> {
  render() {
    return <div>
      <a onClick={()=> this.dispatch('route:game')}>game selector component</a>
    </div>
  }
}