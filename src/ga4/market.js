/**
 * @returns a value based on TLD or undefined
 * supported values: "de" | "at" | "be" | "it" | "hu" | "es" | "fr" | "lu" | "nl" | "bg" | "cz" | "ro" | "int" | "pl" | "hr" | "ru" | "se" | "tr" | "ua" | "gb"
 */

const MarketValues = [
    'de',
    'at',
    'be',
    'it',
    'hu',
    'es',
    'fr',
    'lu',
    'nl',
    'bg',
    'cz',
    'ro',
    'hu',
    'int',
    'pl',
    'hr',
    'ru',
    'se',
    'tr',
    'ua',
];

const isGA4Market = (input) => MarketValues.some((value) => value === input);

const ga4Market = () => {
    try {
        const tld = window.location.hostname.split('.').pop();
        const ga4MarketValue = tld === 'com' ? 'int' : tld;

        return isGA4Market(ga4MarketValue) ? ga4MarketValue : undefined;
    } catch (e) {
        return undefined;
    }
};

module.exports = {
    ga4Market: ga4Market,
};
