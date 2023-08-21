var cookieHelper = require('./cookieHelper');

const waitTillGA4PageView = (callback) => {
    if (window.dataLayer.some((e) => e.event === 'page_view')) {
        callback();
    } else {
        setTimeout(() => waitTillGA4PageView(callback), 100);
    }
};

const ssoToken = () => {
    const res = cookieHelper.read('sso');

    return res ? (res.trim().length > 0 ? res : null) : null;
};

const parseJwt = (token) => {
    const partials = token.split('.');
    const jsonPayload = decodeURIComponent(atob(partials[1]));

    try {
        return JSON.parse(jsonPayload);
    } catch (e) {
        return undefined;
    }
};

const fallbackToUserCookie = () => {
    const userCookie = cookieHelper.read('User');

    if (!userCookie || userCookie.toLowerCase().indexOf('customerid=') === -1) return;

    const userCookieArray = userCookie.toLowerCase().split('&');

    for (const el of userCookieArray) {
        if (el.match(/customerid=/i)) {
            return el.split('=')[1];
        }
        if (el.match(/customerid\(/i)) {
            const variantCustomerId = el.match(/\((.*?)\)/);
            return variantCustomerId ? variantCustomerId[1] : undefined;
        }
    }
    return undefined;
};

const dealerId = () => {
    const token = ssoToken();

    const user = token ? parseJwt(token) : { ctid: fallbackToUserCookie() };

    if (user && user.ctid !== '') {
        return user.ctid;
    } else {
        return undefined;
    }
};

const ga4ClientId = () => {
    const clientIdCookie = cookieHelper.read('_asga');

    if (!clientIdCookie) return;

    const splitted_cookie = clientIdCookie.split('.');
    return splitted_cookie[2] + '.' + splitted_cookie[3];
};

const gaUserId = () => {
    const visitorCookie = cookieHelper.read('as24Visitor');

    return visitorCookie ? visitorCookie : undefined;
};

const loginStatus = () => {
    // this function needs to be updated when its original function from showcar-react updated
    return 'not_logged_in';
};

const adBlockerUsage = () => {
    // this function needs to be updated when its original function from showcar-react updated
    return 'adblock active';
};

const customerId = (classifiedCustomerId, dealerId, chefplatzDealerId) => {
    // this function needs to be updated when its original function from showcar-react updated
    return classifiedCustomerId || dealerId || chefplatzDealerId;
};

module.exports = {
    waitTillGA4PageView: waitTillGA4PageView,
    dealerId: dealerId,
    ga4ClientId: ga4ClientId,
    gaUserId: gaUserId,
    loginStatus: loginStatus,
    adBlockerUsage: adBlockerUsage,
    customerId: customerId,
};
