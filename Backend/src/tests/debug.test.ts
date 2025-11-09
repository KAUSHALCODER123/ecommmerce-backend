import { getTestApp } from './testApp';

describe('Debug Routes', () => {
  let testApp: any;

  beforeAll(async () => {
    testApp = await getTestApp();
  });

  it('should load routes correctly', async () => {
    // This test just ensures the app loads without errors
    expect(testApp).toBeDefined();
  });
});