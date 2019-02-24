let Elf = function () {
    Unit.call(this, CONSTANTS.elf.attack, CONSTANTS.elf.armor, CONSTANTS.elf.health,CONSTANTS.elf.attackCells, CONSTANTS.elf.speed, [CONSTANTS.board.cell.type.barrier]);
    this.type = CONSTANTS.elf.type;
}