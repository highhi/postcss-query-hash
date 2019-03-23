const postcss = require('postcss')
const fs = require('fs')
const queryHash = require('..')
const glob = require('glob')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)

const CWD = __dirname
const SRC = `${CWD}/src`
const DIST = `${CWD}/dist`
const MANIFEST = `${DIST}/manifest.json`
const files = glob.sync(`${SRC}/**/*.css`)

try {
  fs.unlinkSync(MANIFEST)
} catch (_) {}

;(async () => {
  for (const file of files) {
    const css = await readFile(file)
    await postcss([queryHash({ manifest: MANIFEST })]).process(css, {
      from: file,
      to: file.replace(SRC, DIST),
      cwd: CWD,
    })
  }
})()
