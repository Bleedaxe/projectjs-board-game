const CanvasManager = (function () {
    let canvas = null;
    let context = null;
    let offsetLeft = null;
    let offsetTop = null;

    const init = function (elementId) {
        canvas = document.getElementById(elementId);
        offsetLeft = canvas.offsetLeft;
        offsetTop = canvas.offsetTop;
        context = canvas.getContext('2d');
    }

    const renderRect = function (x, y, width, height, color, lineWidth, text = null, borderColor = null) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.lineWidth = lineWidth;
        context.strokeStyle = borderColor !== null ? borderColor : CONSTANTS.board.cell.borderColor;
        context.stroke();
        context.fillStyle = color;
        context.fill();
        if(text !== null) {
            context.fillStyle = text.color;
            context.font = "50px Arial";
            context.fillText(text.value, x + 30, y + 70);
        }
    }

    const onClick = function (callback) {
        const clickFunction = function (e) {
            const click = {
                x: e.clientX - offsetLeft,
                y: e.clientY - offsetTop
            };
            canvas.removeEventListener('click', clickFunction);
            callback(click);
        }
        canvas.addEventListener('click', clickFunction);
    }

    return {
        init,
        renderRect,
        onClick
    }
})();