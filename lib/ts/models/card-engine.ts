import * as _ from 'lodash';

import Card from "./card";
import {Suit} from "../constants/constants";
import Player from "./player";

export default class CardEngine {
  public total:number;
  public rest:number;
  private cards:Card[];
  private gets:any;
  private turnNumber:number;

  constructor(public eachSuitNumber:number, public suits:Suit[], public players:Player[]) {
    this.reset();
  }

  get playerNow():Player {
    return this.players[this.turnNumber];
  }

  choose():(card:Card)=>(card:Card)=>Player {
    return (card)=> {
      if (card.isOpened) {
        return null;
      }

      card.open();

      return (nextCard):Player=> {
        if (nextCard.isOpened) {
          return null;
        }

        nextCard.open();

        if (this.isSame(card, nextCard)) {
          this.getCards(this.playerNow, card, nextCard);
          return this.playerNow;
        }else{
          card.close();
          nextCard.close();

          this.turnNext();
          return this.playerNow;
        }
      }
    }
  }

  getCards(player, card, nextCard) {
    this.rest -= 2;
    this.gets[player.name].push(card, nextCard);
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
        cards.push(new Card(suit, n));
      });
    });

    return _.shuffle(cards);
  }

  isSame(card, nextCard):boolean {
    return card.number === nextCard.number
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