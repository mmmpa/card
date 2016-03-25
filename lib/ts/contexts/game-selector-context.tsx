import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Suit} from "../constants/constants";
import Player from "../models/player";

interface S {
  players:Player[]
}

export default class GameSelectorContext extends Parcel<{},{}> {
  initialState() {
    return {
      players: ['あなた', 'ふつうのCPU', 'つよいCPU']
    }
  }

  activate(){
    this.dispatch('message:right', 'ゲームを選択してください')
  }

  generatePlayer(name:string) {
    switch (true) {
      case name.indexOf('CPU') !== -1:
        return new Player(name, true);
      default:
        return new Player(name);
    }
  }

  recipe(firstName, secondName) {
    let eachSuitNumber = 1;
    let suits = [Suit.Spade, Suit.Dia, Suit.Club, Suit.Heart]

    let first = this.generatePlayer(firstName);
    let second = this.generatePlayer(secondName);

    if (firstName === secondName) {
      second.name += '2';
    }

    return {eachSuitNumber, suits, players: [first, second]}
  }

  listen(to) {
    to('select', (first, second)=> {
      this.dispatch('start:game', this.recipe(first, second))
    })
  }
}