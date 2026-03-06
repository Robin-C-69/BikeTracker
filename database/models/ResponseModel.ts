export interface IResponseModel {
  error: string | false;
  data: any;
}

export class ResponseModel {
  static createSuccess(data: any): IResponseModel {
    return {
      error: false,
      data,
    };
  }

  static createError(errorMessage: any): IResponseModel {
    let error: string;
    if (errorMessage instanceof Error) {
      error = errorMessage.message;
    } else if (typeof errorMessage === "string") {
      error = errorMessage;
    } else {
      error = "Unknow error";
    }
    return {
      error,
      data: null,
    };
  }
}
