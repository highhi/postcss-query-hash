'use strict'

const crypto = require('crypto')

function createHash(css, algorithm) {
  return crypto
    .createHash(algorithm)
    .update(css)
    .digest('hex')
}

module.exports.createHash = createHash
