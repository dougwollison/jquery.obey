/*
============= jQuery Obey =================
    An instruction processor for jQuery
===========================================

jQuery Obey is an "instruction processor",
it takes a list of instructions from the
server and attempts to execute them. Not
raw code, just names of functions and args
to pass to those functions.

Since it's for jQuery, it's namely for
the server to request manipulations to the
DOM, using whatever methods jQuery has. The
only limitation is you of course can't pass
a callback.

Instruction Format
------------------

// an array of instruction steps
[
	{
		type: // function, query, or a custom type
		target: // function name, query selector, etc.
		data: [
			// an array of args...
			arg1, arg2...
			// or jquery methods...
			method: [arg1, arg2...]..
		]
	}	
]

*/

(function($){
	// Make the value an array if not already
	function makeArray(value){
		return $.isArray(value) ? value : [value];
	}
	
	// Main function object, added to jQuery
	var Obey = $.Obey = function(instrns, scope){
		// Abort if invalid instructions are passed
		if(typeof instrns != 'object') return;
		
		// Default the scope to window
		if(!scope) scope = window;
		
		// Ensure the instructions are an array
		instrns = makeArray(instrns);
		
		// Go through each array and proceed accordingly
		$.each(instrns, function(i, instrn){
			// Abort if no type specified
			if(!instrn.type) return;
			
			// Find the matching instruction processor and call it
			if(Obey.methods[instrn.type]){
				Obey.methods[instrn.type].call(Obey, instrn, scope);
			}
		});
	};
	
	// Default methods for instruction processing
	Obey.methods = {
		// Process the instruction as a function
		func: function(instrn){
			var func = makeArray(instrn.target);
			var args = makeArray(instrn.data);
			
			// Abort if empty
			if(func.length == 0) return;
			
			// A function "address"
			var funcAddr = func;
			
			// Fail flag
			var fail = false;
			
			func = this.scope;
			// Starting at scope, "drill" down according to the array
			$.each(funcAddr, function(i, name){
				// Doesn't exist, set fail to true
				if(func[name] === undefined){
					fail = true;
					return;
				}
				
				func = func[name];
			});
			
			// Abort if fail flag is true
			if(fail) return;
			
			// Apply with the provided context
			func.apply(func, args);
		},
		
		// Process the instruction as a query
		query: function(instrn){
			// Get the jQuery object
			var $elm = $(instrn.target);
			var methods = instrn.data;
			
			// Go through each method and apply
			$.each(methods, function(method, args){
				args = makeArray(args);
				// Well be updating $elm every step, to simulate chaining
				$elm = $.fn[method].apply($elm, args);
			});
		}
	};
	
	// Utility method for adding processor methods
	Obey.addMethod = function(name, func){
		if(typeof name == 'object'){
			// Object of methods passed, add individually
			var methods = name;
			$.each(name, function(name, func){
				Obey.addMethod(name, func);	
			});
		}else{
			// Single method passed
			if(typeof func == 'function'){
				this.methods[name] = func;
			}
		}
		return this;
	};
})(jQuery);
