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

App.CommandSequencer = {
    create: function() {
        var that = Object.create(App.EventPublisher.prototype);
        App.EventPublisher.call(that);

        // private members
        var running = false;
    	var commands = [];
    	var context = {};

    	function run() {
    		if (running) {
    			var command = commands.shift();
    			if (command === undefined) {
    				that.stop();
    				return;
    			}

    			that.fire('commandstart', {commandId: command.id});
    			try {
    				command.execute(function (result) {
    					if (result.success) {
    						that.fire('commandcompletion', {commandId: command.id, result: result});
    						run();
    					}
    					else {
    						that.fire('commandfailure', {commandId: command.id, result: result});
    					}
    				}, context);
    			}
    			catch (e) {
    				that.fire('commandfailure', {commandId: command.id, error: e});
    			}
    		}
    	}

    	return Core.apply(that, {
    		add: function(command) {
    			if (command === null || command === undefined) {
    				throw {message: 'Invalid command. Commands must not be null.', command: command};
    			}
    			if (typeof command.execute !== 'function' || typeof command.id !== 'string') {
    				throw {message: 'Invalid command. Commands must respect the contract: {id: String, execute(callback: function}: function}', command: command};
    			}
    			commands.push(command);
    		},

    		start: function() {
    			if (!running) {
                    running = true;
                    this.fire('started');
                    run();
    			}
    		},

    		stop: function() {
    			running = false;
                this.fire('stopped');
    		}
    	});
    }
};

Core.onReady(function() {
    var sequencer = App.CommandSequencer.create();
	sequencer.add({
		id: 'User prompt',
		execute: function(callback, context) {
			var userVal = Core.prompt('Please enter the name of a book');
			if (typeof userVal !== 'string') {
				callback({success: false, reason: "Action cancelled by user"});
			}
			else {
				context.bookName = userVal;
				callback({success: true});
			}
		}
	});

	sequencer.add({
		id: 'Info retrieval',
		execute: function(callback, context) {
			new Core.Resource('book', context.bookName).get(function(response) {
				if (response.success) {
					context.book = response.data;
					callback({success: true});
				}
				else {
					callback({success: false, reason: response.error});
				}
			});
		}
	});

	sequencer.add({
		id: 'Document update',
		execute: function(callback, context) {
			var descriptionDiv = document.getElementById('bookDescription');
			if (descriptionDiv === null) {
				callback({success: false, reason: "No element found with id 'bookDescription'"});
			}
			else {
				descriptionDiv.innerHTML = context.book.description;
				callback({success: true});
			}
		}
	});

	var listener = function(eventName, e) {
		Core.log(eventName, e);
	};

	sequencer.addListener(['commandstart', 'commandcompletion'], listener);
    sequencer.addListener(['commandfailure', 'started', 'stopped'], listener);

	sequencer.start();
});
