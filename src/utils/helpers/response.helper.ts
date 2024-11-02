interface ResponseData {
  status: boolean;
  message: string;
  data: any | null;
}

export const createResponse = (status: boolean, message: string, data: any = null): ResponseData => {
  return {
      status,
      message,
      data,
  };
};
