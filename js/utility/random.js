const Random = {
    getRandom: function (max, min) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}