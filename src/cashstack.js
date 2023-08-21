(function () {
    'use strict';

    if (/disable-cmp=true/.test(document.cookie) || location.href.indexOf('disable-cmp=true') > -1) {
        return false;
    }

    ensureVisitorId();
    setCmpCookiesIfProvidedAsQueryStrings();

    // TCF stub
    // prettier-ignore
    !function(){if("function"!=typeof window.__tcfapi||window.__tcfapi&&"function"!=typeof window.__tcfapi.start){var t,a=[],e=window,i=e.document,c=e.__tcfapi?e.__tcfapi.start:function(){};if(!e.__tcfapi&&function t(){var a=!!e.frames.__tcfapiLocator;if(!a){if(i.body){var c=i.createElement("iframe");c.style.cssText="display:none",c.name="__tcfapiLocator",i.body.appendChild(c)}else setTimeout(t,5)}return!a}()||e.__tcfapi&&!e.__tcfapi.start){var f=e.__tcfapi?e.__tcfapi():[];a.push.apply(a,f),e.__tcfapi=function(...e){var i=[...e];if(!e.length)return a;if("setGdprApplies"===i[0])i.length>3&&2===parseInt(i[1],10)&&"boolean"==typeof i[3]&&(t=i[3],"function"==typeof i[2]&&i[2]("set",!0));else if("ping"===i[0]){var c={gdprApplies:t,cmpLoaded:!1,apiVersion:"2.0"};"function"==typeof i[2]&&i[2](c,!0)}else a.push(i)},e.__tcfapi.commandQueue=a,e.__tcfapi.start=c,e.addEventListener("message",function(t){var a="string"==typeof t.data,i={};try{i=a?JSON.parse(t.data):t.data}catch(c){}var f=i.__tcfapiCall;f&&e.__tcfapi(f.command,f.version,function(e,i){if(t.source){var c={__tcfapiReturn:{returnValue:e,success:i,callId:f.callId,command:f.command}};a&&(c=JSON.stringify(c)),t.source.postMessage(c,"*")}},f.parameter)},!1)}}}();

    loadAs24Cmp()
        .then(() => {
            if (window.__as24CmpEnabled) {
                return;
            }
            console.log('AS24 CMP not enabled');
        })
        .catch((_) => {
            console.log('AS24 CMP not enabled');
        });

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

    function loadAs24Cmp() {
        return new Promise((resolve) => {
            var script = document.createElement('script');
            var ref = document.getElementsByTagName('script')[0];
            ref.parentNode.insertBefore(script, ref);
            var culture = getCulture(window.location.hostname, window.location.pathname);
            script.type = 'module';
            script.onload = resolve;
            var prefix = window.location.hostname.startsWith('www.autoscout24.') ? '' : 'https://www.autoscout24.com';
            script.src = prefix + '/assets/as24-cmp/consent-banner/' + culture + '.js';
        });
    }

    function getCulture(hostname, path) {
        const tld = hostname.split('.').pop();

        switch (tld) {
            case 'de':
                return 'de-DE';
            case 'at':
                return 'de-AT';
            case 'it':
                return 'it-IT';
            case 'es':
                return 'es-ES';
            case 'fr':
                return 'fr-FR';
            case 'nl':
                return 'nl-NL';
            case 'lu':
                return 'fr-LU';
            case 'com':
                return 'en-GB';
            case 'bg':
                return 'bg-BG';
            case 'hu':
                return 'hu-HU';
            case 'pl':
                return 'pl-PL';
            case 'ro':
                return 'ro-RO';
            case 'hr':
                return 'hr-HR';
            case 'cz':
                return 'cs-CZ';
            case 'ua':
                return 'uk-UA';
            case 'se':
                return 'sv-SE';
            case 'ru':
                return 'ru-RU';
            case 'tr':
                return 'tr-TR';
            case 'be':
                return path.startsWith('/nl/') ? 'nl-BE' : 'fr-BE';
            case 'localhost':
            case 'tech':
            default:
                return 'en-GB';
        }
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
        const domainsThatRequireConsent = ['at', 'fr', 'nl'];

        const containerId = containerIdsByTld[tld] || containerIdsByTld['com'];

        if (domainsThatRequireConsent.includes(tld)) {
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
