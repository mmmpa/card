import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Route} from '../constants/constants'
import CardEngine from "../models/card-engine";
import {Suit} from "../constants/constants";
import Player from "../models/player";

export default class MainContext extends Parcel<{},{}>{
  initialState(){
    return {
      route: Route.Game,
      engine: new CardEngine(5, [Suit.Spade, Suit.Dia], [new Player('player')])
    }
  }

  listen(to){
    to('route:game', ()=>{
      this.setState({route: Route.Game});
    });

    to('route:selector', ()=>{
      this.setState({route: Route.Selector});
    });
  }

  route(state){
    this.routeChildren = this.props.children.filter((child)=>{
      return _.isUndefined(child.props.route) || child.props.route == state.route
    });
  }

  componentWillMount(){
    this.route(this.state)
  }

  componentWillUpdate(props, state){
    this.route(state)
  }
}