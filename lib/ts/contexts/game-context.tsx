import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CardEngine from "../models/card-engine";
import Card from "../models/card";
import {CardStepper, CardState} from "../models/card-engine";
import {ResultData} from "../models/card-engine";
import {Suit} from "../constants/constants";
import Player from "../models/player";
import Cpu from "../models/cpu";

interface P {
  recipe:Recipe
}

interface S {
  cards: Card[],
  stepper:CardStepper,
  turn:Turn,
  state:CardState,
  result?:ResultData,
  player: Player,
  cpus:any
}

interface Recipe {
  eachSuitNumber:number,
  suits:Suit[],
  players:Player[]
}

enum Turn{
  Player,
  Cpu,
  Holding
}

export default class GameContext extends Parcel<P,S> {
  initialState(props) {
    return this.initialGameState;
  }

  retry() {
    this.setState(this.initialGameState);
  }

  get initialGameState() {
    let {eachSuitNumber, suits, players} = this.props.recipe;
    let engine = new CardEngine(eachSuitNumber, suits, players);
    let stepper = engine.start();
    let cpus = _.reduce(players, (a, player:Player)=> {
      if (player.isCpu) {
        a[player.name] = Cpu.detect(player.name, engine);
      }
      return a;
    }, {});

    return {
      cpus,
      stepper,
      player: engine.playerNow,
      state: stepper.state,
      cards: engine.cards,
      turn: stepper.player.isCpu ? Turn.Cpu : Turn.Player
    };
  }

  componentDidMount(){
    super.componentDidMount();
    this.runCpu();
  }

  componentDidUpdate() {
    this.runCpu();
  }

  runCpu(){
    if (this.state.turn === Turn.Cpu && this.state.stepper.state === CardState.ChooseOne) {
      this.state.cpus[this.state.player.name].run((card)=> this.choose(card));
    }
  }

  choose(card) {
    let {state} = this;
    let nestStepper:CardStepper = this.state.stepper.step(card);
    state.state = nestStepper.state;

    switch (nestStepper.state) {
      case CardState.ChooseOne:
      case CardState.OneMore:
        state.stepper = nestStepper;
        this.setState(state);
        return;
      case CardState.Result:
        state.stepper = nestStepper.step();
        this.setState(state);
        return;
      case CardState.Miss:
        state.turn = Turn.Holding;
        this.setState(state);
        setTimeout(()=> {
          state.stepper = nestStepper.step();
          state.player = state.stepper.player;
          state.turn = state.stepper.player.isCpu ? Turn.Cpu : Turn.Player;
          this.setState(state);
        }, 1000);
        return;
      case CardState.Finish:
        state.turn = Turn.Holding;
        state.result = nestStepper.result;
        this.setState(state);
        return;
    }
  }

  onChooseCard(card) {
    if (this.state.turn === Turn.Player) {
      this.choose(card);
    }
  }

  listen(to) {
    to('choose:card', (card:Card)=> {
      this.onChooseCard(card);
    });

    to('retry', (card:Card)=> {
      this.retry();
    });

    to('back', (card:Card)=> {
      //this.onChooseCard(card);
    });
  }
}