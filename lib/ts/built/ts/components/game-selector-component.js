"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var fa_1 = require("../../test/src/mods/fa");
var GameSelectorComponent = (function (_super) {
    __extends(GameSelectorComponent, _super);
    function GameSelectorComponent(props) {
        _super.call(this, props);
        this.state = {
            first: null,
            second: null
        };
    }
    GameSelectorComponent.prototype.componentDidMount = function () {
        this.setState({
            first: this.props.players[2],
            second: this.props.players[2]
        });
    };
    GameSelectorComponent.prototype.render = function () {
        var _this = this;
        var players = this.props.players;
        var _a = this.state, first = _a.first, second = _a.second;
        return React.createElement("article", {className: "game-player"}, React.createElement("section", {className: "selector"}, React.createElement("div", {className: "first"}, React.createElement("h1", null, "先手"), React.createElement("select", {value: first, onChange: function (e) { return _this.setState({ first: e.target.value }); }}, players.map(function (name) {
            return React.createElement("option", {value: name}, name);
        }))), React.createElement("div", {className: "second"}, React.createElement("h1", null, "後手"), React.createElement("select", {value: second, onChange: function (e) { return _this.setState({ second: e.target.value }); }}, players.map(function (name) {
            return React.createElement("option", {value: name}, name);
        }))), React.createElement("div", {className: "start"}, React.createElement("button", {onClick: function () { return _this.dispatch('select', first, second); }}, React.createElement(fa_1.default, {icon: "paw"}), "start"))));
    };
    return GameSelectorComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameSelectorComponent;
//# sourceMappingURL=game-selector-component.js.map