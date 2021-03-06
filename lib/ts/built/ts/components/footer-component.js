"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var FooterComponent = (function (_super) {
    __extends(FooterComponent, _super);
    function FooterComponent(props) {
        this.state = {
            leftMessage: '',
            rightMessage: '',
            leftMessageDisplayed: '',
            rightMessageDisplayed: ''
        };
    }
    FooterComponent.prototype.render = function () {
        var _a = this.props, leftMessage = _a.leftMessage, rightMessage = _a.rightMessage;
        return React.createElement("footer", {className: "game-footer"}, React.createElement("div", {className: "left-message"}, leftMessage), React.createElement("div", {className: "right-message"}, rightMessage));
    };
    return FooterComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FooterComponent;
//# sourceMappingURL=footer-component.js.map