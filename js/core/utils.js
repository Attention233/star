/* ============================================================
   core/utils.js — 全局命名空间 + 通用工具
   所有模块统一挂载在 window.STAr 下，供各页面共享
   ============================================================ */

window.STAr = window.STAr || {};

(function (S) {
  'use strict';

  /* 站点根路径：根目录页面为空串，pages/ 下为 '../' */
  S.base = typeof window.STAR_BASE === 'string' ? window.STAR_BASE : '';

  /**
   * 生成可跨层级使用的站内链接
   * @param {string} path 相对站点根的路径，如 'pages/products.html'
   */
  S.url = function (path) {
    if (!path) return S.base || './';
    if (/^(https?:|mailto:|tel:|#|data:)/.test(path)) return path;
    return S.base + path.replace(/^\.?\//, '');
  };

  /** 当前页面文件名，用于导航高亮 */
  S.currentPage = function () {
    const file = location.pathname.split('/').pop() || 'index.html';
    return file === '' ? 'index.html' : file;
  };

  /** 金额格式化 */
  S.formatPrice = function (n) {
    return '¥' + Number(n || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  /** 紧凑金额：12000 -> 1.2万 */
  S.formatCompact = function (n) {
    const v = Number(n || 0);
    if (v >= 10000) return (v / 10000).toFixed(1).replace(/\.0$/, '') + '万';
    return v.toLocaleString('zh-CN');
  };

  /** 是否为图片地址（用于区分 emoji 展示） */
  S.isImageSrc = function (s) {
    return typeof s === 'string' && /\.(png|jpe?g|webp|gif|svg|avif)(\?|#|$)/i.test(s);
  };

  /** 角标文案 */
  S.tagLabel = function (tag) {
    return { new: '新品', sale: '限时优惠', hot: '热销' }[tag] || tag || '';
  };

  /** 分类名 */
  S.categoryLabel = function (key) {
    const c = (S.categories || []).find(x => x.key === key);
    return c ? c.name : '商品';
  };

  /** 读取 URL 查询参数 */
  S.getQuery = function (key) {
    const m = new RegExp('[?&]' + key + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : '';
  };

  S.clamp = function (v, min, max) {
    return Math.max(min, Math.min(max, v));
  };

  S.debounce = function (fn, wait) {
    let t = 0;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait || 200);
    };
  };

  /** 是否偏好减少动效 */
  S.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /** 分批延时（用于 stagger 动画延迟计算） */
  S.staggerDelay = function (index, step, max) {
    return Math.min(index * step, max || 600);
  };
})(window.STAr);
