const cookieHelper = require('./cookieHelper');

const parseJwt = (token) => {
    const partials = token.split('.');
    const jsonPayload = decodeURIComponent(atob(partials[1]));

    try {
        return JSON.parse(jsonPayload);
    } catch (e) {
        return undefined;
    }
};

const ssoToken = () => {
    const res = cookieHelper.read('sso');

    return res ? (res.trim().length > 0 ? res : null) : null;
};

module.exports = {
    parseJwt: parseJwt,
    ssoToken: ssoToken,
};