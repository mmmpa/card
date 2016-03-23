import * as _ from 'lodash';

import Card from "./card";
import {Suit} from "../constants/constants";
import Player from "./player";

export enum CardState{
  ChooseOne,
  OneMore,
  Result,
  Miss,
  Finish
}

export default class CardEngine {
  public total:number;
  public rest:number;
  public cards:Card[];
  private gets:any;
  private turnNumber:number;

  constructor(public eachSuitNumber:number, public suits:Suit[], public players:Player[]) {
    this.reset();
  }

  get playerNow():Player {
    return this.players[this.turnNumber];
  }

  start():CardStepper {
    return CardStepper.start(this);
  }

  getCards(card, nextCard) {
    this.rest -= 2;
    this.gets[this.playerNow.name].push(card, nextCard);
  }

  generateGets(players:Player[]) {
    let gets = {};
    players.forEach((player)=> {
      gets[player.name] = [];
    });

    return gets;
  }

  generateCards(eachSuitNumber:number, suits:Suit[]):Card[] {
    let cards = [];
    suits.forEach((suit)=> {
      _.times(eachSuitNumber, (n)=> {
        cards.push(new Card(suit, n + 1));
      });
    });

    return _.shuffle(cards);
  }

  isSame(card, nextCard):boolean {
    return card.number === nextCard.number
  }

  get isOver(){
    return this.rest === 0;
  }

  reset():void {
    let {eachSuitNumber, suits, players} = this;

    this.cards = this.generateCards(eachSuitNumber, suits);
    this.total = this.rest = this.cards.length;
    this.gets = this.generateGets(players);
    this.turnNumber = 0;
  }

  turnNext() {
    this.turnNumber++;
    if (this.turnNumber === this.players.length) {
      this.turnNumber = 0;
    }
  }
}

export class CardStepper {
  firstCard:Card;
  secondCard:Card;

  engine:CardEngine;
  state:CardState;
  result:boolean;
  player:Player;

  constructor(params) {
    _.each(params, (v, k)=> {
      this[k] = v
    });
  }

  clone(params) {
    let {firstCard, secondCard, engine, state, result, player} = this;
    return new CardStepper(_.assign({firstCard, secondCard, engine, state, result, player}, params));
  }

  static start(engine):CardStepper {
    return new CardStepper({
      state: CardState.ChooseOne,
      engine: engine,
      player: engine.playerNow
    })
  }

  step0():CardStepper {
    return this.clone({
      state: CardState.ChooseOne,
    })
  }

  step(card?):CardStepper {
    switch (this.state) {
      case CardState.ChooseOne:
        return this.step1(card);
      case CardState.OneMore:
        return this.step2(card);
      case CardState.Result:
        return this.step0();
      case CardState.Miss:
        return this.reset();
      default:
        return this.step0();
    }
  }

  step1(card):CardStepper {
    if (card.isOpened) {
      return this;
    }

    card.open();
    this.firstCard = card;

    return this.clone({
      state: CardState.OneMore,
    })
  }

  step2(card):CardStepper {
    if (card.isOpened) {
      return null;
    }

    card.open();
    this.secondCard = card;

    if (this.engine.isSame(this.firstCard, this.secondCard)) {
      this.engine.getCards(this.firstCard, this.secondCard);
      if (this.engine.isOver) {
        return this.clone({
          state: CardState.Finish,
          result: true
        });
      }
      return this.clone({
        state: CardState.Result,
        result: true
      });
    } else {
      return this.clone({
        state: CardState.Miss,
        result: false
      });
    }
  }

  reset() {
    this.firstCard.close();
    this.secondCard.close();
    this.engine.turnNext();

    return this.clone({
      state: CardState.Result,
      player: this.engine.playerNow
    }).step();
  }
}