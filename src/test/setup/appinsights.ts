const appInsights = {
  enable: jest.fn(),
  flush: jest.fn(),
  trackTrace: jest.fn(),
};

jest.mock('../../main/modules/appinsights', () => ({
  AppInsights: jest.fn(() => appInsights),
  appInsights,
}));
