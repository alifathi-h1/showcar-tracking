(function () {
    'use strict';

    if (/disable-cmp=true/.test(document.cookie) || location.href.indexOf('disable-cmp=true') > -1) {
        return false;
    }

    ensureVisitorId();
    setCmpCookiesIfProvidedAsQueryStrings();

    // TCF stub
    // prettier-ignore
    !function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="https://gdpr.privacymanager.io/1.0.10/",n(n.s=38)}({38:function(e,t){!function(){if("function"!=typeof window.__tcfapi){var e,t=[],n=window,r=n.document,a=n.__tcfapi?n.__tcfapi.start:function(){};!n.__tcfapi&&function e(){var t=!!n.frames.__tcfapiLocator;if(!t)if(r.body){var a=r.createElement("iframe");a.style.cssText="display:none",a.name="__tcfapiLocator",r.body.appendChild(a)}else setTimeout(e,5);return!t}()&&(n.__tcfapi=function(n,r,a,o){var i=[n,r,a,o];if(!i.length)return t;if("setGdprApplies"===i[0])i.length>3&&2===parseInt(i[1],10)&&"boolean"==typeof i[3]&&(e=i[3],"function"==typeof i[2]&&i[2]("set",!0));else if("ping"===i[0]){var c={gdprApplies:e,cmpLoaded:!1,apiVersion:"2.0"};"function"==typeof i[2]&&i[2](c,!0)}else t.push(i)},n.__tcfapi.commandQueue=t,n.__tcfapi.start=a,n.addEventListener("message",(function(e){var t="string"==typeof e.data,r={};try{r=t?JSON.parse(e.data):e.data}catch(e){}var a=r.__tcfapiCall;a&&n.__tcfapi(a.command,a.version,(function(n,r){if(e.source){var o={__tcfapiReturn:{returnValue:n,success:r,callId:a.callId,command:a.command}};t&&(o=JSON.stringify(o)),e.source.postMessage(o,"*")}}),a.parameter)}),!1))}}()}});

    var tld = window.location.hostname.split('.').pop();

    setCmpLanguage(tld, window.location.pathname);
    hideCmpIfNeeded();
    trackCmpEvents();
    loadCmpWithoutAbTest();

    // if (tld === 'it') {
    //     loadCmpWithAbTest();
    // } else {
    //     loadCmpWithoutAbTest();
    // }

    /** In case we don't have a visitor id we set one. */
    function ensureVisitorId() {
        if (!/as24Visitor/.test(document.cookie)) {
            var domain = window.location.hostname.replace('www.', '').replace('local.', '');
            document.cookie = 'as24Visitor=' + uuidv4() + ';path=/;max-age=31536000;domain=' + domain;
        }
    }

    /** Apps have their own CMP. For webviews they provide the consent string through query strings. */
    function setCmpCookiesIfProvidedAsQueryStrings() {
        var urlParams = new URLSearchParams(window.location.search);
        var euconsentv2 = urlParams.get('euconsent-v2');
        var cconsentv2 = urlParams.get('cconsent-v2');
        var gdprAuditId = urlParams.get('gdpr-auditId');
        var addtlConsent = urlParams.get('addtl_consent');
        var gdprLastInteraction = (Date.now() / 1000).toFixed(3);

        var domain = 'domain=' + document.location.hostname.replace('www.', '').replace('local.', '');
        var path = 'path=/';
        var maxAge = 'max-age=31536000';
        var sameSite = 'samesite=Lax';

        if (euconsentv2 && cconsentv2 && gdprAuditId && addtlConsent) {
            document.cookie = ['euconsent-v2=' + euconsentv2, path, maxAge, domain, sameSite].join(';');
            document.cookie = ['cconsent-v2=' + cconsentv2, path, maxAge, domain, sameSite].join(';');
            document.cookie = ['gdpr-auditId=' + gdprAuditId, path, maxAge, domain, sameSite].join(';');
            document.cookie = ['addtl_consent=' + addtlConsent, path, maxAge, domain, sameSite].join(';');
            document.cookie = ['gdpr-last-interaction=' + gdprLastInteraction, path, maxAge, domain, sameSite].join(
                ';'
            );
        }
    }

    /**
            We take the language from the domain and path and set it for the CMP.
            For non-core countries we always set it to 'en'.

            @param {string} tld - The top level domain
            @param {string} pathname - The full page path
         */
    function setCmpLanguage(tld, pathname) {
        function guessLanguage() {
            switch (tld) {
                case 'at':
                    return 'de';
                case 'be':
                    return pathname.indexOf('/fr/') === 0 ? 'fr' : 'nl';
                case 'lu':
                    return 'fr';
                case 'de':
                case 'it':
                case 'nl':
                case 'fr':
                case 'es':
                case 'pl':
                case 'ro':
                case 'bg':
                case 'cz':
                case 'hr':
                case 'se':
                case 'hu':
                case 'ru':
                case 'tr':
                    return tld;
                default:
                    return 'en';
            }
        }

        __tcfapi('changeLanguage', null, noOp, guessLanguage());
    }

    function trackCmpEvents() {
        function trackInGA(event) {
            window.dataLayer = window.dataLayer || [];

            if (
                dataLayer.filter(function (x) {
                    return x.event === 'data_ready';
                }).length === 0
            ) {
                setTimeout(function () {
                    trackInGA(event);
                }, 100);
                return;
            }

            window.dataLayer.push({
                event: 'event_trigger',
                event_category: 'CMP',
                event_action: event,
            });
        }
        var trackedCmpEvents = [
            'acceptAllButtonClicked',
            'exitButtonClicked',
            'saveAndExitButtonClicked',
            'consentToolShouldBeShown',
            'denyAllButtonClicked',
            'consentManagerDisplayed',
            'consentManagerClosed',
            'consentNoticeDisplayed',
            'consentNoticeClosed',
        ];

        trackedCmpEvents.forEach(function (event) {
            window.__tcfapi(
                'addEventListener',
                2,
                function () {
                    trackInGA(event);
                },
                event
            );
        });
    }

    function loadLiveRampScript(uid) {
        var script = document.createElement('script');
        var ref = document.getElementsByTagName('script')[0];
        ref.parentNode.insertBefore(script, ref);
        script.src = 'https://gdpr-wrapper.privacymanager.io/gdpr/' + uid + '/gdpr-liveramp.js';
    }

    function hideCmpIfNeeded() {
        var shouldHideCmp =
            window.location.hostname === 'accounts.autoscout24.com' || // on Identity pages
            document.querySelector('as24-tracking[pageid="au-company-privacy"]') || // on privacy pages
            window.self !== window.top; // inside an iframe

        if (shouldHideCmp) {
            __tcfapi(
                'addEventListener',
                2,
                function () {
                    __tcfapi('toggleConsentTool', 2, function () {}, false);
                },
                ['consentToolShouldBeShown']
            );
        }
    }

    function noOp() {}

    function loadCmpWithoutAbTest() {
        var tldToLiveRampMap = {
            at: '3e24114e-f793-4eba-8c0f-735086de7eb6',
            be: '55b58bfe-4c4d-4943-bbf3-11ec3eedc57b',
            de: 'a7e8fb93-5f1f-4375-b321-8e998143ae61',
            es: '4411e5b3-1b15-4c38-8b0b-a1bd0a7c1c15',
            fr: 'cd417891-edbe-4abd-9417-c6a2791634e4',
            it: 'b36f31e9-ba65-47f5-b151-66c307c999d9',
            lu: 'd32b30c5-1df5-4e45-825e-1f0d7ce19b08',
            nl: '7a9273aa-bc97-4542-bed2-4ee53960a5ae',
            com: '94a59b49-b7ea-4e1c-93c9-95a65811342b',
            bg: 'c91d7583-8f6b-4377-9930-d2f4121c077e',
            cz: 'af726efc-d085-4dcd-b1b2-d70bec664c9b',
            ru: '1f94bd98-a90c-42b8-b0f6-dd27eab93973',
            pl: 'f45e019f-1401-499f-a329-19c20067273d',
            hu: '47d0ac99-7029-4dae-91ac-15dd5793eded',
            hr: '04a29971-bbd1-4577-a5fb-07e85b4933d3',
            ro: 'c4949c4e-b1b9-4434-919d-c766202554e5',
            se: '5aeab49d-a921-494f-9b8a-84001adbab72',
            tr: 'd54e7f74-947c-49b3-9eb8-248cbad044fb',
            ua: '730298e4-c5c4-463b-a86c-ead192d21c6f',
        };

        var tld = window.location.hostname.split('.').pop();
        var liverampTcf2Id = tldToLiveRampMap[tld];

        loadLiveRampScript(liverampTcf2Id);
    }

    function loadCmpWithAbTest() {
        var userId = getCookieValue('as24Visitor');

        fetchExperimentData(userId).then(function (data) {
            function sendEvent(event) {
                var url =
                    'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/sendevent/' +
                    data.userid +
                    '/' +
                    event;

                if ('sendBeacon' in navigator) {
                    navigator.sendBeacon(url);
                } else {
                    new Image().src = url;
                }
            }

            function trackEventInOptimizely(cmpEvent, optimizelyEvent) {
                window.__tcfapi('addEventListener', 2, sendEvent.bind(optimizelyEvent), cmpEvent);
            }

            trackEventInOptimizely('acceptAllButtonClicked', 'cmpAcceptAll');
            trackEventInOptimizely('saveAndExitButtonClicked', 'cmpSaveAndExit');
            trackEventInOptimizely('exitButtonClicked', 'cmpExit');
            trackEventInOptimizely('saveAndExitButtonClicked', 'cmpExit');
            trackEventInOptimizely('acceptAllButtonClicked', 'cmpExit');
            trackEventInOptimizely('consentToolShouldBeShown', 'cmpShown');
            trackEventInOptimizely('consentNoticeDisplayed', 'cmpNoticeDisplayed');

            if (window.location.pathname.startsWith('/angebote/')) {
                window.addEventListener('click', function (e) {
                    if (!e || !e.target || !e.target.closest) {
                        return;
                    }

                    var isCallButton = !!e.target.closest('a[href^="tel:"]');
                    if (isCallButton) {
                        sendEvent('cmpCall');
                        return;
                    }

                    var isEmailButton = !!e.target.closest('[data-cip-id="submit"]');
                    if (isEmailButton) {
                        sendEvent('cmpEmail');
                        return;
                    }
                });
            }

            var liverampIdByVariation = {
                variation_1: '7fa21d14-bb68-4b5e-b85f-b5ae26b92696', // original IT
                variation_2: '0ea30077-436d-4294-a85e-0af92282c3ea',
                variation_3: 'b36f31e9-ba65-47f5-b151-66c307c999d9',
                variation_4: '00527a4c-e2b6-4933-a80f-4e8792b153d4',
            };

            var liverampid = liverampIdByVariation[data.variation];

            loadLiveRampScript(liverampid);
        });
    }

    /**
        Reads cookie value
        @param {string} cookieName
        @return {string}
    */
    function getCookieValue(cookieName) {
        var x = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
        return x ? x.pop() : '';
    }

    /** Generates a UUID v4
        @return {string}
    */
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
        @param {string} userId
        @return {Promise<{ data: { userid: string; variation: string; } }>}
    */
    function fetchExperimentData(userId) {
        var optimizelyUrl = 'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/activate/';
        var experimentUrl = optimizelyUrl + 'cmp_theme_comparison_it/';

        return fetch(experimentUrl + userId).then(function (r) {
            return r.json();
        });
    }

    /* Keep the things below this comment. Only replace the part above. */

    loadGTM();

    function loadGTM() {
        const tld = window.location.hostname.split('.').pop();
        const containerIdsByTld = {
            de: 'GTM-MK57H2',
            at: 'GTM-WBZ87G',
            be: 'GTM-5BWB2M',
            lu: 'GTM-NDBDCZ',
            es: 'GTM-PS6QHN',
            fr: 'GTM-PD93LD',
            it: 'GTM-WTCSNR',
            nl: 'GTM-TW48BJ',
            com: 'GTM-KWX9NX',
        };

        const containerId = containerIdsByTld[tld] || containerIdsByTld['com'];

        if (tld === 'nl') {
            const callback = (tcData, success) => {
                if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
                    window.__tcfapi('removeEventListener', 2, () => {}, tcData.listenerId);

                    __tcfapi('getTCData', 2, function (tcData, success) {
                        if (
                            tcData.purpose.consents[1] &&
                            tcData.purpose.consents[2] &&
                            tcData.purpose.consents[3] &&
                            tcData.purpose.consents[4] &&
                            tcData.purpose.consents[5] &&
                            tcData.purpose.consents[6] &&
                            tcData.purpose.consents[7] &&
                            tcData.purpose.consents[8] &&
                            tcData.purpose.consents[9] &&
                            tcData.purpose.consents[10]
                        ) {
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
    }
})();
