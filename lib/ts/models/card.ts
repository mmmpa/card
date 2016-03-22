import {Suit} from "../constants/enums";

export default class Card {
  constructor(public suit:Suit, public number:number, public isOpened = false) {
  }
}