if (!window.App) {
    window.App = {};
}
var App = window.App;

App.Sequencer = {
    running: false,

    start: function() {
        this.running = true;
    },

    stop: function() {
        this.running = false;
    }
};

Core.onReady(function() {
    console.log(App.Sequencer.running);
    App.Sequencer.start();
    console.log(App.Sequencer.running);
    App.Sequencer.stop();
    console.log(App.Sequencer.running);
});