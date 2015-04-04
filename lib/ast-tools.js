'use strict';


function toString(node) {
  var string;

  switch (node.type) {
    case 'Identifier':
      string = node.p('name');
      break;

    case 'Literal':
      string = node.p('raw');
      break;

    case 'MemberExpression':
      string = toString(node.n('object'));

      if (node.n('property')) {
        if (node.p('computed')) {
          string += '[' + toString(node.n('property')) + ']';
        } else {
          string += '.' + toString(node.n('property'));
        }
      }
      break;

    case 'ThisExpression':
      string = 'this';

      if (node.n('property')) {
        if (node.p('computed')) {
          string += '[' + toString(node.n('property')) + ']';
        } else {
          string += '.' + toString(node.n('property'));
        }
      }
      break;

    case 'CallExpression':
      string = toString(node.n('callee'));
      break;

    case 'NewExpression':
      console.log('NewExpression');
      string = '{' + node.type + '}';
      break;

    case 'FunctionExpression':
      if (node.n('id')) {
        string = toString(node.n('id'));
      }
      break;

    case 'FunctionDeclaration':
      string = toString(node.n('id'));
      break;

    default:
      string = '{' + node.type + '}';
  }

  return string;
}
exports.toString = toString;


function toList(nodes) {
  var i, list = [];

  if (!nodes) {
    return list;
  }

  for (i = 0; i < nodes.length; ++i) {
    list.push(toString(nodes[i]));
  }

  return list;
}
exports.toList = toList;
