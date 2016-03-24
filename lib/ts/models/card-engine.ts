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

export class ResultData {
  constructor(public time:number, public count:any, public total:number) {

  }
}

export default class CardEngine {
  public total:number;
  public rest:number;
  public cards:Card[];
  public gets:any;
  public history:Card[];
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
    this.gets[this.playerNow.name] += 2;
  }

  generateGets(players:Player[]) {
    let gets = {};
    players.forEach((player)=> {
      gets[player.name] = 0;
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

  get isOver() {
    return this.rest === 0;
  }

  reset():void {
    let {eachSuitNumber, suits, players} = this;

    this.cards = this.generateCards(eachSuitNumber, suits);
    this.total = this.rest = this.cards.length;
    this.gets = this.generateGets(players);
    this.turnNumber = 0;
    this.history = [];
  }

  turnNext() {
    this.turnNumber++;
    if (this.turnNumber === this.players.length) {
      this.turnNumber = 0;
    }
  }

  open(card:Card):boolean {
    if (card.isOpened) {
      return false;
    }
    card.open();
    _.remove(this.history, card);
    this.history.push(card);
    return true;
  }

  close(card:Card) {
    card.close();
  }
}

export class CardStepper {
  firstCard:Card;
  secondCard:Card;

  engine:CardEngine;
  state:CardState;
  player:Player;
  got:boolean;

  result:ResultData;

  constructor(params) {
    _.each(params, (v, k)=> {
      this[k] = v
    });
  }

  clone(params) {
    let {firstCard, secondCard, engine, state, player} = this;
    return new CardStepper(_.assign({firstCard, secondCard, engine, state, player}, params));
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
    if (!this.engine.open(card)) {
      return this;
    }

    this.firstCard = card;

    return this.clone({
      state: CardState.OneMore,
    })
  }

  step2(card):CardStepper {
    if (!this.engine.open(card)) {
      return this;
    }

    this.secondCard = card;

    if (this.engine.isSame(this.firstCard, this.secondCard)) {
      this.engine.getCards(this.firstCard, this.secondCard);
      if (this.engine.isOver) {
        return this.clone({
          state: CardState.Finish,
          player: this.engine.playerNow,
          result: new ResultData(0, this.engine.gets, this.engine.total)
        });
      }
      return this.clone({
        state: CardState.Result,
        got: true
      });
    } else {
      return this.clone({
        state: CardState.Miss,
        got: false
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