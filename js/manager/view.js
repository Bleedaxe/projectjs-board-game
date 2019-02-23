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
                    //Add to constants
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

    const renderUnitPick = function (avaibleUnits, boardType, callback) {
        showAvaiblePlace(boardType);
        unitManager.showUnits(avaibleUnits, callback);
    }

    // const onBoardClick =  function (unit, callback, afterAddingEvent) {
    //     const canvasClick = function (click) {
    //         click.x = Math.floor(click.x / CONSTANTS.board.cell.width);
    //         click.y = Math.floor(click.y / CONSTANTS.board.cell.height);
    //         afterAddingEvent();
    //         callback(click, unit);
    //     }

    //     CanvasManager.onClick(canvasClick);
    // }
    const onBoardClick =  function (callback, afterAddingEvent = null) {
        const canvasClick = function (click) {
            click.x = Math.floor(click.x / CONSTANTS.board.cell.width);
            click.y = Math.floor(click.y / CONSTANTS.board.cell.height);

            if(afterAddingEvent !== null)
                afterAddingEvent();

            callback(click);
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
            const unitToDiv = function (unit) {
                const afterBoardClick = function (click) {
                    callback(click, unit);
                }
                const onUnitPick = function () {
                    alert('place unit');
                    deleteDiv();
                    onBoardClick(afterBoardClick);
                    return;
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
        
        const pickUnit = function (units, callback) {
            const afterBoardClick = function (click) {
                const clickedUnits = units.filter(u => u.x === click.x && u.y === click.y);
                if (clickedUnits.length === 0) {
                    onBoardClick(afterBoardClick);
                    return;
                }

                callback(clickedUnits[0]);
            }
            onBoardClick(afterBoardClick);
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
        const turnToDiv = function (turn) {
            const onClick = function () {
                onBoardClick(turn.callback);
            }
            //turn will have name and callback function
            const turnDOM = document.createElement('div');
            turnDOM.textContent = turn.name;

            if (turn.callback === null) {
                turnDOM.addEventListener('click', onClick);
            }
            else {
                turn.textContent += " X";
            }

            return turnDOM;
        }
        const showTurns = function () {
            const turnTypesDOMElement = document.createElement('div');
            turnTypesDOMElement.id = CONSTANTS.view.turnTypeId;

            turns
                .map(turnToDiv)
                .forEach(t => turnTypesDOMElement.appendChild(t));

            document.body.appendChild(turnTypesDOMElement);
        }

        showTurns();
    }

    const pickAttackableUnit = function (attackableUnits, callback) {
        const afterClick = function (click) {
            const clickedUnits = attackableUnits
                .filter(u => u.row === click.y && u.col === click.x);
            
            if (clickedUnits.length !== 0) {
                callback(clickedEnemyUnits[0]);
            }

            onBoardClick(afterClick);
        }

        onBoardClick(afterClick);
    }

    init();

    return {
        renderBoard,
        onBoardClick,
        showAvaiblePlace,
        renderPick: renderUnitPick,
        pickUnit: unitManager.pickUnit,
        renderTurn,
        pickAttackableUnit
    }
})();