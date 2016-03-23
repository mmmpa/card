import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import CardModule from "../mods/card-module";
import Card from "../models/card";

interface P {
  cards:Card[]
}

export default class GameComponent extends Good<P,{}> {

  writeCards() {
    let {cards} = this.props;
    return cards.map((card)=> {
      return <CardModule {...{card, onClick: (card)=> this.dispatch('choose:card', card)}}/>
    });
  }

  render() {
    return <article>
      {this.writeCards()}
    </article>
  }
}