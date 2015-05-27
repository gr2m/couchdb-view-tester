/* exported map, reduce */

var path = require('path')
var gaze = require('gaze')
var PouchDB = require('pouchdb')
var clear = require('clear')

module.exports = function (config) {
  var db = new PouchDB(config.dbUrl)
  var mapReduce = {
    map: config.map && require(config.map)
  }

  console.log('config.reduce')
  console.log(config.reduce)
  if (config.reduce) {
    mapReduce.reduce = {
      '_sum': '_sum',
      '_count': '_count',
      '_stats': '_stats'
    }[config.reduce] || require(config.reduce)
  }

  doQuery(db, mapReduce, config.options)

  if (!config.watch) {
    return
  }

  gaze([config.map, config.reduce].filter(Boolean), function (error, watcher) {
    if (error) {
      throw error
    }
    watcher.on('changed', function (filepath) {
      var method = toMethod(config, filepath)
      delete require.cache[filepath]
      mapReduce[method] = require(filepath)
      clear()
      console.log('%s changed.\n\n', filepath)
      doQuery(db, mapReduce, config.options)
    })
  })

  console.log('watching for changes...\n\n')
}

function doQuery (db, mapReduce, options) {
  console.log('mapReduce')
  console.log(mapReduce)
  db.query(mapReduce, options, function (error, response) {
    if (error) {
      return console.log(error)
    }

    console.log(JSON.stringify(response, null, 2))
  })
}

function toMethod (config, filepath) {
  return path.resolve(config.map) === filepath ? 'map' : 'reduce'
}
