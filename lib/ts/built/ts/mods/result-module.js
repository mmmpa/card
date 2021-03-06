"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ResultModule = (function (_super) {
    __extends(ResultModule, _super);
    function ResultModule() {
        _super.apply(this, arguments);
    }
    ResultModule.prototype.render = function () {
        var _this = this;
        console.log(this.props.result);
        var _a = this.props.result, time = _a.time, count = _a.count, total = _a.total;
        var win = _.reduce(count, function (a, v, k) {
            if (a.count < v) {
                return { name: k, count: v };
            }
            return a;
        }, { name: null, count: 0 });
        return React.createElement("div", {className: "result"}, React.createElement("h1", null, "result"), React.createElement("h2", null, win.name + "\u306E\u52DD\u3061"), React.createElement("h2", null, time, "秒"), React.createElement("h2", null, win.count + "/" + total), React.createElement("button", {onClick: function (e) { _this.props.retry(e); }}, "retry"), React.createElement("button", {onClick: function (e) { _this.props.back(e); }}, "back"));
    };
    return ResultModule;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResultModule;
//# sourceMappingURL=result-module.js.map