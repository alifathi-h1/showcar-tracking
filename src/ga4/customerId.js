const { read } = require('../cookieHelper'); // VErify what this func does.
const { ssoToken, parseJwt } = require('../utils');

/**
 *
 * @returns value for customer_id data layer variable
 */
const customerId = () => {
    const customerInfo = getCustomerInfo();

    return customerInfo && customerInfo.customerId;
};

/**
 *
 * @returns UserInfo as {
        customerId: string;
        customerType: string;
    }
 */
const getCustomerInfo = () => {
    const customerInfoFromSSO = getCustomerInfoFromSSOCookie();

    return customerInfoFromSSO ||
     getCustomerInfoFromUserCookie();
};

const getCustomerInfoFromSSOCookie = () => {
    const token = ssoToken();

    if (!token) return undefined;

    const userInfo = parseJwt(token);

    if (!userInfo) return undefined;

    const customerId = userInfo.ctid !== '' ? userInfo.ctid : undefined;
    const customerType = userInfo.cty !== '' ? userInfo.cty : undefined;

    return customerId && customerType ? { customerId, customerType } : undefined;
};

const getCustomerInfoFromUserCookie = () => {
    const userCookie = read('User');

    if (!userCookie) return;

    const userCookieParams = new URLSearchParams(userCookie);
    let customerId = userCookieParams.get('CustomerID');
    customerId = customerId ? customerId.replace(/[()]+/g, '') : customerId;
    const customerType = userCookieParams.get('CustomerType');

    return customerId && customerType ? { customerId, customerType } : undefined;
};

module.exports = {
    customerId: customerId,
    getCustomerInfo: getCustomerInfo,
};
