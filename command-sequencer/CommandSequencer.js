if (typeof App === 'undefined') {
	var App = (function() {

		return {
			log: function() {
				throw 'App.log() is not implemented';
			},

			prompt: function() {
				throw 'App.prompt() is not implemented';
			},

			onReady: function() {
				throw 'App.onReady is not implemented';
			}
		};
	})();
}

(function() {
	App.Resource = (function() {
		var R = function(path, resourceId) {
			this.path = path;
			this.resourceId = resourceId;
		};
		R.prototype = {
			get: function(callback) {
				callback.call(undefined, {
					success: true,
					data: {
						name: this.resourceId,
						description: "Description of " + this.resourceId
					}
				});
			}
		};

		return R;
	})();

	App.CommandSequencer = (function() {
		var running = false;
		var commands = [];
		var context = {};
		var listeners = {};

		function run() {
			if (running) {
				var command = commands.shift();
				if (command == null) {
					running = false;
					return;
				}

				fire('commandstart', {commandId: command.id});
				try {
					command.execute(function(result) {
						if (result.success) {
							fire('commandcompletion', {commandId: command.id, result: result});
							run();
						}
						else {
							fire('commandfailure', {commandId: command.id, result: result});
						}
					}, context);
				} catch (e) {
					fire('commandfailure', {commandId: command.id, error: e});
				}
			}
		}

		function fire(eventName, eventData) {
			var listenersForEvent = listeners[eventName];
			if (listenersForEvent !== undefined) {
				listenersForEvent.forEach(function(listener) {
					listener.call(undefined, eventName, eventData);
				});
			}
		}

		return {
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
					run();
				}
			},

			stop: function() {
				running = false;
			},

			addListener: function(eventName, listener) {
				if (listeners[eventName] === undefined) {
					listeners[eventName] = [];
				}
				listeners[eventName].push(listener);
			},

			removeListener: function(eventName, listener) {
				var listenersForEvent = listeners[eventName];
				if (listenersForEvent !== undefined) {
					listenersForEvent.remove(listener); // remove(o)?
				}
			}
		};
	})();
})();

App.onReady(function() {
	App.CommandSequencer.add({
		id: 'User prompt',
		execute: function(callback, context) {
			var userVal = App.prompt('Please enter the name of a book');
			if (typeof userVal !== 'string') {
				callback({success: false, reason: "Action cancelled by user"});
			}
			else {
				context.bookName = userVal;
				callback({success: true});
			}
		}
	});

	App.CommandSequencer.add({
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

	App.CommandSequencer.add({
		id: 'Document update',
		execute: function(callback, context) {
			var descriptionDiv = document.getElementById('bookDescription');
			if (descriptionDiv == null) {
				callback({success: false, reason: "No element found with id 'bookDescription'"});
			}
			else {
				descriptionDiv.innerHTML = context.book.description;
				callback({success: true});
			}
		}
	});

	var listener = function(eventName, e) {
		App.log(eventName, e.commandId, e.result ? e.result.reason : e);
	};
	//App.CommandSequencer.addListener('commandstart', listener);
	//App.CommandSequencer.addListener('commandcompletion', listener);
	App.CommandSequencer.addListener('commandfailure', listener);

	App.CommandSequencer.start();
});
