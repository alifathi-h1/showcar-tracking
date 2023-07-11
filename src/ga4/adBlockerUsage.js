/**
 * returns "adblock active" | "no adblock detected". How to get it?.
 */

const { getAdBlocker } = require('./ad-block-detection');

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
        // In the worst case, if the adblockDetector never executes our callbacks. We give up on it after 2 seconds!
        setTimeout(() => resolve('adblock detector failed'), 2000);
    });
};

module.exports = {
    adBlockerUsage: adBlockerUsage,
};
