/* ============================================================
   core/app.js — 页面挂载入口
   统一注册全局组件、购物车联动、动效初始化
   ============================================================ */

(function (S) {
  'use strict';

  /**
   * 挂载一个页面级组件
   * @param {object} pageDef Vue 组件选项对象
   * @returns {object} 根组件实例
   */
  S.mountPage = function (pageDef) {
    const app = Vue.createApp(pageDef);

    Object.keys(S.components).forEach(name => {
      app.component(name, S.components[name]);
    });

    app.config.globalProperties.$url = S.url;
    app.config.globalProperties.$price = S.formatPrice;

    const vm = app.mount('#app');

    /* 购物车打开时锁定页面滚动 */
    Vue.watch(
      () => S.cart.state.isOpen,
      open => {
        document.body.style.overflow = open ? 'hidden' : '';
        document.body.classList.toggle('cart-open', open);
        if (open) S.cart.load();
      }
    );

    /* Esc 关闭购物车 */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && S.cart.state.isOpen) S.cart.close();
    });

    /* 动效统一启动 */
    requestAnimationFrame(() => S.motion.boot());

    return vm;
  };
})(window.STAr);
