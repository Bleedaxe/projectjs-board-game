const PointsManager = (function (){
    const players = [];
    const getPlayerIndexByName = function (name) {
        return players.map(p => p.name).indexOf(name);
    }
    const set = function (params) {
        let index = getPlayerIndexByName(params.playerName);

        if (index === -1) {
            let player = {
                name,
                points: 0
            };
            index = players.push(player) - 1;
        }

        players[index].points += params.points;
    }
    const get = function (playerName) {
        const index = getPlayerIndexByName(playerName);
        
        if(index === -1)
            throw Error('Player with that name is not found!');
        
        players[index].points;
    }
    return {
        set,
        get
    }
})();