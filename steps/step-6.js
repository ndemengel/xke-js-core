// requires Core.<env>.js
// requires Core.common.js

if (typeof App === 'undefined') {
    App = {};
}

App.Sequencer = (function() {
    var running = false;
    var commands = [];
    var context = {};
	var listeners = [];

    function run() {
        if (running) {
            var command = commands.shift();
            if (!command) {
				stop();
            }
            else {
				fire('commandlaunched', command.id);
                command.execute(context, function() {
					fire('commandexecuted', command.id);
                	run();
				});
            }
        }
    }

	function fire(eventName, eventData) {
		listenersFor(eventName).forEach(function(listener) {
			listener.call(undefined, eventName, eventData);
		});
	}

	function listenersFor(eventName) {
		var ls = listeners[eventName];
		if (!ls) {
			ls = [];
			listeners[eventName] = ls;
		}
		return ls;
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
			if (typeof eventNames === 'string') {
				eventNames = [eventNames];
			}
			eventNames.forEach(function(eventName) {
				listenersFor(eventName).push(listener);
			});
		},

		removeListener: function(eventName, listener) {
			var ls = listenersFor(eventName);
			ls.splice(ls.indexOf(listener), 1);
		}
	};
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
