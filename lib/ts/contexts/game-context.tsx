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

  componentDidMount() {
    super.componentDidMount()
    this.runCpu(this.state);
    this.sendMessage(this.state);
  }

  componentWillUpdate(_, state) {
    this.runCpu(state, this.state);
    this.sendMessage(state, this.state);
  }

  sendMessage(nextState, state?) {
    if (!state || nextState.stepper.player !== state.stepper.player) {
      this.dispatch('message:right', `${nextState.stepper.player.name}のターンです`)
    }
  }

  runCpu(nextState, state?) {
    if (!state
      || state.state !== nextState.state
      && nextState.state === CardState.ChooseOne
      && nextState.turn === Turn.Cpu) {
      setTimeout(()=> {
        nextState.cpus[nextState.player.name].run((card)=> this.choose(card));
      }, 1);
    }
  }

  choose(card) {
    let stepper:CardStepper = this.state.stepper.step(card);
    let state = stepper.state;

    switch (state) {
      case CardState.ChooseOne:
      case CardState.OneMore:
        this.setState({state, stepper});
        return;
      case CardState.Result:
        stepper = stepper.step();
        state = stepper.state;
        this.setState({state, stepper});
        return;
      case CardState.Miss:
        let turn = Turn.Holding;
        this.setState({state, turn});
        setTimeout(()=> {
          stepper = stepper.step();
          state = stepper.state;
          let player = stepper.player;
          let turn = player.isCpu ? Turn.Cpu : Turn.Player;
          this.setState({state, stepper, player, turn});
        }, 1000);
        return;
      case CardState.Finish:
        let turn = Turn.Holding;
        let result = stepper.result;
        this.setState({state, turn, result});
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