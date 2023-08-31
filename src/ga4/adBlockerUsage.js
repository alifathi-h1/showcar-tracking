/**
 * returns "adblock active" | "no adblock detected". How to get it?.
 */

const { getAdBlocker } = require('./adBlockDetection');

/**
 * @param window global variable
 * @returns AdBlockerUsage as - 'no adblock detected'
    | 'adblock active'
    | 'adblock detector failed'
    | 'init adblock detector failed'
 */
const adBlockerUsage = (window) => {
    return new Promise((resolve) => {
        getAdBlocker(window);
        if (typeof window.adblockDetector === 'undefined') {
            return resolve('init adblock detector failed');
        }
        window.adblockDetector.init({
            debug: false,
            found: () => resolve('adblock active'),
            notfound: () => resolve('no adblock detected'),
        });
    });
};

module.exports = {
    adBlockerUsage: adBlockerUsage,
};
