'use strict';
const path = require('path');
const helpers = require('yeoman-test');
const chai = require('chai');
const fs = require('fs');

const options = { path: '', name: 'test' };

const run = tmpDir =>
  helpers
    .run(path.join(__dirname, '../generators/entry'))
    .withOptions(options)
    .inTmpDir(dir => {
      if (tmpDir) {
        tmpDir(dir);
      }
    });

describe('entry aborts', () => {
  test('when the js entry file already exists', () =>
    run(dir => {
      fs.mkdirSync(path.join(dir, 'src'));
      fs.writeFileSync(path.join(dir, 'src/test.js'), '');
    })
      .then(() => {
        throw new chai.AssertionError('Generator failed to abort');
      })
      .catch(err => {
        chai.assert.exists(err);
      }));
});
