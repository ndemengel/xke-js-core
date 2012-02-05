if (!window.App) {
    window.App = {};
}
var App = window.App;

App.Sequencer = {
    running: false,
    commands: [],
    context: {},

    run: function() {
        if (this.running) {
            var command = this.commands.shift();
            if (!command) {
                this.stop();
            }
            else {
                command(this.context);
                this.run();
            }
        }
    },

    start: function() {
        this.running = true;
        this.run();
    },

    stop: function() {
        this.running = false;
    },

    add: function(command) {
        this.commands.push(command);
    }
};

Core.onReady(function() {
    App.Sequencer.add(function(ctxt) {
        console.log("First command. " + ctxt.firstCommandCalled);
        ctxt.firstCommandCalled = true;
    });
    App.Sequencer.add(function(ctxt) {
        console.log("Second command. " + ctxt.firstCommandCalled);
    });
    App.Sequencer.start();
});