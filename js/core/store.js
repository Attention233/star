/* ============================================================
   core/store.js — 购物车 Store / Toast Store（全局单例）
   数据落地于 localStorage，跨页面共享
   ============================================================ */

(function (S) {
  'use strict';

  const CART_KEY = 'star_demo_cart';

  /**
   * 购物车 Store 工厂
   * @param {object} Vue Vue 全局对象（需 reactive / computed）
   */
  function createCartStore(Vue) {
    const { reactive, computed } = Vue;

    const state = reactive({ items: [], isOpen: false });

    const totalItems = computed(() => state.items.reduce((sum, i) => sum + i.qty, 0));
    const subtotal = computed(() => state.items.reduce((sum, i) => sum + i.price * i.qty, 0));
    const isEmpty = computed(() => state.items.length === 0);

    function load() {
      try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        state.items = Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        state.items = [];
      }
    }

    function save() {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(state.items));
      } catch (_) { /* 隐私模式下忽略 */ }
    }

    /** 加入购物车，支持指定数量 */
    function add(product, qty) {
      const count = Math.max(1, Number(qty) || 1);
      const exist = state.items.find(i => i.id === product.id);
      if (exist) {
        exist.qty += count;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          icon: product.icon || '🎁',
          spec: product.spec || '',
          qty: count
        });
      }
      save();
      return true;
    }

    function remove(id) {
      const idx = state.items.findIndex(i => i.id === id);
      if (idx !== -1) state.items.splice(idx, 1);
      save();
    }

    /** 修改数量，减到 0 时移除；返回是否仍存在 */
    function changeQty(id, delta) {
      const item = state.items.find(i => i.id === id);
      if (!item) return false;
      item.qty += delta;
      if (item.qty <= 0) {
        remove(id);
        return false;
      }
      save();
      return true;
    }

    function clear() {
      state.items = [];
      save();
    }

    function open() { state.isOpen = true; }
    function close() { state.isOpen = false; }
    function toggle() { state.isOpen = !state.isOpen; }

    load();

    return {
      state, totalItems, subtotal, isEmpty,
      add, addToCart: add, remove, removeFromCart: remove,
      changeQty, clear, open, close, toggle, load, save
    };
  }

  /**
   * Toast Store：任意模块调用 S.toast.show(...)
   */
  function createToastStore(Vue) {
    const { reactive } = Vue;
    const state = reactive({ items: [] });
    let seq = 0;

    function show(type, title, message, duration) {
      const id = ++seq;
      state.items.push({ id, type: type || 'info', title, message });
      const ttl = typeof duration === 'number' ? duration : 3000;
      setTimeout(() => remove(id), ttl);
      return id;
    }

    function remove(id) {
      const idx = state.items.findIndex(t => t.id === id);
      if (idx !== -1) state.items.splice(idx, 1);
    }

    return { state, items: state.items, show, remove };
  }

  S.createCartStore = createCartStore;
  S.cart = createCartStore(Vue);
  S.toast = createToastStore(Vue);

  /* ---- 购物车业务动作（各页面共用） ---- */
  S.actions = {
    /** 加入购物车 + 提示 + 可选飞入动画 */
    addToCart(product, qty, sourceEl) {
      if (!product) return;
      S.cart.add(product, qty, sourceEl);
      S.toast.show('success', '已加入购物车', product.name + ' · x' + (qty || 1), 2600);
      if (sourceEl && S.motion) S.motion.flyToCart(sourceEl);
      if (S.motion) S.motion.bumpCart();
    },
    changeQty(id, delta) {
      const item = S.cart.state.items.find(i => i.id === id);
      const keep = S.cart.changeQty(id, delta);
      if (!keep && item) S.toast.show('info', '已移除商品', item.name, 2200);
    },
    checkout() {
      if (S.cart.isEmpty.value) {
        S.toast.show('warning', '购物车为空', '请先添加商品再结算~', 2400);
        return;
      }
      S.toast.show('success', '进入结算流程',
        '共 ' + S.cart.totalItems.value + ' 件商品，合计 ' + S.formatPrice(S.cart.subtotal.value), 2800);
    }
  };
})(window.STAr);
