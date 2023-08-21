/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var tracking = __webpack_require__(1);
	window.ut = tracking.ut || [];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var trackingEnabled = location.hash.indexOf('tracking-off=true') < 0;
	
	var startTracking = function startTracking() {
	    var gtm = __webpack_require__(2);
	    var dealerGtm = __webpack_require__(9);
	    var ga4Tracking = __webpack_require__(10);
	
	    function processCommand(data) {
	        var fn, args;
	
	        if (data[0] === 'ga4Event') {
	            ga4Tracking.trackGA4Event(data[1], data[2]);
	        }
	
	        if (data[0] === 'ga4PageviewEvent') {
	            ga4Tracking.trackGA4PageViewEvent(data[1], data[2]);
	        }
	
	        if (data[0] === 'pagename') {
	            gtm.setPagename(data[1]);
	        }
	
	        if (data[0] === 'gtm') {
	            fn = gtm[data[1]];
	            args = data.slice(2);
	            if (typeof fn === 'function') {
	                fn.apply(gtm, args);
	            }
	        }
	
	        if (data[0] === 'dealer-gtm') {
	            fn = dealerGtm[data[1]];
	            args = data.slice(2);
	            if (typeof fn === 'function') {
	                fn.apply(dealerGtm, args);
	            }
	        }
	
	        if (data[0] === 'cmp' && window.__tcfapi && data[1] === 'onPersonalizedCookiesAllowed' && typeof data[2] === 'function') {
	            var userCallback = data[2];
	
	            var callback = function callback(partialTcData, success) {
	                if (success && (partialTcData.eventStatus === 'tcloaded' || partialTcData.eventStatus === 'useractioncomplete')) {
	                    window.__tcfapi('getFullTCData', 2, function (tcData) {
	                        if (tcData.purpose.legitimateInterests['25'] && tcData.purpose.consents['26']) {
	                            userCallback();
	                        }
	                        window.__tcfapi('removeEventListener', 2, callback);
	                    });
	                }
	            };
	
	            window.__tcfapi('addEventListener', 2, callback);
	        }
	    }
	
	    var ut = window.ut || (window.ut = []);
	
	    if (ut.push === Array.prototype.push) {
	        ut.push = function () {
	            Array.prototype.push.apply(window.ut, arguments);
	            processCommand.apply({}, arguments);
	        };
	
	        ut.forEach(processCommand);
	    }
	
	    __webpack_require__(19);
	
	    module.exports = {
	        gtm: gtm,
	        ut: ut
	    };
	};
	
	__webpack_require__(20);
	
	// if (window.location.hostname.split('.').pop() === 'de') {
	//     require('./ivw');
	// }
	
	if (window.location.hostname.split('.').pop() === 'at') {
	    __webpack_require__(21);
	}
	
	var run = function run() {
	    if (!trackingEnabled) {
	        console.log('Tracking disabled');
	        return;
	    }
	
	    startTracking();
	};
	
	run();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var merge = __webpack_require__(3);
	
	var gtm = __webpack_require__(6);
	var containerId = __webpack_require__(7)(location.hostname);
	var viewport = __webpack_require__(8);
	
	var pagename;
	
	function setPagename(pn) {
	    pagename = pn;
	}
	
	function generateCommonParams(data) {
	    var mergedPagename = merge({}, pagename, data);
	
	    if (!mergedPagename || !mergedPagename.country || !mergedPagename.market || !mergedPagename.category || !mergedPagename.pageid || !mergedPagename.environment) {
	        if (mergedPagename.environment !== 'test' || mergedPagename.environment !== 'live') {
	            throw new Error('Invalid environment type, ' + JSON.stringify(mergedPagename));
	        }
	        throw new Error('Incorrect pagename, ' + JSON.stringify(mergedPagename));
	    }
	
	    var commonPageName = [mergedPagename.country, mergedPagename.market, mergedPagename.category, mergedPagename.group, mergedPagename.pageid].filter(function (x) {
	        return x;
	    }).join('/');
	
	    if (mergedPagename.layer) {
	        commonPageName += '|' + mergedPagename.layer;
	    }
	
	    var commonData = {
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
	
	        common_techState: mergedPagename.techState || ''
	    };
	
	    return commonData;
	}
	
	function trackClick(params) {
	    if (params.eventcategory && params.eventaction) {
	        gtm.push({
	            event: 'event_trigger',
	            event_category: params.eventcategory,
	            event_action: params.eventaction,
	            event_label: params.eventlabel || '',
	            event_non_interaction: false
	        });
	    } else {
	        //DEPRECATED
	        gtm.push(generateCommonParams(params));
	        gtm.push({
	            event: 'click'
	        });
	    }
	}
	
	var firstPageview = true;
	
	function trackPageview(data) {
	    if (firstPageview) {
	        gtm.push(viewport);
	    }
	
	    gtm.push(generateCommonParams(data));
	
	    setTimeout(function () {
	        if (firstPageview) {
	            gtm.loadContainer(containerId);
	            gtm.push({
	                event: 'common_data_ready'
	            });
	            gtm.push({
	                event: 'data_ready'
	            });
	            firstPageview = false;
	        } else {
	            gtm.push({
	                event: 'pageview'
	            });
	        }
	    }, 10);
	}
	
	module.exports = {
	    setPagename: setPagename,
	    trackClick: trackClick,
	
	    set: gtm.push,
	    pageview: trackPageview,
	    click: trackClick
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var extend = __webpack_require__(4);
	
	module.exports = function merge() {
	    var args = [].slice.call(arguments);
	    args.unshift({});
	    return extend.apply(this, args);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(5);
	
	module.exports = function (obj) {
	    if (!isObject(obj)) return obj;
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	        source = arguments[i];
	        for (prop in source) {
	            obj[prop] = source[prop];
	        }
	    }
	    return obj;
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = function isObject(obj) {
	    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	    return !!obj && (type === 'function' || type === 'object');
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	var dataLayer = window.dataLayer = window.dataLayer || [];
	var useNewArrayLogic = window.location.href.indexOf('tracking-arrays=true') >= 0;
	var domainsThatRequireConsent = ['at', 'fr', 'nl'];
	
	module.exports = {
	    loadContainer: function loadContainer(containerId) {
	        var gtmAlreadyLoadedClassName = 'gtm-main-container-load-initiated';
	        var alreadyInitiatedMainGtmContainerLoaded = document.documentElement.className.indexOf(gtmAlreadyLoadedClassName) >= 0;
	
	        if (alreadyInitiatedMainGtmContainerLoaded) {
	            // preventing duplicated load of main GTM container
	            return;
	        }
	
	        document.documentElement.className += ' ' + gtmAlreadyLoadedClassName;
	
	        var tld = window.location.hostname.split('.').pop();
	        if (domainsThatRequireConsent.includes(tld) && window.__tcfapi) {
	            var callback = function callback(tcData, success) {
	                if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
	                    window.__tcfapi('removeEventListener', 2, function () {}, tcData.listenerId);
	                    __tcfapi('getTCData', 2, function (tcData, success) {
	                        if (success && tcData.purpose.consents[1] && tcData.purpose.consents[2] && tcData.purpose.consents[3] && tcData.purpose.consents[4] && tcData.purpose.consents[5] && tcData.purpose.consents[6] && tcData.purpose.consents[7] && tcData.purpose.consents[8] && tcData.purpose.consents[9] && tcData.purpose.consents[10]) {
	                            loadContainer();
	                        }
	                    });
	                }
	            };
	            window.__tcfapi('addEventListener', 2, callback);
	        } else {
	            loadContainer();
	        }
	
	        function loadContainer() {
	            (function (w, d, s, l, i) {
	                w[l] = w[l] || [];
	                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
	                var f = d.getElementsByTagName(s)[0],
	                    j = d.createElement(s),
	                    dl = l != 'dataLayer' ? '&l=' + l : '';
	                j.async = true;
	                j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
	                f.parentNode.insertBefore(j, f);
	            })(window, document, 'script', 'dataLayer', containerId);
	        }
	    },
	
	    push: function push() {
	        if (!arguments.length) {
	            return;
	        }
	
	        var args = [].slice.call(arguments);
	
	        args.map(function (data) {
	            for (var key in data) {
	                if (!useNewArrayLogic || typeof data[key] === 'string') {
	                    data[key] = toLower(data[key]);
	                }
	            }
	
	            return data;
	        });
	
	        dataLayer.push.apply(dataLayer, args);
	    }
	};
	
	function toLower(val) {
	    return val && ('' + val).toLowerCase();
	}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';
	
	var containerIdsByTld = {
	    de: 'GTM-MK57H2',
	    at: 'GTM-WBZ87G',
	    be: 'GTM-5BWB2M',
	    lu: 'GTM-NDBDCZ',
	    es: 'GTM-PS6QHN',
	    fr: 'GTM-PD93LD',
	    it: 'GTM-WTCSNR',
	    nl: 'GTM-TW48BJ',
	    com: 'GTM-KWX9NX'
	};
	
	var isIdentityPage = function isIdentityPage(hostname) {
	    return hostname === "accounts.autoscout24.com";
	};
	
	var extractTldFromRedirectUrl = function extractTldFromRedirectUrl(url) {
	    // search for ui_locales=xx in URL
	    var regexp = new RegExp(/ui_locales=([a-z]+)/g);
	    var matches = window.location.href.match(regexp);
	    var tld = 'com';
	
	    if (matches) {
	        var match = matches.join(''); // i.e. ui_locales=de
	        tld = match.split('=')[1];
	    }
	
	    return tld;
	};
	
	module.exports = function (hostname) {
	    var tld = isIdentityPage(hostname) ? extractTldFromRedirectUrl(window.location.href) : hostname.split('.').pop();
	    return containerIdsByTld[tld] || containerIdsByTld['com'];
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || screen.width);
	
	module.exports = {
	    session_viewport: viewportWidth >= 994 ? 'l' : viewportWidth >= 768 ? 'm' : viewportWidth >= 480 ? 's' : 'xs'
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	
	var currentVehicles = [];
	
	function add(data) {
	    currentVehicles.push(data);
	}
	
	function commit() {
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	        list_productidsall: currentVehicles
	    });
	
	    currentVehicles = [];
	}
	
	module.exports = {
	    add: add,
	    commit: commit
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _require = __webpack_require__(11),
	    waitTillGA4PageView = _require.waitTillGA4PageView,
	    dealerId = _require.dealerId,
	    ga4ClientId = _require.ga4ClientId,
	    as24VisitorId = _require.as24VisitorId;
	
	var _require2 = __webpack_require__(15),
	    loginStatus = _require2.loginStatus;
	
	var _require3 = __webpack_require__(16),
	    adBlockerUsage = _require3.adBlockerUsage;
	
	var _require4 = __webpack_require__(13),
	    customerId = _require4.customerId;
	
	var _require5 = __webpack_require__(18),
	    ga4Market = _require5.ga4Market;
	
	var trackGA4Event = function trackGA4Event(event, otherData) {
	    if (event.name.indexOf('_') === -1) throw new Error('Event name must follow naming convention: {feature}_{action}');
	
	    window.dataLayer = window.dataLayer || [];
	    var eventDetails = !event.details ? undefined : Object.entries(event.details).map(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            key = _ref2[0],
	            value = _ref2[1];
	
	        return key + '=' + value;
	    }).join(';');
	
	    waitTillGA4PageView(function () {
	        if (otherData) {
	            window.dataLayer.push(otherData);
	        }
	
	        window.dataLayer.push({
	            event: 'ga4_event',
	            event_name: event.name,
	            event_type: event.type,
	            event_details: eventDetails
	        });
	    });
	};
	
	var trackGA4PageViewEvent = function trackGA4PageViewEvent(eventData, dataLayerVariables) {
	    window.dataLayer = window.dataLayer || [];
	
	    if (dataLayerVariables) {
	        window.dataLayer.push(dataLayerVariables);
	    }
	
	    var dealerIdValue = dealerId();
	
	    adBlockerUsage(window).then(function (adBlockerStatus) {
	        window.dataLayer.push(_extends({
	            event_name: 'page_view',
	            event_type: 'page_load',
	            content_id: 'all',
	            dealer_id: dealerIdValue,
	            ga4_client_id: ga4ClientId(),
	            as24_visitor_id: as24VisitorId(),
	            login_status: loginStatus(),
	            adblocker_usage: adBlockerStatus,
	            customer_id: customerId(),
	            market: ga4Market()
	        }, eventData));
	
	        window.dataLayer.push({ event: 'page_view' });
	    });
	};
	
	module.exports = { trackGA4Event: trackGA4Event, trackGA4PageViewEvent: trackGA4PageViewEvent };

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var cookieHelper = __webpack_require__(12);
	
	var _require = __webpack_require__(13),
	    getCustomerInfo = _require.getCustomerInfo;
	
	var _require2 = __webpack_require__(15),
	    DEALER = _require2.DEALER;
	
	var waitTillGA4PageView = function waitTillGA4PageView(callback) {
	    if (window.dataLayer.some(function (e) {
	        return e.event === 'page_view';
	    })) {
	        callback();
	    } else {
	        setTimeout(function () {
	            return waitTillGA4PageView(callback);
	        }, 100);
	    }
	};
	
	var dealerId = function dealerId() {
	    var customerInfo = getCustomerInfo();
	
	    return customerInfo && customerInfo.customerType === DEALER ? customerInfo.customerId : undefined;
	};
	
	var ga4ClientId = function ga4ClientId() {
	    var clientIdCookie = cookieHelper.read('_asga');
	
	    if (!clientIdCookie) return;
	
	    var splitted_cookie = clientIdCookie.split('.');
	    return splitted_cookie[2] + '.' + splitted_cookie[3];
	};
	
	var as24VisitorId = function as24VisitorId() {
	    var visitorCookie = cookieHelper.read('as24Visitor');
	
	    return visitorCookie ? visitorCookie : undefined;
	};
	
	module.exports = {
	    waitTillGA4PageView: waitTillGA4PageView,
	    dealerId: dealerId,
	    ga4ClientId: ga4ClientId,
	    as24VisitorId: as24VisitorId
	};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	'use strict';
	
	var doc = document;
	
	function readCookie(name, options) {
	    if (!name) {
	        return null;
	    }
	
	    var decodingFunction = options && options.decodingFunction || decodeURIComponent;
	
	    return decodingFunction(doc.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
	}
	
	function setCookie(name, value, options) {
	    if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
	        return false;
	    }
	
	    var expiresString = '';
	
	    if (options.expires) {
	        var date = new Date();
	        date.setTime(+date + options.expires);
	        expiresString = '; expires=' + date.toGMTString();
	    }
	
	    options.encodingFunction = options.encodingFunction || encodeURIComponent;
	
	    document.cookie = encodeURIComponent(name) + '=' + options.encodingFunction(value) + expiresString + (options.domain ? '; domain=' + options.domain : '') + (options.path ? '; path=' + options.path : '') + (options.secure ? '; secure' : '');
	
	    return true;
	}
	
	function removeCookie(name, options) {
	    if (hasCookie(name)) {
	        return false;
	    }
	    document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (name ? '; domain=' + options.domain : '') + (options.path ? '; path=' + options.path : '');
	    return true;
	}
	
	function hasCookie(name) {
	    if (!name) {
	        return false;
	    }
	    return new RegExp('(?:^|;\\s*)' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(document.cookie);
	}
	
	module.exports = {
	    read: readCookie,
	    set: setCookie,
	    remove: removeCookie
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(12),
	    read = _require.read; // VErify what this func does.
	
	
	var _require2 = __webpack_require__(14),
	    ssoToken = _require2.ssoToken,
	    parseJwt = _require2.parseJwt;
	
	/**
	 *
	 * @returns value for customer_id data layer variable
	 */
	
	
	var customerId = function customerId() {
	    var customerInfo = getCustomerInfo();
	
	    return customerInfo && customerInfo.customerId;
	};
	
	/**
	 *
	 * @returns UserInfo as {
	        customerId: string;
	        customerType: string;
	    }
	 */
	var getCustomerInfo = function getCustomerInfo() {
	    var customerInfoFromSSO = getCustomerInfoFromSSOCookie();
	
	    return customerInfoFromSSO || getCustomerInfoFromUserCookie();
	};
	
	var getCustomerInfoFromSSOCookie = function getCustomerInfoFromSSOCookie() {
	    var token = ssoToken();
	
	    if (!token) return undefined;
	
	    var userInfo = parseJwt(token);
	
	    if (!userInfo) return undefined;
	
	    var customerId = userInfo.ctid !== '' ? userInfo.ctid : undefined;
	    var customerType = userInfo.cty !== '' ? userInfo.cty : undefined;
	
	    return customerId && customerType ? { customerId: customerId, customerType: customerType } : undefined;
	};
	
	var getCustomerInfoFromUserCookie = function getCustomerInfoFromUserCookie() {
	    var userCookie = read('User');
	
	    if (!userCookie) return;
	
	    var userCookieParams = new URLSearchParams(userCookie);
	    var customerId = userCookieParams.get('CustomerID');
	    customerId = customerId ? customerId.replace(/[()]+/g, '') : customerId;
	    var customerType = userCookieParams.get('CustomerType');
	
	    return customerId && customerType ? { customerId: customerId, customerType: customerType } : undefined;
	};
	
	module.exports = {
	    customerId: customerId,
	    getCustomerInfo: getCustomerInfo
	};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var cookieHelper = __webpack_require__(12);
	
	var parseJwt = function parseJwt(token) {
	    var partials = token.split('.');
	    var jsonPayload = decodeURIComponent(atob(partials[1]));
	
	    try {
	        return JSON.parse(jsonPayload);
	    } catch (e) {
	        return undefined;
	    }
	};
	
	var ssoToken = function ssoToken() {
	    var res = cookieHelper.read('sso');
	
	    return res ? res.trim().length > 0 ? res : null : null;
	};
	
	module.exports = {
	    parseJwt: parseJwt,
	    ssoToken: ssoToken
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(14),
	    ssoToken = _require.ssoToken,
	    parseJwt = _require.parseJwt;
	
	var DEALER = 'D'; // Classic Dealer
	var PRIVATE_BASIC = 'B'; // Basic Private person
	var PRIVATE = 'P'; // Private person
	
	/**
	 *
	 * @returns "not_logged_in" | "logged-in|b2c" | "logged-in|b2b" | "logged-in|other"
	 */
	var loginStatus = function loginStatus() {
	    var token = ssoToken();
	
	    if (!token) return 'not_logged_in';
	
	    var user = parseJwt(token);
	
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
	    DEALER: DEALER
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * returns "adblock active" | "no adblock detected". How to get it?.
	 */
	
	var _require = __webpack_require__(17),
	    getAdBlocker = _require.getAdBlocker;
	
	/**
	 * @param window global variable
	 * @returns AdBlockerUsage as - 'no adblock detected'
	    | 'adblock active'
	    | 'adblock detector failed'
	    | 'init adblock detector failed'
	 */
	
	
	var adBlockerUsage = function adBlockerUsage(window) {
	    return new Promise(function (resolve) {
	        getAdBlocker(window);
	        if (typeof window.adblockDetector === 'undefined') {
	            return resolve('init adblock detector failed');
	        }
	        window.adblockDetector.init({
	            debug: false,
	            found: function found() {
	                return resolve('adblock active');
	            },
	            notfound: function notfound() {
	                return resolve('no adblock detected');
	            }
	        });
	        // In the worst case, if the adblockDetector never executes our callbacks. We give up on it after 2 seconds!
	        setTimeout(function () {
	            return resolve('adblock detector failed');
	        }, 2000);
	    });
	};
	
	module.exports = {
	    adBlockerUsage: adBlockerUsage
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// Copied from: https://github.com/AutoScout24/OSA-One-Scout-Adlib/blob/master/src/core/util/ad-block-detection.js
	
	// ===============================================
	// AdBlock detector
	//
	// Attempts to detect the presence of Ad Blocker software and notify listener of its existence.
	// Copyright (c) 2017 IAB
	//
	// The BSD-3 License
	// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	// ===============================================
	
	/**
	 * @name window.adblockDetector
	 *
	 * IAB Adblock detector.
	 * Usage: window.adblockDetector.init(options);
	 *
	 * Options object settings
	 *
	 *	@prop debug:  boolean
	 *         Flag to indicate additional debug output should be printed to console
	 *
	 *	@prop found: @function
	 *         Callback function to fire if adblock is detected
	 *
	 *	@prop notfound: @function
	 *         Callback function to fire if adblock is not detected.
	 *         NOTE: this function may fire multiple times and give false negative
	 *         responses during a test until adblock is successfully detected.
	 *
	 *	@prop complete: @function
	 *         Callback function to fire once a round of testing is complete.
	 *         The test result (boolean) is included as a parameter to callback
	 *
	 * example: 	window.adblockDetector.init(
	 {
						found: function(){ ...},
	 					notfound: function(){...}
					}
	 );
	 *
	 *
	 */
	
	'use strict';
	
	var getAdBlocker = function getAdBlocker(win) {
	    var version = '1.0';
	
	    var ofs = 'offset',
	        cl = 'client';
	    var noop = function noop() {};
	
	    var isOldIEevents = win.addEventListener === undefined;
	
	    /**
	     * Options set with default options initialized
	     *
	     */
	    var _options = {
	        loopDelay: 50,
	        maxLoop: 5,
	        debug: true,
	        found: noop, // function to fire when adblock detected
	        notfound: noop, // function to fire if adblock not detected after testing
	        complete: noop // function to fire after testing completes, passing result as parameter
	    };
	
	    var listeners = []; // event response listeners
	    var baitNode = null;
	    var quickBait = {
	        cssClass: 'ad-banner banner_ad adsbygoogle ad_block adslot ad_slot advert1 content-ad'
	    };
	    var baitTriggers = {
	        nullProps: [ofs + 'Parent'],
	        zeroProps: []
	    };
	
	    baitTriggers.zeroProps = [ofs + 'Height', ofs + 'Left', ofs + 'Top', ofs + 'Width', ofs + 'Height', cl + 'Height', cl + 'Width'];
	
	    // result object
	    var exeResult = {
	        quick: null,
	        remote: null
	    };
	
	    var findResult = null; // result of test for ad blocker
	
	    var timerIds = {
	        test: 0,
	        download: 0
	    };
	
	    function isFunc(fn) {
	        return typeof fn === 'function';
	    }
	
	    /**
	     * Make a DOM element
	     */
	    function makeEl(tag, attributes) {
	        var attr = attributes;
	        var el = document.createElement(tag);
	        var k = void 0;
	
	        if (attr) {
	            for (k in attr) {
	                if (attr.hasOwnProperty(k)) {
	                    el.setAttribute(k, attr[k]);
	                }
	            }
	        }
	
	        return el;
	    }
	
	    function attachEventListener(dom, eventName, handler) {
	        if (isOldIEevents) {
	            dom.attachEvent('on' + eventName, handler);
	        } else {
	            dom.addEventListener(eventName, handler, false);
	        }
	    }
	
	    function log(message, isError) {
	        if (!_options.debug && !isError) {
	            return;
	        }
	        if (win.console && win.console.log) {
	            if (isError) {
	                console.error('[ABD] ' + message);
	            } else {
	                console.log('[ABD] ' + message);
	            }
	        }
	    }
	
	    // =============================================================================
	    /**
	     * Begin execution of the test
	     */
	    function beginTest(bait) {
	        log('start beginTest');
	        if (findResult === true) {
	            return; // we found it. don't continue executing
	        }
	        castBait(bait);
	
	        exeResult.quick = 'testing';
	
	        timerIds.test = setTimeout(function () {
	            reelIn(bait, 1);
	        }, 5);
	    }
	
	    /**
	     * Create the bait node to see how the browser page reacts
	     */
	    function castBait(bait) {
	        var d = document,
	            b = d.body;
	        var baitStyle = 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;';
	
	        if (bait === null || typeof bait === 'string') {
	            log('invalid bait being cast');
	            return;
	        }
	
	        if (bait.style !== null) {
	            baitStyle += bait.style;
	        }
	
	        baitNode = makeEl('div', {
	            class: bait.cssClass,
	            style: baitStyle
	        });
	
	        log('adding bait node to DOM');
	
	        b.appendChild(baitNode);
	    }
	
	    /**
	     * Run tests to see if browser has taken the bait and blocked the bait element
	     */
	    function reelIn(bait, attemptNum) {
	        var i = void 0;
	        var body = document.body;
	        var found = false;
	
	        if (baitNode === null) {
	            log('recast bait');
	            castBait(bait || quickBait);
	        }
	
	        if (typeof bait === 'string') {
	            log('invalid bait used', true);
	            if (clearBaitNode()) {
	                setTimeout(function () {}, 5);
	            }
	
	            return;
	        }
	
	        if (timerIds.test > 0) {
	            clearTimeout(timerIds.test);
	            timerIds.test = 0;
	        }
	
	        // test for issues
	
	        if (body.getAttribute('abp') !== null) {
	            log('found adblock body attribute');
	            found = true;
	        }
	
	        for (i = 0; i < baitTriggers.nullProps.length; i++) {
	            if (baitNode[baitTriggers.nullProps[i]] === null) {
	                if (attemptNum > 4) {
	                    found = true;
	                }
	                log('found adblock null attr: ' + baitTriggers.nullProps[i]);
	                break;
	            }
	            if (found === true) {
	                break;
	            }
	        }
	
	        for (i = 0; i < baitTriggers.zeroProps.length; i++) {
	            if (found === true) {
	                break;
	            }
	            if (baitNode[baitTriggers.zeroProps[i]] === 0) {
	                if (attemptNum > 4) {
	                    found = true;
	                }
	                log('found adblock zero attr: ' + baitTriggers.zeroProps[i]);
	            }
	        }
	
	        if (window.getComputedStyle !== undefined) {
	            var baitTemp = window.getComputedStyle(baitNode, null);
	            if (baitTemp.getPropertyValue('display') === 'none' || baitTemp.getPropertyValue('visibility') === 'hidden') {
	                if (attemptNum > 4) {
	                    found = true;
	                }
	                log('found adblock computedStyle indicator');
	            }
	        }
	
	        if (found || attemptNum++ >= _options.maxLoop) {
	            findResult = found;
	            log('exiting test loop - value: ' + findResult);
	            notifyListeners();
	            if (clearBaitNode()) {
	                setTimeout(function () {}, 5);
	            }
	        } else {
	            timerIds.test = setTimeout(function () {
	                reelIn(bait, attemptNum);
	            }, _options.loopDelay);
	        }
	    }
	
	    function clearBaitNode() {
	        if (baitNode === null) {
	            return true;
	        }
	
	        try {
	            if (isFunc(baitNode.remove)) {
	                baitNode.remove();
	            }
	            document.body.removeChild(baitNode);
	        } catch (ex) {
	            // something add here
	        }
	        baitNode = null;
	
	        return true;
	    }
	
	    /**
	     * Fire all registered listeners
	     */
	    function notifyListeners() {
	        var i = void 0,
	            funcs = void 0;
	        if (findResult === null) {
	            return;
	        }
	        for (i = 0; i < listeners.length; i++) {
	            funcs = listeners[i];
	            try {
	                if (funcs !== null) {
	                    if (isFunc(funcs['complete'])) {
	                        funcs['complete'](findResult);
	                    }
	
	                    if (findResult && isFunc(funcs['found'])) {
	                        funcs['found']();
	                    } else if (findResult === false && isFunc(funcs['notfound'])) {
	                        funcs['notfound']();
	                    }
	                }
	            } catch (ex) {
	                log('Failure in notify listeners ' + ex.Message, true);
	            }
	        }
	    }
	
	    /**
	     * Attaches event listener or fires if events have already passed.
	     */
	    function attachOrFire() {
	        var fireNow = false;
	
	        if (document.readyState) {
	            if (document.readyState === 'complete') {
	                fireNow = true;
	            }
	        }
	
	        var fn = function fn() {
	            beginTest(quickBait, false);
	        };
	
	        if (fireNow) {
	            fn();
	        } else {
	            attachEventListener(win, 'load', fn);
	        }
	    }
	
	    win['adblockDetector'] = {
	        /**
	         * Version of the adblock detector package
	         */
	        version: version,
	
	        /**
	         * Initialization function. See comments at top for options object
	         */
	        init: function init(options) {
	            var k = void 0;
	
	            if (!options) {
	                return;
	            }
	
	            var funcs = {
	                complete: noop,
	                found: noop,
	                notfound: noop
	            };
	
	            for (k in options) {
	                if (options.hasOwnProperty(k)) {
	                    if (k === 'complete' || k === 'found' || k === 'notfound') {
	                        funcs[k.toLowerCase()] = options[k];
	                    } else {
	                        _options[k] = options[k];
	                    }
	                }
	            }
	
	            listeners.push(funcs);
	
	            attachOrFire();
	        }
	    };
	};
	
	module.exports = {
	    getAdBlocker: getAdBlocker
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * @returns a value based on TLD or undefined
	 * supported values: "de" | "at" | "be" | "it" | "hu" | "es" | "fr" | "lu" | "nl" | "bg" | "cz" | "ro" | "int" | "pl" | "hr" | "ru" | "se" | "tr" | "ua" | "gb"
	 */
	
	var MarketValues = ['de', 'at', 'be', 'it', 'hu', 'es', 'fr', 'lu', 'nl', 'bg', 'cz', 'ro', 'hu', 'int', 'pl', 'hr', 'ru', 'se', 'tr', 'ua'];
	
	var isGA4Market = function isGA4Market(input) {
	    return MarketValues.some(function (value) {
	        return value === input;
	    });
	};
	
	var ga4Market = function ga4Market() {
	    try {
	        var tld = window.location.hostname.split('.').pop();
	        var ga4MarketValue = tld === 'com' ? 'int' : tld;
	
	        return isGA4Market(ga4MarketValue) ? ga4MarketValue : undefined;
	    } catch (e) {
	        return undefined;
	    }
	};
	
	module.exports = {
	    ga4Market: ga4Market
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var as24tracking = _extends(Object.create(HTMLElement.prototype), {
	    inDev: false,
	    supportedActions: ['set', 'click', 'pageview'],
	    supportedTypes: ['gtm', 'pagename'],
	    reservedWords: ['type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],
	
	    attachedCallback: function attachedCallback() {
	        var _this = this;
	
	        var values = this.getAdditionalProperties();
	        var type = this.getAttribute('type');
	        var action = this.getAttribute('action');
	        var args = [type, action];
	
	        if (Object.keys(values).length > 0) {
	            args.push(values);
	        }
	
	        if (type === 'pagename') {
	            args.splice(1, 1);
	        }
	
	        var clickTarget = this.getAttribute('as24-tracking-click-target');
	        if (clickTarget) {
	            var elements = document.querySelectorAll(clickTarget);
	
	            for (var i = 0; i < elements.length; i++) {
	                elements[i].addEventListener('click', function () {
	                    return _this.track(args);
	                });
	            }
	        } else {
	            this.track(args);
	        }
	    },
	    getAdditionalProperties: function getAdditionalProperties() {
	        var _this2 = this;
	
	        var trackingValue = this.getAttribute('as24-tracking-value');
	        var values = trackingValue ? JSON.parse(trackingValue) : {};
	
	        if (Array.isArray(values)) {
	            return values;
	        }
	
	        return Array.prototype.slice.call(this.attributes).filter(function (element) {
	            return !(_this2.reservedWords.indexOf(element.nodeName) > -1);
	        }).reduce(function (prev, curr) {
	            var attrName = _this2.decodeAttributeName(curr.nodeName);
	            prev[attrName] = curr.nodeValue;
	            return prev;
	        }, values);
	    },
	    decodeAttributeName: function decodeAttributeName(attrName) {
	        if (attrName.indexOf('-') > -1) {
	            attrName = attrName.replace(/-([a-z])/g, function (g) {
	                return g[1].toUpperCase();
	            });
	        }
	        return attrName;
	    },
	    track: function track(args) {
	        if (this.inDev) {
	            console.log(args);
	        } else {
	            window.ut = window.ut || [];
	            window.ut.push(args);
	        }
	    }
	});
	
	try {
	    var ctor = document.createElement('as24-tracking').constructor;
	    if (ctor === HTMLElement || ctor === HTMLUnknownElement) {
	        document.registerElement('as24-tracking', {
	            prototype: as24tracking
	        });
	    }
	} catch (e) {
	    if (window && window.console) {
	        window.console.warn('Failed to register CustomElement "as24-tracking".', e);
	    }
	}

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	'use strict';
	
	// TODO: this is an experimental feature.
	// If this works well, we have to document it.
	
	window.addEventListener('click', function (e) {
	    window.dataLayer = window.dataLayer || [];
	
	    var node = e.target;
	
	    do {
	        var rawValue = node.getAttribute('data-click-datalayer-push');
	        if (rawValue) {
	            try {
	                // TODO: Check if we can use something like `eval` but more secure to allow JS style objects
	                // aka. objects without quotes around key names or some computation inside
	                // e.g. { event: "event_trigger", event_category: "category", event_action: "action" }
	                // Don't use `eval` or `new Function(...)` directly because they execute anything => XSS attack
	
	                var value = JSON.parse(rawValue);
	                window.dataLayer.push(value);
	            } catch (e) {
	                console.error('Cannot parse tracking value', rawValue, node);
	            }
	        }
	        node = node.parentNode;
	    } while (node && node.getAttribute);
	});

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';
	
	var path = window.location.pathname;
	var pixelPath = function () {
	    switch (true) {
	        case RegExp('^\/$').test(path):
	            return 'Service/Homepage/Homepage';
	            break;
	        case RegExp('(^\/promo\/preisbewertung)|(^\/auto\-verkaufen)|(^\/fahrzeugbewertung)|(^\/promo\/preisbewertung)').test(path):
	            return 'Service/Sonstiges/Sonstiges';
	            break;
	        case RegExp('(^\/motorrad)|(^\/lst)').test(path):
	            return 'Service/Rubrikenmaerkte/Automarkt';
	            break;
	        case RegExp('(^\/informieren)|(^\/auto)|(^\/moto)').test(path):
	            return 'RedCont/AutoUndMotor/AutoUndMotor';
	            break;
	        case RegExp('^\/unternehmen').test(path):
	            return 'Service/Unternehmenskommunikation/Unternehmenskommunikation';
	            break;
	        default:
	            return 'not_available';
	            break;
	    }
	}();
	
	function detailPage() {
	    loadScript('https://script-at.iocnt.net/iam.js').then(function () {
	        if (window.iom) {
	            // OEWA VERSION="3.0" 
	            window.oewa_data = {
	                cn: 'at', // country 
	                st: 'at_w_atascout24', // sitename 
	                cp: 'Service/Rubrikenmaerkte/Automarkt', // kategorienpfad  
	                sv: 'mo', // die Befragungseinladung wird im mobilen Format ausgespielt 
	                ps: 'lin' // Privacy setting 
	            };
	            iom.c(window.oewa_data, 1);
	        }
	    });
	}
	
	function allPages() {
	    loadScript('https://script-at.iocnt.net/iam.js').then(function () {
	        if (window.iom) {
	            // OEWA VERSION="3.0" 
	            window.oewa_data = {
	                cn: 'at', // country 
	                st: 'at_w_atascout24', // sitename 
	                cp: pixelPath, // kategorienpfad 
	                sv: 'mo', // die Befragungseinladung wird im mobilen Format ausgespielt 
	                ps: 'lin' // Privacy setting 
	            };
	            iom.c(window.oewa_data, 1);
	        }
	    });
	}
	
	function loadScript(src) {
	    return new Promise(function (resolve) {
	        var script = document.createElement('script');
	        var ref = document.getElementsByTagName('script')[0];
	        ref.parentNode.insertBefore(script, ref);
	        script.onload = resolve;
	        script.src = src;
	    });
	}
	
	var onDetailPage = path.startsWith('/angebote') && document.querySelector('as24-tracking[type=pagename]').getAttribute('pageid') === 'detail';
	
	if (onDetailPage) {
	    detailPage();
	
	    try {
	        document.querySelector('as24-carousel').addEventListener('as24-carousel.slide', function (e) {
	            return detailPage();
	        });
	    } catch (e) {}
	} else {
	    if (pixelPath !== 'not_available') {
	        allPages();
	    }
	}

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map