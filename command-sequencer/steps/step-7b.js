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

App.Sequencer = (function() {
    var running = false;
    var commands = [];
    var context = {};
	var listeners = [];

	var sequencer = new App.EventPublisher();

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
