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
    //console.log({removed})
  }

  componentDidMount() {
    this.listen((eventName:string, callback:Function) => {
      this.addedOnStore.push({eventName, callback});
      this.emitter.on(eventName, callback);
    });
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
      {this.children.map((child, i)=> React.cloneElement(child, _.assign(props, {key: i})))}
    </div>;
  }
}

