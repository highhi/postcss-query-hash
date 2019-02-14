'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const postcss = require('postcss')
const crypto = require('crypto')

function generateHash(css, algorithm) {
  return crypto
    .createHash(algorithm)
    .update(css)
    .digest('hex')
}

function postcssQueryHash(options = {}) {
  const opts = Object.assign({}, {
    algorithm: 'md5',
    manifest: './manifest.json',
  }, options)

  return (root, result) => {
    const hash = generateHash(root.toString(), opts.algorithm)
    console.log(root)
    console.log(result)
    const filename = result.opts.to.replace(result.opts.cwd, '')
    const hashFilename = `${filename}?${hash}`
    const next = {}
    let prev = {}

    next[filename] = hashFilename
    mkdirp.sync(path.dirname(opts.manifest))

    try {
      prev = JSON.parse(fs.readFileSync(opts.manifest, 'utf-8'))
    } catch {}

    const data = JSON.stringify(Object.assign({}, prev, next), null ,2)
    fs.writeFileSync(opts.manifest, data, 'utf-8')
  }
}

module.exports = postcss.plugin('postcss-query-hash', postcssQueryHash)


