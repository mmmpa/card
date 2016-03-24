"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var card_engine_1 = require("../models/card-engine");
var card_engine_2 = require("../models/card-engine");
var cpu_1 = require("../models/cpu");
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
        return this.initialGameState;
    };
    GameContext.prototype.retry = function () {
        this.setState(this.initialGameState);
    };
    Object.defineProperty(GameContext.prototype, "initialGameState", {
        get: function () {
            var _a = this.props.recipe, eachSuitNumber = _a.eachSuitNumber, suits = _a.suits, players = _a.players;
            var engine = new card_engine_1.default(eachSuitNumber, suits, players);
            var stepper = engine.start();
            var cpus = _.reduce(players, function (a, player) {
                if (player.isCpu) {
                    a[player.name] = cpu_1.default.detect(player.name, engine);
                }
                return a;
            }, {});
            return {
                cpus: cpus,
                stepper: stepper,
                player: engine.playerNow,
                state: stepper.state,
                cards: engine.cards,
                turn: stepper.player.isCpu ? Turn.Cpu : Turn.Player
            };
        },
        enumerable: true,
        configurable: true
    });
    GameContext.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.runCpu();
    };
    GameContext.prototype.componentDidUpdate = function () {
        this.runCpu();
    };
    GameContext.prototype.runCpu = function () {
        var _this = this;
        if (this.state.turn === Turn.Cpu && this.state.stepper.state === card_engine_2.CardState.ChooseOne) {
            this.state.cpus[this.state.player.name].run(function (card) { return _this.choose(card); });
        }
    };
    GameContext.prototype.choose = function (card) {
        var _this = this;
        var state = this.state;
        var nestStepper = this.state.stepper.step(card);
        state.state = nestStepper.state;
        switch (nestStepper.state) {
            case card_engine_2.CardState.ChooseOne:
            case card_engine_2.CardState.OneMore:
                state.stepper = nestStepper;
                this.setState(state);
                return;
            case card_engine_2.CardState.Result:
                state.stepper = nestStepper.step();
                this.setState(state);
                return;
            case card_engine_2.CardState.Miss:
                state.turn = Turn.Holding;
                this.setState(state);
                setTimeout(function () {
                    state.stepper = nestStepper.step();
                    state.player = state.stepper.player;
                    state.turn = state.stepper.player.isCpu ? Turn.Cpu : Turn.Player;
                    _this.setState(state);
                }, 1000);
                return;
            case card_engine_2.CardState.Finish:
                state.turn = Turn.Holding;
                state.result = nestStepper.result;
                this.setState(state);
                return;
        }
    };
    GameContext.prototype.onChooseCard = function (card) {
        if (this.state.turn === Turn.Player) {
            this.choose(card);
        }
    };
    GameContext.prototype.listen = function (to) {
        var _this = this;
        to('choose:card', function (card) {
            _this.onChooseCard(card);
        });
        to('retry', function (card) {
            _this.retry();
        });
        to('back', function (card) {
            //this.onChooseCard(card);
        });
    };
    return GameContext;
}(parcel_1.Parcel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameContext;
//# sourceMappingURL=game-context.js.map