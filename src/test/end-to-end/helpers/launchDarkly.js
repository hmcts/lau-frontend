'use strict';

const testConfig = require('src/test/config.js');
const launchDarkly = require('launchdarkly-node-server-sdk');

class LaunchDarkly {
    constructor() {
        this.ready = false;
        const enabled = testConfig.featureToggles.enabled && testConfig.featureToggles.enabled !== 'false';
        const options = enabled ? {diagnosticOptOut: true} : {offline: true};
        this.client = launchDarkly.init(testConfig.featureToggles.launchDarklyKey, options);
        this.client.once('ready', () => {
            this.ready = true;
        });
    }

    variation(...params) {
        if (this.ready) {
            return this.client.variation(...params);
        }

        return this.client.once('ready', () => {
            this.ready = true;
            return this.client.variation(...params);
        });
    }

    close() {
        this.client.close();
    }
}

class Singleton {
    constructor(options = {}, ftValue = {}) {
        if (!this.instance) {
            this.instance = new LaunchDarkly(options, ftValue);
        }
    }

    getInstance() {
        return this.instance;
    }

    close() {
        if (this.instance) {
            this.instance.close();
            delete this.instance;
        }
    }
}

module.exports = Singleton;
