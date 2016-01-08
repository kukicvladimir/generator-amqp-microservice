/**
 * amqp module. Initialize AMQP connection and creates service queues.
 * Queues are defined in .env file
 * @module amqp
 */
'use strict';

var amqp    = require('amqp'),
    winston = require('winston'),
    async   = require('async');

module.exports = {
  init: function (callback) {
    var root        = this;
    this.connection = amqp.createConnection();
    this.queues     = {};

    this.connection.on('error', function (err) {
      winston.error('ERROR', err);
    });

    //fetch queue names defined in .env file and create them
    this.connection.on('ready', function () {
      winston.info('Connected to AMQP');
      winston.info('Creating AMQP queues...');

      //pack to JSON structure
      var channels = {
        request: process.env.SERVICE_REQ,
        response: process.env.SERVICE_RES
      };

      return async.each(channels, root.createQueue.bind(root), callback);
    });
  },
  /**
   * create a queue
   * @param name
   * @param callback
   */
  createQueue: function (name, callback) {
    this.connection.queue(name, {durable: true, autoDelete: false}, function (queue) {
      winston.info('Queue created: ', name);
      this.queues[name] = queue;
      return callback();
    }.bind(this));
  }
};
