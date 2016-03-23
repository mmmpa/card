"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var card_engine_1 = require("../models/card-engine");
var Turn;
(function (Turn) {
    Turn[Turn["Player"] = 0] = "Player";
    Turn[Turn["Cpu"] = 1] = "Cpu";
    Turn[Turn["Holding"] = 2] = "Holding";
})(Turn || (Turn = {}));
var GameContext = (function (_super) {
    __extends(GameContext, _super);
    function GameContext() {
        _super.apply(this, arguments);
    }
    GameContext.prototype.initialState = function (props) {
        return {
            player: props.engine.playerNow,
            cards: props.engine.cards || [],
            stepper: props.engine.start(),
            turn: Turn.Player
        };
    };
    GameContext.prototype.onChooseCard = function (card) {
        var _this = this;
        var state = this.state;
        if (state.turn !== Turn.Player) {
            return;
        }
        var now = this.state.stepper.step(card);
        switch (now.state) {
            case card_engine_1.CardState.ChooseOne:
            case card_engine_1.CardState.OneMore:
                state.stepper = now;
                this.setState(state);
                return;
            case card_engine_1.CardState.Result:
                state.stepper = now.step();
                this.setState(state);
                return;
            case card_engine_1.CardState.Miss:
                state.turn = Turn.Holding;
                this.setState(state);
                setTimeout(function () {
                    state.stepper = now.step();
                    state.turn = now.player.isCpu ? Turn.Cpu : Turn.Player;
                    _this.setState(state);
                }, 1000);
                return;
            case card_engine_1.CardState.Finish:
                this.setState(state);
                return;
        }
    };
    GameContext.prototype.listen = function (to) {
        var _this = this;
        to('choose:card', function (card) {
            _this.onChooseCard(card);
        });
    };
    return GameContext;
}(parcel_1.Parcel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameContext;
//# sourceMappingURL=game-context.js.map