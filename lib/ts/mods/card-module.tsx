import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Card from "../models/card";

interface P{
  card:Card,
  onClick:Function
}

interface S{

}

export default class CardModule extends Good<P,{}> {
  get isOpened(){
    return this.props.card.isOpened
  }

  writeClass():string{
    return this.isOpened ? 'card opened' : 'card closed'
  }

  write(){
    if(!this.isOpened){
      return null;
    }

    return this.props.card.number;
  }

  render() {
    return <div className={this.writeClass()} onClick={()=> this.props.onClick(this.props.card)}>
      {this.write()}
    </div>
  }
}