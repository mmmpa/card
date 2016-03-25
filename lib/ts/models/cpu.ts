import CardEngine from "../models/card-engine";
import Card from "./card";
import * as _ from 'lodash';

export default class Cpu {
  static detect(name, engine) {
    switch (true) {
      case name.indexOf('つよい') !== -1:
        console.log('つよい')
        return new StrongCpu(engine);
      default:
        return new RandomCpu(engine);
    }
  }
}

abstract class BaseCpu {
  constructor(protected engine:CardEngine) {
  }

  abstract choose(n):Card;

  abstract prepare():void

  run(callback:(card:Card)=>void) {
    this.prepare();
    this.timer(()=>callback(this.choose(0)), ()=>callback(this.choose(1)));
  }

  timer(...args:Function[]) {
    let step = (f) => {
      if (!f) {
        return;
      }
      setTimeout(()=> {
        f();
        step(args.shift());
      }, 1000)
    };

    step(args.shift())
  }
}

class RandomCpu extends BaseCpu {
  prepare():void {

  }

  choose(n):Card {
    let list = _.filter(this.engine.cards, (card:Card)=> !card.isOpened);
    let chosen = _.sample(list);

    return chosen;
  }
}

class StrongCpu extends BaseCpu {
  private cards:Card[];

  prepare():void {
    let history:Card[] = _.filter(this.engine.history, (card:Card)=> !card.isOpened);

    let last1 = history.pop();
    if (last1) {
      let first = _.find(history, (card)=> card.number === last1.number);
      if (first) {
        this.cards = [first, last1];
        return void(0);
      }
      history.push(last1)
    }

    let last2 = history.pop();
    if (last2) {
      let second = _.find(history, (card)=> card.number === last2.number);
      if (second) {
        this.cards = [second, last2];
        return void(0);
      }
      history.push(last2)
    }

    let notOpened = _.filter(this.engine.cards, (card:Card)=> !card.isOpened);
    let notYetOpened = _.filter(notOpened, (card)=> !_.includes(history, card) && card !== last1 && card !== last2);
    let list = notYetOpened.length === 0 ? notOpened : notYetOpened;

    let chosen = _.sample(list);

    let third = _.find(history, (card)=> card !== chosen && card.number === chosen.number);
    if (third) {
      this.cards = [chosen, third];
      return;
    }
    let rest = _.filter(list, (card:Card)=> card !== chosen);

    this.cards = [chosen, _.sample(rest)];
    return void(0);
  }

  choose(n):Card {
    return this.cards[n];
  }

  random() {
    let list = _.filter(this.engine.cards, (card:Card)=> !card.isOpened);

    return _.sample(list);
  }
}