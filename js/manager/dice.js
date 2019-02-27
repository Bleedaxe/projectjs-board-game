const DiceManager = (function () {
    const min = 1;
    const max = 6;

    const rollDice = function () {
        return Random.getRandom(this.max, this.min);
    }

    const rollDices = function (count) {
        return Array(count).fill(this.rollDice());
    }
    return {
        min,
        max,
        rollDice,
        rollDices
    }
})();