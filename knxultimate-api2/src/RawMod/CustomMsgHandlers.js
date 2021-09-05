/******************************************************************
 * This file contains functions to work with raw message handlers *
 ******************************************************************/

const KnxNetProtocolExtra = require('./KnxNetProtocolExtra')

module.exports = class RawModCustomMsgHandlers {
  /*
   * Function: RawModCustomMsgHandlers.checkCallCustomMsgHandler()
   *
   *      This function calls this.messageMatchesTemplate() to check if if a message, rawMsgJson,
   *      matches any registered handlers and calls the corresponding handler function
   *      NOTE all matching handlers are called
   *
   * Arguments:
   *
   *      conContext      The knx connection context
   *      rawMsgJson      The raw message represented as JSON object (in the usual structure)
   *                      Type: Json-Object
   */
  static checkCallCustomMsgHandler (rawMsgJson, conContext) {
    /*
     * Check if this.handlers is defined
     */
    if (conContext.handlers) {
      /*
       * Check if this.handlers.customMsgHandlers is defined
       */
      if (conContext.handlers.customMsgHandlers) {
        /*
         * Iterate trough this.handlers.customMsgHandlers
         */
        for (let entry in conContext.handlers.customMsgHandlers) {
          /*
           * Check if the current entry is defined
           * This done to prevent collisions when deleting custom message handlers
           */
          if (conContext.handlers.customMsgHandlers.hasOwnProperty(entry)) {
            /*
             * Check if the callback field of the current entry is a function
             */
            if (typeof conContext.handlers.customMsgHandlers[entry].callback === 'function') {
              /*
               * Check if the template of the current entry matches rawMsgJson
               */
              if (new KnxNetProtocolExtra().messageMatchesTemplate(conContext.handlers.customMsgHandlers[entry].template, rawMsgJson) === 0) {
                /*
                 * Call the designated function
                 */
                conContext.handlers.customMsgHandlers[entry].callback(rawMsgJson)
              }
            }
          }
        }
      }
    }
  }

  /*
   * Function: RawModCustomMsgHandlers.registerCustomMsgHandler()
   *
   *      This function registers a custom message handler
   *
   * Arguments:
   *
   *      template        The template incoming messages are tested against
   *                      If it matches, the callback function will be called
   *      callback        Will be called if a matching message arrives
   *                      It should take one argument:
   *                          rawMsgJson  - The message represented as JSON object
   *      conContext      The knx connection context
   *
   * Return:
   *
   *      The length difference of the custom message handlers array before and after the deletion
   *      -1 on error
   *
   * Errors:
   *
   *      When either template, callback or conContext are undefined, -1 will be returned
   */
  static registerCustomMsgHandler (template, callback, conContext) {
    if (!(template && callback && conContext)) {
      return -1
    }

    if (!conContext.handlers) {
      conContext.handlers = {}
    }

    if (!conContext.handlers.customMsgHandlers) {
      conContext.handlers.customMsgHandlers = []
    }

    // Get the length of conContext.handlers.customMsgHandlers before the addition
    const lengthBefore = conContext.handlers.customMsgHandlers.length

    // Add template and callback to the custom message handler array
    conContext.handlers.customMsgHandlers.push({
      template: template,
      callback: callback
    })

    // Return the length difference of conContext.handlers.customMsgHandlers before and after the addition
    return lengthBefore - conContext.handlers.customMsgHandlers.length
  }

  /*
   * Function: RawModCustomMsgHandlers.removeCustomMsgHandler()
   *
   *      This function removes a custom message handler from the conContext.handlers.customMsgHandlers array
   *
   * Arguments:
   *
   *      template        The template the handler, which shall be deleted, can be identified by
   *      conContext      The KNX connection context
   *
   * Return:
   *
   *      The length difference of the custom message handlers array before and after the deletion
   *        So zero if no handler matches the template and any number greater than zero if there were matching handlers
   *      It will return -1 one error
   *
   * Errors:
   *
   *      When either template or conContext are undefined, -1 will be returned
   *      When conContext.handlers is undefined, -1 will be returned
   *      When conContext.handlers.customMsgHandlers is undefined, -1 will be returned
   *
   *      The last case can happen when there are no customMsgHandlers registered
   */
  static removeCustomMsgHandler (template, conContext) {
    if (!(template && conContext)) { return -1 }
    if (!conContext.handlers) { return 0 }
    if (!conContext.handlers.customMsgHandlers) { return 0 }

    // Get the length of conContext.handlers.customMsgHandlers before the deletion
    const lengthBefore = conContext.handlers.customMsgHandlers.length

    // Find and delete all matching handlers
    conContext.handlers.customMsgHandlers = conContext.handlers.customMsgHandlers.filter(function (e) {
      return JSON.stringify(e.template) !== JSON.stringify(template)
    })

    // Return the length difference of conContext.handlers.customMsgHandlers before and after the deletion
    return lengthBefore - conContext.handlers.customMsgHandlers.length
  }
}
