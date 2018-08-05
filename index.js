const debug = require('debug')('pdf2html')
const cheerio = require('cheerio')
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

const html = (filePath, callback) => {
  if (typeof callback !== 'function') return

  debug('Converts PDF to HTML')
  runTika(filePath, 'html', callback)
}

const pages = (filePath, options, callback) => {
  if (typeof callback !== 'function') return

  debug('Converts PDF to HTML pages')
  html(filePath, (err, html) => {
    if (err) return callback(err)

    let $ = cheerio.load(html)
    let pages = []
    let $pages = $('.page')
    $pages.each((index) => {
      let $page = $pages.eq(index)
      pages.push(options.text ? $page.text().trim() : $page.html())
    })

    return callback(null, pages)
  })
}

const text = (filePath, callback) => {
  if (typeof callback !== 'function') return

  debug('Converts PDF to Text')
  runTika(filePath, 'text', callback)
}

const meta = (filePath, callback) => {
  if (typeof callback !== 'function') return

  debug('Extracts meta information from PDF')
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

exports.html = html
exports.pages = pages
exports.text = text
exports.meta = meta
