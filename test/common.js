'use strict';
var fs = require('fs');
var path = require('path');

exports.fixtures = path.resolve(__dirname, 'fixtures');
exports.root = path.resolve(__dirname, '../');

var source = null;

function getSource() {
  if (!source) {
    source = fs.readFileSync(exports.fixtures + '/source.js');
  }
  return source;
}

exports.getSource = getSource;
