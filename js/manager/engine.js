const Engine = (function () {    
    const createUnits = function () {
        const units = [];
        const addUnits = function (action) {
            for(let i = 0; i < /*CONSTANTS.unitsPerType*/ 1; i++) {
                action();
            }
        }
        addUnits(() => units.push(new Knight()));
        addUnits(() => units.push(new Elf()));
        addUnits(() => units.push(new Dwarf()));
        return units;
    }
    const endGame = function (winner, loser) {
        console.log(winner, loser);
    }
    const play = function (playerOne, playerTwo) {
        const getAttackableUnits = function (unit, enemyPlayer) {
            const currentUnitPositionSum = unit.x + unit.y;
            const availableForAttackUnits = function (unit) {
                const enemyUnitPositionSum = unit.x + unit.y;
                return Math.abs(enemyUnitPositionSum - currentUnitPositionSum) === unit.attackCells;
            }
            const toCell = function (unit) {
                return {
                    row: unit.y,
                    col: unit.x
                };
            }

            const attackableUnits = enemyPlayer.getAliveUnits()
                .filter(availableForAttackUnits)
                .map(toCell);

            BoardManager.getBarriers()
                .filter(availableForAttackUnits)
                .forEach(b => attackableUnits.push(b));

            return attackableUnits;
        }
                    
        const isAttackAvailable = function (unit, enemyPlayer) {
            return getAttackableUnits(unit, enemyPlayer) !== 0;
        }

        const isUnitNotOnFullHealth = function (unit) {
            //TODO: check in constants for given type and compare with current health
            return true;
        }

        const getMoves = function (unit, enemyPlayer, samePlayerTurn, otherPlayerTurn) {
            const attack = function () {
                const afterUnitPicking = function (pickedUnit) {
                    const pickedEnemyUnit = enemyPlayer.getAliveUnits()
                        .filter(u => u.x === pickedUnit.col && u.y === pickedUnit.col);
                    if (pickedEnemyUnit.length !== 0) {
                        pickedEnemyUnit[0].receiveDamage(unit.attack);
                    }
                    else {
                        BoardManager.removeBarrier(pickedUnit.row, pickedUnit.col);
                        ViewManager.renderBoard();
                    }

                    otherPlayerTurn();
                }
                const attackableUnits = getAttackableUnits(unit, enemyPlayer);
                ViewManager.pickAttackableUnit(attackableUnits, afterUnitPicking)
            }
            const move = function () {
                BoardManager.showAvailableMovement(unit);
                ViewManager.renderBoard();
                //view manager pick cell with number on it
                //change unit position (on board and unit coordinates)
                //render board
                //change to enemy turn
            }
            //TODO: check if heal is max -> if it is don't enable healing.
            const heal = function () {
                //get random number for healing unit (don't heal for more than max heal)
                //heal unit
                //throw dice and check if this unit has one more turn (should player can have more than one bonus rounds)
                //if yes give one more turn
                //else change to enemy turn
            }

            return {
                attack: isAttackAvailable(unit, enemyPlayer) ? attack : null,
                move,
                heal: isUnitNotOnFullHealth(unit) ? heal : null
            }
        }

        const makeTurn = function (current, enemy) {
            const aliveUnits = current.getAliveUnits();
            if (aliveUnits.length === 0) {
                endGame(enemy, current);
                return;
            }

            const showAvailableTurns = function (unit) {
                const moveToObject = function (moveType) {
                    return {
                        name: moveType,
                        callback: moves[moveType]
                    };
                }

                const samePlayerTurn = () => makeTurn(current, enemy);
                const otherPlayerTurn = () => makeTurn(enemy, current);
                const moves = getMoves(unit, enemy, samePlayerTurn, otherPlayerTurn);
                const turnTypes = Object.keys(moves)
                    .map(moveToObject);

                ViewManager.renderTurn(turnTypes);
            }

            ViewManager.pickUnit(aliveUnits, showAvailableTurns);
            //ViewManager.pickMove(current, aliveUnits, isAttackAvailable, callback);
        }
        makeTurn(playerOne, playerTwo);
    }
    const placeAllUnits = function (playerOne, playerТwo) {
        const makeTurn = function (current, other) {
            const availableUnits = current.getUnplacedUnits();
            const callback = function (place, unit) {
                let succeed = BoardManager.tryAddUnit(place, unit, current.boardSide);
                if (!succeed) {
                    makeTurn(current, other);
                    return;
                }
                if (other.getUnplacedUnits() === 0) {
                    play()
                }

                makeTurn(other, current);
            }
            
            ViewManager.renderPick(availableUnits, current.boardSide, callback);
        }
        makeTurn(playerOne, playerТwo);
    }
    const run = function (){
        //Show message for starting the game (alert probably)
        BoardManager.createBoard();
        BoardManager.addBarriers();
        ViewManager.renderBoard();
        const playerOne = new Player('player one', createUnits(), CONSTANTS.board.cell.type.playerOne);
        const playerТwo = new Player('player two', createUnits(), CONSTANTS.board.cell.type.playerTwo);
        placeAllUnits(playerOne, playerТwo);
        play(playerOne, playerТwo);
    }

    return {
        run
    }
})();