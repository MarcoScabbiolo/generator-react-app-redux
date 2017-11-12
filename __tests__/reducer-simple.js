'use strict';
const reducer = require('./reducer/test.js');

jest.setTimeout(15000);

describe('simple reducer', reducer.bind(null, undefined, true));
