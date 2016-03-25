import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Route, Suit} from '../constants/constants'
import Player from "../models/player";

export default class MainContext extends Parcel<{},{}> {
  initialState() {
    return {
      route: Route.Selector
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