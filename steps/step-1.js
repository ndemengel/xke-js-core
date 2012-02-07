// requires Core.<env>.js
// requires Core.common.js

var Sequencer = {
    running: false,

    start: function() {
        this.running = true;
    },

    stop: function() {
        this.running = false;
    }
};

Core.onReady(function() {
    Core.log(Sequencer.running);
    Sequencer.start();
    Core.log(Sequencer.running);
    Sequencer.stop();
    Core.log(Sequencer.running);
});
