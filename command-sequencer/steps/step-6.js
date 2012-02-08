"use strict"
// requires Core.<env>.js
// requires Core.common.js

var App = App;
if (typeof App === 'undefined') {
    App = {};
}

App.Sequencer = (function() {
    var running = false;
    var commands = [];
    var context = {};
	// will serve as a map (eventName => list of listeners)
	var listeners = {};

    function run() {
        if (running) {
            var command = commands.shift();
            if (!command) {
				stop();
            }
            else {
				// we assume that the command is a proper one and has both .id and .execute defined
				fire('commandlaunched', command.id);
                command.execute(context, function() {
					fire('commandexecuted', command.id);
                	run();
				});
            }
        }
    }

	// utility function to retrieve the list of listeners for a given event, creating it if it does not exist yet
	function listenersFor(eventName) {
		var ls = listeners[eventName];
		if (!ls) {
			ls = [];
			listeners[eventName] = ls;
		}
		return ls;
	}

	function fire(eventName, eventData) {
		listenersFor(eventName).forEach(function(listener) {
			// we could write listener(eventName, eventData);
			// but this way we prevent any unwanted use of 'this' inside the listener: it will be undefined
			listener.call(undefined, eventName, eventData);
		});
	}

	function stop() {
		running = false;
		fire('stop');
	}

	return {
		start: function() {
			fire('start');
			running = true;
			run();
		},

		stop: stop,

		addCommand: function(command) {
			commands.push(command);
		},

		addListener: function(eventNames, listener) {
			// this function accepts both a single event name and an array of event names
			if (typeof eventNames === 'string') {
				eventNames = [eventNames];
			}
			eventNames.forEach(function(eventName) {
				listenersFor(eventName).push(listener);
			});
		},

		removeListener: function(eventName, listener) {
			var ls = listenersFor(eventName);
			// Array.splice removes, adds, or replaces elements of the array, using indices
			// here, we replace 1 element from the desired index with nothing, i.e. we remove the element
			ls.splice(ls.indexOf(listener), 1);
		}
	};
})();

Core.onReady(function() {
	// binds the same listener to all events
	// a listener being a simple function, directly passed a reference to Core.logln that will log all arguments on separated lines
	App.Sequencer.addListener(['start', 'stop', 'commandlaunched', 'commandexecuted'], Core.logln);

    App.Sequencer.addCommand({
		id: 'firstCommand',
		execute: function(ctxt, callback) {
	        Core.log("First command. " + ctxt.firstCommandCalled);
	        ctxt.firstCommandCalled = true;
			callback();
		}
    });
    App.Sequencer.addCommand({
		id: 'secondCommand',
		execute: function(ctxt, callback) {
    	    Core.log("Second (asynchronous) command. " + ctxt.firstCommandCalled);
        	ctxt.secondCommandCalled = true;
			Core.delay(callback, 2000);
		}
    });
    App.Sequencer.addCommand({
		id: 'thirdCommand',
		execute: function(ctxt, callback) {
        	Core.log("Third command. " + ctxt.secondCommandCalled);
			callback();
		}
    });
    App.Sequencer.start();
});
