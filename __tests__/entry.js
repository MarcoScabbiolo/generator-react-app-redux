'use strict';
const entry = require('./entry/test.js');

jest.setTimeout(25000);

entry(undefined, true);
