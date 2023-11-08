var merge = require('amp-merge');

var gtm = require('./googletagmanager');
var containerId = require('./getGtmContainerId')(location.hostname);
var viewport = require('./viewport');

const {	
    dealerId,	
    gaClientId,	
    as24VisitorId,	
} = require('../ga4/eventParameters');	
const { loginStatus } = require('../ga4/loginStatus');	
const { adBlockerUsage } = require('../ga4/adBlockerUsage');	
const { customerId } = require('../ga4/customerId');	
const { ga4Market } = require('../ga4/market');
const { getItem, setItem } = require('../sessionStorage');

var pagename;

function setPagename(pn) {
    pagename = pn;
}

function generateCommonParams(data) {
    var mergedPagename = merge({}, pagename, data);

    if (
        !mergedPagename ||
        !mergedPagename.country ||
        !mergedPagename.market ||
        !mergedPagename.category ||
        !mergedPagename.pageid ||
        !mergedPagename.environment
    ) {
        if (mergedPagename.environment !== 'test' || mergedPagename.environment !== 'live') {
            throw new Error('Invalid environment type, ' + JSON.stringify(mergedPagename));
        }
        throw new Error('Incorrect pagename, ' + JSON.stringify(mergedPagename));
    }

    var commonPageName = [
        mergedPagename.country,
        mergedPagename.market,
        mergedPagename.category,
        mergedPagename.group,
        mergedPagename.pageid,
    ]
        .filter(function (x) {
            return x;
        })
        .join('/');

    if (mergedPagename.layer) {
        commonPageName += '|' + mergedPagename.layer;
    }

    // Read adBlockerStatus value from sessionStorage. For first pageView in every session, it will be "undefined"
    // This approach is taken to keep trackPageview() synchronous.
    var adBlockerStatus = getItem('adBlockerStatus');

    if (adBlockerStatus === null)
        adBlockerUsage(window)
            .then((statusValue) => setItem('adBlockerStatus', statusValue))
            .catch((err) => console.error("trackPageview: Couldn't get adBlockerStatus", err));

    return {
        common_country: mergedPagename.country,
        common_market: mergedPagename.market,
        common_category: mergedPagename.category,
        common_pageid: mergedPagename.pageid,
        common_pageName: commonPageName,
        common_environment: mergedPagename.environment,

        common_language: mergedPagename.language || '',
        common_group: mergedPagename.group || '',
        common_layer: mergedPagename.layer || '',
        common_attribute: mergedPagename.attribute || '',

        common_linkgroup: mergedPagename.linkgroup || '',
        common_linkid: mergedPagename.linkid || '',

        common_techState: mergedPagename.techState || '',

        // GA4 DataLayer variables
        dealer_id: dealerId(),	
        ga_client_id: gaClientId(),	
        as24_visitor_id: as24VisitorId(),	
        login_status: loginStatus(),	
        adblocker_usage: adBlockerStatus === null ? undefined : adBlockerStatus,	
        customer_id: customerId(),	
        market: ga4Market(),
    }
}

function trackClick(params) {
    if (params.eventcategory && params.eventaction) {
        gtm.push({
            event: 'event_trigger',
            event_category: params.eventcategory,
            event_action: params.eventaction,
            event_label: params.eventlabel || '',
            event_non_interaction: false,
        });
    } else {
        //DEPRECATED
        gtm.push(generateCommonParams(params));
        gtm.push({
            event: 'click',
        });
    }
}

var firstPageview = true;

function trackPageview(data) {
    if (firstPageview) {
        gtm.push(viewport);
    }

    var commonParams = generateCommonParams(data)

    gtm.push(commonParams);
    setTimeout(function () {
        if (firstPageview) {
            gtm.loadContainer(containerId);
            gtm.push({
                event: 'common_data_ready',
            });
            gtm.push({
                event: 'data_ready',
            });
            firstPageview = false;
        } else {
            gtm.push({
                event: 'pageview',
            });
        }
    }, 10);
}

module.exports = {
    setPagename: setPagename,
    trackClick: trackClick,

    set: gtm.push,
    pageview: trackPageview,
    click: trackClick,
};
