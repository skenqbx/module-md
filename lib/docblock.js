'use strict';


function parse(docblock) {
  var i, t, p1, p2, p3;
  var line;
  var lines = docblock.split('\n');
  var sp;

  var doc = {
    message: '',
    params: {},
    ctor: false,
    extends: false,
    return: false
  };

  for (i = 0; i < lines.length; ++i) {
    sp = lines[i].indexOf('*') + 2;
    line = lines[i].substr(sp);

    if (line[0] === '@') {

      if (line.indexOf(' ') > -1) {
        t = line.substr(0, line.indexOf(' '));
      } else {
        t = line;
      }

      switch (t) {
        case '@param':
          t = line.substr(t.length + 1);
          p1 = t.indexOf('}');
          p1 = t.substr(0, p1 + 1);
          t = t.substr(p1.length + 1);

          p2 = t.indexOf(' ');
          if (p2 > -1) {
            p3 = t.substr(p2 + 1);
            p2 = t.substr(0, p2);
          } else {
            p2 = t;
            p3 = null;
          }

          doc.params[p2] = [p1, p3];
          break;
        case '@extends':
          t = line.substr(t.length + 1);
          doc.extends = t;
          break;
        case '@constructor':
          doc.ctor = true;
          break;
        case '@return':
          t = line.substr(t.length + 1);
          p1 = t.indexOf('}');
          p1 = t.substr(0, p1 + 1);
          t = t.substr(p1.length + 1);
          doc.return = [p1, t];
          break;
      }
    } else {
      doc.message += '\n' + line;
    }
  }

  doc.message = doc.message.trim();

  matchParamsToLists(doc);

  return doc;
}
module.exports = parse;


function matchParamsToLists(doc) {
  var params = doc.params;
  var i, message = doc.message.split('\n');
  var p, name;

  for (i = 0; i < message.length; ++i) {
    if (message[i].substr(0, 2) === '**') {
      p = message[i].indexOf('**', 2);

      if (p > 0) {
        name = message[i].substr(2, p - 2);

        if (params[name]) {
          message.splice(i, 1);
          params[name][2] = [];

          while (message[i] && message[i][0] === ' ') {
            params[name][2].push(message.splice(i, 1)[0]);
          }

          --i;
        }
      }
    }
  }

  doc.message = message.join('\n');
}
