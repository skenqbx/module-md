'use strict';



/**
 *
 */
function Markdown() {
  if (!(this instanceof Markdown)) {
    return new Markdown();
  }
}
module.exports = Markdown;


Markdown.prototype.render = function(context) {
  var i, j, files = context.files.slice();
  var file, classes;

  for (i = 0; i < files.length; ++i) {
    file = files[i];
    classes = Object.keys(context.intel[file].classes);

    if (classes.length) {
      for (j = 0; j < classes.length; ++j) {
        this.renderClass(context.intel[file].classes[classes[j]]);
      }
    }
  }
};


Markdown.prototype.renderClass = function(intel) {
  var i, methods = Object.keys(intel);

  var view = {
    ctor: intel.ctor,
    methods: []
  };

  methods.splice(0, 1);

  for (i = 0; i < methods.length; ++i) {
    view.methods.push(intel[methods[i]]);
  }
};
