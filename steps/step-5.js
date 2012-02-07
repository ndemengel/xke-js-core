// requires Core.<env>.js
// requires Core.common.js

if (typeof App === 'undefined') {
    App = {};
}

App.Sequencer = (function() {
    var running = false;
    var commands = [];
    var context = {};

    function run() {
        if (running) {
            var command = commands.shift();
            if (!command) {
                running = false;
            }
            else {
                command(context, function() {
                	run();
				});
            }
        }
    }

	return {
		start: function() {
			running = true;
			run();
		},

		stop: function() {
			running = false;
		},

		add: function(command) {
			commands.push(command);
		}
	};
})();

Core.onReady(function() {
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("First command. " + ctxt.firstCommandCalled);
        ctxt.firstCommandCalled = true;
		callback();
    });
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("Second (asynchronous) command. " + ctxt.firstCommandCalled);
        ctxt.secondCommandCalled = true;
		Core.delay(callback, 2000);
    });
    App.Sequencer.add(function(ctxt, callback) {
        Core.log("Third command. " + ctxt.secondCommandCalled);
		callback();
    });
    App.Sequencer.start();
});
