interface AppConfig {
  submitServiceUrl: string;
  moderateServiceUrl: string;
  deliverServiceUrl: string;
}

export const appConfig: AppConfig = {
  submitServiceUrl: process.env.NEXT_PUBLIC_SUBMIT_SERVICE as string,
  moderateServiceUrl: process.env.NEXT_PUBLIC_MODERATE_SERVICE as string,
  deliverServiceUrl: process.env.NEXT_PUBLIC_DELIVER_SERVICE as string,
};
