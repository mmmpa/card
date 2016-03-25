import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import CardModule from "../mods/card-module";
import Card from "../models/card";
import {CardStepper, CardState} from "../models/card-engine";
import ResultModule from "../mods/result-module";
import {ResultData} from "../models/card-engine";

interface P {
  cards:Card[],
  state:CardState,
  result:ResultData
}

export default class GameComponent extends Good<P,{}> {
  writeResult() {
    if (this.props.state === CardState.Finish) {
      let {result} = this.props;
      return <ResultModule {...{
        result,
        back: ()=> this.dispatch('back'),
        retry: ()=> this.dispatch('retry')
      }}/>
    }
  }

  writeCards() {
    let {cards} = this.props;
    return cards.map((card, key)=> {
      return <CardModule {...{key, card, onClick: (card)=> this.dispatch('choose:card', card)}}/>
    });
  }

  render() {
    return <article className="game-field">
      {this.writeResult()}
      <section className="card-table">
        {this.writeCards()}
      </section>
    </article>
  }
}