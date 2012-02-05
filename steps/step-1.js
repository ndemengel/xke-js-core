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
    console.log(Sequencer.running);
    Sequencer.start();
    console.log(Sequencer.running);
    Sequencer.stop();
    console.log(Sequencer.running);
});