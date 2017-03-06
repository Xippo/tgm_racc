/**
 * TgM (R)accordion BETA v1.0.0
 * by Oliver Pfaff, written in plain JS.
 *
 */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(factory);
    } else if ( typeof exports === 'object' ) {
        module.exports = factory;
    } else {
        root.accordion = factory(root); //
    }
})(this, function (root) {
    'use strict';
    // Variables
    var exports = {}; // Object for public APIs
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test

    // Default settings
    var defaults = {
        sessionType: 'javascript',
        class : 'tgm-racco',
        trigger: true,
        cbBeforeTrigger: function () {alert('before');},
        cbAfterTrigger: function () {alert('after');}
    };

    // Methods

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function ( defaults, options ) {
        for ( var key in options ) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                defaults[key] = options[key];
            }
        }
        return defaults;
    };

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Remove whitespace from a string
     * @private
     * @param {String} string
     * @returns {String}
     */
    var trim = function ( string ) {
        return string.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Convert data-options attribute into an object of key/value pairs
     * @private
     * @param {String} options Link-specific options as a data attribute string
     * @returns {Object}
     */
    var getDataOptions = function ( options ) {
        var settings = {};
        // Create a key/value pair for each setting
        if ( options ) {
            options = options.split(';');
            options.forEach( function(option) {
                option = trim(option);
                if ( option !== '' ) {
                    option = option.split(':');
                    settings[option[0]] = trim(option[1]);
                }
            });
        }
        return settings;
    };

    var initTriggerEvent = function(trigger,ele,settings){
        // So we can do some css stuff when the element has the open class
        trigger.classList.add('tgm-racco-trigger');

        //If we have a head we take the head height. The Trigger is supposed to be inside the head
        if(ele.querySelectorAll('[data-tgm-racco-head="1"]').length >= 1){
            var head = ele.querySelectorAll('[data-tgm-racco-head="1"]');
            var style = window.getComputedStyle(head[0]);
            ele.setAttribute('data-tgm-racco-minheight', head[0].offsetHeight  + parseInt(style.marginTop) + parseInt(style.marginBottom));
        }else{
            var style = window.getComputedStyle(trigger);
            //set minHeight data attribute ele height + margin Top and bottom
            ele.setAttribute('data-tgm-racco-minheight', trigger.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom));
        }

        //barrier free enchantment
        trigger.addEventListener('keydown',function (e) {
            if(e.keyCode == 8 || e.keyCode == 13){
                openCloseBehavior(e,ele,settings);
            }
            //Default perma opening when we tab on it can be set in the settings //TODO add setting check
            /*
            if(e.keyCode == 9){
                if(ele.className.indexOf('tgm-racco-open') < 1){
                    openCloseBehavior(e,ele,settings);
                }
            }
            */
        });

        //Click Stuff
        trigger.addEventListener('click',function (e) {
            openCloseBehavior(e,ele,settings);
        });
    };

    function openCloseBehavior(e,ele,settings){
        //A tags dont fire
        e.preventDefault();
        //settings.cbBeforeTrigger();
        if(ele.className.indexOf('tgm-racco-open') >= 0){
            //Close Element
            ele.style.maxHeight = ele.getAttribute('data-tgm-racco-minheight')+'px';

            ele.classList.remove('tgm-racco-open');
            var trigger = ele.getElementsByClassName('tgm-racco-trigger');
            if(typeof trigger[0] != 'undefined'){
                trigger[0].setAttribute('aria-expanded','false');
            }
            //remove from cookie
            removeUidFromCookie(ele.id,'tgm-racco-open');
            if(ele.getAttribute('data-tgm-racco-open') > 0){
                addUidTooCookie(ele.id, 'tgm-racco-cinitopen');
            }
        }else{
            ele.classList.add('tgm-racco-open');
            var trigger = ele.getElementsByClassName('tgm-racco-trigger');
            if(typeof trigger[0] != 'undefined'){
                trigger[0].setAttribute('aria-expanded','true');
            }
            ele.style.maxHeight = ele.getAttribute('data-tgm-racco-maxheight')+'px';
            //add too cookie
            addUidTooCookie(ele.id,'tgm-racco-open');
            if(ele.getAttribute('data-tgm-racco-open') > 0){
                removeUidFromCookie(ele.id, 'tgm-racco-cinitopen');
            }
        }
        //settings.cbAfterTrigger();
    }

    /**
     * Init 2 needed cookies
     * @returns {boolean}
     */
    function initCookie() {
        //TODO add expiration date in the plugin settings
        if(!readCookie('tgm-racco-open')){
            document.cookie = "tgm-racco-open = 0";
            document.cookie = "tgm-racco-cinitopen = 0";
            return true;
        }
        return false;
    }

    function addUidTooCookie(uid,cookieName){
        //get the cookie
        var cookieValues = readCookie(cookieName);
        //check if the element is already set (should not be the case)
        if(cookieValues.indexOf(uid) < 0){
            cookieValues += ','+uid;
            document.cookie = cookieName+' = '+cookieValues;
        }
    }

    function removeUidFromCookie(uid,cookieName) {
        var cookieValues = readCookie(cookieName);
        //check if the element is set (should be the case)
        if(cookieValues.indexOf(uid) > 0){
            cookieValues = cookieValues.replace(','+uid,'');
            document.cookie = cookieName+' = '+cookieValues;
        }
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    var setNeededStuff = function(settings){
        //try to init cookie
        var newCookie = initCookie();
        var cookieInitOpenClosed = false;
        var cookieOpenElements = false;

        //get all elements with the right data attribute
        var dataAccordionElements = document.querySelectorAll('[data-tgm-racco="1"]');
        forEach(dataAccordionElements,function(ele){
            //Check if the element has already the right class. If it has not, we add it
            if(ele.className.indexOf(settings.class) < 0){
                //We take the high before we add the class and after. The highest will be set. (We had some trouble with floating and overflow hidden which come in to play with the added class)
                var height1 =  ele.offsetHeight;
                ele.classList.add(settings.class);
                var height2 = ele.offsetHeight;
                if(height2 > height1){
                    height1 = height2;
                }
                ele.setAttribute('data-tgm-racco-maxheight', height1);
            }else {
                //@TODO remove the class and set the right maxHeight. Than ReAdd the class
            }

            //Check if the accordion element has trigger
            if(settings.trigger){
                var trigger = 1;
                var eleTrigger = false;
                //Search first for the trigger data attribute
                if(ele.querySelectorAll('[data-tgm-racco-trigger="1"]').length >= 1){
                    eleTrigger = ele.querySelectorAll('[data-tgm-racco-trigger="1"]');
                }else{
                    //if no trigger data attribute we search for the data head
                    eleTrigger = ele.querySelectorAll('[data-tgm-racco-head="1"]')
                }
            }
            //fallback on simple header tag. Get the first header inside th accordion
            if(typeof eleTrigger[0] === "undefined"){
                //if we find anything we set the trigger on the first Heading
                eleTrigger = ele.querySelectorAll('h1, h2, h3, h4, h5, h6');
            }

            if(eleTrigger.length > 0){
                //here we set also the min-height for the closed status
                initTriggerEvent(eleTrigger[0],ele,settings);
            }else{
                console.warn('tgm_racc: The element '+ele.getAttribute('id')+' dosen\'t have a right heading to be used as trigger and the trigger data tag is not set')
            }

            if(!newCookie){
                //get the uids from cookies
                cookieInitOpenClosed = readCookie('tgm-racco-cinitopen');
                cookieOpenElements = readCookie('tgm-racco-open');

                //Warning when the element has no CSS ID
                if(ele.id === ''){
                    console.warn('TGM Racc Extension (WARNING) : The html element where you initialize the accordion (the element with the data tags ;) ) need to have a unique CSS ID. Without ID the extension can\'t store the accordion status ');
                }

                //Check if the element should be open #racco-open check
                if(ele.getAttribute('data-tgm-racco-open') > 0){
                    //check if the element was closed in this session
                    if(cookieInitOpenClosed.indexOf(ele.id) < 0){
                        ele.classList.add('tgm-racco-open');
                        if(typeof eleTrigger[0] != 'undefined'){
                            eleTrigger[0].setAttribute('aria-expanded','true');
                        }
                        ele.style.maxHeight = ele.getAttribute('data-tgm-racco-maxheight')+'px';
                    }
                }else if(cookieOpenElements.indexOf(ele.id) >= 0 && ele.id !== ''){
                    ele.classList.add('tgm-racco-open');
                    if(typeof eleTrigger[0] != 'undefined'){
                        eleTrigger[0].setAttribute('aria-expanded','true');
                    }
                    ele.style.maxHeight = ele.getAttribute('data-tgm-racco-maxheight')+'px';
                }
            }else if(ele.getAttribute('data-tgm-racco-open') > 0){
                ele.classList.add('tgm-racco-open');
                if(typeof eleTrigger[0] != 'undefined'){
                    eleTrigger[0].setAttribute('aria-expanded','true');
                }
                ele.style.maxHeight = ele.getAttribute('data-tgm-racco-maxheight')+'px';
            }

            //check if element is closed
            if(ele.className.indexOf('tgm-racco-open') < 0){
                //Close Element
                if(typeof eleTrigger[0] != 'undefined'){
                    eleTrigger[0].setAttribute('aria-expanded','false');
                }
                ele.style.maxHeight = ele.getAttribute('data-tgm-racco-minheight')+'px';
            }
        });
    };


    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    exports.init = function ( options ) {
        // feature test
        if ( !supports ) return;

        //Get full settings
        var settings = extend(defaults, options);
        //init
        setNeededStuff(settings);
    };

    //
    // Public APIs
    //
    return exports;

});
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}