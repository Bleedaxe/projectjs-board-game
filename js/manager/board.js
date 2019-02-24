const BoardManager = (function () {
    let barriers = [];

    const appendCol = function (col, row, value) {
        Board[row][col] = value;
    }
    const fillRow = function (row, value) {
        Board[row] = Array(CONSTANTS.board.colCount).fill(value)
    }
    const initBoard = function () {
        createBarriers();
        Board = Array(CONSTANTS.board.rowCount).fill([]);
    }

    const createBoard = function (units = null) {
        for(let row = 0; row < CONSTANTS.board.firstPlayerCastleEndRow; row++){
            fillRow(row, CONSTANTS.board.cell.type.playerOne);
        }
        for(let row = CONSTANTS.board.battlefield.startRow; row < CONSTANTS.board.battlefield.endRow; row++){
            fillRow(row, CONSTANTS.board.cell.type.empty);
        }

        for(let row = CONSTANTS.board.secondPlayerCastleStartRow; row < CONSTANTS.board.rowCount; row++){
            fillRow(row, CONSTANTS.board.cell.type.playerTwo);
        }

        placeBarriers();
        if (units !== null) {
            placeUnits(units);
        }
    }

    const getBarriers = function () {
        return barriers;
    }

    const createBarriers = function () {
        const barriersCount = Random.getRandom(CONSTANTS.board.barrier.maxCount, CONSTANTS.board.barrier.minCount);
        for (let i = 0; i < barriersCount; i++) {
            const barrier = {
                col: Random.getRandom(CONSTANTS.board.colCount, 0),
                row: Random.getRandom(CONSTANTS.board.battlefield.endRow, CONSTANTS.board.battlefield.startRow)
            }
            barriers.push(barrier);
        }
    }

    const placeBarriers = function () {
        getBarriers()
            .forEach(b => appendCol(b.col, b.row, CONSTANTS.board.cell.type.barrier));
    }

    const placeUnits = function (units) {
        const unitToCell = function (unit) {
            return {
                row: unit.y,
                col: unit.x,
                value: unit.type[0].toUpperCase()
            }
        }
        units
            .map(unitToCell)
            .filter(u => u.row !== null && u.col !== null)
            .forEach(u => appendCol(u.col, u.row, u.value));
    }

    const removeBarrier = function (row, col) {
        barriers = barriers.filter(b => b.row !== row || b.col !== col);
        Board[row][col] = CONSTANTS.board.cell.type.empty;
    }

    const isOutOfBoard = function (row, col) {
        return row < 0 ||
               row >= Board.length ||
               col < 0 ||
               col >= Board[row].length
    }

    const getNotEmptyCells = function (ignorableCells = null) {
        let cells = [CONSTANTS.board.cell.type.barrier].concat(
            Object.keys(CONSTANTS.board.cell.type.units)                
                .map(key => CONSTANTS.board.cell.type.units[key]));

        if (ignorableCells !== null) {
            cells = cells.filter(c => ignorableCells.indexOf(c) === -1);
        }

        return cells;
    }

    const showAvailableMovement = function (unitRow, unitCol, blocksCount, ignorableCells = null, allowMaxRangeIgnore = false) {
        const notEmptyCells = getNotEmptyCells(ignorableCells);
        const changeBoard = function (row, col, index) {
            const replaceWithIndexIfEmpty = function (row, col, index) {
                if (isOutOfBoard(row, col)){
                    return;
                }
                const currentValue = Board[row][col];
                if(+currentValue == currentValue) {
                    return;
                }                              
                const cell = Board[row][col];
                if ((allowMaxRangeIgnore && index === blocksCount) || notEmptyCells.indexOf(cell) === -1){
                    Board[row][col] = index;
                }
            }
            const availablePlaces = [
                {
                    row: 0,
                    col: 1
                },
                {
                    row: 0,
                    col: -1
                },
                {
                    row: 1,
                    col: 0
                },
                {
                    row: -1,
                    col: 0
                }
            ];
            availablePlaces
                .forEach(ap => replaceWithIndexIfEmpty(row + ap.row, col + ap.col, index));
        }
        const boardValue = Board[unitRow][unitCol];
        Board[unitRow][unitCol] = 0;
        for(let i = 0; i < blocksCount; i++) {
            for(let row = 0; row < Board.length; row++) {
                for(let col = 0; col < Board[row].length; col++) {
                    if(Board[row][col] == i) {
                        changeBoard(row, col, i + 1);
                    }
                }
            }             
        }
        Board[unitRow][unitCol] = boardValue;
    }

    const getCellsWithGivenValue = function (value) {
        const cells = [];
        for(let row = 0; row < Board.length; row++) {
            for (let col = 0; col < Board[row].length; col++) {
                if (Board[row][col] == value) {
                    cells.push({
                        row,
                        col
                    });
                }
            }
        }

        return cells;
    }

    const getCopyOfBoard = function () {
        const copy = [];
            Board.forEach(row => copy.push(row.slice(0)));
        return copy;
    }

    const getAttackablePlaces = function (unit, ignorableCells) {
        const unitRow = unit.y;
        const unitCol = unit.x;
        const blocksCount = unit.attackCells;
        const currentBoard = getCopyOfBoard();
        showAvailableMovement(unitRow, unitCol, blocksCount, ignorableCells, true);
        const cells = getCellsWithGivenValue(blocksCount);
        Board = currentBoard;
        return cells;
    }

    const placeUnit = function (place, unit) {
        const row = place.y;
        const col = place.x;

        Board[row][col] = unit.type[0].toUpperCase();
        unit.x = col;
        unit.y = row;
    }

    initBoard();

    return {
        createBoard,
        showAvailableMovement,
        getBarriers,
        placeUnit,
        removeBarrier,
        getAttackablePlaces
    }
})();