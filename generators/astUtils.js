const _ = require('lodash');
const generator = require('babel-generator');
const prettier = require('prettier');
const babylon = require('babylon');
const types = require('babel-types');
const traverse = require('@babel/traverse');
const assert = require('chai').assert;
const pkg = require('../package.json');

function pushLinesDown(ast, from) {
  traverse.default(ast, {
    enter(path) {
      if (
        path.parent.type === 'Program' &&
        path.node.loc &&
        path.node.loc.start.line >= from
      ) {
        path.node.loc.start.line += 1;
        path.node.loc.end.line += 1;
      }
    }
  });
}

function shorthandProperty(name) {
  return types.objectProperty(
    types.identifier(name),
    types.identifier(name),
    false,
    true
  );
}

function singleSpecifierImportDeclaration(
  identifier,
  path,
  { isDefault, isNamespace } = {}
) {
  let localIdentifier = types.identifier(
    typeof identifier === 'string' ? identifier : identifier[0]
  );
  let specifier;

  if (isDefault) {
    specifier = types.importDefaultSpecifier(localIdentifier);
  } else if (isNamespace) {
    specifier = types.importNamespaceSpecifier(localIdentifier);
  } else {
    specifier = types.importSpecifier(
      localIdentifier,
      typeof identifier === 'string' ? localIdentifier : types.identifier(identifier[1])
    );
  }
  return types.importDeclaration([specifier], types.stringLiteral(path));
}

function lastImportIndex(ast) {
  return _.findLastIndex(ast.program.body, types.isImportDeclaration) + 1;
}

function newImport(ast, importDeclaration) {
  let lastIndex = lastImportIndex(ast);
  let line = ast.program.body[lastIndex - 1]
    ? ast.program.body[lastIndex - 1].loc.start.line + 1
    : 1;
  importDeclaration.loc = {
    start: { line, column: 0 },
    end: { line }
  };
  pushLinesDown(ast, line);
  ast.program.body.splice(lastIndex, 0, importDeclaration);
  return ast;
}

function newBodyStatement(ast, statement, line, index) {
  statement.loc = {
    start: { line, column: 0 },
    end: { line }
  };
  ast.program.body.splice(index, 0, statement);
  return ast;
}

function newBodyStatements(ast, statements, startingLine, startingIndex) {
  for (let i = 0; i < statements.length; i += 1) {
    pushLinesDown(ast, startingLine);
  }

  let currentIndex = startingIndex;

  statements.forEach((stmt, i) => {
    if (stmt) {
      newBodyStatement(ast, stmt, startingLine + i, currentIndex);
      currentIndex += 1;
    }
  });

  return ast;
}

function findSingleVariableDeclaration(ast, kind, name) {
  return ast.program.body.find(
    stmt =>
      types.isVariableDeclaration(stmt) &&
      stmt.kind === kind &&
      stmt.declarations.length === 1 &&
      types.isVariableDeclarator(stmt.declarations[0]) &&
      stmt.declarations[0].id.name === name
  );
}

function findClassDeclaration(ast, name) {
  return ast.program.body.find(
    stmt => types.isClassDeclaration(stmt) && stmt.id && stmt.id.name === name
  );
}

function findDefaultExportDeclaration(ast) {
  return ast.program.body.find(types.isExportDefaultDeclaration);
}

function findClassMethodDeclaration(classDeclaration, method) {
  return classDeclaration.body.body.find(
    stmt => types.isClassMethod(stmt) && stmt.key.name === method
  );
}

function findReturnStatement(body) {
  return body.find(types.isReturnStatement);
}

function generate(ast) {
  return prettier.format(
    generator.default(ast, { quotes: 'single', retainLines: true }).code,
    pkg.eslintConfig.rules['prettier/prettier'][1]
  );
}

function parse(code) {
  return babylon.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'objectRestSpread', 'classProperties', 'decorators']
  });
}

function importBootstrap(ast) {
  return newImport(
    ast,
    types.importDeclaration(
      [types.importNamespaceSpecifier(types.identifier('B'))],
      types.stringLiteral('react-bootstrap')
    )
  );
}

function importAll(ast, toImport, options = {}, callback) {
  assert.isObject(
    toImport,
    'second parameter (toImport) must be an object where the keys are the local identifiers and the values are the paths to import from'
  );
  _.forIn(toImport, (filePath, name) => {
    ast = newImport(ast, singleSpecifierImportDeclaration(name, filePath, options));
    if (callback) {
      callback(name, filePath);
    }
  });
  return ast;
}

module.exports = {
  parse,
  generate,
  singleSpecifierImportDeclaration,
  findSingleVariableDeclaration,
  findClassDeclaration,
  findDefaultExportDeclaration,
  findClassMethodDeclaration,
  findReturnStatement,
  lastImportIndex,
  newImport,
  newBodyStatement,
  newBodyStatements,
  shorthandProperty,
  importBootstrap,
  importAll,
  pushLinesDown
};
