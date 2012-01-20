var SCOPE = this;

var App = {
	log: function() {
		print(Array.prototype.join.call(arguments, ', '));
	},

	prompt: function() {
		print(arguments[0]);
		return readline.call(SCOPE);
	},

	onReady: function(fn) {
		fn.call(undefined);
	}
};
