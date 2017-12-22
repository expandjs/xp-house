!function(t){function o(i){if(e[i])return e[i].exports;var s=e[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,o),s.l=!0,s.exports}var e={};o.m=t,o.c=e,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},o.p="",o(o.s=3)}([function(t,o){t.exports=XP},function(t,o){t.exports=XPEmitter},function(t,o){var e;e=function(){return this}();try{e=e||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,o,e){t.exports=e(4)},function(t,o,e){(function(o){const i="undefined"!=typeof window?window:o,s=i.XP||e(0),r=i.XPEmitter||e(1),n=e(5);t.exports=new s.Class("XPHouse",{extends:r,initialize(){r.call(this),this.rooms={}},getRoom(t,o){s.assertArgument(s.isString(t,!0),1,"string"),s.assertArgument(s.isVoid(o)||s.isObject(o),2,"Object"),s.assertOption(!o||s.isVoid(o.floor)||s.isString(o.floor),"options.floor","string");let e=o&&o.floor||"";return this.rooms[e]&&this.rooms[e][t]},getRooms(t){s.assertArgument(s.isVoid(t)||s.isObject(t),1,"Object"),s.assertOption(!t||s.isVoid(t.floor)||s.isString(t.floor),"options.floor","string");let o=t&&t.floor||"";return s.values(this.rooms[o]||{})},kick:{callback:!0,value(t,o){if(!s.isFunction(t))return void o(new s.ValidationError("identity","Function"));let e=!1;s.each(this.rooms,(o,i)=>s.each(i,(o,i)=>i.kick(t,(t,i)=>o(t,e=e||i)),o),t=>o(t,e))}},room:{callback:!0,value(t,o,e){if(!s.isString(t,!0))return void e(new s.ValidationError("name","string"));if(!s.isVoid(o)&&!s.isObject(o))return void e(new s.ValidationError("options","Object"));if(o&&!s.isVoid(o.floor)&&!s.isString(o.floor))return void e(new s.ValidationError("options.floor","string"));let i=o.floor||"",r=this.rooms[i]=this.rooms[i]||{},l=this.rooms[i][t]||new n(t,o);r[t]||l.once("close",()=>delete r[t]),e(null,r[t]=l)}},rooms:{set(t){return this.rooms||t},validate:t=>!s.isObject(t)&&"Object"}}),"undefined"!=typeof window&&(window.XPHouse=t.exports)}).call(o,e(2))},function(t,o,e){(function(o){const i="undefined"!=typeof window?window:o,s=i.XP||e(0),r=i.XPEmitter||e(1),n=e(6);t.exports=new s.Class("Room",{extends:r,initialize(t,o){r.call(this),this.closed=!1,this.roomers=[],this.name=t,this.options=o,this.floor=this.options.floor||null,this.autoClose=this.options.autoClose||!1,this.cursor=new n(this)},getRoomer(t){return s.assertArgument(s.isFunction(t),1,"Function"),this.roomers.find(t)},close:{callback:!0,value(t){this.closed?t(null,!1):(this.closed=!0,this.roomers.forEach(t=>this.kick(t)),this.emit("close"),t(null,!0))}},kick:{callback:!0,value(t,o){if(!s.isFunction(t))return void o(new s.ValidationError("identity","Function"));let e=this.roomers.findIndex(t);e>=0&&this.roomers.splice(e,1),e>=0&&this.autoClose&&this.empty&&this.close(),o(null,e>=0)}},let:{callback:!0,value(t,o){s.isObject(t)?(this.closed||s.append(this.roomers,t),o(null,!this.closed)):o(new s.ValidationError("roomer","Object"))}},autoClose:{set(t){return s.isDefined(this.autoClose)?this.autoClose:Boolean(t)}},closed:{set(t){return this.closed||Boolean(t)}},cursor:{set(t){return this.cursor||t},validate:t=>!s.isObject(t)&&"Object"},empty:{get(){return!this.roomers.length}},floor:{set(t){return s.isDefined(this.floor)?this.floor:t},validate:t=>!s.isNull(t)&&!s.isString(t,!0)&&"string"},name:{set(t){return this.name||t},validate:t=>!s.isString(t,!0)&&"string"},roomers:{set(t){return this.roomers||t},validate:t=>!s.isArray(t)&&"Array"}})}).call(o,e(2))},function(t,o,e){const i=e(0),s=e(1);t.exports=new i.Class("Cursor",{extends:s,initialize(t){s.call(this),this.closed=!1,this.id=i.uuid(),t.once("close",()=>this.closed=!0)},closed:{set(t){return this.closed||Boolean(t)},then(t,o){t&&!o&&(this.emit("close",!0),this.removeAllListeners())}},id:{set(t){return this.id||t},validate:t=>!i.isUUID(t,!0)&&"uuid"},value:{set:t=>t,then(t,o){return t!==o&&this.emit("change",t)}}})}]);