const main = function () {
    const start = confirm('Start Game?');
    if(!start){
        alert('Goodbye! :)');
        document.body.childNodes.forEach(node => document.body.removeChild(node));
        return;
    }
    
    Engine.run();
};

main();