## Material

- editor: use your favorite one: some known JS editors or IDEs are VIM, Notepad++, SublimeText 2, Eclipse, Aptana, JetBrains WebStorm, IntelliJ IDEA. Also you can use an online editor such as Cloud9 (provides syntactic coloration and error checking). Just avoid Notepad :-)
- you can rely on Core.jsc.js or Core.window.js to have base functions that work both within JSC or within your browser: Core.log(), Core.prompt(), Core.onReady(), Core.delay().

## Exercise 1: Array in JavaScript

Array is one of the base types provided by JavaScript. There are three ways to create an Array:

    var a = [elt_1, elt_2, ..., elt_n];
    var a = new Array(elt_1, elt_2, ..., elt_n);
    var a = new Array(size);

You can access elements this way:

    a[1]

You can add elements that ways:

    a[n + 1] = "hello";
    a.push("hello");

JavaScript Array can be used to represent a mapping as you would do with a hashtable:

    a["hello"] = "world";

You can get the length of an array like this:

    a.length

{{length}} is a writtable property!

    a.length = 10; // pad array with undefined or shrink it

Here are the available methods on an Array:

    // Mutators
    
    pop // get & remove last element
    push // add an element at the end
    reverse
    shift // get & remove the first element
    unshift // add an element at the beginning
    sort
    splice // add and/or remove an element from a list

    // Accessors
    
    concat
    join
    slice // get a sub-array
    toString
    indexOf // JS 1.6+
    lastIndexOf // JS 1.6+

There some iteration methods available, like filter, map, or reduce. But, these methods are only available since JS 1.6 or JS 1.8 and later.

If you have an JS version prior to 1.6 and want to use the iteration method, a good practise to create an Array wrapper that provides such methods. Here is a typical use of such a wrapper:

    arrayWrapper(myArray).filter(function (x) { return x > 10; })

Note: it may be a good idea to rename arrayWrapper into _.

**Question:** Create an Array wrapper that provides functions filter, map, reduce.


## Exercise 2: Command sequencer

**Summary:** Write a command sequencer that exposes the following methods: add(command: Object), start(), stop(). To be accepted by the sequencer, a command must have an id and must define the method execute(). The sequencer must execute the commands sequentially, one after the completion of the other.

**Steps:**

1. *\[Object literal\]* write a simple sequencer object - name it: CommandSequencer - capable of changing its internal state via the methods start() and stop().
2. *\[Namespace\]* what if another library defines an object with the same name? Define a namespace for your code _(attach any code of yours to a "master" object that is specific to your application)_.
3. *\[Array + Function call\]* write the method add() that accepts a command. A command is just a simple function. Once the sequencer is started, execute commands that are registered in order. Pass them a context object so they can collaborate (variation: give each command the result of the previous one). Write some commands to be executed by the sequencer.
4. *\[Asynchronicity\]* make your sequencer handle asynchronous commands by passing them a callback function to be called once they completed. Write an asynchronous command (use Core.delay(fn, timeInMillis)) to demonstrate it.
5. *\[Encapsulation\]* using a closure, hide the internal state of the sequencer.
6. *\[Events + Duck typing\]* make the sequencer accept listeners for the following events: the sequencer is started, the sequencer is stopped, a command is executed, a command completed. Write a listener that makes use of it to log events (use Core.log(), defined in Core.<env>.js). Give IDs to commands so that one can known which command is concerned by an event _(change your commands into objects providing the ID and a method "execute(callback, context)")_.
7. *\[Prototyping / Inheritance\]*
 - Extract the event publishing behavior to a dedicated object - name it: YourNamespace.EventPublisher. This object may be cloned to make a new one. Make the sequencer inherit from it _(use the publisher as a prototype for the sequencer)_.
 - Change the event publisher object into a class: write a constructor function for it and define its prototype. Now a publisher can be created with the keyword new. How can the sequencer still inherit from it? _(instantiate one publisher and use it directly as a base on which to build the sequencer, or make the publisher's prototype the prototype of your sequencer and call the publisher constructor on the sequencer instance)_.
 - Now, make the sequencer a class too so that several ones can be instantiated, but do not break the encapsulation of its internal state _(use varibales local to the constructor or write a factory method with local variables)_.

**Optionally:**

1. *\[Timeout\]* stop the execution in case an asynchronous command does not complete in a certain amount of time, and fire an event.
1. *\[DOM\]* using the sequencer, write commands to ask the user the name of a book (use Core.prompt()), retrieve the information related to this book from a server (use the App.Resource class to fake the request), and display it in a dedicated DIV of the web document.
1. *\[Errors\]* check that commands being added respect the contract previously defined, otherwise throw an error. Catch any error that might occur during the execution of a command ; should it happen, stop the sequencer.
1. Write a fork/join command in charge to execute other commands in parallel.
1. *\[Reflection\]* write a function that will enumerate all members (public properties and methods) of an object, but none of its prototype. Test it on an EventPublisher and on a CommandSequencer _(have a look at the for..in loop and at the various functions proposed by the object "Object")_.
