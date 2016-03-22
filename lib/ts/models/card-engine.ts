import * as _ from 'lodash';

import Card from "./card";
import {Suit} from "../constants/enums";
import Player from "./player";

class CardEngine {
  private total:number;
  private cards:Card[];
  private gets:any;
  private turnNumber:number;

  constructor(public eachSuitNumber:number, public suits:Suit[], public players:Player[]) {
    this.reset();
  }

  get playerNow():Player {
    return this.players[this.turnNumber];
  }

  choose(player):(card:Card)=>(card:Card)=>Player {
    return (card)=> {
      if (card.isOpened) {
        return null;
      }

      return (nextCard):Player=> {
        if (nextCard.isOpened) {
          return null;
        }

        if (this.isSame(card, nextCard)) {
          this.getCards(player, card, nextCard);
        }

        this.turnNext();
        return this.playerNow;
      }
    }
  }

  getCards(player, card, nextCard) {
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
    return card.number === nextCard
  }

  reset():void {
    let {eachSuitNumber, suits, players} = this;

    this.cards = this.generateCards(eachSuitNumber, suits);
    this.total = this.cards.length;
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