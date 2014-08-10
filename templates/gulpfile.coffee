# jshint node: true
'use strict'

gulp = require 'gulp'
g    = require('gulp-load-plugins')(lazy: false)

browserSync    = require 'browser-sync'
bower          = require './bower'
mainBowerFiles = require 'main-bower-files'
modRewrite     = require 'connect-modrewrite'
runSequence    = require 'run-sequence'

Notification = require 'node-notifier'
notifier     = new Notification()

# Defaults
src  = 'client'
dest = 'client/public'
# End Defaults

# Options
ngClassifyOpts =
  animation:
    format: 'camelCase'
    prefix: ''
  constant:
    format: 'camelCase'
    prefix: ''
  controller:
    format: 'upperCamelCase'
    suffix: ''
  factory:
    format: 'upperCamelCase'
    suffix: ''
  filter:
    format: 'camelCase'
  provider:
    format: 'camelCase'
    suffix: ''
  service:
    format: 'upperCamelCase'
    suffix: ''
  value:
    format: 'camelCase'
# End Options


# Sub Tasks

## Preprocessor
gulp.task 'coffee', ->
  gulp.src(["#{src}/**/*.coffee", "!#{src}/**/_*.coffee"])
    .pipe g.plumber(errorHandler: reportError)
    .pipe g.ngClassify(ngClassifyOpts)
    .pipe g.coffeelint()
    .pipe g.coffee(bare: true).on('error', reportError)
    .pipe gulp.dest("./.tmp/#{src}")

gulp.task 'stylus', ->
  gulp.src(["#{src}/**/*.styl", "!#{src}/**/_*.styl"])
    .pipe g.plumber(errorHandler: reportError)
    .pipe g.stylus(use: [require('nib')])
    ## csslint
    .pipe gulp.dest("./.tmp/#{src}")
    .pipe g.cached('styling')

gulp.task 'jade', ->
  YOUR_LOCALS = {}
  gulp.src(["#{src}/**/*.jade", "!#{src}/**/_*.jade"])
    .pipe g.plumber(errorHandler: reportError)
    .pipe g.jade(locals: YOUR_LOCALS).on('error', reportError)
    # lint html
    .pipe gulp.dest("./.tmp/#{src}")
## End Preprocessor

## Combine
gulp.task 'dependencies', ->
  jsFilter = g.filter('*.js')
  cssFilter = g.filter('*.css')
  fontFilter = g.filter(['*.eot', '*.woff', '*.svg', '*.ttf'])

  gulp.src(mainBowerFiles())
    # .pipe g.filelog()
    .pipe g.plumber(errorHandler: reportError)

    # grab vendor js files from bower_components
    # .pipe jsFilter
    # .pipe g.concat('vendor.js')
    .pipe gulp.dest("./.tmp/lib")
    # .pipe jsFilter.restore()

    # grab vendor css files from bower_components
    # .pipe cssFilter
    # .pipe g.concat('vendor.css')
    # .pipe gulp.dest("./.tmp/lib")
    # .pipe cssFilter.restore()

    # grab vendor font files from bower_components
    # .pipe fontFilter
    # .pipe flatten()
    # .pipe(gulp.dest(dest_path + '/fonts'))


gulp.task 'scripts', ->
  # concat libs
  # gulp.src(["./.tmp/lib/*.js", "./.tmp/#{src}/**/*.js"])
  #   .pipe g.filelog()
  gulp.src([
      "./.tmp/lib/angular.js",
      "./.tmp/lib/jquery.js",
      "./.tmp/lib/*.js",
      "./.tmp/#{src}/app/index.js",
      "./.tmp/#{src}/**/*.js"
    ])
    .pipe g.sourcemaps.init()
    .pipe g.concat('application.js')
    .pipe g.sourcemaps.write('./maps')
    .pipe gulp.dest("#{dest}")
    .pipe browserSync.reload(stream: true)

gulp.task 'styles', ->
  # concat libs
  gulp.src(["./.tmp/#{src}/**/*.css", "./.tmp/lib/*.css"])
    .pipe g.concat('application.css')
    .pipe gulp.dest("#{dest}")
    .pipe browserSync.reload(stream: true)

gulp.task 'templates', ->
  # concat html to template.js
  gulp.src(["./.tmp/#{src}/**/*.html", "!./.tmp/#{src}/**/index.html"])
    # uglify
    # ngmin / ngannotate
    # lazypipe()
    .pipe g.angularTemplatecache(standalone: true, root: "#{src}/", module: "Templates")
    .pipe gulp.dest("./.tmp/#{src}")

## End Combine

gulp.task 'index', ->
  gulp.src("./.tmp/#{src}/**/index.html")
    .pipe gulp.dest("#{dest}")

# gulp.task 'images', ->
#   gulp.src("#{src}/assets/*.*")
#     .pipe imagemin()
#     .pipe gulp.dest("#{dest}/i")

gulp.task 'server', ->
  browserSync.init ["#{dest}/index.html"],
    server:
      baseDir: "#{dest}"
      middleware: [
        modRewrite ['^([^.]+)$ /index.html [L]']
      ]
    debugInfo: false
    notify: false

gulp.task 'clean', ->
  gulp.src(["./.tmp/**/*.*", "#{dest}/**/*.*"], read: false)
    .pipe g.rimraf()
# End Sub Tasks


# Essential Tasks
gulp.task 'compile', ['jade', 'coffee', 'stylus'], ->
  runSequence('index', 'dependencies', 'templates', 'scripts', 'styles')

gulp.task 'watch', ['compile', 'server'], ->
  g.watch glob: "#{src}/**/*.coffee", emitOnGlob: false, ->
    gulp.start('coffee')

  g.watch glob: "#{src}/**/*.styl", emitOnGlob: false, ->
    gulp.start('stylus')

  g.watch glob: "#{src}/**/*.jade", emitOnGlob: false, ->
    gulp.start('jade')

  g.watch glob: mainBowerFiles(), emitOnGlob: false, ->
    gulp.start('dependencies')

  g.watch glob: ["./.tmp/#{src}/**/*.js", "./.tmp/lib/*.js"], emitOnGlob: false, ->
    gulp.start('scripts')

  g.watch glob: ["./.tmp/#{src}/**/*.css", "./.tmp/lib/*.css"], emitOnGlob: false, ->
    gulp.start('styles')

  g.watch glob: ["./.tmp/#{src}/**/*.html", "!./.tmp/#{src}/index.html"], emitOnGlob: false, ->
    gulp.start('templates')

  g.watch glob: "./.tmp/#{src}/index.html", emitOnGlob: false, ->
    gulp.start('index')

  # g.watch glob: "#{dest}", emitOnGlob: false, ->
  #   browserSync.reload(stream: true)

# gulp.task 'serve', ['clean'], ->
#   gulp.start('watch')

gulp.task 'serve', ['watch']

gulp.task 'default', ['serve']

# End Essential Tasks


# Other methods
reportError = (err) ->
  g.util.beep()
  notifier.notify
    title: "Error running Gulp"
    message: err.message
  g.util.log err.message
  @emit 'end'
# End Other methods