'use strict';

const testConfig = require('src/test/config.js');
const LaunchDarkly = require('./launchDarkly');

const logger = require('../logger');

class FeatureToggle {
  constructor() {
    this.launchDarkly = new LaunchDarkly().getInstance();
  }

  getToggleValue(key) {
    const featureToggleKey = testConfig.featureToggles.flags[key];
    const roles = [];
    const ldUser = {
      key: 'lau-e2e-tests',
      custom: {
        roles,
      },
    };
    const ldDefaultValue = false;

    try {
      return this.launchDarkly.variation(featureToggleKey, ldUser, ldDefaultValue);
    } catch (error) {
      logger.info('launch darkly check toggle errors..', error);
    }
  }

  closeConnection() {
    this.launchDarkly.close();
  }

}

module.exports = FeatureToggle;
