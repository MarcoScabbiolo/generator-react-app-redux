const _ = require('lodash');

function importDefaultDeclaration(identifier, source) {
  return importDeclaration(source, [
    {
      type: 'ImportDefaultSpecifier',
      local: {
        type: 'Identifier',
        name: identifier
      }
    }
  ]);
}

function importDeclaration(source, specifiers) {
  return {
    type: 'ImportDeclaration',
    specifiers: specifiers,
    source: {
      type: 'Literal',
      value: source,
      raw: `'${source}'`
    }
  };
}

function importSpecifier(local, imported) {
  return {
    type: 'ImportSpecifier',
    local: {
      type: 'Identifier',
      name: local
    },
    imported: {
      type: 'Identifier',
      name: imported || local
    }
  };
}

function stringLiteralProperty(name, value) {
  return {
    type: 'Property',
    key: {
      type: 'Identifier',
      name: name
    },
    computed: false,
    value: {
      type: 'Literal',
      value: value,
      raw: `'${value}'`
    },
    kind: 'init',
    method: false,
    shorthand: false
  };
}

function callExpression(func, args) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: func
    },
    arguments: args
  };
}

function newImport(ast, importDeclaration) {
  let index = _.findLastIndex(ast.body, stmt => stmt.type === 'ImportDeclaration') + 1;
  ast.body.splice(index, 0, importDeclaration);
  return ast;
}

function findSingleVariableDeclaration(ast, kind, name) {
  return ast.body.find(
    stmt =>
      stmt.type === 'VariableDeclaration' &&
      stmt.kind === kind &&
      stmt.declarations.length === 1 &&
      stmt.declarations[0].type === 'VariableDeclarator' &&
      stmt.declarations[0].id.name === name
  );
}

module.exports = {
  importDefaultDeclaration,
  findSingleVariableDeclaration,
  callExpression,
  stringLiteralProperty,
  newImport,
  importDeclaration,
  importSpecifier
};
