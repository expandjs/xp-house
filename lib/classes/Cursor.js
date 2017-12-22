/**
 * @license
 * Copyright (c) 2017 The expand.js authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */

// Const
const XP      = require('expandjs'),
    XPEmitter = require('xp-emitter');

/*********************************************************************/

/**
 * TODO DOC
 *
 * @class Cursor
 * @extends XPEmitter /bower_components/xp-emitter/lib/index.js
 * @description TODO DOC
 * @keywords nodejs, expandjs
 */
module.exports = new XP.Class('Cursor', {

    // EXTENDS
    extends: XPEmitter,

    /*********************************************************************/
    /* EVENTS */
    /*********************************************************************/

    /**
     * Emitted when the cursor's value changes.
     *
     * @event change
     * @param {*} value
     */

    /**
     * Emitted when the cursor has been closed.
     *
     * @event close
     */

    /*********************************************************************/
    /* INITIALIZER */
    /*********************************************************************/

    /**
     * @constructs
     * @param {Object} room
     */
    initialize(room) {

        // Super
        XPEmitter.call(this);

        // Setting
        this.closed = false;
        this.id     = XP.uuid();

        // Listening
        room.once('close', () => this.closed = true);
    },

    /*********************************************************************/
    /* PROPERTIES */
    /*********************************************************************/

    /**
     * If set to true, the cursor has been closed.
     *
     * @property closed
     * @type boolean
     * @default false
     * @readonly
     */
    closed: {
        set(val) { return this.closed || Boolean(val); },
        then(post, pre) { if (post && !pre) { this.emit('close', true); this.removeAllListeners(); } }
    },

    /**
     * The cursor's id.
     *
     * @property id
     * @type string
     * @readonly
     */
    id: {
        set(val) { return this.id || val; },
        validate(val) { return !XP.isUUID(val, true) && 'uuid'; }
    },

    /**
     * The cursor's value.
     *
     * @property value
     * @type *
     */
    value: {
        set(val) { return val; },
        then(post, pre) { return post !== pre && this.emit('change', post); }
    }
});
