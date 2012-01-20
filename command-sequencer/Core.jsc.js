var SCOPE = this;

var Core = {
    log: (function() {
        function stringify(o, d) {
            var depth = d || 0;
            if (o === undefined) {
                return "undefined";
            }
            if (o === null) {
                return "null";
            }
            if (typeof o === 'object') {
                if (typeof o.length === 'number' && typeof o.join === 'function') {
                    return '[' + o.join(', ') + ']';
                }
                else {
                    var props = [];
                    for (var p in o) {
                        var val = o[p];
                        if (typeof o[p] !== 'function') {
                            props.push(p + ': ' + stringify(val, depth + 1));
                        }
                    }

                    if (props.length === 0) {
                        return '{}';
                    }

                    var tabs = [];
                    for (var i = 0; i < depth; i++) {
                        tabs.push('\t');
                    }
                    tabs = tabs.join('');
                    return ['{\n', tabs, '\t', props.join(', '), '\n', tabs, '}'].join('');
                }
            }
            return o.toString();
        }

    	return function() {
            var args = [];
            Array.prototype.forEach.call(arguments, function(arg) {
                args.push(stringify(arg));
            });
            print(args.join(';\n'));
        };
	})(),

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