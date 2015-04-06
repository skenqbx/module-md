'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var moduleMD = require('../');


suite('parser', function() {
  test('source', function() {
    var source, data;
    var parser = moduleMD.parser();

    source = common.getSource();
    assert(source);
    data = parser.parse(source);
    assert(data);

    assert.strictEqual(data.classes.Test.ctor.id, 'Test');
    assert.strictEqual(data.classes.Test.abc.id, 'Test.prototype.abc');
    assert.strictEqual(data.exports.length, 1);
    assert.strictEqual(data.exports[0].left, 'module.exports');
    assert.strictEqual(data.exports[0].right, 'Test');

    assert.strictEqual(data.functions.length, 1);
    assert.strictEqual(data.requires.length, 2);
    assert.strictEqual(data.callbacks.length, 1);

    assert.strictEqual(data.callbacks[0].callee, 'this.emit');
    assert.strictEqual(data.callbacks[0].id, 'xxx');
    assert.strictEqual(data.callbacks[0].arguments[0], '\'xxx\'');
    assert.strictEqual(data.callbacks[0].arguments[1], 'test');
    assert.strictEqual(data.callbacks[0].arguments[2], '{CALLBACK}');

    assert.deepEqual(data.callbacks[0].scope,
        ['Program', 'Test.prototype.abc']);
  });
});
