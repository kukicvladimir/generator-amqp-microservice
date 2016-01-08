/** requestHandler module. Handles all input messages.
 * Operation invoked is stored in message object under type property. This property determines which method will
 * be invoked,
 * @module requestHandler
 */

'use strict';

module.exports = {
  /**
   * Invoked operation op1
   * @param message
   * @param ack
   */
  op1: function (message, ack) {
    ack();
  }
};
