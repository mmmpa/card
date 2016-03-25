import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Route, Suit} from '../constants/constants'
import Player from "../models/player";
import {ResultData} from "../models/card-engine";

export default class MainContext extends Parcel<{},{}> {
  initialState() {
    return {route: Route.Selector}
  }

  testState() {
    return {
      route: Route.Game,
      recipe: {eachSuitNumber: 2, suits: [Suit.Spade, Suit.Dia], players: [new Player()]},
      result: new ResultData(10, {}, 10)
    }
  }

  listen(to) {
    to('start:game', (recipe)=> {
      this.setState({route: Route.Game, recipe});
    });

    to('route:selector', ()=> {
      this.setState({route: Route.Selector});
    });

    to('message:right', (rightMessage)=> {
      this.setState({rightMessage});
    });

    to('message:left', (leftMessage)=> {
      this.setState({leftMessage});
    });
  }

  route(state) {
    this.routeChildren = this.props.children.filter((child)=> {
      return _.isUndefined(child.props.route) || child.props.route == state.route
    });
  }

  activate() {
    this.route(this.state)
  }

  componentWillUpdate(props, state) {
    this.route(state)
  }
}