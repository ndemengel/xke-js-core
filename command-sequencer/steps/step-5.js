"use strict"
// requires Core.<env>.js
// requires Core.common.js

var App = App;
if (typeof App === 'undefined') {
    App = {};
}

// defines a closure. The parentheses wrapping the function are not mandatory but are a clue that this function is anonymous and will be called immediatly
App.Sequencer = (function() {
	// those are variables local to the function
    var running = false;
    var commands = [];
    var context = {};

	// this function is also local to the surrounding function
    function run() {
        if (running) {
            var command = commands.shift();
            if (!command) {
                running = false;
            }
            else {
                command(context, function() {
                	run();
				});
            }
        }
    }

	// the method of the returned object are public
	// they also beneficiate from this function's context and therefore have access to its local variables, which are invisible from the outside
	return {
		start: function() {
			running = true;
			run();
		},

		stop: function() {
			running = false;
		},

		add: function(command) {
			commands.push(command);
		}
	};
})();

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
