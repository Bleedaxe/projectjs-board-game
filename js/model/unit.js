let Unit = function (attack, armor, health, attackCells, speed, ignorableCells = null) {
    maxHealth = health;
    this.getMaxHealth = function () {
        return maxHealth;
    }

    this.attack = attack;
    this.armor = armor;
    this.health = health;
    this.attackCells = attackCells;
    this.speed = speed;

    this.x = null;
    this.y = null;

    this.ignorableCells = Object.keys(CONSTANTS.board.cell.type.units)
        .map(k => CONSTANTS.board.cell.type.units[k]);
    if(ignorableCells !== null){
        this.ignorableCells = this.ignorableCells.concat(ignorableCells);
    }

    this.receiveDamage = (attackDamage) => {
        this.health -= (attackDamage - this.armor);
        if (this.health <= 0) {
            this.x = null;
            this.y = null;
        }
    }

    this.move = (x, y) => {
        this.x = x;
        this.y = y;
    }

    this.isAlive = () => {
        return this.health > 0;
    }

    this.heal = (points) => {
        this.health += points;
        this.health = this.getMaxHealth() < this.health ? this.getMaxHealth() : this.health;
    }
}