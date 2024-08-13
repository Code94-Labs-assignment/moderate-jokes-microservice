export interface responseFormate {
  code: number;
  message: string;
  data?: any; // The data is optional because it may not always be present
  error?: any; // The error is optional because it is only present in case of failure
}
