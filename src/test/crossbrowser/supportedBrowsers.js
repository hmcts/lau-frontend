const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
    microsoft: {
        edge_win_latest: {
            browserName: 'MicrosoftEdge',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'CMC CCD E2E Tests - XUI: Edge_Win10',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    },
    safari: {
        safari_mac: {
            browserName: 'safari',
            platformName: 'macOS 10.14',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'CMC CCD E2E Tests - XUI: MAC_SAFARI',
                seleniumVersion: '3.141.59',
                screenResolution: '1400x1050',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    },
    chrome: {
        chrome_win_latest: {
            browserName: 'chrome',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'CMC CCD E2E Tests - XUI: WIN_CHROME_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        },
        chrome_mac_latest: {
            browserName: 'chrome',
            platformName: LATEST_MAC,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'CMC CCD E2E Tests - XUI: MAC_CHROME_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    },
    firefox: {
        firefox_win_latest: {
            browserName: 'firefox',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'CMC CCD E2E Tests - XUI: WIN_FIREFOX_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        },
        firefox_mac_latest: {
            browserName: 'firefox',
            platformName: LATEST_MAC,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'CMC CCD E2E Tests - XUI: MAC_FIREFOX_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    }
};

module.exports = supportedBrowsers;
