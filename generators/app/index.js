'use strict';
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the beautiful ' + chalk.red('generator-amqp-microservice') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name:',
      default: this.appname
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath(),
      this.destinationPath()
    );
    this.fs.copy(
      this.templatePath('.*'),
      this.destinationRoot()
    );
    this.template('index.js', 'index.js', this.props);
    this.template('package.json', 'package.json', this.props);
  },

  install: function () {
    this.installDependencies();
  }
});
