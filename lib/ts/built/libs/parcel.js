"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var React = require('react');
var _ = require('lodash');
var Good = (function (_super) {
    __extends(Good, _super);
    function Good() {
        _super.apply(this, arguments);
    }
    Good.prototype.dispatch = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this.props.emitter).emit.apply(_a, [event].concat(args));
        var _a;
    };
    Good.prototype.activate = function () {
    };
    Good.prototype.deactivate = function () {
    };
    Object.defineProperty(Good.prototype, "myName", {
        get: function () {
            if (this._myName) {
                return this._myName;
            }
            return this._myName = this.constructor.toString().match(/function[ ]+([a-zA-Z0-9_]+)/)[1];
        },
        enumerable: true,
        configurable: true
    });
    Good.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        console.log.apply(console, [this.myName].concat(args));
    };
    Good.prototype.componentWillMount = function () {
        this.debug('componentWillMount');
        this.activate();
    };
    Good.prototype.componentDidMount = function () {
        this.debug('componentDidMount');
    };
    Good.prototype.componentWillReceiveProps = function (nextProps) {
        //this.debug('componentWillReceiveProps');
    };
    Good.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        //this.debug('shouldComponentUpdate');
        return true;
    };
    Good.prototype.componentWillUpdate = function (nextProps, nextState) {
        //this.debug('componentWillUpdate');
    };
    Good.prototype.componentDidUpdate = function (prevProps, prevState) {
        //this.debug('componentDidUpdate');
    };
    Good.prototype.componentWillUnmount = function () {
        //this.debug('componentWillUnmount');
        this.deactivate();
    };
    return Good;
}(React.Component));
exports.Good = Good;
var Parcel = (function (_super) {
    __extends(Parcel, _super);
    function Parcel(props) {
        _super.call(this, props);
        this.addedOnStore = [];
        this.emitter = props.emitter
            ? props.emitter
            : new events_1.EventEmitter();
        this.state = this.initialState(props);
    }
    Parcel.prototype.componentWillUnmount = function () {
        var _this = this;
        var removed = this.addedOnStore.map(function (_a) {
            var eventName = _a.eventName, callback = _a.callback;
            _this.emitter.removeListener(eventName, callback);
            return eventName;
        });
        _super.prototype.componentWillUnmount.call(this);
    };
    Parcel.prototype.componentWillMount = function () {
        var _this = this;
        this.listen(function (eventName, callback) {
            _this.addedOnStore.push({ eventName: eventName, callback: callback });
            _this.emitter.on(eventName, callback);
        });
        _super.prototype.componentWillMount.call(this);
    };
    Object.defineProperty(Parcel.prototype, "children", {
        get: function () {
            if (this.routeChildren) {
                return this.routeChildren;
            }
            var children = this.props.children;
            return !!children.map ? children : [children];
        },
        enumerable: true,
        configurable: true
    });
    Parcel.prototype.render = function () {
        var props = _.assign({ emitter: this.emitter }, this.props, this.state);
        delete props.children;
        return React.createElement("div", {className: "context-wrapper"}, this.children.map(function (child, key) { return React.cloneElement(child, _.assign(props, { key: key })); }));
    };
    return Parcel;
}(Good));
exports.Parcel = Parcel;
//# sourceMappingURL=parcel.js.map