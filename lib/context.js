'use strict';



/**
 * @constructor
 */
function Context() {
  this.files = {};
}
module.exports = Context;


Context.prototype.addFile = function(file) {
  this.files[file.name] = file;
};
