const ViewManager = (function () {
    const colorManager = (function () {
        const getPlayerColor =  function (row, col) {
            const isBlack = (row + col) % 2 !== 0;
            let color = isBlack ? CONSTANTS.board.color.blackCastle : CONSTANTS.board.color.grayCastle;
            return color;
        }
        const getBattlefieldColor = function () {
            return CONSTANTS.board.battlefield.color;
        }
        const getBarrierColor = function () {
            return CONSTANTS.board.barrier.color;
        }
        const getUnitColor = function () {
            return CONSTANTS.board.color.unit;
        }

        return {
            getPlayerColor,
            getBattlefieldColor,
            getBarrierColor,
            getUnitColor
        }
    })();

    const getRectColor = function (value, row, col) {
        switch (value) {
            case CONSTANTS.board.cell.type.empty:
                return colorManager.getBattlefieldColor();
            case CONSTANTS.board.cell.type.playerOne:
            case CONSTANTS.board.cell.type.playerTwo:
                return colorManager.getPlayerColor(row, col);
            case CONSTANTS.board.cell.type.barrier:
                return colorManager.getBarrierColor();
            default: return colorManager.getUnitColor();
        }
    }

    const renderBoard = function (boardType = null) {
        //TODO: add text in rect
        for(let row = 0; row < Board.length; row++) {
            for(let col = 0; col < Board[row].length; col++) {
                const x = col * CONSTANTS.board.cell.width;
                const y = row * CONSTANTS.board.cell.height;
                const boardValue = Board[row][col];
                if (boardType === null || boardType === boardValue) {
                    CanvasManager.renderRect(x, y, CONSTANTS.board.cell.width, CONSTANTS.board.cell.height, getRectColor(boardValue, row, col), CONSTANTS.board.cell.lineWidth);
                }
                else {
                    CanvasManager.renderRect(x, y, CONSTANTS.board.cell.width, CONSTANTS.board.cell.height, 'red', CONSTANTS.board.cell.lineWidth, "X", "black");
                }
            }
        }
    }
    
    const createCanvas = function (id, width, height, border, parentElement) {
        const canvas = document.createElement(CONSTANTS.canvas.tagName);
        canvas.id = id;
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
        canvas.style.border = border;
        parentElement.appendChild(canvas);
        
        CanvasManager.init(id);
    }
    
    const init = function () {
        createCanvas(CONSTANTS.canvas.board.id, CONSTANTS.canvas.board.width, CONSTANTS.canvas.board.height, CONSTANTS.canvas.board.border, document.body);
        //createInfo();
        //createPlayerTurnMessage(getInfo());
    }

    const renderPick = function (avaibleUnits, boardType, callback) {
        showAvaiblePlace(boardType);
        unitManager.showUnits(avaibleUnits, callback);
    }

    const onBoardClick =  function (unit, callback) {
        const canvasClick = function (click) {
            click.x = Math.floor(click.x / CONSTANTS.board.cell.width);
            click.y = Math.floor(click.y / CONSTANTS.board.cell.height);
            callback(click, unit);
        }

        CanvasManager.onClick(canvasClick);
    }

    const unitManager = (function () {
        const showUnits = function (avaibleUnits, callback) {
            const unitDomElementId = 'units';
            const unitElements = document.createElement('div');
            unitElements.id = unitDomElementId;

            const deleteDiv = function () {
                if(unitElements.parentNode !== null){
                    unitElements.parentNode.removeChild(unitElements);
                }
            }
            const isUnitDomElementAvailable = function () {
                return document.getElementById(unitDomElementId);
            }
            const unitToDiv = function (unit) {
                const onUnitPick = function () {
                    alert('place unit');
                    deleteDiv();
                    if (isUnitDomElementAvailable) {
                        onBoardClick(unit, callback, deleteDiv);
                        return;
                    }
                }

                let unitElement = document.createElement('div');
                unitElement.textContent = unit.type[0].toUpperCase();
                unitElement.id = unit.type;

                unitElement.addEventListener('click', onUnitPick)

                return unitElement;
            }
            avaibleUnits
                .map(unitToDiv)
                .forEach(u => unitElements.appendChild(u));
            
            document.body.appendChild(unitElements);
        }
        return {
            showUnits,
            renderPick
        }
    })();

    const showAvaiblePlace = function (boardType) {
        renderBoard(boardType);
    }

    init();

    return {
        renderBoard,
        onBoardClick,
        showAvaiblePlace,
        showUnits: unitManager.showUnits,
        renderPick: unitManager.renderPick
    }
})();