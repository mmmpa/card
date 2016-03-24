import * as React from "react";
import * as ReactDOM from 'react-dom';
import Card from "../models/card";
import {ResultData} from "../models/card-engine";

interface P {
  result:ResultData,
  retry:Function,
  back:Function
}

interface S {

}

export default class ResultModule extends React.Component<P,{}> {

  render() {
    console.log(this.props.result)
    let {time, count, total} = this.props.result;
    let win = _.reduce(count, (a, v, k)=> {
      if (a.count < v) {
        return {name: k, count: v}
      }
      return a;
    }, {name: null, count: 0}) as {name:string, count:number};

    return <div className="result">
      <h1>result</h1>
      <h2>{`${win.name}の勝ち`}</h2>
      <h2>{time}秒</h2>
      <h2>{`${win.count}/${total}`}
      </h2>
      <button onClick={(e)=>{this.props.retry(e)}}>retry</button>
      <button onClick={(e)=>{this.props.back(e)}}>back</button>
    </div>
  }
}