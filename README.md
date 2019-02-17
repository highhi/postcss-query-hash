# postcss-query-hash

## Usage

CLI
```
# input 
postcss ./src/**/*.css -d /dist

# output manifest.json
{
  "/dist/style.css":"/dist/style.css?a516675ef8",
  "/dist/user/user.css":"/dist/user/user.css?gh9848whf"
}
```
Node script

```javascript
# input

const postcss = require('postcss')
const fs = require('fs')
const queryHash = require('postcss-query-hash')
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

files.forEach(async file => {
  const css = await readFile(file)

  try {
    await postcss([queryHash({ manifest: MANIFEST })]).process(css, {
      from: file,
      to: file.replace(SRC, DIST),
      cwd: CWD,
    })
  } catch (err) {
    console.error(err)
  }
})

# output manifest.json
{
  "/dist/style.css":"/dist/style.css?a516675ef8",
  "/dist/user/user.css":"/dist/user/user.css?gh9848whf"
}
```

## Options
### algorithm
Type: `String`  
Default: `md5`  

Uses node's inbuilt crypto module. Pass any digest algorithm that is supported in your environment.

### manifest
Type: `String`  
Default: `./manifest.json`

Output destination of the manifest file.

## license
MIT
