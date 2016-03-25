import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Good} from "../libs/parcel";

interface P {
  onChange:(value:string)=>void,
  values:string[],
  selected:string
}

export default class PlainSelect extends Good<P,{}> {
  render() {
    let {onChange, values, selected} = this.props;
    return <select value={selected} onChange={(e)=> onChange((e.target as HTMLSelectElement).value) }>
      {values.map((value, key)=><option {...{value, key}}>{value}</option>)}
    </select>
  }
}