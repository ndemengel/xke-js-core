"use strict"
// requires Core.<env>.js
// requires Core.common.js

// this line just makes JSLint ignore the unknown 'App' variable
var App = App;

// if the namespace object does not already exist, creates it
if (typeof App === 'undefined') {
    App = {};
}

// the sequencer is now declared within our namespace
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
