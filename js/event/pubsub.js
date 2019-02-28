const PubSub = (function () {
    let events = {};
    const publish = function (topic, params) {
        events[topic]
            .forEach(l => l(params));
    }

    const subscribe = function (topic, listener) {
        if(!events.hasOwnProperty(topic)) {
            events[topic] = [];
        }

        events[topic].push(listener);
    }
    const reset = function () {
        events = {};
    }

    return {
        publish,
        subscribe,
        reset
    }
})()