"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var CardModule = (function (_super) {
    __extends(CardModule, _super);
    function CardModule() {
        _super.apply(this, arguments);
    }
    CardModule.prototype.write = function () {
        return this.props.card.number;
    };
    CardModule.prototype.render = function () {
        return React.createElement("div", {className: "card"}, this.write());
    };
    return CardModule;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardModule;
//# sourceMappingURL=card-module.js.map