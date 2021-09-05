/*****************************************************************************
 * This file contains things to handle errors that occurred inside of RawMod *
 *****************************************************************************/

const callerID = require('caller-id')

module.exports = class RawModError {
  constructor (filePath, functionName, time, errorObject, referenceID, errorNumber) {
    this.filePath = filePath // The file the error occurred in
    this.functionName = functionName // The function the error occurred in
    this.time = time // The time of the occurrence
    this.errorObject = errorObject // The new Error() object describing the error
    this.referenceID = referenceID // A error code identifying the error (RawModErrors.ERR_*.errorID)
    this.errorNumber = errorNumber // The number (counter) of the error
  }
}

module.exports = class RawModErrorHandler {
  constructor () {
    // A array of RawModError objects
    this.errorCounter = 0
    this.errorStack = []
  }

  /*
   * Function:  RawModErrorHandler.getLastError()
   *
   *      Returns the last (most recent) error from this.errorStack
   */
  getLastError () {
    return (this.getErrorStack()[this.getErrorStack().length - 1])
  }

  /*
   * Function:  RawModErrorHandler.getErrorByNumber
   *
   *      Returns the error with errorNumber eq. number
   */
  getErrorByNumber (number) {
    return this.getErrorStack().filter(e => {
      if (e.errorNumber === number) {
        return e
      }
    })[0]
  }

  /*
   * Function:  RawModErrorHandler.getErrorStack()
   *
   *      Returns the whole this.errorStack
   */
  getErrorStack () {
    return this.errorStack
  }

  /*
   * Function:  RawModErrorHandler.delLastError()
   *
   *      Deletes the last (most recent) error from this.errorStack
   */
  delLastError () {
    this.errorStack.pop()
  }

  /*
   * Function:  RawModErrorHandler.delErrorStack()
   *
   *      Clears the whole this.errorStack
   */
  delErrorStack () {
    this.errorStack = []
  }

  /*
   * Function:  RawModErrorHandler.addNewError()
   *
   *      Adds a new error to this.errorStack
   *
   * Arguments:
   *      rawModErrorObject   A RawModErrorHandler.RawModError object which will be pushed onto this.errorStack
   *
   * Returns the number of the added error
   */
  addNewError (rawModErrorObject) {
    this.errorStack.push(rawModErrorObject)

    return rawModErrorObject.errorNumber
  }

  /*
   * Function:  RawModErrorHandler.createNewError()
   *
   *      Creates and returns a RawModError object
   *
   * Arguments:
   *      errorObject   A new Error() object describing the error
   *      referenceID   The reference ID of the error
   *
   *      (See RawModError above)
   */
  createNewError (errorObject, referenceID) {
    // Get information about the caller
    const callerInfo = callerID.getData(this.createNewError)

    // Return the new RarModError
    return new RawModError(callerInfo.filePath, callerInfo.functionName, new Date(), errorObject, referenceID, ++this.errorCounter)
  }
}
