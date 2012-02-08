"use strict"
// requires Core.<env>.js
// requires Core.common.js

var App = App;
if (typeof App === 'undefined') {
    App = {};
}

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
    Core.log(App.Sequencer.running);
    App.Sequencer.start();
    Core.log(App.Sequencer.running);
    App.Sequencer.stop();
    Core.log(App.Sequencer.running);
});
