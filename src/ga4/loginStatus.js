const { ssoToken, parseJwt } = require('../utils');

const DEALER = 'D'; // Classic Dealer
const PRIVATE_BASIC = 'B'; // Basic Private person
const PRIVATE = 'P'; // Private person

/**
 *
 * @returns "not_logged_in" | "logged-in|b2c" | "logged-in|b2b" | "logged-in|other"
 */
const loginStatus = () => {
    const token = ssoToken();

    if (!token) return 'not_logged_in';

    const user = parseJwt(token);

    if (!user) return 'not_logged_in';

    switch (user.cty) {
        case PRIVATE_BASIC:
        case PRIVATE:
            return 'logged-in|b2c';

        case DEALER:
            return 'logged-in|b2b';

        default:
            return 'logged-in|other';
    }
};

module.exports = {
    loginStatus: loginStatus,
    DEALER: DEALER,
};
