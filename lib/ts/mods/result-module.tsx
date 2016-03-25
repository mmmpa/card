import * as React from "react";
import * as ReactDOM from 'react-dom';
import Card from "../models/card";
import {ResultData} from "../models/card-engine";
import Fa from "../mods/fa";

interface P {
  result:ResultData,
  retry:Function,
  back:Function
}

interface S {

}

export default class ResultModule extends React.Component<P,{}> {

  render() {
    let {time, count, total} = this.props.result;
    let win = _.reduce(count, (a, v, k)=> {
      if (a.count < v) {
        return {name: k, count: v}
      }
      return a;
    }, {name: null, count: 0}) as {name:string, count:number};

    return <div className="game-result">
      <div className="container">
        <section>
          <h1>試合結果</h1>
          <h2>{`${win.name}の勝ち`}</h2>
          <h2>{`${win.count}/${total}`}
          </h2>
          <button className="one-more" onClick={(e)=>{this.props.retry(e)}}>
            <Fa icon="refresh"/>
            もう一回
          </button>
          <button className="selector" onClick={(e)=>{this.props.back(e)}}>選択画面
            <Fa icon="arrow-circle-right"/>
          </button>
        </section>
      </div>
    </div>
  }
}