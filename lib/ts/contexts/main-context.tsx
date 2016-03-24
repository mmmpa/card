import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Route, Suit} from '../constants/constants'
import Player from "../models/player";

export default class MainContext extends Parcel<{},{}> {
  initialState() {
    return {
      route: Route.Game,
      recipe: {
        eachSuitNumber: 5,
        suits: [Suit.Spade, Suit.Dia, Suit.Club, Suit.Heart],
        players: [new Player('CPU1', true), new Player('CPU2', true)]
      }
    }
  }

  listen(to) {
    to('route:game', ()=> {
      this.setState({route: Route.Game});
    });

    to('route:selector', ()=> {
      this.setState({route: Route.Selector});
    });
  }

  route(state) {
    this.routeChildren = this.props.children.filter((child)=> {
      return _.isUndefined(child.props.route) || child.props.route == state.route
    });
  }

  componentWillMount() {
    this.route(this.state)
  }

  componentWillUpdate(props, state) {
    this.route(state)
  }
}