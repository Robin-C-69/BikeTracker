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
    return {
      error:
        errorMessage instanceof Error ? errorMessage.message : "Unknown error",
      data: null,
    };
  }
}
