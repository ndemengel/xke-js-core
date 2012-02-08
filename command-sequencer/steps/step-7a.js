"use strict"
// requires Core.<env>.js
// requires Core.common.js

var App = App;
if (typeof App === 'undefined') {
    App = {};
}

// the publishing behavior is exported to a classic object
App.EventPublisher = {
	listeners: {},
	fire: function(eventName, eventData) {
		this.listenersFor(eventName).forEach(function(listener) {
			listener.call(undefined, eventName, eventData);
		});
	},

	listenersFor: function(eventName) {
		var ls = this.listeners[eventName];
		if (!ls) {
			ls = [];
			this.listeners[eventName] = ls;
		}
		return ls;
	},

	addListener: function(eventNames, listener) {
		if (typeof eventNames === 'string') {
			eventNames = [eventNames];
		}
		eventNames.forEach(function(eventName) {
			this.listenersFor(eventName).push(listener);
		}.bind(this));
	},

	removeListener: function(eventName, listener) {
		var ls = this.listenersFor(eventName);
		ls.splice(ls.indexOf(listener), 1);
	}
};

App.Sequencer = (function() {
    var running = false;
    var commands = [];
    var context = {};
	var listeners = [];

	// the sequencer uses the publisher object as a prototype
	var sequencer = Object.create(App.EventPublisher);

    function run() {
        if (running) {
            var command = commands.shift();
            if (!command) {
				sequencer.stop();
            }
            else {
				sequencer.fire('commandlaunched', command.id);
                command.execute(context, function() {
					sequencer.fire('commandexecuted', command.id);
                	run();
				});
            }
        }
    }

	// Core.apply applies all properties of the second argument to the first one (and returns the first argument)
	// it is equivalent to: sequencer.start = function() {..}; sequencer.stop = function() {..}, etc.
	return Core.apply(sequencer, {
		start: function() {
			this.fire('start');
			running = true;
			run();
		},

		stop: function() {
			running = false;
			this.fire('stop');
		},

		addCommand: function(command) {
			commands.push(command);
		}
	});
})();

Core.onReady(function() {
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
