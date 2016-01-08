/** <%= name %> service module.
 * Starts listeners on the AMQP Broker
 * @module <%= name %>
 */

'use strict';

/**
 * load environment variables from .env file located in root folder
 */
require('dotenv').load();

var mongodb    = require('./lib/mongodb'),
    amqp       = require('./lib/amqp'),
    dispatcher = require('./dispatcher');

//connect to mongo database
module.exports = mongodb
  .connect()
  .catch(process.exit)
  .then(
    //connect to amqp server
    amqp.init(function () {
      dispatcher.init();
      //request queue
      amqp.queues[process.env.SERVICE_REQ].subscribe({
        ack: true,
        durable: true,
        prefetchCount: 1
      }, function (message, headers, deliveryInfo, messageObject) {
        dispatcher.req[messageObject.type](message, messageObject.acknowledge.bind(messageObject));
      });

      //response queue
      amqp.queues[process.env.SERVICE_RES].subscribe({
        ack: true,
        durable: true,
        prefetchCount: 1
      }, function (message, headers, deliveryInfo, messageObject) {
        dispatcher.res[messageObject.type](message, messageObject.acknowledge.bind(messageObject));
      });

    }));


/**
 * Called when the program received a SIGINT/SIGTERM, gracefully shuts down things
 * @return {Promise} a promise resolving when everything is cleaned up smoothly
 */
var gracefulShutdown = function () {
  return mongodb.close().then(process.exit);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
