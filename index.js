const debug = require('debug')('pdf2html')
const exec = require('child_process').exec
const constants = require('./constants')

const runTika = (filePath, commandOption, callback) => {
  if (!commandOption) {
    commandOption = 'html'
  }

  const command = `java -jar ${constants.DIRECTORY.VENDOR + constants.VENDOR_TIKA_JAR} --${commandOption} ${filePath}`
  debug(command)
  exec(command, { maxBuffer: 1024 * 2000 }, callback)
}

exports.html = (filePath, callback) => {
  debug('Converts PDF to HTML')
  if (typeof callback === 'function') {
    runTika(filePath, 'html', callback)
  }
}

exports.text = (filePath, callback) => {
  debug('Converts PDF to Text')
  if (typeof callback === 'function') {
    runTika(filePath, 'text', callback)
  }
}

exports.meta = (filePath, callback) => {
  debug('Extracts meta information from PDF')
  if (typeof callback === 'function') {
    runTika(filePath, 'json', (err, meta) => {
      if (err) return callback(err)

      try {
        const metaJSON = JSON.parse(meta)
        return callback(null, metaJSON)
      } catch (e) {
        return callback(err)
      }
    })
  }
}
