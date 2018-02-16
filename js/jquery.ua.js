/*!
 * jquery.ua.js
 * @link https://github.com/cloudcome/jquery.ua
 * @author ydr.me
 */




!(function($){
    'use strict';

    var 
        win = window,
        nav = win.navigator,
        navua = nav.userAgent,
        appVersion = nav.appVersion,
        doc = win.document,
        parseRule = _getRules(),
        ieAX = win.ActiveXObject,
        ieMode = doc.documentMode,
        // [10,)鐗堟湰灏辨棤娉曞垽鏂�
        ieVer = _getIeVersion() || ieMode || 0,
        isIe = ieAX || ieMode,
        chromiumType = _getChromiumType(),
        // 浠ヤ笅涓洪潤鎬佸睘鎬�
        statics = {
            // ie娴忚鍣�
            isIe: !! ieVer,
            isIe6: ieAX && ieVer == 6 || ieMode == 6,
            isIe7: ieAX && ieVer == 7 || ieMode == 7,
            isIe8: ieAX && ieVer == 8 || ieMode == 8,
            isIe9: ieAX && ieVer == 9 || ieMode == 9,
            isIe10: ieMode === 10,
            isIe11: ieMode === 11,
            ie: ieVer,
            // chrome
            isChrome: chromiumType === 'chrome',
            is360ee: chromiumType === '360ee',
            is360se: chromiumType === '360se',
            isSougou: chromiumType === 'sougou',
            isLiebao: chromiumType === 'liebao',
            isFirefox: win.scrollMaxX !== undefined,
            isMaxthon: ieVer && /\bmaxthon\b/i.test(appVersion),
            isMaxthonYun: !ieVer && /\bmaxthon\b/i.test(appVersion),    // 鍌叉父浜戞祻瑙堝櫒锛屾瀬閫熸ā寮�
            isQQ: !!ieVer && /\bqqbrowser\b/i.test(appVersion)
        }, i;




    $.ua = function(ua) {
        var _ua = new Constructor(ua);
        return _ua._parse();
    };


    for (i in statics) {
        $.ua[i] = statics[i];
    }





    // =======================================
    // ================ UA ===================
    // =======================================

    function Constructor(ua) {
        this.ua = (ua || navua || '').toLowerCase();
        this.isWebkit = !1;
        this.isGecko = !1;
        this.isTrident = !1;
    }

    Constructor.prototype = {
        _parse: function() {
            var that = this,
                objPlatform = _parse(parseRule.platforms, that.ua),
                objBrowser = _parse(parseRule.browsers, that.ua, !0),
                objEngine = _parse(parseRule.engines, that.ua);

            // 鎿嶄綔骞冲彴
            that.platform = $.extend({}, objPlatform, {
                os: win.navigator.platform.toLowerCase()
            });

            // 娴忚鍣║A澶栧３
            that.browser = objBrowser;

            // 娴忚鍣║A鍐呮牳
            that.engine = objEngine;

            // UA鍐呮牳
            that.isWebkit = !! objEngine.isWebkit;
            that.isGecko = !! objEngine.isGecko;
            that.isTrident = !! objEngine.isTrident;

            // UA绫诲瀷
            that.isMobile = objPlatform.isMobile;
            that.isTablet = objPlatform.isTablet;
            that.isDesktop = objPlatform.isDesktop;

            return that;
        }
    };









    /**
     * 瑙ｆ瀽
     * 鍙傝€冿細https://github.com/terkel/jquery-ua
     * @param  {Array} 闇€瑕佽В鏋愮殑鏁版嵁
     * @param  {String} 闇€瑕佽В鏋愮殑ua瀛楃涓�
     * @param  {Boolean} 鏄惁涓鸿В鏋愭祻瑙堝櫒鏁版嵁
     * @return {Object} 瑙ｆ瀽鍚庣殑瀵硅薄
     * @version 1.0
     * 2013骞�9鏈�27鏃�13:36:47
     */

    function _parse(rule, ua, isBrowser) {
        var item = {},
            name,
            versionSearch,
            flags,
            versionNames,
            i,
            is,
            ic,
            j,
            js,
            jc;

        if (isBrowser && ieVer) {
            return {
                name: 'ie',
                ie: !0,
                version: ieVer,
                isIe: !0
            };
        }

        for (i = 0, is = rule.length; i < is; i++) {
            ic = rule[i];
            name = ic.name;
            versionSearch = ic.versionSearch;
            flags = ic.flags;
            versionNames = ic.versionNames;
            if (ua.indexOf(name) !== -1) {
                item.name = name.replace(/\s/g, '');
                if (ic.slugName) {
                    item.name = ic.slugName;
                }
                item['is' + _upperCase1st(item.name)] = !0;
                item.version = ('' + (new RegExp(versionSearch + '(\\d+((\\.|_)\\d+)*)').exec(ua) || [, 0])[1]).replace(/_/g, '.');
                if (flags) {
                    for (j = 0, js = flags.length; j < js; j++) {
                        item['is' + _upperCase1st(flags[j])] = !0;
                    }
                }
                if (versionNames) {
                    for (j = 0, js = versionNames.length; j < js; j++) {
                        jc = versionNames[j];
                        if (item.version.indexOf(jc.number) === 0) {
                            item.fullname = jc.name;
                            item['is' + _upperCase1st(item.fullname)] = !0;
                            break;
                        }
                    }
                }
                if (rule === parseRule.platforms) {
                    item.isMobile = /mobile|phone/.test(ua) || item.isBlackberry;
                    item.isMobile = item.isMobile === undefined ? !1 : !0;

                    item.isTablet = /tablet/.test(ua) || item.isIpad || (item.isAndroid && !/mobile/.test(ua));
                    item.isTablet = item.isTablet === undefined ? !1 : !0;

                    if (item.isTablet) item.isMobile = !1;

                    item.isDesktop = !item.isMobile && !item.isTablet ? !0 : !1;

                    if (item.ios) {
                        item.fullname = 'ios' + parseInt(item.version, 10);
                        item['is' + _upperCase1st(item.fullname)] = !0;
                    }
                }
                break;
            }
        }
        if (!item.name) {
            item.isUnknown = !0;
            item.name = '';
            item.version = '';
        }
        return item;
    }



    // 澶у啓绗竴涓瓧姣�

    function _upperCase1st(string) {
        return string.replace(/^(\w)/, function(w) {
            return w.toUpperCase();
        });
    }



    // 娴嬭瘯mime

    function _mime(where, value, name, nameReg) {
        var mimeTypes = win.navigator.mimeTypes,
            i;

        for (i in mimeTypes) {
            if (mimeTypes[i][where] == value) {
                if (name !== undefined && nameReg.test(mimeTypes[i][name])) return !0;
                else if (name === undefined) return !0;
            }
        }
        return !1;
    }



    /**
     * 鑾峰彇 Chromium 鍐呮牳娴忚鍣ㄧ被鍨�
     * @link http://www.adtchrome.com/js/help.js
     * @link https://ext.chrome.360.cn/webstore
     * @link https://ext.se.360.cn
     * @return {String}
     *         360ee 360鏋侀€熸祻瑙堝櫒
     *         360se 360瀹夊叏娴忚鍣�
     *         sougou 鎼滅嫍娴忚鍣�
     *         liebao 鐚庤惫娴忚鍣�
     *         chrome 璋锋瓕娴忚鍣�
     *         ''    鏃犳硶鍒ゆ柇
     * @version 1.0
     * 2014骞�3鏈�12鏃�20:39:55
     */

    function _getChromiumType() {
        if (isIe || win.scrollMaxX !== undefined) return '';

        var isOriginalChrome = _mime('type', 'application/vnd.chromium.remoting-viewer');

        // 鍘熷 chrome
        if (isOriginalChrome) {
            return 'chrome';
        }
        // 璋锋瓕銆佺伀鐙愩€乮e鐨勬煇浜涚増鏈篃鏈� window.chrome 灞炴€�
        // 闇€鍏堟帓闄�
        else if ( win.chrome) {
            var _track = 'track' in doc.createElement('track'),
                _style = 'scoped' in doc.createElement('style'),
                _v8locale = 'v8Locale' in win,
                external = win.external;

            // 鎼滅嫍娴忚鍣�
            if ( external && 'SEVersion' in external) return 'sougou';

            // 鐚庤惫娴忚鍣�
            if ( external && 'LiebaoGetVersion' in external) return 'liebao';

            // 360鏋侀€熸祻瑙堝櫒
            if (_track && !_style && !_v8locale && /Gecko\)\s+Chrome/.test(appVersion)) return '360ee';

            // 360瀹夊叏娴忚鍣�
            if (_track && _style && _v8locale) return '360se';

            return 'other chrome';
        }
        return '';
    }



    // 鑾峰緱ie娴忚鍣ㄧ増鏈�

    function _getIeVersion() {
        var v = 3,
            p = doc.createElement('p'),
            all = p.getElementsByTagName('i');
        while (
            p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]);
        return v > 4 ? v : 0;
    }




    // 瑙ｆ瀽瑙勫垯

    function _getRules() {
        return {
            platforms: [
                // windows phone
                {
                    name: 'windows phone',
                    versionSearch: 'windows phone os ',
                    versionNames: [ // windows phone must be tested before win
                        {
                            number: '7.5',
                            name: 'mango'
                        }
                    ]
                },
                // windows
                {
                    name: 'win',
                    slugName: 'windows',
                    versionSearch: 'windows(?: nt)? ',
                    versionNames: [{
                        number: '6.2',
                        name: 'windows 8'
                    }, {
                        number: '6.1',
                        name: 'windows 7'
                    }, {
                        number: '6.0',
                        name: 'windows vista'
                    }, {
                        number: '5.2',
                        name: 'windows xp'
                    }, {
                        number: '5.1',
                        name: 'windows xp'
                    }, {
                        number: '5.0',
                        name: 'windows 2000'
                    }]
                },
                // ipad
                {
                    name: 'ipad',
                    versionSearch: 'cpu os ',
                    flags: ['ios']
                },
                // ipad and ipod must be tested before iphone
                {
                    name: 'ipod',
                    versionSearch: 'iphone os ',
                    flags: ['ios']
                },
                // iphone
                {
                    name: 'iphone',
                    versionSearch: 'iphone os ',
                    flags: ['ios']
                },
                // iphone must be tested before mac
                {
                    name: 'mac',
                    versionSearch: 'os x ',
                    versionNames: [{
                        number: '10.8',
                        name: 'mountainlion'
                    }, {
                        number: '10.7',
                        name: 'lion'
                    }, {
                        number: '10.6',
                        name: 'snowleopard'
                    }, {
                        number: '10.5',
                        name: 'leopard'
                    }, {
                        number: '10.4',
                        name: 'tiger'
                    }, {
                        number: '10.3',
                        name: 'panther'
                    }, {
                        number: '10.2',
                        name: 'jaguar'
                    }, {
                        number: '10.1',
                        name: 'puma'
                    }, {
                        number: '10.0',
                        name: 'cheetah'
                    }]
                },
                // android
                {
                    name: 'android',
                    versionSearch: 'android ',
                    versionNames: [
                        // android must be tested before linux
                        {
                            number: '4.1',
                            name: 'jellybean'
                        }, {
                            number: '4.0',
                            name: 'icecream sandwich'
                        }, {
                            number: '3.',
                            name: 'honey comb'
                        }, {
                            number: '2.3',
                            name: 'ginger bread'
                        }, {
                            number: '2.2',
                            name: 'froyo'
                        }, {
                            number: '2.',
                            name: 'eclair'
                        }, {
                            number: '1.6',
                            name: 'donut'
                        }, {
                            number: '1.5',
                            name: 'cupcake'
                        }
                    ]
                },
                // blackberry
                {
                    name: 'blackberry',
                    versionSearch: '(?:blackberry\\d{4}[a-z]?|version)/'
                },
                // blackberry
                {
                    name: 'bb',
                    slugName: 'blackberry',
                    versionSearch: '(?:version)/'
                },
                // blackberry
                {
                    name: 'playbook',
                    slugName: 'blackberry',
                    versionSearch: '(?:version)/'
                },
                // linux
                {
                    name: 'linux'
                },
                // nokia
                {
                    name: 'nokia'
                }
            ],
            browsers: [{
                    name: 'iemobile',
                    versionSearch: 'iemobile/'
                }, // iemobile must be tested before msie
                {
                    name: 'msie',
                    slugName: 'ie',
                    versionSearch: 'msie '
                }, {
                    name: 'firefox',
                    versionSearch: 'firefox/'
                }, {
                    name: 'chrome',
                    versionSearch: 'chrome/'
                }, // chrome must be tested before safari
                {
                    name: 'safari',
                    versionSearch: '(?:browser|version)/'
                }, {
                    name: 'opera',
                    versionSearch: 'version/'
                }
            ],
            engines: [{
                    name: 'trident',
                    versionSearch: 'trident/'
                }, {
                    name: 'webkit',
                    versionSearch: 'webkit/'
                }, // webkit must be tested before gecko
                {
                    name: 'gecko',
                    versionSearch: 'rv:'
                }, {
                    name: 'presto',
                    versionSearch: 'presto/'
                }
            ]
        };
    }
})(jQuery);