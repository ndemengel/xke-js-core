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
        if (this.running) {
            var command = this.commands.shift();
            if (!command) {
                this.stop();
            }
            else {
				// when a command is over, it is expected to call the callback method
				var callback = function() {
                	this.run();
				}

				// callback is bound to this object so that 'this' refers to it
                command(this.context, callback.bind(this));
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
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("First command. " + ctxt.firstCommandCalled);
        ctxt.firstCommandCalled = true;

		// command is over, calls callback function
		callback();
    });

	// adds an asynchronous command
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("Second (asynchronous) command. " + ctxt.firstCommandCalled);
        ctxt.secondCommandCalled = true;

		// will call the callback function in two seconds, asynchronously
		Core.delay(callback, 2000);
    });

	// will be called only after the callback function has been called for the previous command
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("Third command. " + ctxt.secondCommandCalled);
		callback();
    });

    App.Sequencer.start();

	// if App.Sequencer.stop() were called right here, the 3rd command would never execute, as the sequencer would have the ability to know about its new state during the asynchronous part of the second command
});
