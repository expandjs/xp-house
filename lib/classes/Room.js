/**
 * @license
 * Copyright (c) 2017 The expand.js authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */

// Const
const env     = typeof window !== "undefined" ? window : global,
    XP        = env.XP || require('expandjs'),
    XPEmitter = env.XPEmitter || require('xp-emitter'),
    Cursor    = require('./Cursor');

/*********************************************************************/

/**
 * A class used to provide room functionality.
 *
 * @class Room
 * @extends XPEmitter /bower_components/xp-emitter/lib/index.js
 * @description A class used to provide room functionality
 * @keywords nodejs, expandjs
 * @source https://github.com/expandjs/xp-house/blob/master/lib/room.js
 */
module.exports = new XP.Class('Room', {

    // EXTENDS
    extends: XPEmitter,

    /*********************************************************************/
    /* EVENTS */
    /*********************************************************************/

    /**
     * Emitted when the room has been closed.
     *
     * @event close
     */

    /*********************************************************************/
    /* INITIALIZER */
    /*********************************************************************/

    /**
     * @constructs
     * @param {string} name The room's name
     * @param {Object} options The room's options
     *   @param {string} [options.floor] The room's floor, used as namespace
     *   @param {boolean} [options.autoClose = false] Specifies if the room should be closed when there are no more `roomers` left
     */
    initialize(name, options) {

        // Super
        XPEmitter.call(this);

        // Setting
        this.closed    = false;
        this.roomers   = [];
        this.name      = name;
        this.options   = options;
        this.floor     = this.options.floor || null;
        this.autoClose = this.options.autoClose || false;
        this.cursor    = new Cursor(this);
    },

    /*********************************************************************/
    /* GETTERS */
    /*********************************************************************/

    /**
     * Iterates over room's roomers, returning the first roomer `identity` returns truthy for.
     *
     * @method getRoomer
     * @param {Function} identity
     */
    getRoomer(identity) {

        // Asserting
        XP.assertArgument(XP.isFunction(identity), 1, 'Function');

        // Returning
        return this.roomers.find(identity);
    },

    /*********************************************************************/
    /* METHODS */
    /*********************************************************************/

    /**
     * Closes the room, kicking each roomer.
     *
     * The `callback` is invoked with two arguments: (`error`, `success`).
     *
     * @method close
     * @param {Function} [callback]
     * @returns {Promise}
     */
    close: {
        promise: true,
        value(callback) {

            // Preventing
            if (this.closed) { callback(null, false); return; }

            // Setting
            this.closed = true;

            // Kicking
            this.roomers.forEach(roomer => this.kick(roomer));

            // Emitting
            this.emit('close');

            // Callback
            callback(null, true);
        }
    },

    /**
     * Iterates over the room's `roomers`, kicking the first one `identity` returns truthy for.
     *
     * The `callback` is invoked with two arguments: (`error`, `success`).
     *
     * @method kick
     * @param {Function} identity
     * @param {Function} [callback]
     * @returns {Promise}
     */
    kick: {
        promise: true,
        value(identity, callback) {

            // Asserting
            if (!XP.isFunction(identity)) { callback(new XP.ValidationError('identity', 'Function')); return; }

            // Finding
            let index = this.roomers.findIndex(identity);

            // Splicing
            if (index >= 0) { this.roomers.splice(index, 1); }

            // Closing
            if (index >= 0 && this.autoClose && this.empty) { this.close(); }

            // Callback
            callback(null, index >= 0);
        }
    },

    /**
     * Lets in the provided `roomer`.
     *
     * The `callback` is invoked with two arguments: (`error`, `success`).
     *
     * @method let
     * @param {Object} roomer
     * @param {Function} [callback]
     * @returns {Promise}
     */
    let: {
        promise: true,
        value(roomer, callback) {

            // Asserting
            if (!XP.isObject(roomer)) { callback(new XP.ValidationError('roomer', 'Object')); return; }

            // Appending
            if (!this.closed) { XP.append(this.roomers, roomer); }

            // Callback
            callback(null, !this.closed);
        }
    },

    /*********************************************************************/
    /* PROPERTIES */
    /*********************************************************************/

    /**
     * If set to true, the room will be closed when there are no more `roomers` left.
     *
     * @property autoClose
     * @type boolean
     * @default false
     */
    autoClose: {
        set(val) { return XP.isDefined(this.autoClose) ? this.autoClose : Boolean(val); }
    },

    /**
     * If set to true, the room has been closed.
     *
     * @property closed
     * @type boolean
     * @default false
     */
    closed: {
        set(val) { return this.closed || Boolean(val); }
    },

    /**
     * The room's cursor.
     *
     * @property cursor
     * @type Object
     * @readonly
     */
    cursor: {
        set(val) { return this.cursor || val; },
        validate(val) { return !XP.isObject(val) && 'Object'; }
    },

    /**
     * If set to true, there are no `roomers`.
     *
     * @property empty
     * @type boolean
     * @readonly
     */
    empty: {
        get() { return !this.roomers.length; }
    },

    /**
     * The room's floor, used as namespace.
     *
     * @property floor
     * @type string
     * @readonly
     */
    floor: {
        set(val) { return XP.isDefined(this.floor) ? this.floor : val; },
        validate(val) { return !XP.isNull(val) && !XP.isString(val, true) && 'string'; }
    },

    /**
     * The room's name.
     *
     * @property name
     * @type string
     */
    name: {
        set(val) { return this.name || val; },
        validate(val) { return !XP.isString(val, true) && 'string'; }
    },

    /**
     * The room's roomers.
     *
     * @property roomers
     * @type Array
     * @readonly
     */
    roomers: {
        set(val) { return this.roomers || val; },
        validate(val) { return !XP.isArray(val) && 'Array'; }
    }
});
