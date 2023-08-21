const {
    waitTillGA4PageView,
    dealerId,
    ga4ClientId,
    gaUserId,
    loginStatus,
    adBlockerUsage,
    customerId,
} = require('./ga4-event-parameters');

const trackGA4Event = (event, otherData) => {
    if (event.name.indexOf('_') === -1) throw new Error('Event name must follow naming convention: {feature}_{action}');

    window.dataLayer = window.dataLayer || [];
    const eventDetails = !event.details
        ? undefined
        : Object.entries(event.details)
              .map(([key, value]) => `${key}=${value}`)
              .join(';');

    waitTillGA4PageView(() => {
        if (otherData) {
            window.dataLayer.push(otherData);
        }

        window.dataLayer.push({
            event: 'ga4_event',
            event_name: event.name,
            event_type: event.type,
            event_details: eventDetails,
        });
    });
};

const trackGA4PageViewEvent = (eventData, dataLayerVariables) => {
    window.dataLayer = window.dataLayer || [];
    const common_countryObj = window.dataLayer.find((x) => x.common_country);
    const country = common_countryObj && common_countryObj.common_country;
    if (!country) {
        throw new Error('COMMON_COUNTRY_NOT_SET');
    }

    if (dataLayerVariables) {
        window.dataLayer.push(dataLayerVariables);
    }

    const dealerIdValue = dealerId();
    const market = window.document.location.hostname.split('.').pop() || undefined;

    window.dataLayer.push(
        Object.assign(
            {
                event_name: 'page_view',
                event_type: 'page_load',
                content_id: 'all',
                dealer_id: dealerIdValue,
                ga4_client_id: ga4ClientId(),
                ga_user_id: gaUserId(),
                login_status: loginStatus(),
                adblocker_usage: adBlockerUsage(),
                customer_id: customerId(undefined, dealerIdValue, undefined), // needed classified_customerId and chefplatz_ad_dealer_id dataLayervariables. How to get them?,  this line needs to be revisited when the original code from showcar-react updated
                market: market,
            },
            eventData
        )
    );

    window.dataLayer.push({ event: 'page_view' });
};

module.exports = { trackGA4Event: trackGA4Event, trackGA4PageViewEvent: trackGA4PageViewEvent };
