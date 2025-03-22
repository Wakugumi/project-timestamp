/**
 * Javascript interface-like class for abstracting Electron IPC response.
 * This class is generalized with frontend for standardized communication.
 * Please use this for easy development.
 * ~ Wakugumi
 */

/**
 * Status codes for IPC response
 * @enum {number}
 */
const StatusCodes = {
  /**
   * Means literal OK, process is resolved and the desired output is returned
   */
  OK: 0,

  /**
   * Proess is resolved but not the desired output
   */
  FAILED: 1,

  /**
   * Process took more than timeout threshold
   */
  TIMEOUT: 2,

  /**
   * Literal error, process could not even be finished
   */
  ERROR: 3,
};

class IPCResponse {
  /**
   * Create a IPC response instance
   * @param {StatusCodes} status - The status codes indicating the state of the returned result
   * @param {string} message - Description of the response
   * @param {Object | null} [data=null] - Optional data to be included in the response
   * @param {Object} [headers={}] - Optional headers for the response
   */
  constructor(status, message, data = null, headers = null) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.headers = headers;
  }

  /**
   * Returns response type with codes OK
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers to be passed
   */
  static ok(message, data = null, headers = {}) {
    return new IPCResponse(StatusCodes.OK, message, data, headers);
  }

  /**
   * Returns response with code FAILED
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers
   */
  static failed(message, data = null, headers = {}) {
    return new IPCResponse(StatusCodes.FAILED, message, data, headers);
  }

  /**
   * Returns response with code ERROR
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers
   */
  static error(message, data = null, headers = {}) {
    return new IPCResponse(StatusCodes.ERROR, message, data, headers);
  }

  /**
   * Returns response type with codes TIMEOUT
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers to be passed
   */
  static timeout(message, data = null, headers = {}) {
    return new IPCResponse(StatusCodes.TIMEOUT, message, data, headers);
  }
}

module.exports = { StatusCodes, IPCResponse };
