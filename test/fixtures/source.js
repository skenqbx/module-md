'use strict';
var util = require('util');
var events = require('events');



/**
 * Test
 *
 * **opt_options**
 *  - {boolean} strict Validate results in strict mode
 *  - {string} cwd The working directory
 *
 * @param {?Object} opt_options The test's configuration
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
function Test(opt_options) {
  events.EventEmitter.call(this);

  opt_options = opt_options || {};
}
util.inherits(Test, events.EventEmitter);
module.exports = Test;


/**
 * Print a string to the console
 *
 * @param {string} value The value to print
 */
Test.prototype.abc = function(value) {
  var test = new Test();

  console.log('abc:', value);

  /**
   * Some call
   */
  this.emit('xxx', test, function xxx() {

  });
};


/**
 * no-op
 */
function test() {

}
