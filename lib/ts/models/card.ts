import {Suit} from "../constants/constants";

export default class Card {
  constructor(public suit:Suit, public number:number, public isOpened = false) {
  }

  open() {
    this.isOpened = true;
  }

  close() {
    this.isOpened = false;
  }
}