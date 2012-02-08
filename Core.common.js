"use strict"
// requires Core.<env>.js

/* Polyfills */

if (!Function.prototype.bind) {
	Function.prototype.bind = function(scope) {
		var self = this;
		return function() {
			return self.apply(scope, arguments);
		};
	};
}


/**
 * Performs a shallow copy of all properties of arguments 2 to n (the source objects) to argument 1 (the destination object), and return argument 1.
 */
Core.apply = function(dest) {
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

	return dest;
};

Core.stringify = function(o, d) {
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
					props.push(p + ': ' + Core.stringify(val, depth + 1));
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
};

/**
 * Same as Core.log() but also prints an additional line.
 */
Core.logln = function() {
	Core.log.apply(undefined, arguments);
	Core.log('\n');
};

/**
 * A fake resource class.
 */
Core.Resource = (function() {
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

