var Card = (function () {
    function Card(suit, number, isOpened) {
        if (isOpened === void 0) { isOpened = false; }
        this.suit = suit;
        this.number = number;
        this.isOpened = isOpened;
    }
    return Card;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Card;
//# sourceMappingURL=card.js.map