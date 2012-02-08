"use strict"
// requires Core.<env>.js
// requires Core.common.js

// here we have a very simple object with a property and two methods
var sequencer = {
    running: false,

    start: function() {
        this.running = true;
    },

    stop: function() {
        this.running = false;
    }
};

// when run within a browser, Core.onReady waits for the web document to be loaded before executing its argument
// this is useful when working with the DOM
Core.onReady(function() {
    Core.log(sequencer.running);
    sequencer.start();
    Core.log(sequencer.running);
    sequencer.stop();
    Core.log(sequencer.running);
});
