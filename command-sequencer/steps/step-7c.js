"use strict"
// requires Core.<env>.js
// requires Core.common.js

var App = App;
if (typeof App === 'undefined') {
    App = {};
}

App.EventPublisher = function() {
    var listeners = {};

    function listenersFor(eventName) {
        var ls = listeners[eventName];
        if (!ls) {
            ls = [];
            listeners[eventName] = ls;
        }
        return ls;
    }

    this.fire = function(eventName, eventData) {
        listenersFor(eventName).forEach(function(listener) {
            listener.call(undefined, eventName, eventData);
        });
    }

    this.addListener = function(eventNames, listener) {
        if (typeof eventNames === 'string') {
            eventNames = [eventNames];
        }
        eventNames.forEach(function(eventName) {
            listenersFor(eventName).push(listener);
        });
    };

    this.removeListener = function(eventName, listener) {
        var ls = listenersFor(eventName);
        ls.splice(ls.indexOf(listener), 1);
    };
};

// an example that uses a factory method is provided in command-sequencer/a-solution/CommandSequencer.js
App.Sequencer = function() { // constructor
	// calls "super" constructor (gives this object the properties of a publisher)
	App.EventPublisher.call(this);

	// private members
   	var running = false;
   	var commands = [];
   	var context = {};
	var listeners = [];

	// avoids having to bind run() to 'this' each time we call it
	// reference to 'this' is stored in 'self'
	var self = this;
    function run() {
		if (running) {
           	var command = commands.shift();
           	if (!command) {
				self.stop();
       		}
           	else {
				self.fire('commandlaunched', command.id);
               	command.execute(context, function() {
					self.fire('commandexecuted', command.id);
               		run();
				});
           	}
       	}
   	}

	// public members
	Core.apply(this, {
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
}

// officially defines App.EventPublisher as the prototype of Sequencer
// also adds any property defined on the publisher's prototype to this prototype (none in this particular case)
App.Sequencer.prototype = App.EventPublisher.prototype;	

Core.onReady(function() {
	var sequencer = new App.Sequencer();

	sequencer.addListener(['start', 'stop', 'commandlaunched', 'commandexecuted'], Core.logln);

    sequencer.addCommand({
		id: 'firstCommand',
		execute: function(ctxt, callback) {
	        Core.log("First command. " + ctxt.firstCommandCalled);
	        ctxt.firstCommandCalled = true;
			callback();
		}
    });
    sequencer.addCommand({
		id: 'secondCommand',
		execute: function(ctxt, callback) {
    	    Core.log("Second (asynchronous) command. " + ctxt.firstCommandCalled);
        	ctxt.secondCommandCalled = true;
			Core.delay(callback, 2000);
		}
    });
    sequencer.addCommand({
		id: 'thirdCommand',
		execute: function(ctxt, callback) {
        	Core.log("Third command. " + ctxt.secondCommandCalled);
			callback();
		}
    });
    sequencer.start();
});
