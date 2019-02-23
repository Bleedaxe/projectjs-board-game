let Player = function(name, units, boardSide) {
    this.name = name;
    this.units = units;
    this.boardSide = boardSide;
}

Player.prototype.isAlive = function () {
    return this.units.length !== 0;
}

Player.prototype.getUnplacedUnits = function () {
    return this.units
        .filter(u => u.x === null && u.y === null);
}

Player.prototype.getAliveUnits = function () {
    return this.units
        .filter(u => u.isAlive());
}