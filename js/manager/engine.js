const Engine = (function () {    
    const createUnits = function () {
        const units = [];
        const addUnits = function (action) {
            for(let i = 0; i < /*CONSTANTS.unitsPerType*/ 1; i++) {
                action();
            }
        }
        //addUnits(() => units.push(new Knight()));
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

            attackableUnits
                .concat(BoardManager.getBarriers()
                    .filter(availableForAttackUnits));

            return attackableUnits;
        }
                    
        const isAttackAvailable = function (unit, enemyPlayer) {
            return getAttackableUnits(unit, enemyPlayer).length !== 0;
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
            const move = function (afterSuccess) {
                const filter = function (click) {
                    const row = click.y;
                    const col = click.x;
                    const boardValue = Board[row][col];

                    return +boardValue == boardValue;
                }
                const changeUnitPosition = function (click) {
                    afterSuccess();
                    unit.move(click.x, click.y);
                    BoardManager.createBoard(unitManger.getUnits());
                    ViewManager.renderBoard();
                    otherPlayerTurn();
                }

                BoardManager.showAvailableMovement(unit);
                ViewManager.renderBoard();
                ViewManager.onBoardClick(changeUnitPosition, filter);
            }
            //TODO: check if heal is max -> if it is don't enable healing.
            const heal = function () {
                //get random number for healing unit (don't heal for more than max heal)
                //heal unit
                //throw dice and check if this unit has one more turn (should player can have more than one bonus rounds)
                //if yes give one more turn
                //else change to enemy turn
            }
            const result = {};
            result.attack = isAttackAvailable(unit, enemyPlayer) ? attack : null;
            result.move = move;
            result.heal = isUnitNotOnFullHealth(unit) ? heal : null;

            return result;
        }

        const makeTurn = function (current, enemy) {
            const aliveUnits = current.getAliveUnits();
            if (aliveUnits.length === 0) {
                endGame(enemy, current);
                return;
            }

            const showAvailableTurns = function (unit) {
                const samePlayerTurn = () => makeTurn(current, enemy);
                const otherPlayerTurn = () => makeTurn(enemy, current);
                const moves = getMoves(unit, enemy, samePlayerTurn, otherPlayerTurn);

                const moveToObject = function (moveType) {
                    return {
                        name: moveType,
                        callback: moves[moveType]
                    };
                }
                
                const turnTypes = Object.keys(moves)
                    .map(moveToObject);

                ViewManager.renderTurn(turnTypes);
            }

            ViewManager.pickUnit(aliveUnits, showAvailableTurns);
        }
        ViewManager.renderBoard();
        makeTurn(playerOne, playerTwo);
    }
    const placeAllUnits = function (playerOne, playerТwo) {
        const makeTurn = function (current, other) {
            const availableUnits = current.getUnplacedUnits();
            const placeUnitFilter = function (click) {
                const row = click.y;
                const col = click.x;
                return Board[row][col] === current.boardSide;
            }
            const callback = function (place, unit) {
                BoardManager.placeUnit(place, unit);
                // if (!succeed) {
                //     makeTurn(current, other);
                //     return;
                // }
                if (other.getUnplacedUnits().length === 0) {
                    play(playerOne, playerТwo);
                    return;
                }

                makeTurn(other, current);
            }
            
            ViewManager.renderPick(availableUnits, current.boardSide, callback, placeUnitFilter);
        }
        makeTurn(playerOne, playerТwo);
    }
    const run = function (){
        //Show message for starting the game (alert probably)
        BoardManager.createBoard();
        ViewManager.renderBoard();
        const playerOne = new Player('player one', createUnits(), CONSTANTS.board.cell.type.playerOne);
        const playerТwo = new Player('player two', createUnits(), CONSTANTS.board.cell.type.playerTwo);
        unitManger.setPlayers(playerOne, playerТwo);
        placeAllUnits(playerOne, playerТwo);
    }

    const unitManger = (function () {
        let playerOne = null;
        let playerTwo = null;
        const setPlayers = function (playerOneParam, playerTwoParam) {
            playerOne = playerOneParam;
            playerTwo = playerTwoParam;
        }
        const getUnits = function () {
            return playerOne.getAliveUnits()
                .concat(playerTwo.getAliveUnits());
        }
        return {
            setPlayers,
            getUnits
        }
    })();

    return {
        run
    }
})();