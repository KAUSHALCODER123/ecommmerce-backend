import { loadExpressApp } from './loaders/express';

let appInstance: any = null;

export const getApp = async () => {
  if (!appInstance) {
    appInstance = await loadExpressApp();
  }
  return appInstance;
};

// Initialize app for testing
const initApp = async () => {
  return await loadExpressApp();
};

export const app = initApp();