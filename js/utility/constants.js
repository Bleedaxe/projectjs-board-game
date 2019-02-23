const CONSTANTS = {
    board: {
        rowCount: 7,
        colCount: 9,
        firstPlayerCastleEndRow: 2,
        secondPlayerCastleStartRow: 5,
        cell: {
            width: 100,
            height: 100,
            lineWidth: 1,
            type: {
                playerOne: 'p1',
                playerTwo: 'p2',
                empty: 'e',
                barrier: 'b',
                units: {
                    elf: 'E',
                    dwarf: 'D',
                    knight: 'K'
                }
            }
        },
        color: {
            blackCastle: '#333333',
            grayCastle: 'gray',
            unit: 'white'
        },
        battlefield: {
            color: '#b3b3b3',
            startRow: 2,
            endRow: 5
        },
        barrier: {
            color: 'black',
            minCount: 1,
            maxCount: 5
        }
    },
    canvas:{
        tagName: 'canvas',
        board: {
            id: 'canvas',
            width: '900px',
            height: '700px',
            border: '1px solid black'
        }
    },
    info: {
        tagName: 'div',
        id: 'info',
        pick:{
            tagName: 'div',
            id: 'pick',
            width: '300px',
            height: '200px',
            border: '1px solid red'
        }
    },
    plyaerTurn: {
        tagName: 'p',
        id: 'turn'
    },
    unitsPerType: 2,
    knight: {
        attack: 8,
        armor: 3,
        health: 15,
        attackCells: 1,
        speed: 1,
        type: 'Knight'
    },
    elf: {
        attack: 5,
        armor: 1,
        health: 10,
        attackCells: 3,
        speed: 3,
        type: 'Elf'
    },
    dwarf: {
        attack: 6,
        armor: 2,
        health: 12,
        attackCells: 2,
        speed: 2,
        type: 'Dwarf'
    },
    turnType: {
        attack: 'Attack',
        move: 'Move',
        heal: 'Heal'
    },
    view: {
        pickUnitId: 'units',
        turnTypeId: 'turns',
    }
}