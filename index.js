'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const postcss = require('postcss')
const { createHash } = require('./utils')

function postcssQueryHash(options = {}) {
  const opts = Object.assign(
    {},
    {
      algorithm: 'md5',
      manifest: './manifest.json',
    },
    options
  )

  return (root, result) => {
    const hash = createHash(root.toString(), opts.algorithm)
    const originalName = result.opts.to
    const filename = originalName.replace(result.opts.cwd, '')
    const hashFilename = `${filename}?${hash}`
    const next = {}
    let prev = {}

    result.opts.to = hashFilename
    next[filename] = hashFilename
    mkdirp.sync(path.dirname(opts.manifest))

    try {
      prev = JSON.parse(fs.readFileSync(opts.manifest, 'utf-8'))
    } catch (_) {}

    const data = JSON.stringify(Object.assign({}, prev, next), null, 2)
    fs.writeFileSync(opts.manifest, data, 'utf-8')
  }
}

module.exports = postcss.plugin('postcss-query-hash', postcssQueryHash)
