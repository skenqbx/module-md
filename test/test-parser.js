'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var moduleMD = require('../');


suite('parser', function() {
  test('dummy', function() {
    var source, data;
    var parser = moduleMD.parser();

    source = common.getSource();
    assert(source);
    data = parser.parse(source);
    assert(data);
    assert.strictEqual(data.functions.length, 2);
    assert.strictEqual(data.requires.length, 2);
  });
});
