/** dispatcher module. Dispatcher for all incoming messages.
 * Messages are stored in two groups, input and output messages.
 * @module dispatcher
 */

var requestHandler  = require('./handlers/request');
var responseHandler = require('./handlers/response');

module.exports = {
  init: function () {
    this.req = requestHandler;
    this.res = responseHandler;

    return this;
  }
};

