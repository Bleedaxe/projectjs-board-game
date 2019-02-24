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
            var attackableCells = BoardManager.getAttackablePlaces(unit, unit.ignorableCells);
            const availableForAttackUnits = function (unit) {
                const enemyRow = unit.row;
                const enemyCol = unit.col;

                return attackableCells
                    .filter(ac => ac.row === enemyRow && ac.col === enemyCol).length !== 0;
            }

            const toCell = function (unit) {
                return {
                    row: unit.y,
                    col: unit.x
                };
            }

            let attackableUnits = enemyPlayer.getAliveUnits()
                .map(toCell)
                .filter(availableForAttackUnits);
            debugger;
            const barriers = BoardManager.getBarriers()
                .filter(availableForAttackUnits);

            attackableUnits = attackableUnits.concat(barriers);
            debugger;
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
            const attack = function (afterSuccess) {
                const attackableUnits = getAttackableUnits(unit, enemyPlayer);

                const getAttackableUnitAtPosition = function (row, col) {
                    const units = attackableUnits
                        .filter(au => au.row === row &&  au.col === col);
                    
                    return units.length === 0 ? null : units[0];
                }

                const afterUnitPicking = function (click) {
                    afterSuccess();
                    const pickedEnemyUnit = enemyPlayer.getAliveUnits()
                        .filter(u => u.x === click.x && u.y === click.y);

                    if (pickedEnemyUnit.length !== 0) {
                        pickedEnemyUnit[0].receiveDamage(unit.attack);
                    }
                    else {
                        BoardManager.removeBarrier(click.y, click.x);
                    }

                    otherPlayerTurn();
                }

                const filter = function (click) {
                    return getAttackableUnitAtPosition(click.y, click.x) !== null;
                }

                ViewManager.onBoardClick(afterUnitPicking, filter);
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
                    otherPlayerTurn();
                }
                const unitRow = unit.y;
                const unitCol = unit.x;
                const blocksCount = unit.speed;

                BoardManager.showAvailableMovement(unitRow, unitCol, blocksCount);
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
            BoardManager.createBoard(unitManger.getUnits());
            ViewManager.renderBoard();
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