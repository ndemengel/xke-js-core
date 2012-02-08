var Core = {
	log: function() {
        var args = [];
        Array.prototype.forEach.call(arguments, function(arg) {
            args.push(Core.stringify(arg));
        });

        if (console && console.log) {
            console.log(args.join(';\n'));
        }
        else {
            window.alert(args.join(';\n'));
        }
    },

	prompt: function() {
		return window.prompt.apply(window, arguments);
	},

	onReady: function(fn) {
        if (document.readyState === 'complete') {
            fn.call(undefined);
        }
        else {
            // document.addEventListener('DOMContentLoaded', fn, false);
            window.addEventListener("load", fn, false);
        }
	},

    delay: function() {
        window.setTimeout.apply(window, arguments);
    }
};
