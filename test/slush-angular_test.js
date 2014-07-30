/* jshint node:true */
/* global require, it, before, beforeEach, describe */
'use strict';
var chai = require('chai'),
    inquirer = require('inquirer'),
    gulp = require('gulp'),
    mockGulpDest = require('mock-gulp-dest')(gulp);

chai.should();

require('../slushfile');

describe('slush-angular', function() {
  before(function () {
    process.chdir(__dirname);
  });

  describe('default generator', function () {
    beforeEach(function () {
      mockPrompt({name: 'module', example: false});
    });

    it('should put all project files in current working directory', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.cwd().should.equal(__dirname);
        mockGulpDest.basePath().should.equal(__dirname);
        done();
      });
    });

    it('should add dot files to project root', function(done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains([
          '.bowerrc',
          '.csslintrc',
          '.editorconfig',
          '.gitignore',
          '.jshintrc'
        ]);

        done();
      });
    });

    it('should add bower.json and package.json to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains([
          'package.json',
          'bower.json'
        ]);

        done();
      });
    });

    it('should add a gulpfile to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('gulpfile.coffee');
        done();
      });
    });

    it('should add a karma config file to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('karma.conf.js');
        done();
      });
    });

    it('should add a readme file to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('README.md');
        done();
      });
    });

    it('should add an index.jade to the app folder', function (done) {
      mockPrompt({name: '', example: false, jade: true});

      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestNotContains('client/app/index.html');
        mockGulpDest.assertDestContains('client/app/index.jade');
        done();
      });
    });

    it('should add a JavaScript app module definition file by default', function (done) {
      mockPrompt({name: 'module', example: false});

      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('src/app/app.js');
        mockGulpDest.assertDestNotContains('client/app/app.coffee');
        done();
      });
    });

    it('should add a CoffeeScript app module definition file if CoffeeScript is chosen', function (done) {
      mockPrompt({name: 'module', example: false, coffee: true});

      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestNotContains('client/app/index.js');
        mockGulpDest.assertDestContains('client/app/index.coffee');
        done();
      });
    });

    it('should create a gitkeep file in assets dir', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('client/assets/.gitkeep');
        done();
      });
    });

    describe('Todo example', function () {
      it('should not add any todo example files by default', function (done) {
        mockPrompt({name: 'module', example: false});

        gulp.start('default').once('stop', function () {
          mockGulpDest.assertDestNotContains({
            'client/app/todo': [
              'todo.jade',
              'todo.coffee',
              'todo_test.coffee',
              'todo.styl',
            ]
          });
          done();
        });
      });

      describe('When Todo example is included', function () {
        beforeEach(function () {
          mockPrompt({name: 'module', example: true, jade: true, coffee: true});
        });

        it('should add a module specific template', function (done) {
          gulp.start('default').once('stop', function () {
            mockGulpDest.assertDestContains('client/app/todo/todo.jade');
            done();
          });
        });

        it('should add a module definition file for the Todo module', function (done) {
          gulp.start('default').once('stop', function () {
            mockGulpDest.assertDestContains('client/app/todo/todo.coffee');
            done();
          });
        });

        it('should add a Todo controller with a corresponding test file', function (done) {
          gulp.start('default').once('stop', function () {
            mockGulpDest.assertDestContains([
              'client/app/todo/todo.coffee',
              'client/app/todo/todo_test.coffee'
            ]);
            done();
          });
        });

        describe('When Jade is chosen', function () {
          beforeEach(function () {
            mockPrompt({name: 'module', example: true, jade: true});
          });

          it('should add a Jade module definition file', function (done) {
            gulp.start('default').once('stop', function () {
              mockGulpDest.assertDestContains('client/app/todo/todo.jade');
              done();
            });
          });
        });
      });

    });

    describe('CSS files', function () {
      it('should add stylus stylesheets by default', function (done) {
        mockPrompt({name: 'module', example: true});

        gulp.start('default').once('stop', function () {
          mockGulpDest.assertDestContains([
            'client/styles/index.styl',
            'client/app/todo/todo.styl'
          ]);
          done();
        });
      });
    });

  });
});

/**
 * Mock inquirer prompt
 */
function mockPrompt (answers) {
  inquirer.prompt = function (prompts, done) {

    [].concat(prompts).forEach(function (prompt) {
      if (!(prompt.name in answers)) {
        answers[prompt.name] = prompt.default;
      }
    });

    done(answers);
  };
}
