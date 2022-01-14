#!/usr/bin/env node
// @ts-check
'use strict';

const { transformSync } = require('@swc/core');
const { sync: findUp } = require('find-up');
const debug = require('debug')('foobar');
const { dirname, join, relative } = require('path');
const { addHook } = require('pirates');
const { install } = require('source-map-support');

const rootDir = dirname(findUp('yarn.lock'));

install({
  environment: 'node',
  hookRequire: true,
});

addHook(
  (source, filename) => {
    if (debug.enabled) {
      debug('transpiling %s', relative(rootDir, filename));
    }

    return transformSync(source, {
      filename,
      jsc: {
        parser: {
          syntax: 'typescript',
        },
      },
      module: {
        type: 'commonjs',
      },
      sourceMaps: 'inline',
    }).code;
  },
  {
    exts: ['.ts'],
  }
);

require('./src/index');
