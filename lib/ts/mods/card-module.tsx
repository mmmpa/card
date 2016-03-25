import * as React from "react";
import * as ReactDOM from 'react-dom';
import Card from "../models/card";
import {Suit} from '../constants/constants'

interface P {
  card:Card,
  onClick:Function
}

export default class CardModule extends React.Component<P,{}> {
  get isOpened() {
    return this.props.card.isOpened
  }

  get number(){
    return this.props.card.number
  }

  suitClass() {
    switch (this.props.card.suit) {
      case Suit.Spade:
        return 'spade';
      case Suit.Dia:
        return 'dia';
      case Suit.Club:
        return 'club';
      case Suit.Heart:
        return 'heart';
    }
  }

  writeClass():string {
    let base = this.isOpened ? 'card opened ' : 'card closed ';
    return base + this.suitClass()
  }

  write():string {
    if (!this.isOpened) {
      return '';
    }

    switch (this.number) {
      case 1:
        return 'A';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        return this.number+''
    }
  }

  render() {
    return <div className={this.writeClass()} onMouseDown={()=> this.props.onClick(this.props.card)}>
      {this.write()}
    </div>
  }
}