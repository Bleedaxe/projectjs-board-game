const BoardManager = (function () {
    const barriers = [];

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
        barriers = barriers.filter(b => b.row !== row && b.col !== col);
        Board[row][col] = CONSTANTS.board.cell.type.empty;
    }

    const showAvailableMovement = function (unit) {
        const unitRow = unit.y;
        const unitCol = unit.x;
        const blocksCount = unit.speed;
        const changeBoard = function (row, col, index) {
            const isOutOfBoard = function (row, col) {
                return row < 0 ||
                       row >= Board.length ||
                       col < 0 ||
                       col >= Board[row].length
            }
            const getNotEmptyCells = function () {
                const cells = [CONSTANTS.board.cell.type.barrier];
                Object.keys(CONSTANTS.board.cell.type.units)
                    .forEach(key => cells.push(CONSTANTS.board.cell.type.units[key]));
                return cells;
            }
            const replaceWithIndexIfEmpty = function (row, col, index) {
                if (isOutOfBoard(row, col)){
                    return;
                }
                const currentValue = Board[row][col];
                if(+currentValue == currentValue) {
                    return;
                }
                const notEmptyCells = getNotEmptyCells();               
                const cell = Board[row][col];
                if (notEmptyCells.indexOf(cell) === -1){
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
        removeBarrier
    }
})();