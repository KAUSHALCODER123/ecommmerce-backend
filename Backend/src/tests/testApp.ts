import { loadExpressApp } from '../loaders/express';

let testAppInstance: any = null;

export const getTestApp = async () => {
  if (!testAppInstance) {
    testAppInstance = await loadExpressApp();
  }
  return testAppInstance;
};