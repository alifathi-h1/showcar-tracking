const cookieHelper = require('../cookieHelper');
const { getCustomerInfo } = require('./customerId');
const { DEALER } = require('./loginStatus');

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

const as24VisitorId = () => {
    const visitorCookie = cookieHelper.read('as24Visitor');

    return visitorCookie ? visitorCookie : undefined;
};

module.exports = {
    waitTillGA4PageView: waitTillGA4PageView,
    dealerId: dealerId,
    gaClientId: gaClientId,
    as24VisitorId: as24VisitorId,
};
