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
    Room      = require('./classes/Room');

/*********************************************************************/

/**
 * A class used to provide rooming functionality.
 *
 * @class XPHouse
 * @extends XPEmitter /bower_components/xp-emitter/lib/index.js
 * @description A class used to provide rooming functionality
 * @keywords nodejs, expandjs
 * @source https://github.com/expandjs/xp-house/blob/master/lib/index.js
 */
module.exports = new XP.Class('XPHouse', {

    // EXTENDS
    extends: XPEmitter,

    /*********************************************************************/
    /* INITIALIZER */
    /*********************************************************************/

    /**
     * @constructs
     */
    initialize() {

        // Super
        XPEmitter.call(this);

        // Setting
        this.rooms = {};
    },

    /*********************************************************************/
    /* GETTERS */
    /*********************************************************************/

    /**
     * Returns an house's room.
     *
     * @method getRoom
     * @param {string} name The room's name
     * @param {Object} options The room's options
     *   @param {string} [options.floor] The room's namespace
     * @returns {Object}
     */
    getRoom(name, options) {

        // Asserting
        XP.assertArgument(XP.isString(name, true), 1, 'string');
        XP.assertArgument(XP.isVoid(options) || XP.isObject(options), 2, 'Object');
        XP.assertOption(!options || XP.isVoid(options.floor) || XP.isString(options.floor), 'options.floor', 'string');

        // Let
        let floor = options && options.floor || '';

        // Returning
        return this.rooms[floor] && this.rooms[floor][name];
    },

    /**
     * Returns the house's rooms.
     *
     * @method getRooms
     * @param {Object} [options] The rooms options
     *   @param {string} [options.floor] The rooms namespace
     * @returns {Array}
     */
    getRooms(options) {

        // Asserting
        XP.assertArgument(XP.isVoid(options) || XP.isObject(options), 1, 'Object');
        XP.assertOption(!options || XP.isVoid(options.floor) || XP.isString(options.floor), 'options.floor', 'string');

        // Let
        let floor = options && options.floor || '';

        // Returning
        return XP.values(this.rooms[floor] || {});
    },

    /*********************************************************************/
    /* METHODS */
    /*********************************************************************/

    /**
     * Iterates over rooms, removing every roomer `identity` returns truthy for.
     * The `callback` is invoked with 2 arguments: (`error`, `success`).
     *
     * @method kick
     * @param {Function} identity
     * @param {Function} [callback]
     */
    kick: {
        callback: true,
        value(identity, callback) {

            // Asserting
            if (!XP.isFunction(identity)) { callback(new XP.ValidationError('identity', 'Function')); return; }

            // Let
            let kicked = false;

            // Kicker
            let kick = (next, room) => room.kick(identity, (err, res) => next(err, kicked = kicked || res));

            // Kicking
            XP.each(this.rooms, (next, rooms) => XP.each(rooms, kick, next), error => callback(error, kicked));
        }
    },

    /**
     * Ensures a room.
     * The `callback` is invoked with two arguments: (`error`, `room`).
     *
     * @method room
     * @param {string} name The room's name
     * @param {Object} options The room's options
     *   @param {string} [options.floor] The room's namespace
     *   @param {boolean} [options.autoClose = false] Specifies if the room should be closed when the last roomer has been kicked
     * @param {Function} [callback]
     */
    room: {
        callback: true,
        value(name, options, callback) {

            // Asserting
            if (!XP.isString(name, true)) { callback(new XP.ValidationError('name', 'string')); return; }
            if (!XP.isVoid(options) && !XP.isObject(options)) { callback(new XP.ValidationError('options', 'Object')); return; }
            if (options && !XP.isVoid(options.floor) && !XP.isString(options.floor)) { callback(new XP.ValidationError('options.floor', 'string')); return; }

            // Let
            let floor = options.floor || '',
                rooms = this.rooms[floor] = this.rooms[floor] || {},
                room  = this.rooms[floor][name] || new Room(name, options);

            // Listening
            if (!rooms[name]) { room.once('close', () => delete rooms[name]); }

            // Callback
            callback(null, rooms[name] = room);
        }
    },

    /*********************************************************************/
    /* PROPERTIES */
    /*********************************************************************/

    /**
     * The house's rooms.
     *
     * @property rooms
     * @type Object
     * @readonly
     */
    rooms: {
        set(val) { return this.rooms || val; },
        validate(val) { return !XP.isObject(val) && 'Object'; }
    }
});

/*********************************************************************/

// Globalizing
if (typeof window !== "undefined") { window.XPHouse = module.exports; }
