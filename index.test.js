'use strict'

const postcss = require('postcss')
const path = require('path')
const { tmpdir } = require('os')
const fs = require('fs')
const plugin = require('./')
const { createHash } = require('./utils')

const tryUnlink = file => {
  try {
    fs.unlinkSync(file)
  } catch (_) {}
}

const CSS_FILES = {
  'file01.css': '.a {}',
  'file02.css': '.b {background-color: #fff}',
}

const MANIFEST_FILE = 'foo/bar/manifest.json'

beforeEach(() => {
  Object.keys(CSS_FILES).forEach(file =>
    fs.writeFileSync(path.join(tmpdir(), file), CSS_FILES[file])
  )
})

afterEach(() => {
  Object.keys(CSS_FILES)
    .concat(MANIFEST_FILE)
    .forEach(file => tryUnlink(path.join(tmpdir(), file)))
})

async function execPlugin(file, opts) {
  const filePath = path.join(tmpdir(), file)
  const result = await postcss([plugin(opts)]).process(
    fs.readFileSync(filePath, 'utf-8'),
    { from: file, to: file }
  )
  const hash = createHash(fs.readFileSync(filePath, 'utf-8'), 'md5')
  const hashFilename = `${file}?${hash}`

  expect(result.opts.to).toBe(hashFilename)
  expect(result.warnings().length).toBe(0)
  return { file, hashFilename }
}

test('plugin', async () => {
  const manifest = path.join(tmpdir(), MANIFEST_FILE)
  const opts = { algorithm: 'md5', manifest }
  const files = fs.readdirSync(tmpdir()).filter(name => /css$/.test(name))
  const promises = files.map(file => execPlugin(file, opts))
  const results = await Promise.all(promises)

  expect(JSON.parse(fs.readFileSync(manifest, 'utf-8'))).toEqual({
    [results[0].file]: results[0].hashFilename,
    [results[1].file]: results[1].hashFilename,
  })
})
