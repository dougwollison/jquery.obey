jQuery.Obey
===========

*An instruction processor for jQuery*

jQuery Obey is an "instruction processor", it takes a list of instructions from the server and attempts to execute them. Not raw code, just names of functions and args to pass to those functions.

Since it's for jQuery, it's namely for the server to request manipulations to the DOM, using whatever methods jQuery has. The only limitation is you of course can't pass a callback.

Instruction Format
------------------

The JSON data the server sends to Obey for processing should be an array of objects, although a plain object will be accepted as a single instruction.

Every instruction object should have 3 components; type, target, and data (and optionaly context). Type specifies what processor method should be used; either a function or a query (jQuery object). Target identifies the subject of the instructions; either a function name/address, or a jQuery selector. Finally, the data object will hold either an array of arguments for the function, or an object of methods to apply to the jQuery object. The optional context field is name or address to an object that will server as the `this` context when applying the function (defaults to `null`).

When dealing with functions, you can pass an array for the target/context, with the names of the parent objects to drill down through to get to the function you want to make. For example: to acces `jQuery.ajax`, pass `['jQuery', 'ajax']` as the "address".

Extending
---------

You can add custom processor methods to for Obey to use via the `addMethod` function, passing either a name and a callback, or an name-keyed object of callbacks. These methods will be passed any instructions whose type matches their name.

Usage
-----

Via AJAX or WebSockets, setup your script to recieve instructions from the server, then call `$.Obey`, passing the instructions JSON to it, along with possibly the scope to use (default is `window`).

Setting the Scope
-----------------

When expanding function/context addresses, jQuery by default drills down starting at `window`, but you can pass a different object to use at call time as the scope, just ensure that it covers all the functions your server's instructions could possibly request.
