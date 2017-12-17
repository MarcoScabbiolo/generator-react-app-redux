'use strict';
const prompts = require('../generators/prompts');
const chai = require('chai');

describe('prompts', () => {
  test('gets the props', () => {
    let props = {
      bootstrap: true,
      path: ''
    };
    let single = prompts.bindToProps(prompts.get('bootstrap'), props);
    let multiple = prompts.bindToProps(prompts.get(['bootstrap', 'path']), props);

    chai.expect(single.when).to.equal(false);
    chai.expect(multiple.map(p => p.when).every(x => !x)).to.equal(true);
    chai.assert.isEmpty(prompts.get([]));
    chai.assert.isUndefined(prompts.get(''));
    chai.assert.throws(() => prompts.get());
  });
});
