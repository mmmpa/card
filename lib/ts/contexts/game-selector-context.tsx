import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class GameSelectorContext extends Parcel<{},{}>{
  initialState(){
    return {}
  }

  listen(to){
    to('route:game', ()=>{
      console.log('click')
    })
  }
}