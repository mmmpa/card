import {EventEmitter} from 'events';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

interface GoodProps {
  emitter?:EventEmitter,
}

interface GoodState {

}

interface ParcelProps {
  children?,
  route?
}

interface ParcelState {
}

interface EventStore {
  eventName:string,
  callback:Function
}

export abstract class Good<P, S> extends React.Component<P & GoodProps, S & GoodState> {
  dispatch(event:string, ...args:any[]):boolean {
    return this.props.emitter.emit(event, ...args);
  }

  activate(){

  }

  deactivate(){

  }

  private _myName:string;
  get myName(){
    if(this._myName){
      return this._myName;
    }
    return this._myName = this.constructor.toString().match(/function[ ]+([a-zA-Z0-9_]+)/)[1]
  }

  debug(...args){
    console.log(this.myName, ...args)
  }

  componentWillMount() {
    this.debug('componentWillMount');
    this.activate();
  }

  componentDidMount() {
    this.debug('componentDidMount');
  }

  componentWillReceiveProps(nextProps){
    //this.debug('componentWillReceiveProps');
  }

  shouldComponentUpdate(nextProps, nextState):boolean{
    //this.debug('shouldComponentUpdate');
    return true
  }

  componentWillUpdate(nextProps, nextState):void{
    //this.debug('componentWillUpdate');
  }

  componentDidUpdate(prevProps, prevState):void{
    //this.debug('componentDidUpdate');
  }

  componentWillUnmount() {
    //this.debug('componentWillUnmount');
    this.deactivate();
  }
}

export abstract class Parcel<P, S> extends Good<P & ParcelProps, S & ParcelState> {
  emitter:EventEmitter;
  routeChildren;
  addedOnStore:EventStore[] = [];

  abstract listen(to:(eventName:string, callback:Function)=>void):void;

  abstract initialState(props):any;


  componentWillUnmount() {
    let removed = this.addedOnStore.map(({eventName, callback}:EventStore)=> {
      this.emitter.removeListener(eventName, callback);
      return eventName;
    });
    super.componentWillUnmount();
  }

  componentWillMount() {
    this.listen((eventName:string, callback:Function) => {
      this.addedOnStore.push({eventName, callback});
      this.emitter.on(eventName, callback);
    });
    super.componentWillMount();
  }

  constructor(props) {
    super(props);
    this.emitter = props.emitter
      ? props.emitter
      : new EventEmitter();
    this.state = this.initialState(props);
  }

  get children() {
    if (this.routeChildren) {
      return this.routeChildren;
    }

    let {children} = this.props;
    return !!children.map ? children : [children];
  }

  render() {
    let props:any = _.assign({emitter: this.emitter}, this.props, this.state);
    delete props.children;

    return <div className="context-wrapper">
      {this.children.map((child, key)=> React.cloneElement(child, _.assign(props, {key})))}
    </div>;
  }
}

