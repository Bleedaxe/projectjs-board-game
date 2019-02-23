let Knight = function () {
    Unit.call(this, CONSTANTS.knight.attack, CONSTANTS.knight.armor, CONSTANTS.knight.health, CONSTANTS.knight.attackCells, CONSTANTS.knight.speed);
    this.type = CONSTANTS.knight.type;
}