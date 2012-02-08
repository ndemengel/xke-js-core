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
                command(this.context, function() {
                	this.run();
				}.bind(this));
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
		callback();
    });
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("Second (asynchronous) command. " + ctxt.firstCommandCalled);
        ctxt.secondCommandCalled = true;
		Core.delay(callback, 2000);
    });
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("Third command. " + ctxt.secondCommandCalled);
		callback();
    });
    App.Sequencer.start();
});
