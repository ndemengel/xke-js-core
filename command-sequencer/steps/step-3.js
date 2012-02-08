"use strict"
// requires Core.<env>.js
// requires Core.common.js

var App = App;
if (typeof App === 'undefined') {
    App = {};
}

App.Sequencer = {
    running: false,
    commands: [],
    context: {},

    run: function() {
        while (this.running) {
            var command = this.commands.shift();
            if (!command) {
                this.stop();
            }
            else {
                command(this.context);
            }
        }
    },

    start: function() {
        this.running = true;
        this.run();
    },

    stop: function() {
        this.running = false;
    },

    add: function(command) {
        this.commands.push(command);
    }
};

Core.onReady(function() {
    App.Sequencer.add(function(ctxt) {
        Core.log("First command. " + ctxt.firstCommandCalled);
        ctxt.firstCommandCalled = true;
    });
    App.Sequencer.add(function(ctxt) {
        Core.log("Second command. " + ctxt.firstCommandCalled);
    });
    App.Sequencer.start();
});
