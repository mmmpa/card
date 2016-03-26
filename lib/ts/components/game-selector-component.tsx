import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Player from "../models/player";
import Fa from "../mods/fa";
import PlainSelect from "../mods/plain-select";

interface P {
  players:string[]
}

interface S {
  first:string,
  second:string
}

export default class GameSelectorComponent extends Good<P,S> {
  componentWillMount() {
    super.componentWillMount()
    this.setState({
      first: this.props.players[0],
      second: this.props.players[1]
    })
  }

  render() {
    let {players} = this.props;
    let {first, second} = this.state;
    return <article className="game-player">
      <section className="game-selector">
        <div className="game-first">
          <h1>先手</h1>
          <PlainSelect {...{
            values: players,
            selected: first,
            onChange: (first)=> this.setState({first})
          }}/>
        </div>
        <div className="game-second">
          <h1>後手</h1>
          <PlainSelect {...{
            values: players,
            selected: second,
            onChange: (second)=> this.setState({second})
          }}/>
        </div>
        <div className="game-start">
          <button onClick={()=> this.dispatch('select', first, second)}>
            <Fa icon="paw"/>
            対戦開始
          </button>
        </div>
      </section>
    </article>
  }
}