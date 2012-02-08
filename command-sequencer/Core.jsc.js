var SCOPE = this;

var Core = {
    log: function() {
        var args = [];
        Array.prototype.forEach.call(arguments, function(arg) {
            args.push(Core.stringify(arg));
        });
        print(args.join(';\n'));
    },

	prompt: function() {
		print(arguments[0]);
		return readline.call(SCOPE);
	},

	onReady: function(fn) {
		fn.call(undefined);
	},

    delay: function(fn) {
        fn.call(undefined);
    }
};

