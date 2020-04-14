const debug = require('debug')('pdf2html')
const cheerio = require('cheerio')
const URI = require('urijs')
const fs = require('fs')
const defaults = require('lodash.defaults')
const gm = require('gm').subClass({ imageMagick: true })
const exec = require('child_process').exec
const constants = require('./constants')

const runPDFBox = (filePath, options, callback) => {
  options = defaults(options || {}, { page: 1, imageType: 'png', width: 160, height: 226 })
  const uri = new URI(filePath)

  const copyFilePath = constants.DIRECTORY.PDF + uri.filename()
  fs.copyFile(filePath, copyFilePath, (err) => {
    if (err) return callback(err)

    exec(`java -jar ${constants.DIRECTORY.VENDOR + constants.VENDOR_PDF_BOX_JAR} PDFToImage -imageType ${options.imageType} -startPage ${options.page} -endPage ${options.page} ${copyFilePath}`, { maxBuffer: 1024 * 2000 }, (err) => {
      if (err) return callback(err)

      uri.suffix(options.imageType)
      const pdfBoxImageFilePath = constants.DIRECTORY.PDF + uri.filename().replace(new RegExp(`.${uri.suffix()}$`), `${options.page}.${uri.suffix()}`)
      const imageFilePath = constants.DIRECTORY.IMAGE + uri.filename()
      // Resize image
      gm(pdfBoxImageFilePath)
        .resize(options.width, options.height, '!') // use the '!' flag to ignore aspect ratio
        .write(imageFilePath, (err) => {
          if (!err) {
            // delete temp pdf file copied
            fs.unlink(copyFilePath, (err) => {
              if (err) return callback(err)

              // delete temp image file created by PdfBox
              fs.unlink(pdfBoxImageFilePath, (err) => {
                if (err) return callback(err)

                return callback(null, imageFilePath)
              })
            })
          } else {
            fs.copyFile(pdfBoxImageFilePath, imageFilePath, (err) => {
              if (err) return callback(err)

              // delete temp pdf file copied
              fs.unlink(copyFilePath, (err) => {
                if (err) return callback(err)

                // delete temp image file created by PdfBox
                fs.unlink(pdfBoxImageFilePath, (err) => {
                  if (err) return callback(err)

                  return callback(null, imageFilePath)
                })
              })
            })
          }
        })
    })
  })
}

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
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  if (typeof callback !== 'function') return

  options = defaults(options || {}, { text: false })

  debug('Converts PDF to HTML pages')
  html(filePath, (err, html) => {
    if (err) return callback(err)

    const $ = cheerio.load(html)
    const pages = []
    const $pages = $('.page')
    $pages.each((index) => {
      const $page = $pages.eq(index)
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
      return callback(undefined, metaJSON)
    } catch (e) {
      return callback(e)
    }
  })
}

const thumbnail = (filePath, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  if (typeof callback !== 'function') return

  debug('Generate thumbnail image for PDF')
  runPDFBox(filePath, options, callback)
}

exports.html = html
exports.pages = pages
exports.text = text
exports.meta = meta
exports.thumbnail = thumbnail
