/* 妗嗘灦鍒濆鍖� */
!function(win, $) {
var 
  yp = function(conf) {
    return yp.mix(true, new yp.fn.create(conf), yp);
  }
  yp.fn = yp.prototype = {
    constructor: yp
  , yp: '20140223.1'
  , create: function(conf) {
      /*this.conf = conf || {};*/
      this.config.init();
      this.loader.init();
      return this;
    }
  }
  yp.fn.create.prototype = yp.fn;
  yp.create = yp.fn.create;///

  /* 璇硶绯栨墿灞� */
  ///yp.$ = $;
  // 瀵硅薄鎵╁睍
  yp.mix = $.extend;
  yp.extend = function(a, b) {
    return yp.mix({}, a, b);///
  };
  // 瀵硅薄寰幆
  yp.each = function(arr, callback) {
    return $.each(arr, function(a, b) {
      return callback(b, a);
    });
  };
  // 浠ｇ悊鍑芥暟
  yp.proxy = $.proxy;
  // 妯℃澘鍑芥暟
  yp.format = function(str, data) {
    ///if (!str) return false;
    var re = this.re || yp.config.fun.formatSettings.re || /{([\s\S]+?)}/g
    if (typeof data !== 'object') data = [].slice.call(arguments, 1);
    return str.replace(re, function($0, $1) {
      return data[$1] != null ? data[$1] : '';
    });
  };
  // 绌哄嚱鏁�
  yp.noop = $.noop;
