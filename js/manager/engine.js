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
    const play = function (playerOne, playerTwo) {
        const getAttackableUnits = function (unit, other) {
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

            const enemyUnits = other.aliveUnits()
                .filter(availableForAttackUnits)
                .map(toCell);

            const barriers = BoardManager.getBarriers()
                .filter(availableForAttackUnits);

            return {
                enemyUnits,
                barriers
            };
        }
        const moves = (function () {
            const attack = function (attackUnit, otherPlayer) {

            }
            const move = function (unit) {

            }
            const heal = function (unit) {

            }

            return {
                attack,
                move,
                heal
            }
        })()
        const endGame = function (winner, loser) {

        }
        const makeTurn = function (current, other) {
            const aliveUnits = current.aliveUnits();
            
            const isAttackAvailable = function (unit) {
                return getAttackableUnits(unit, other) !== 0;
            } 
            const callback = function (unit, moveType) {
                switch (moveType) {
                    case 'attack':
                        moves.attack(unit, other);
                        break;
                    case 'move':
                        BoardManager.showAvailableMovement(unit);
                        //pick where to go
                        //change possition
                        //other player turn
                        break;
                    case 'heal':
                        const makeOneMoreTurn = function () {
                            makeTurn(current, other);
                        }
                        moves.heal(unit, makeOneMoreTurn);
                        break;
                }
            }

            if (playerTwo.aliveUnits() === 0) {

            }
            ViewManager.pickMove(playerOne, aliveUnits, isAttackAvailable, callback);
        }
        makeTurn();
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
        BoardManager.createBoard();
        //BoardManager.addBarriers();
        ViewManager.renderBoard();
        const playerOne = new Player('player one', createUnits(), CONSTANTS.board.cell.type.playerOne);
        const playerТwo = new Player('player two', createUnits(), CONSTANTS.board.cell.type.playerTwo);
        placeAllUnits(playerOne, playerТwo);
        //play
    }

    return {
        run
    }
})();