'use strict';
var espree = require('espree');
var Walker = require('ast-walker');
var tools = require('./ast-tools');
var parseDocblock = require('./docblock');



/**
 * AST Documentation Parser
 *
 * @constructor
 */
function Parser() {
  if (!(this instanceof Parser)) {
    return new Parser();
  }
  this.types = new Walker.Types();
  this.espreeOptions = {
    range: true,
    loc: true,
    attachComment: true
  };
}
module.exports = Parser;


Parser.prototype.parse = function(source) {
  var ast = espree.parse(source, this.espreeOptions);

  var walker = new Walker(ast, {
    types: this.types
  });

  return this._parse(walker);
};


Parser.prototype._parse = function(walker) {
  var exports = [];
  var classes = {};
  var functions = [];
  var callbacks = [];
  var requires = [];
  var scope = [walker.root.name];

  walker.on('pre-FunctionDeclaration', function(node) {
    var id = tools.toString(node.n('id'));
    var docblock = node.p('leadingComments') ?
        node.p('leadingComments').slice(-1)[0] : null;

    if (docblock) {
      docblock = parseDocblock(docblock.value);
    }

    if (id[0] === id[0].toUpperCase()) {
      classes[id] = {
        ctor: {
          id: id,
          params: tools.toList(node.n('params')),
          scope: scope.slice(),
          docblock: docblock,
          loc: node.p('loc'),
          range: node.p('range')
        }
      };
    } else {
      functions.push({
        id: id,
        params: tools.toList(node.n('params')),
        scope: scope.slice(),
        docblock: docblock,
        loc: node.p('loc'),
        range: node.p('range')
      });
    }

    scope.push(id);
  });

  walker.on('pre-FunctionExpression', function(node) {
    var docblock, tmp;
    var id = node.n('id');

    // FUNCTION ASSIGNMENTS
    if (node.parent.parent.type === 'ExpressionStatement' &&
        node.parent.type === 'AssignmentExpression') {

      docblock = node.parent.parent.p('leadingComments') ?
          node.parent.parent.p('leadingComments').slice(-1)[0] : null;

      if (docblock) {
        docblock = parseDocblock(docblock.value);
      }

      id = tools.toString(node.parent.n('left'));
      tmp = id.split('.');

      if (tmp.length === 3 && tmp[1] === 'prototype') {
        if (!classes[tmp[0]]) {
          // TODO: issue error/warning (eslint should mention this anyway)
          classes[tmp[0]] = {};
        }

        classes[tmp[0]][tmp[2]] = {
          id: id,
          params: tools.toList(node.n('params')),
          scope: scope.slice(),
          docblock: docblock,
          loc: node.p('loc'),
          range: node.p('range')
        };

      } else {
        functions.push({
          id: id,
          params: tools.toList(node.n('params')),
          scope: scope.slice(),
          docblock: docblock,
          loc: node.p('loc'),
          range: node.p('range')
        });
      }

      scope.push(id);

    // CALLBACKS
    } else if (node.parent.type === 'CallExpression' &&
        node.parent.n('arguments').length === node.idx + 1) {

      docblock = node.parent.parent.p('leadingComments') ?
          node.parent.parent.p('leadingComments').slice(-1)[0] : null;

      if (docblock) {
        docblock = parseDocblock(docblock.value);
      }

      var args = node.parent.n('arguments').slice();
      args.pop(); // remove the callback
      args = tools.toList(args);

      args.push('{CALLBACK}');
      id = id ? tools.toString(id) : '<anonymous>';

      callbacks.push({
        callee: tools.toString(node.parent.n('callee')),
        arguments: args,
        id: id,
        params: tools.toList(node.n('params')),
        scope: scope.slice(),
        docblock: docblock,
        loc: node.p('loc'),
        range: node.p('range')
      });
      scope.push(id);
    }
  });

  walker.on('post-BlockStatement', function(node) {
    if (node.parent.type === 'FunctionExpression' ||
        node.parent.type === 'FunctionDeclaration') {
      scope.pop();
    }
  });

  walker.on('post-CallExpression', function(node) {
    var callee = tools.toString(node.n('callee'));

    if (callee === 'require') {
      // TODO: detect require-s in MemberExpression-s & AssignmentExpression-s
      if (node.parent.type === 'VariableDeclarator') {
        requires.push({
          var: tools.toString(node.parent.n('id')),
          params: tools.toList(node.n('arguments')),
          scope: scope.slice(),
          loc: node.p('loc'),
          range: node.p('range')
        });
      }
    }
  });

  walker.on('post-AssignmentExpression', function(node) {
    var id;

    if (scope.length === 1 && scope[0] === 'Program') {
      id = tools.toString(node.n('left'));

      if (id === 'module.exports') {
        exports.push({
          left: id,
          right: tools.toString(node.n('right')),
          scope: scope.slice(),
          loc: node.p('loc'),
          range: node.p('range')
        });

      } else if (id.substr(0, 8) === 'exports.') {

        exports.push({
          left: id,
          right: tools.toString(node.n('right')),
          scope: scope.slice(),
          loc: node.p('loc'),
          range: node.p('range')
        });
      }
    }
  });

  walker.traverse();

  return {
    requires: requires,
    exports: exports,
    classes: classes,
    functions: functions,
    callbacks: callbacks
  };
};
