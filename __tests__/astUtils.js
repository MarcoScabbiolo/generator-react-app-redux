// Prettier-ignore

const astUtils = require('../generators/astUtils');
const chai = require('chai');

describe('ast utilities', () => {
  test('finds proper import index', () => {
    let ast = astUtils.parse(`
      import a from 'a';
      import b from 'b';
    `);
    chai.expect(astUtils.lastImportIndex(ast)).to.eq(2);
  });
  test('adding an import keeps the original new lines', () => {
    let ast = astUtils.parse(
      `import a from 'a';
import b from 'b';

export default 123;`
    );

    let newAst = astUtils.newImport(
      ast,
      astUtils.singleSpecifierImportDeclaration('test', 'test', { isDefault: true })
    );

    chai.expect(astUtils.generate(newAst)).to.eq(
      `import a from 'a';
import b from 'b';
import test from 'test';

export default 123;
`
    );
  });
});
