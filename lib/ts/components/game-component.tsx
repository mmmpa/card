import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';

export default class GameComponent extends Good<{},{}>{
  render(){
    return <div>game component</div>
  }
}