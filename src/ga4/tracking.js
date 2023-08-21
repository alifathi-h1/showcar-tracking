const {
    waitTillGA4PageView,
    dealerId,
    gaClientId,
    as24VisitorId,
} = require('./eventParameters');
const { loginStatus } = require('./loginStatus');
const { adBlockerUsage } = require('./adBlockerUsage');
const { customerId } = require('./customerId');
const { ga4Market } = require('./market');

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

    if (dataLayerVariables) {
        window.dataLayer.push(dataLayerVariables);
    }

    const dealerIdValue = dealerId();
    
    adBlockerUsage(window)
        .then(adBlockerStatus => {
            window.dataLayer.push(
                Object.assign(
                    {
                        event_name: 'page_view',
                        event_type: 'page_load',
                        content_id: 'all',
                        dealer_id: dealerIdValue,
                        ga_client_id: gaClientId(),
                        as24_visitor_id: as24VisitorId(),
                        login_status: loginStatus(),
                        adblocker_usage: adBlockerStatus,
                        customer_id: customerId(),
                        market: ga4Market(),
                    },
                    eventData
                )
            );
        
            window.dataLayer.push({ event: 'page_view' });
        });
};

module.exports = { trackGA4Event: trackGA4Event, trackGA4PageViewEvent: trackGA4PageViewEvent };
