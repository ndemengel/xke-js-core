**Summary:** write a command sequencer that exposes the following methods: add(command: Object), start(), stop(). To be accepted by the sequencer, a command must have an id and must define the method execute(). The sequencer must execute the commands sequentially, one after the completion of the other.

**Material:**

- editor: use your favorite one: some known JS editors or IDEs are VIM, Notepad++, SublimeText 2, Eclipse, Aptana, JetBrains WebStorm, IntelliJ IDEA. Also you can use an online editor such as Cloud9 (provides syntactic coloration and error checking). Just avoid Notepad :-)
- you can rely on Core.jsc.js or Core.window.js to have base functions that works both within JSC or within your browser: Core.log(), Core.prompt(), Core.onReady(), Core.delay().

**Steps:**

1. *\[Object literal\]* write a simple sequencer object capable of changing its internal state via the methods start() and stop().
1. *\[Namespace\]* what if another library defines an object with the same name? Define a namespace for your code.
1. *\[Array + Duck typing\]* write the method add() that accepts a command. Once the sequencer is started, execute commands that are registered in order. Pass them a context object so they can collaborate (variation: give each command the result of the previous one).
1. Write some commands to be executed by the sequencer.
1. *\[Asynchronicity\]* make your sequencer handle asynchronous commands by passing them a callback function to be called once they completed. Write an asynchronous command (use setTimeout) to demonstrate it.
1. *\[Encapsulation\]* using a closure, hide the internal state of the sequencer.
1. *\[Events\]* make the sequencer accept listeners for the following events: the sequencer is started, the sequencer is stopped, a command is executed, a command completed. Write a logger that makes use of it (use the functions defined in Core.js).
1. *\[Prototyping / Inheritance\]*
 - Extract the event publishing behavior to a dedicated object. This object can be cloned to have a new one. Make the sequencer inherit from it (use the publisher as the prototype of the sequencer).
 - Change the event publisher object into a class: write a constructor function for it and define its prototype. Now a publisher can be created with the keyword new. How can the sequencer still inherit from it? (instantiate one publisher and use it as the prototype of the sequencer).
 - Now, make the sequencer a class too so that several ones can be instantiated, but do not break the encapsulation of its internal state (provide a factory method instead of a constructor).
 - Discussion: many possibilities for classes and inheritance, is it worth it?.
1. *\[Timeout\]* stop the execution in case an asynchronous command does not complete in a certain amount of time, and fire an event.
1. *\[DOM\]* Using the sequencer, write commands to ask the user the name of a book, retrieve the information related to this book from the server (use the App.Resource class to fake the request), and display it in a dedicated DIV of the page.

**Optionally:**

1. *\[Errors\]* check that commands being added respect the contract previously defined, otherwise throw an error. Catch any error that might occur during the execution of a command ; should it happen, stop the sequencer.
1. Write a fork/join command in charge to execute other commands in parallel.