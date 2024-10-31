export interface ResponseModel<T> {
    message: string;
    data?: T;
    code: number;
    error?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail?: any;
  }