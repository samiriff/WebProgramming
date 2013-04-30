//! include /ui/juic/js/Util.js
//
// Start of $Id: component.js 275862 2013-03-11 06:18:27Z sramteare $
//
//

// Define a JUIC namespace if need be that we can slowly start using
// if and when we want to ensure that what we are defining will not
// conflict with other libraries
var juic;
if (!juic) {
    juic = {};
}

// This file created a global hash-map of view components
// hence Component JS should only be loaded once
if (!juic.isComponentJSLoaded) {

/**
 * Dump any object to a string. This is similar to JSON.stringify(obj)
 * 
 * @param {*} obj Any object to dump to a string.
 * @return {string} The string representation of obj
 */
juic.dump = function (obj) {

    function quote(str) {
        return '"' + str.replace(/([\"\\])/g, '\\$1').replace(/\r\n?|\n/g, '\\n') + '"';
    }


    switch (typeof obj) {
        case 'object':
            if (obj) {
                switch (obj.constructor) {
                    case Array:
                        var tmp = [];

                        for (var i = 0; i < obj.length; ++i) {
                            tmp[i] = juic.dump(obj[i]);
                        }

                        return '[' + tmp.join() + ']';

                    case Date:
                        return 'new Date(' + obj.getFullYear() + "," + obj.getMonth() + "," + obj.getDate() + ")";

                    default:
                        var tmp = [];

                        for (var i in obj) {
                            tmp.push(quote(i) + ":" + juic.dump(obj[i]));
                        }

                        return "{" + tmp.sort().join() + "}";
                }
            } else {
                return 'null';
            }

        case 'unknown':
        case 'undefined':
            return 'undefined';
        case 'number':
            return obj;
        case 'string':
            return quote(obj);
        case 'function':
            return '"function"';


        default:
            return String(obj);
    }
};

/**
 * Assert that a condition is true.
 * 
 * @param {boolean} cond The condition to check
 * @param {string} msg The message to display if the condition is false
 */
juic.assert = function (cond, msg) {
    if (!cond) {
        alert('Assertion failed: ' + msg);
    }
};

/**
 * Relinquish JUIC's control of the "$" global variable,
 * which is useful when using JUIC with JavaScript libraries
 * that use "$" as a global function or variable.
 * 
 * Once this is invoked, you can still invoke "juic.$" to get
 * what you would normally have gotten with JUIC if you had
 * invoked "$" and this function was not previously invoked.
 * 
 * (Note that this function follows the same API contract as
 * jQuery's "noConflict" function, except that this function
 * deals with JUIC's usage of "$".)
 */
juic.noConflict = function () {
    // Is the "$" global variable what JUIC previously assigned?
    if (window.$ === juic.$) {
        window.$ = juic._$;
        delete juic._$; // (We don't need "juic._$" any more, so get rid of it...)
    }
};

// Map over "$" to "juic._$" in case we're about to overwrite it in the next block of code
juic._$ = window.$; // (If "$" isn't defined, find by us -- we still can assign undefined to "juic._$"...)

/**
 * A shortcut for document.getElementById.
 * @param {string} id The id of the element
 * @returns {HTMLElement} The html element returned by document.getElementById
 */
juic.$ = function (id) {
    return ("string" == typeof id) ? document.getElementById(id) : id;
};

/**
 * This is the inheritance mechanism. It essentially takes the first argument
 * obj and adds to it all the properties of the second argument, vals.
 *
 * @param {Object} obj  the base class instance
 * @param {Object} vals the additional properties to be added to the base class
 * @return {Object} the same base class instance but with the additional properties added.
 */
juic.set = function (obj, vals) {

    for (var f in vals) {
        var o = obj[f], v = vals[f];

        if (("object" == typeof v) && o) {
            juic.set(o, v);
        }
        else {
            obj[f] = v;
        }
    }

    return obj;
};

// DO NOT add any code between these 2 functions

(function() {
    /**
     * Use this method to extend a parent class.
     * 
     * @param {Function} childClass The child class
     * @param {Function} parentClass The parent class to extend
     * @param {Object} overrides The overrides to attach to the child prototype
     */
    function extend(childClass, parentClass, overrides) {
        var _super = parentClass.prototype;

        /**
         * @inner
         * @constructor
         */
        function Parent() {}
        Parent.prototype = _super;
        var proto = juic.set(new Parent(), overrides);

        if (FN_TEST.test(childClass)) {
            // The top level _super function is for the constructor
            proto._super = function() {
                this._super = arguments.callee._super;
                parentClass.apply(this, arguments);
                this._super = arguments.callee;
            }
            proto._super._super = _super._super;
        }

        // Functions in the child will be overridden
        for ( var name in overrides) {
            // Only override this property if both the child and parent contain
            // this function and the code in the child function references
            // _super in some way
            if (typeof proto[name] == 'function' && typeof _super[name] == 'function' && FN_TEST.test(overrides[name])) {
                var superFn = _super[name];
                proto[name] = (function(name, fn) {
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, proto[name]);
            }
        }

        childClass.prototype = proto;
    }

    // This will be a regex that checks the code of a function for
    // a reference to _super - but only if converting a function
    // to string is supported by the browser.
    var FN_TEST = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;

    // Expose the extend function to the global namespace
    juic.extend = extend;
})();

/**
 * Use this method to escape some html.
 * 
 * @param {string} text The text to escape
 * @param {string=} nl The html to replace the new line characters
 * @param {string=} empty The html to use if the input text is empty
 * @returns {string} The escaped html
 */
juic.escapeHTML = function (text,nl,empty) {
  if (typeof nl != 'string') nl = "\n";
  if (typeof empty != 'string') empty = "";

  return ((text||"").toString().
    replace(/&/g,'&amp;').
    replace(/</g,'&lt;').
    replace(/>/g,'&gt;').
    replace(/\"/g,'&quot;').
    replace(/\'/g,'&#39;').
    replace(/\n|\r\n?/g, nl)) || empty;
};

/** 
 * Use this method to escape some html if needed 
 * 
 * @param {string} text The text to escape 
 * @param {boolean} needsEscaping Specifies whether to do the escaping or not 
 * @returns {string} The escaped html if needed; otherwise, the original text 
 */ 
juic.escapeHTMLIfNeeded = function (text,needsEscaping) { 
  return needsEscaping ? juic.escapeHTML(text) : text; 
}; 



/**
 * EventTarget is an object that can have event listeners and dispatch
 * events to those listeners.  It is the base class of Component.
 * This method is safe to call at each prototype level to allow for
 * sub-componenents to add additional events to the list of allowed
 * ones.
 *
 * <p>
 * Example usage:
 * <pre>
 * var example = new EventTarget(["change", "action"]);
 * example.addEventListener("change", listener); // OK
 * example.addEventListener("action", listener); // OK
 * example.addEventListener("other", listener); // Assertion Failure!
 * </pre>
 * </p>
 *
 * <p>
 * Note: if the "eventTypes" argument is null or not present, then
 * there will not be any restrictions on the event types dispatched by
 * this object. (This is primarily for backwards compatibility)
 * </p>
 *
 * @constructor
 * @param {Array.<string>} eventTypes an optional array of strings that specifies what
 * types of events this EventTarget will dispatch.
 */
juic.EventTarget = function (eventTypes) {
    juic.assert(arguments.length <= 1, "Too many arguments to EventTarget");
    juic.assert("null" == typeof eventTypes || "undefined" == typeof eventTypes || eventTypes.constructor == Array,
           "eventTypes argument to EventTarget must be an array or null");

    if (eventTypes) {
        // if we are adding new event type restrictions, we always
        // have to make a copy of the existing _allowedEvents object
        // and replace it.  This is because the object could be on the
        // prototype, and we want to avoid overriding functionality
        // shared in another event target.

        var allowedEvents = {};
        if (this._allowedEvents) {
            juic.set(allowedEvents, this._allowedEvents);
        }

        for (var i=0, n=eventTypes.length ; i<n ; i++) {
            juic.assert(juic.EventTarget.isValidEventType(eventTypes[i]), "Invalid event type name in EventTarget: "+eventTypes[i]);
            allowedEvents[eventTypes[i]] = 1;
        }

        // replace the existing (or mask the prototype) with the new
        // events type cache.
        this._allowedEvents = allowedEvents;
    }
};

juic.EventTarget.isValidEventType = function(type) {
    return ("string" == typeof type) && !/^on/.test(type);
};

/**
 * The event object.
 * 
 * @constructor
 * @param {string} type The type for the event
 * @param {Object=} data Extra data to store in the event
 */
juic.EventTarget.Event = function(type, data) {
    juic.set(this, data).type = type;
};

juic.EventTarget.prototype = (function() {
    /**
     * @inner
     */
    function validEvents(obj) {
        var list = [];
        for (var name in obj._allowedEvents) {
            list.push(name);
        }
        return list.join(", ");
    }

    return /** @lends EventTarget.prototype */ {
        /**
         * @param {string} type The type to use for the event
         * @param {EventTarget} handler The handler for this event
         * @param {string=} callback Optional function name for the callback
         */
        addEventListener : function(type, handler, callback) {
            juic.assert(juic.EventTarget.isValidEventType(type), "Invalid event type name in addEventListener: "+type);
            juic.assert(!this._allowedEvents || this._allowedEvents[type], "Event type '"+type+"' (within addEventListener) is not dispatched by this object, valid events are: "+validEvents(this));
            juic.assert(handler, "handler is null in addEventListener");
            if (callback) {
                juic.assert(handler[callback], "Invalid callback in addEventListener, does not exist on handler.");
            } else {
                juic.assert(handler.handleEvent && "function" == typeof handler.handleEvent,
                       "Event handler does not provide handleEvent function in addEventListener");
            }

            // Each component has a lazily constructed associative array
            // called "_events" that maps event types to an array of
            // handlers for that type.  The "_events" array is NOT part of
            // the public or protected API and should not be accessed
            // directly.

            // Get or create the _events object
            var evts = this._events || (this._events = {});

            // Get or create the event array, and append the new handler.
            (evts[type] || (evts[type] = [])).push(
                {
                    handler: handler,
                    callback: callback ? callback : null
                }
            );
            
        },
        /**
         * Removes a previously added event handler added through
         * addEventListener.
         *
         * @param {string} type the type of the event
         * @param {Object} handler the handler to remove
         * @return void
         */
        removeEventListener : function(type, handler) {
            var allEvts = this._events, evts;
            if (allEvts && (evts = allEvts[type])) {
                for (var i = evts.length; --i >= 0;) {
                    if (evts[i].handler === handler) {
                        evts.splice(i, 1);
                    }
                }
                if (!evts.length) {
                    delete allEvts[type];
                }
            }
        },
        /**
         * Dispatches an event to all registered event listeners of the
         * event's type.  This method is normally only called by the
         * implemenation of the component itself, but it is part of the
         * public API, and may be used to simulate an event being fired by
         * the component.
         *
         * @param {EventTarget.Event} evt the event to fire.  This should be
         * constructed using the Event constructor, and the "type" field
         * must be defined and valid.
         * @return void
         */
        dispatchEvent : function(evt) {
            juic.assert(evt && evt.constructor == juic.EventTarget.Event, "Attempt to dispatch non-Event: " + evt);
            juic.assert(juic.EventTarget.isValidEventType(evt.type), "Invalid event type name in dispatchEvent: "+evt.type);
            juic.assert(!this._allowedEvents || this._allowedEvents[evt.type], "Event type '"+evt.type+"' (within dispatchEvent) is not dispatched by this object, valid events are: "+validEvents(this));

            evt.target = this;

            var evts = this._events;
            if (evts && (evts = evts[evt.type])) {

                // iterate over a copy of the events array.  This allows
                // removeEventListener to be called by the event handler without
                // disrupting the dispatch.
                var tmp = evts.slice(0);
                var ex;

                for (var i = 0; i < tmp.length; ++i) {
                    try {
                        var handler = tmp[i].handler;
                        var callback = tmp[i].callback;
                        if (callback) {
                            handler[callback](evt);
                        } else {
                            handler.handleEvent(evt);
                        }
                    } catch (e) {
                        ex = e;
                        if (typeof juic.Logger != 'undefined') {
                            juic.Logger.error("Uncaught exception", ex);    
                        } else {
                            eval("debugger");
                        }
                    }
                }

                if (ex) throw ex;
            }
        },

        /**
         * This is shorthand for this.dispatchEvent(new Component.Event(type, data))
         *
         * @param {string} type the event type to dispatch
         * @param {Object=} data additional name/value pairs to attach to the event
         */
        dispatch : function(type, data) {
            this.dispatchEvent(new juic.EventTarget.Event(type, data));
        }

    };
})();

/**
 * The constructor for JUIC Component prototype objects.
 *
 * @constructor
 * @extends EventTarget
 * @param eventType an optional argument to restrict what types of
 * events this object will dispatch.  It is recommended that this
 * argument be provided.  See EventTarget for a more complete
 * description.
 */
juic.Component = function (eventTypes) {
    juic.EventTarget.call(this, eventTypes);
};

juic.Component.prototype = (function() {
    var seqNo = 0;

    return juic.set(new juic.EventTarget(), /** @lends juic.Component.prototype */ {

        /**
         * Render this component into the DOM element represented by the given id.
         * @param {string} id The id of the DOM element to render into
         */
        render : function(id) {
            var html = juic.createRenderContext();
            this.renderHtml(html);
            html.renderInto(id);
        },

        /**
         * Render the HTML for this component.
         * @param {Array.<string>} The html array
         */
        renderHtml : function(html) {
            juic.assert(false, "ERROR: the subclasses must override renderHtml(): " + html);
        },

        /**
         * Register this component into the registry and assign a unique id to this component.
         */
        register : function() {
            juic.assert(!this.id || !this.isRegistered(), "Component already registered!");
            this.id = ++seqNo + ":";
            juic.Component._registry[this.id] = this;
        },

        /**
         * This method needs to be unique and should NOT be overridden.
         */
        unregister : function() {
            juic.assert(this.isRegistered(), "Component not registered! " + this.id);
            // remove the event array and then remove the object from the registry array
            delete this._events;
            delete juic.Component._registry[this.id];
        },
        /**
         * return true if this instance is registered or else false.
         * @return {boolean} true or false based on the current state of registration of the component.
         */
        isRegistered : function () {
            return !!juic.Component._registry[this.id];
        },
        
        /**
         * This function will unregister this component, and any components created by this component as well.
         * 
         * <p><strong>Note:</strong>This method needs to be overridden by each sub component.</p>
         *
         * <p>If any component has sub-components, it will have to first call the cleanup method on its children and then
         * unregister itself from the component registry. If no children the object will only unregister from the
         * registry.</p>
         *
         * <p>Please make sure to NOT to overwrite unregister when you create a component.</p>
         */
        cleanup: function() {
            this.unregister();
        },

        /**
         * You should implement this if you want to support setValue
         * 
         * @param {*} arg The value to set
         */
        setValue : function(arg) {
            juic.assert(false, "ERROR: the subclasses must override setValue(): " + arg);
        },

        /**
         * You should implement this if you want to support getValue
         * 
         * @return {*} The value of the component.
         */
        getValue : function() {
            return null;
        },

        /**
         * serializeState ==> Serialize State of this component, ie, get the state of this
         *              component
         */
        serializeState : function() {
            juic.assert(false, "ERROR: the subclasses must override serializeState(): ");
        },

        /**
         * deserializeState ==> Deserialize State for this component, ie, set the component's
         *              properties to the passed-in serialized form
         *
         * @param {*} newState The new state of this component.
         */
        deserializeState : function(newState) {
            juic.assert(false, "ERROR: the subclasses must override deserializeState(): " + newState);
        },

        /**
         * Generates a string that if evaluated will call the named method
         * in this component.  This is used to generate callbacks from DOM
         * events into the component.
         * 
         * <p>
         * <strong>IMPORTANT NOTE:</strong> this method is used by renderHtml
         * implementations to send DOM events back to the component.  It
         * should not be called by anything that uses component.  The
         * addEventListener, removeEventListener and dispatchEvent methods
         * are for the users of the component.
         * </p>
         *
         * Example:
         * <pre>
         * MyComponent.prototype.renderHtml = function(h) {
         *   for (var i=0 ; i<10 ; i++) {
         *     h.push("a href='javascript:" + this.fireCode("addItem", i) + "'...");
         *   }
         * };
         * MyComponent.prototype.addItem = function(index) { ... };
         * </pre>
         *
         * <p>
         * <strong>NOTE:</strong> this method's internals should not be relied upon, though
         * some parts are publically accessible, the implementation is not
         * guaranteed to be stable.
         * </p>
         *
         * @param {String} name the name of a function on this component
         * that will be called
         * @param {...*} additional parameters will be passed into the
         * function when called.  These parameters must be of simple types
         * that can be converted to JSON (string, number, object, or
         * array).  Objects and arrays, must contain only simpled types.
         */
        fireCode : function(name) {
            juic.assert(this.id, "Component not registered (within fireCode)!");
            juic.assert("function" == typeof this[name], "Not a function (within fireCode): " + name);

            var code = "juic.fire(\"" + this.id + "\",\"" + name + "\"";

            for (var i = 1; i < arguments.length; ++i) {
                code += "," + juic.dump(arguments[i]);
            }
             //Note that the addition of "event" to the argument list is experimental.
             //DO NOT RELY ON THIS!
            return juic.escapeHTML(code + ",event);");
        }
    });
})();

juic.Component._registry = {};


(function () {

    /**
     * constructor for render context object to be used to replace the array
     * that is passed to renderHtml.
     *
     * @constructor
     */
    function RenderContext() {
        /**
         * @type Array.<(string|number)>
         * @private
         */
        this._html = [];
        /**
         * @type number
         */
        this.length = 0;
    }

    juic.extend( RenderContext, juic.EventTarget, /** @lends RenderContext.prototype */ (function ()
        {
            var ID_COUNT = 0;
            return {
                /**
                 * creating a push type object, which will directly pushed to the array
                 * without additional changes to the argument
                 */
                pushTypes: {
                    'string': true,
                    'number': true,
                    'boolean':true
                },

                /**
                 * function that will convert argument of type component, array to
                 * string and push to its HTML array that will be later used as inner
                 * HTML
                 *
                 * @param {...*} items
                 *             the items that wil be pushed to the render context
                 * @return {number} the new length of the HTML array
                 */
                push: function (items) {
                    var /** @type {number} */ eachArgs,
                        /** @type {number} */ len,
                        /** @type {*} */ argument;

                    for (eachArgs = 0,len = arguments.length; eachArgs < len; ++eachArgs) {
                        argument = arguments[eachArgs];

                        switch (true) {

                            case this.pushTypes[typeof argument]:
                                this._html.push(argument);
                                this.length++;
                                break;

                            // if component call the renderHtml and pass in the reference of this
                            case argument instanceof juic.Component:
                                argument.renderHtml(this);
                                break;

                            // if array then call this.push recursively
                            case argument instanceof Array:
                                this.push.apply(this, argument);
                                break;

                            // Is this a dom element?
                            case argument && argument.nodeType == 1:
                                var domID = nextUniqueId();
                                this._domReplacements = this._domReplacements || {};
                                this._domReplacements[domID] = argument;
                                this.push('<span id="', domID, '" style="display:none"></span>');
                                break;

                            // if object call toString of the object passed
                            case argument instanceof Object:
                                if (argument.toString) {
                                    this._html.push(argument.toString());
                                    this.length++;
                                }
                                break;



                            /*
                             * ** cannot have the default for backward compatibility **
                             *
                             * default:
                             *     this._html.push("object passed to push do not have a implementation to render");
                             *     this.length++;
                             *     break;
                             */

                        }

                    }

                    return this.length;
                },

                /**
                 * join the HTML array with the given separator
                 *
                 * @param {string=} separator
                 *             used between items of the array
                 * @return {string} the joined elements of the array as a string
                 */
                join: function (separator) {
                    return this._html.join.apply(this._html, arguments);
                },

                /**
                 * Render into the DOM element with the given id to have the HTML stored in this
                 * RenderContext object.
                 *
                 * @param {HTMLElement|String} elOrId The element handle or the id of a DOM element to be updated
                 */
                renderInto: function(elOrId) {
                    var el;
                    if (typeof elOrId === 'string') {
                        el = juic.$(elOrId);
                    } else {
                        el = elOrId;
                    }
                    juic.assert(el, "[Render] Element/ID passed should be available on the DOM!");

                    el.innerHTML = this.join('');
                    if (this._domReplacements && juic._inDoc(el, document)) {
                        for (var domID in this._domReplacements) {
                            var replace = juic.$(domID);
                            replace && replace.parentNode.replaceChild(this._domReplacements[domID], replace);
                        }
                        delete this._domReplacements;
                    }
                    this.dispatch('afterRender');

                    // Cleanup any events added to this render context.
                    delete this._events;
                },

                /**
                 * Call the given handler/callback after the DOM is available represented
                 * by the HTML that has been appended to this RenderContext object.
                 *
                 * @param {Object} handler The handler to be invoked
                 * @param {string=} callback The name of the function that will be called
                 */
                addAfterRenderListener: function(handler, callback) {
                    this.addEventListener('afterRender', handler, callback);
                }
            };

            /**
             * Generate a unique id for the dom replacements.
             *
             * @inner
             * @return {string}
             */
            function nextUniqueId() {
                return '__RenderContext' + (ID_COUNT++);
            };

        })()
    );

    /**
     * Returns a new render context for use by renderHtml
     *
     * @return {RenderContext} a new render context
     */
    juic.createRenderContext = function () {
        return new RenderContext();
    };

})();


/**
 * @private to JUIC
 * Determines whether an HTMLElement is an ancestor of another HTML
 * element in the DOM hierarchy.
 *
 * @method _isAncestor
 * @param {String | HTMLElement} haystack The possible ancestor
 * @param {String | HTMLElement} needle The possible descendant
 * @return {Boolean} Whether or not the haystack is an ancestor of
 *         needle
 */
juic._isAncestor = function (haystack, needle) {
    haystack = juic.$(haystack);
    needle = juic.$(needle);

    var ret = false;

    if ((haystack && needle) && (haystack.nodeType && needle.nodeType)) {
        if (haystack.contains && haystack !== needle) {
            /* contains returns true when equal */
            ret = haystack.contains(needle);
        } else if (haystack.compareDocumentPosition) { /* gecko */
            ret = !!(haystack.compareDocumentPosition(needle) & 16);
        }
    }

    return ret;
};

/**
 * @private to JUIC utility function to determine if the given element can be
 * found within the given document.
 * @method _inDoc
 * @param el {HTMLElement} The html element
 * @return {boolean}
 */
juic._inDoc = function (el, doc) {
    var ret = false;
    if (el && el.tagName) {
        doc = doc || el.ownerDocument;
        ret = juic._isAncestor(doc.documentElement, el);
    }
    return ret;
};


/**
 * This method is used by fireCode.  It is subject to change and
 * should not be called directly.
 *
 * @param {string} compId the id of the component
 * @param {string} funcName the function name to invoke
 * @param {...*} var_args additional parameters to pass to the function
 * @return {*}
 */
juic.fire = function(compId, funcName) {
    var comp = juic.Component._registry[compId];

    juic.assert(comp, "Component " + compId + " not registered (within fire)");

    var args = [];

    for (var i = 2; i < arguments.length; ++i) {
        args.push(arguments[i]);
    }

    return comp[funcName].apply(comp, args);
};

/*
 * These global references are for backwards compatibility.
 * These will not be supported in the future.
 * 
 * @deprecated
 */
window.$ = juic.$;
window.assert = juic.assert;
window.createRenderContext = juic.createRenderContext;
window.dump = juic.dump;
window.escapeHTML = juic.escapeHTML;
window.escapeHTMLIfNeeded = juic.escapeHTMLIfNeeded;
window.extend = juic.extend;
window.fire = juic.fire;
window.set = juic.set;
window.Component = juic.Component;
window.EventTarget = juic.EventTarget;

// This flag is set after the first interpretation of this code
// to prevent any further evaluation by the browser
juic.isComponentJSLoaded = true;

}
    
//
// End of $Id: component.js 275862 2013-03-11 06:18:27Z sramteare $
//
