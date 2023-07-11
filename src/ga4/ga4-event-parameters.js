const cookieHelper = require('../cookieHelper');
const { getCustomerInfo } = require('./customerId');

const waitTillGA4PageView = (callback) => {
    if (window.dataLayer.some((e) => e.event === 'page_view')) {
        callback();
    } else {
        setTimeout(() => waitTillGA4PageView(callback), 100);
    }
};

const dealerId = () => {
    const customerInfo = getCustomerInfo();

    return customerInfo && customerInfo.customerType === DEALER ? customerInfo.customerId : undefined;
};

const gaClientId = () => {
    const clientIdCookie = cookieHelper.read('_asga');

    if (!clientIdCookie) return;

    const splitted_cookie = clientIdCookie.split('.');
    return splitted_cookie[2] + '.' + splitted_cookie[3];
};

const gaUserId = () => {
    const visitorCookie = cookieHelper.read('as24Visitor');

    return visitorCookie ? visitorCookie : undefined;
};

const adBlockerUsage = () => {
    // this function needs to be updated when its original function from showcar-react updated
    return 'adblock active';
};

module.exports = {
    waitTillGA4PageView: waitTillGA4PageView,
    dealerId: dealerId,
    gaClientId: gaClientId,
    gaUserId: gaUserId,
    adBlockerUsage: adBlockerUsage,
};
