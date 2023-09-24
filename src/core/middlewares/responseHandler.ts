export class ResponseHandler {
  constructor() {}
  /**
   * Error Response Handler
   * @param {Numher} Status Code
   * @param {string} message
   * @returns {{response: {code: *, message: *, status: boolean}, statusCode: *}}
   */
  responseError = (statusCode: number, message: string) => {
    return {
      statusCode,
      response: {
        code: statusCode,
        message,
        status: false,
      },
    }
  }
  /**
   * Successful Response Handler
   * @param {Numher} Status Code
   * @param {string} message
   * @param {any} data
   * @returns {{response: {code: *, message: *, status: boolean, data: *}, statusCode: *}}
   */
  responseSuccess = (statusCode: number, message: string, data: any = {}) => {
    return {
      statusCode,
      response: {
        code: statusCode,
        status: true,
        message,
        data,
      },
    }
  }
}

