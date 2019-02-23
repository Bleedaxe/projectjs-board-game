const BoardManager = (function () {
    const barriers = [];

    const appendCol = function (col, row, value) {
        Board[row][col] = value;
    }
    const fillRow = function (row, value) {
        Board[row] = Array(CONSTANTS.board.colCount).fill(value)
    }
    const initBoard = function () {
        Board = Array(CONSTANTS.board.rowCount).fill([]);
    }
    const createBoard = function () {
        initBoard();
        //TODO: add constants for fields
        for(let row = 0; row < CONSTANTS.board.firstPlayerCastleEndRow; row++){
            fillRow(row, CONSTANTS.board.cell.type.playerOne);
        }
        for(let row = CONSTANTS.board.battlefield.startRow; row < CONSTANTS.board.battlefield.endRow; row++){
            fillRow(row, CONSTANTS.board.cell.type.empty);
        }

        for(let row = CONSTANTS.board.secondPlayerCastleStartRow; row < CONSTANTS.board.rowCount; row++){
            fillRow(row, CONSTANTS.board.cell.type.playerTwo);
        }
    }

    const getBarriers = function () {
        return barriers;
    }

    const addBarriers = function () {
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

        createBarriers();
        getBarriers()
            .forEach(b => appendCol(b.col, b.row, CONSTANTS.board.cell.type.barrier));
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
            const replaceWithIndexIfEmpty = function (row, col, index) {
                debugger;
                const notEmptyCells = [CONSTANTS.board.cell.type.barrier];
                Object.keys(CONSTANTS.board.cell.type.units)
                    .forEach(key => notEmptyCells.push(CONSTANTS.board.cell.type.units[key]));

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
        Board[unitRow][unitCol] = 0;
        for(let i = 0; i <= blocksCount; i++) {
            Board.forEach(row => 
                row.filter(col => Board[row][col] == i)
                    .forEach(col => changeBoard(row, col, i + 1)));
        }
    }

    const tryAddUnit = function (place, unit, boardType) {
        const row = place.y;
        const col = place.x;
        if (Board[row][col] === boardType){
            Board[row][col] = unit.type[0].toUpperCase();
            unit.x = col;
            unit.y = row;
            return true;
        }

        return false;
    }

    return {
        createBoard,
        addBarriers,
        showAvailableMovement,
        getBarriers,
        tryAddUnit
    }
})();