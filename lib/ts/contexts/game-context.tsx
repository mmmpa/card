import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CardEngine from "../models/card-engine";
import Card from "../models/card";
import {CardStepper, CardState} from "../models/card-engine";

interface P {
  engine:CardEngine
}

interface S {
  cards: Card[],
  stepper:CardStepper,
  turn:Turn
}

enum Turn{
  Player,
  Cpu,
  Holding
}

export default class GameContext extends Parcel<P,S> {
  initialState(props) {
    return {
      player: props.engine.playerNow,
      cards: props.engine.cards || [],
      stepper: props.engine.start(),
      turn: Turn.Player
    }
  }

  onChooseCard(card) {
    let {state} = this;

    if (state.turn !== Turn.Player) {
      return;
    }

    let now:CardStepper = this.state.stepper.step(card);

    switch (now.state) {
      case CardState.ChooseOne:
      case CardState.OneMore:
        state.stepper = now;
        this.setState(state);
        return;
      case CardState.Result:
        state.stepper = now.step();
        this.setState(state);
        return;
      case CardState.Miss:
        state.turn = Turn.Holding;
        this.setState(state);

        setTimeout(()=> {
          state.stepper = now.step();
          state.turn = now.player.isCpu ? Turn.Cpu : Turn.Player;
          this.setState(state);
        }, 1000);
        return;
      case CardState.Finish:
        this.setState(state);
        return;
    }
  }

  listen(to) {
    to('choose:card', (card:Card)=> {
      this.onChooseCard(card);
    });
  }
}