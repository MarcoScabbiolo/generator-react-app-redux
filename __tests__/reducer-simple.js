'use strict';
const reducer = require('./reducer/test.js');

describe('simple reducer', reducer.bind(null, undefined, true));
