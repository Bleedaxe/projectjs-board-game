const ViewManager = (function () {
    const getElementsDOM = function () {
        return document.getElementById('elements');
    }
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

    const getText = function (boardValue) {
        if (+boardValue == boardValue) {
            return {
                value: boardValue,
                color: 'black'
            };
        }
        const units = Object.keys(CONSTANTS.board.cell.type.units)
            .map(k => CONSTANTS.board.cell.type.units[k]);
        const index = units.indexOf(boardValue);
        return index === -1 
            ? null
            : {
                value: units[index],
                color: 'red'
            };
    }

    const renderBoard = function (filterType = null) {
        for(let row = 0; row < Board.length; row++) {
            for(let col = 0; col < Board[row].length; col++) {
                const x = col * CONSTANTS.board.cell.width;
                const y = row * CONSTANTS.board.cell.height;
                const boardValue = Board[row][col];
                if (filterType === null || filterType === boardValue) {
                    const text = getText(boardValue);
                    CanvasManager.renderRect(x, y, CONSTANTS.board.cell.width, CONSTANTS.board.cell.height, getRectColor(boardValue, row, col), CONSTANTS.board.cell.lineWidth, text);
                }
                else {
                    //Add to constants
                    const text = {
                        value: 'X',
                        color: 'black'
                    }
                    CanvasManager.renderRect(x, y, CONSTANTS.board.cell.width, CONSTANTS.board.cell.height, 'red', CONSTANTS.board.cell.lineWidth, text);
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
        const elementsDOM = document.createElement('div');
        elementsDOM.id = 'elements';
        document.body.appendChild(elementsDOM);
    }

    const onBoardClick =  function (callback, filter = null) {
        let allCallbacks = [];
        allCallbacks.push(callback);
        const canvasClick = function (click) {
            click.x = Math.floor(click.x / CONSTANTS.board.cell.width);
            click.y = Math.floor(click.y / CONSTANTS.board.cell.height);
            if (filter !== null && !filter(click)) {
                onBoardClick(callback, filter);
                return;
            }
            const lastCallback = allCallbacks.pop();
            allCallbacks = [];
            lastCallback(click);
        }
        CanvasManager.onClick(canvasClick);
        
    };
    

    const renderUnitPick = function (avaibleUnits, boardType, callback, filter) {
        showAvaiblePlace(boardType);
        unitManager.showUnits(avaibleUnits, callback, filter);
    }

    const unitManager = (function () {
        const showUnits = function (avaibleUnits, callback, filter) {
            let pickedUnit = null;

            const unitDomElementId = 'units';
            const unitElements = document.createElement('div');
            unitElements.id = unitDomElementId;

            const deleteDiv = function () {
                if(unitElements.parentNode !== null){
                    unitElements.parentNode.removeChild(unitElements);
                }
            }
            const unitToDiv = function (unit) {
                const afterBoardClick = function (click) {

                    if(pickedUnit !== null){
                        deleteDiv();
                        callback(click, pickedUnit);
                        pickedUnit = null;
                    }
                }
                const onUnitPick = function () {
                    alert('place unit');
                    pickedUnit = unit;
                    onBoardClick(afterBoardClick, filter);
                    return;
                }

                let unitElement = document.createElement('div');
                unitElement.textContent = unit.type[0].toUpperCase();
                unitElement.classList.add('unit');

                unitElement.addEventListener('click', onUnitPick)

                return unitElement;
            }
            avaibleUnits
                .map(unitToDiv)
                .forEach(u => unitElements.appendChild(u));
            
            getElementsDOM().appendChild(unitElements);
        }
        
        const pickUnit = function (units, callback) {
            const unitPickFilter = function (click) {
                const clickedUnits = units.filter(u => u.x === click.x && u.y === click.y);
                return clickedUnits.length !== 0;
            }
            const afterBoardClick = function (click) {
                const clickedUnits = units.filter(u => u.x === click.x && u.y === click.y);

                callback(clickedUnits[0]);
            }
            onBoardClick(afterBoardClick, unitPickFilter);
        }

        return {
            showUnits,
            pickUnit
        }
    })();

    const showAvaiblePlace = function (boardType) {
        renderBoard(boardType);
    }

    const renderTurn = function (turns) {
        const turnTypesDOMElement = document.createElement('div');
        turnTypesDOMElement.id = CONSTANTS.view.turnTypeId;
        const deleteTurnsDOMElement = function () {
            turnTypesDOMElement.parentNode.removeChild(turnTypesDOMElement);
        }
        const turnToDiv = function (turn) {
            const onClick = function () {
                turn.callback(deleteTurnsDOMElement);
            }
            const turnDOM = document.createElement('div');
            turnDOM.textContent = turn.name;
            turnDOM.classList.add('turn');

            if (turn.callback !== null) {
                turnDOM.addEventListener('click', onClick);
            }
            else {
                turnDOM.textContent += " X";
            }

            return turnDOM;
        }
        const showTurns = function () {
            turns
                .map(turnToDiv)
                .forEach(t => turnTypesDOMElement.appendChild(t));

            getElementsDOM().appendChild(turnTypesDOMElement);
        }

        showTurns();
    }

    const renderAttackableTargets = function (attackableTargets) {
        const renderAttackableRect = function (target) {
            debugger;
            const row = target.row * CONSTANTS.board.cell.height;
            const col = target.col * CONSTANTS.board.cell.width;
            const boardValue = Board[target.row][target.col];
            const text = getText(boardValue);
            const color = getRectColor(boardValue, row, col);
            CanvasManager.renderRect(col, row, CONSTANTS.board.cell.width, CONSTANTS.board.cell.height, color, CONSTANTS.board.cell.lineWidth, text, "red");

        }
        attackableTargets.forEach(renderAttackableRect);           
    }

    const showCurrentPlayerName = function (name) {
        let playerNameDOM = document.getElementById('playerName');
        if (playerNameDOM !== null) {
            playerNameDOM.parentNode.removeChild(playerNameDOM);
        }

        playerNameDOM = document.createElement('div');
        playerNameDOM.id = 'playerName';
        playerNameDOM.textContent = `${name} Turn`;
        getElementsDOM().appendChild(playerNameDOM);
    }

    init();

    return {
        renderBoard,
        onBoardClick,
        showAvaiblePlace,
        renderPick: renderUnitPick,
        pickUnit: unitManager.pickUnit,
        renderTurn,
        renderAttackableTargets,
        showCurrentPlayerName
    }
})();