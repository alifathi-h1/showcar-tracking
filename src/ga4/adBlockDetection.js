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
const getAdBlocker = (win) => {
     const version = '1.0';
 
     const ofs = 'offset',
         cl = 'client';
     const noop = function () {};
 
     const isOldIEevents = win.addEventListener === undefined;
 
     /**
      * Options set with default options initialized
      *
      */
     const _options = {
         loopDelay: 50,
         maxLoop: 5,
         debug: true,
         found: noop, // function to fire when adblock detected
         notfound: noop, // function to fire if adblock not detected after testing
         complete: noop, // function to fire after testing completes, passing result as parameter
     };
 
     const listeners = []; // event response listeners
     let baitNode = null;
     const quickBait = {
         cssClass: 'ad-banner banner_ad adsbygoogle ad_block adslot ad_slot advert1 content-ad',
     };
     const baitTriggers = {
         nullProps: [ofs + 'Parent'],
         zeroProps: [],
     };
 
     baitTriggers.zeroProps = [
         ofs + 'Height',
         ofs + 'Left',
         ofs + 'Top',
         ofs + 'Width',
         ofs + 'Height',
         cl + 'Height',
         cl + 'Width',
     ];
 
     // result object
     const exeResult = {
         quick: null,
         remote: null,
     };
 
     let findResult = null; // result of test for ad blocker
 
     const timerIds = {
         test: 0,
         download: 0,
     };
 
     function isFunc(fn) {
         return typeof fn === 'function';
     }
 
     /**
      * Make a DOM element
      */
     function makeEl(tag, attributes) {
         const attr = attributes;
         const el = document.createElement(tag);
         let k;
 
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
 
         timerIds.test = setTimeout(() => {
             reelIn(bait, 1);
         }, 5);
     }
 
     /**
      * Create the bait node to see how the browser page reacts
      */
     function castBait(bait) {
         const d = document,
             b = d.body;
         let baitStyle =
             'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;';
 
         if (bait === null || typeof bait === 'string') {
             log('invalid bait being cast');
             return;
         }
 
         if (bait.style !== null) {
             baitStyle += bait.style;
         }
 
         baitNode = makeEl('div', {
             class: bait.cssClass,
             style: baitStyle,
         });
 
         log('adding bait node to DOM');
 
         b.appendChild(baitNode);
     }
 
     /**
      * Run tests to see if browser has taken the bait and blocked the bait element
      */
     function reelIn(bait, attemptNum) {
         let i;
         const body = document.body;
         let found = false;
 
         if (baitNode === null) {
             log('recast bait');
             castBait(bait || quickBait);
         }
 
         if (typeof bait === 'string') {
             log('invalid bait used', true);
             if (clearBaitNode()) {
                 setTimeout(() => {}, 5);
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
             const baitTemp = window.getComputedStyle(baitNode, null);
             if (
                 baitTemp.getPropertyValue('display') === 'none' ||
                 baitTemp.getPropertyValue('visibility') === 'hidden'
             ) {
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
                 setTimeout(() => {}, 5);
             }
         } else {
             timerIds.test = setTimeout(() => {
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
         let i, funcs;
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
         let fireNow = false;
 
         if (document.readyState) {
             if (document.readyState === 'complete') {
                 fireNow = true;
             }
         }
 
         const fn = function () {
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
         init: function (options) {
             let k;
 
             if (!options) {
                 return;
             }
 
             const funcs = {
                 complete: noop,
                 found: noop,
                 notfound: noop,
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
         },
     };
 };

module.exports = {
    getAdBlocker: getAdBlocker,
};

 