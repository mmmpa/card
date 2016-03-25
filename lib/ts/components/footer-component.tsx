import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';

interface P {
  leftMessage:string,
  rightMessage:string
}

interface S {
  leftMessage:string,
  rightMessage:string,
  leftMessageDisplayed:string,
  rightMessageDisplayed:string
}

export default class FooterComponent extends Good<P,S> {
  constructor(props) {
    super(props);
    this.state = {
      leftMessage: '',
      rightMessage: '',
      leftMessageDisplayed: '',
      rightMessageDisplayed: ''
    }
  }

  render() {
    let {leftMessage, rightMessage} = this.props;

    return <footer className="game-footer">
      <div className="left-message">{leftMessage}</div>
      <div className="right-message">{rightMessage}</div>
    </footer>
  }
}