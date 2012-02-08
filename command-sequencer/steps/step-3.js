"use strict"
// requires Core.<env>.js
// requires Core.common.js

// this line just makes JSLint ignore the unknown 'App' variable
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
			// Array.shift removes the first element and returns it
            var command = this.commands.shift();
            if (!command) {
                this.stop();
            }
            else {
				// each command is passed a common context
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
		// write to the context
        ctxt.firstCommandCalled = true;
    });
    App.Sequencer.add(function(ctxt) {
		// read from the context
        Core.log("Second command. " + ctxt.firstCommandCalled);
    });
    App.Sequencer.start();
});
