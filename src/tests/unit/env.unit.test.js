import {
  APP_PORT,
  APP_BASE_URL,
  CLIENT_URL,
  NODE_ENV,
  MONGO_URI,
  JWT_SECRET,
  MAILTRAP_ENDPOINT,
  MAILTRAP_TOKEN,
} from '../../configs/env.config.js';

describe('[Unit] - environment', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should load the required environment variables', () => {
    expect(APP_PORT).toBeDefined();
    expect(APP_BASE_URL).toBeDefined();
    expect(CLIENT_URL).toBeDefined();
    expect(NODE_ENV).toBeDefined();
    expect(MONGO_URI).toBeDefined();
    expect(JWT_SECRET).toBeDefined();
    expect(MAILTRAP_ENDPOINT).toBeDefined();
    expect(MAILTRAP_TOKEN).toBeDefined();
  });
});
