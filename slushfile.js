var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    inquirer = require('inquirer'),
    _ = require('underscore.string');

gulp.task('default', function (done) {
  inquirer.prompt([
    {type: 'input', name: 'name', message: 'What do you want to name your AngularJS app?', default: getNameProposal()},
    {type: 'input', name: 'description', message: 'Descripe your app in one line?', default: "Todo"},
    {type: 'confirm', name: 'stylus', message: 'Do you want to use Stylus in your app?', default: true},
    {type: 'confirm', name: 'coffee', message: 'Do you want to use CoffeeScript in your app?', default: true},
    {type: 'confirm', name: 'jade', message: 'Do you want to use Jade in your app?', default: true},
    {type: 'confirm', name: 'example', message: 'Do you want to include a Todo List example in your app?', default: true}
  ],
  function (answers) {
    answers.nameDashed = _.slugify(answers.name);
    answers.description = answers.description;
    answers.modulename = _.camelize(answers.nameDashed);
    var files = [__dirname + '/templates/**'];
    if (answers.stylus) {
      files.push('!' + __dirname + '/templates/client/**/*.css')
    }
    else {
      files.push('!' + __dirname + '/templates/client/**/*.styl')
    }
    if (answers.coffee) {
      files.push('!' + __dirname + '/templates/client/**/*.js')
    }
    else {
      files.push('!' + __dirname + '/templates/client/**/*.coffee')
    }
    if (answers.jade) {
      files.push('!' + __dirname + '/templates/client/**/*.html')
    }
    else {
      files.push('!' + __dirname + '/templates/client/**/*.jade')
    }
    if (!answers.example) {
      files.push('!' + __dirname + '/templates/client/app/todo/**');
    }
    return gulp.src(files)
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('finish', function () {
        done();
      });
  });
});

function getNameProposal () {
  var path = require('path');
  try {
    return require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    return path.basename(process.cwd());
  }
}
