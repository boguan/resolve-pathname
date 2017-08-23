const fs = require('fs')
const execSync = require('child_process').execSync
const inInstall = require('in-publish').inInstall
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

if (inInstall())
  process.exit(0)

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('\nBuilding ES modules ...')

exec('babel modules -d . --ignore __tests__', {
  BABEL_ENV: 'es'
})

console.log('Building CommonJS modules ...')

exec('babel modules -d cjs --ignore __tests__', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding resolve-pathname.js ...')

exec('webpack modules/index.js umd/resolve-pathname.js', {
  NODE_ENV: 'production'
})

console.log('\nBuilding resolve-pathname.min.js ...')

exec('webpack -p modules/index.js umd/resolve-pathname.min.js', {
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('umd/resolve-pathname.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
