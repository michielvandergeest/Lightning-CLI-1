const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const crypto = require('crypto')

const setupDistFolder = (folder, type) => {
  if (type === 'es6') {
    shell.cp(
      path.join(process.cwd(), './node_modules/wpe-lightning/dist/lightning.js'),
      path.join(folder, 'js', 'lightning.js')
    )

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es6.html'),
      path.join(folder, 'index.html')
    )
    return true
  }
  if (type === 'es5') {
    const lightningFile = path.join(
      process.cwd(),
      './node_modules/wpe-lightning/dist/lightning.es5.js'
    )
    // lightning es5 bundle in dist didn't exist in earlier versions (< 1.3.1)
    if (fs.existsSync(lightningFile)) {
      shell.cp(lightningFile, path.join(folder, 'js', 'lightning.es5.js'))
    }

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es5.html'),
      path.join(folder, 'index.html')
    )
    return true
  }
  if (type === 'spark') {
    shell.cp(
      path.join(process.cwd(), './node_modules/wpe-lightning/dist/lightning.js'),
      path.join(folder, 'js', 'lightning.js')
    )

    shell.cp(
      path.join(__dirname, '../../fixtures/spark/web-globals.js'),
      path.join(folder, 'js', 'web-globals.js')
    )

    shell.cp(path.join(__dirname, '../../fixtures/spark/index.js'), path.join(folder, 'index.js'))

    const index = path.join(folder, 'index.spark')
    shell.cp(path.join(__dirname, '../../fixtures/dist/index.spark'), index)

    const json = JSON.parse(fs.readFileSync(index, 'utf8'))
    json.frameworks.forEach(f => {
      if (f.url.indexOf('appBundle') === -1) {
        f.md5 = crypto
          .createHash('md5')
          .update(fs.readFileSync(path.join(folder, f.url)))
          .digest('hex')
      }
    })
    fs.writeFileSync(index, JSON.stringify(json, null, 4))
    return true
  }
}

module.exports = {
  setupDistFolder,
}