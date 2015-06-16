'use strict';



/**
 * @constructor
 */
function Context() {
  this.files = [];
  this.source = {};
  this.intel = {};
}
module.exports = Context;


Context.prototype.addFile = function(file, intel) {
  this.files.push(file.name);

  this.source[file.name] = file.buffer;
  this.intel[file.name] = intel;
};
