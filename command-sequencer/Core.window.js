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

            if (console && console.log) {
                console.log(args.join(';\n'));
            }
            else {
                window.alert(args.join(';\n'));
            }
        };
	})(),

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
