/**
 * Class for abstracting Electron IPC response.
 * This class is generalized with frontend for standardized communication.
 * Please use this for easy development.
 * ~ Wakugumi
 */

/**
 * Status codes for IPC response
 * @enum {number}
 */
export enum StatusCodes {
  /**
   * Means literal OK, process is resolved and the desired output is returned
   */
  OK,

  /**
   * Proess is resolved but not the desired output
   */
  FAILED,

  /**
   * Process took more than timeout threshold
   */
  TIMEOUT,

  /**
   * Literal error, process could not even be finished
   */
  ERROR,
}

export class IPCResponse<T extends any | null> {
  status: StatusCodes;
  message: string;
  data: T | null;
  headers: object | null;

  /**
   * Create a IPC response instance
   * @param {StatusCodes} status - The status codes indicating the state of the returned result
   * @param {string} message - Description of the response
   * @param {Object | null} [data=null] - Optional data to be included in the response
   * @param {Object} [headers={}] - Optional headers for the response
   */
  constructor(
    status: StatusCodes,
    message: string,
    data: T = null,
    headers: object | null = null,
  ) {
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
  static ok(message: string, data: any = null, headers = {}) {
    return new IPCResponse(StatusCodes.OK, message, data, headers);
  }

  /**
   * Returns response with code FAILED
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers
   */
  static failed(message: string, data: any = null, headers = {}) {
    return new IPCResponse(StatusCodes.FAILED, message, data, headers);
  }

  /**
   * Returns response with code ERROR
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers
   */
  static error(message: string, data: any = null, headers = {}) {
    return new IPCResponse(StatusCodes.ERROR, message, data, headers);
  }

  /**
   * Returns response type with codes TIMEOUT
   * @param {string} message - Message
   * @param {Object | null} [data = null] - Data to be passed with response
   * @param {Object} [headers = {}] - Headers to be passed
   */
  static timeout(message: string, data: any = null, headers = {}) {
    return new IPCResponse(StatusCodes.TIMEOUT, message, data, headers);
  }
}
