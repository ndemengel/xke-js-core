// requires Core.<env>.js

var App = {
    /**
     * Performs a shallow copy of all properties of arguments 2 to n (the source objects) to argument 1 (the destination object).
     */
    apply: function(dest) {
        if (arguments.length < 2) {
            return dest;
        }

        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(src) {
            for (var p in src) {
                if (src.hasOwnProperty(p)) {
                    dest[p] = src[p];
                }
            }
        });
    }
};

/**
 * A fake resource class.
 */
App.Resource = (function() {
	var R = function(path, resourceId) {
		this.path = path;
		this.resourceId = resourceId;
	};
	R.prototype = {
		get: function(callback) {
            Core.delay(function() {
    			callback.call(undefined, {
    				success: true,
    				data: {
    					name: this.resourceId,
    					description: "Description of " + this.resourceId
    				}
    			});
            }.bind(this), 1000);
		}
	};

	return R;
})();

App.EventPublisher = function() {
    this.listeners = {};
};
App.EventPublisher.prototype = {
    fire: function(eventName, eventData) {
        var listenersForEvent = this.listeners[eventName];
        if (listenersForEvent !== undefined) {
            listenersForEvent.forEach(function(listener) {
                listener.call(undefined, eventName, eventData);
            });
        }
    },

    addListener: function(eventNames, listener) {
        if (typeof eventNames === 'string') {
            eventNames = [eventNames];
        }
        eventNames.forEach(function(eventName) {
            if (this.listeners[eventName] === undefined) {
    			this.listeners[eventName] = [];
    		}
    		this.listeners[eventName].push(listener);
        }.bind(this));
	},

	removeListener: function(eventName, listener) {
		var listenersForEvent = this.listeners[eventName];
		if (listenersForEvent !== undefined) {
			var idx = listenersForEvent.indexOf(listener);
            listenersForEvent.splice(idx, 1);
		}
	}
};

App.CommandSequencer = {
    create: function() {
        var that = Object.create(new App.EventPublisher());

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

    	App.apply(that, {
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

        return that;
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
			new App.Resource('book', context.bookName).get(function(response) {
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
