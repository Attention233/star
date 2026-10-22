/* ============================================================
   core/components.js — 全局复用组件
   SiteNav / SiteFooter / CartDrawer / ToastStack / ProductCard / PageHero
   ============================================================ */

(function (S) {
  'use strict';

  const { ref, computed, onMounted, onUnmounted } = Vue;

  /* ------------------------------------------------------------
     顶部导航
     ------------------------------------------------------------ */
  const SiteNav = {
    name: 'SiteNav',
    setup() {
      const cart = S.cart;
      const scrolled = ref(false);
      const open = ref(false);
      const page = S.currentPage();

      const onScroll = () => { scrolled.value = window.scrollY > 8; };
      onMounted(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      });
      onUnmounted(() => window.removeEventListener('scroll', onScroll));

      /* 详情页归属「产品」导航 */
      const alias = { 'product.html': 'products.html' };
      const current = alias[page] || page;
      const isActive = item => {
        const file = item.href.split('?')[0].split('/').pop();
        return file === current;
      };

      const links = S.site.nav.map(item => ({
        ...item,
        href: S.url(item.href),
        active: isActive(item)
      }));

      return {
        cart, scrolled, open, links,
        logo: S.url('assets/images/STAr.svg'),
        close() { open.value = false; }
      };
    },
    template: `
      <div class="scroll-progress" aria-hidden="true"></div>

      <nav class="navbar" :class="{ scrolled }">
        <div class="navbar-inner">
          <a :href="links[0].href" class="nav-logo" aria-label="STAr 首页">
            <img :src="logo" alt="STAr">
          </a>

          <div class="nav-links">
            <a v-for="l in links" :key="l.href" :href="l.href" :class="{ 'is-active': l.active }">{{ l.label }}</a>
          </div>

          <div class="nav-actions">
            <button class="nav-action-btn cart-btn" aria-label="购物车" title="购物车" @click="cart.open()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <Transition name="count-pop">
                <span class="cart-count" v-if="cart.totalItems.value > 0">{{ cart.totalItems.value }}</span>
              </Transition>
            </button>

            <button class="nav-toggle" :class="{ 'is-open': open }" aria-label="菜单" :aria-expanded="open" @click="open = !open">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <Transition name="nav-slide">
        <div class="mobile-nav" v-if="open">
          <ul>
            <li v-for="l in links" :key="l.href">
              <a :href="l.href" @click="close">{{ l.label }}</a>
            </li>
          </ul>
        </div>
      </Transition>
    `
  };

  /* ------------------------------------------------------------
     页脚
     ------------------------------------------------------------ */
  const SiteFooter = {
    name: 'SiteFooter',
    setup() {
      const f = S.site.footer;
      const year = new Date().getFullYear();
      return {
        f,
        year,
        logo: S.url('assets/images/STAr.svg'),
        link: S.url
      };
    },
    template: `
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-top">
            <div class="footer-brand">
              <img :src="logo" alt="STAr">
              <p>{{ f.desc }}</p>
              <div class="footer-social">
                <a v-for="s in f.social" :key="s.label" :href="s.href" :title="s.title" :aria-label="s.label">{{ s.icon }}</a>
              </div>
            </div>

            <div class="footer-col" v-for="col in f.columns" :key="col.title">
              <h4>{{ col.title }}</h4>
              <ul>
                <li v-for="l in col.links" :key="l.label"><a :href="link(l.href)">{{ l.label }}</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>© {{ year }} STAr · {{ f.note }}</p>
            <div class="footer-legal">
              <a v-for="l in f.legal" :key="l.label" :href="l.href">{{ l.label }}</a>
            </div>
          </div>
        </div>
      </footer>
    `
  };

  /* ------------------------------------------------------------
     购物车侧栏
     ------------------------------------------------------------ */
  const CartDrawer = {
    name: 'CartDrawer',
    setup() {
      return {
        cart: S.cart,
        fmt: S.formatPrice,
        isImg: S.isImageSrc,
        changeQty: (id, d) => S.actions.changeQty(id, d),
        checkout: () => S.actions.checkout()
      };
    },
    template: `
      <Transition name="fade">
        <div class="cart-overlay" v-if="cart.state.isOpen" @click="cart.close()"></div>
      </Transition>

      <Transition name="cart-slide">
        <aside class="cart-panel" v-if="cart.state.isOpen" role="dialog" aria-modal="true" aria-label="购物车">
          <div class="cart-header">
            <h3>购物车</h3>
            <button class="cart-close" @click="cart.close()" aria-label="关闭购物车">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="cart-items">
            <div v-if="cart.isEmpty.value" class="empty-state">
              <div class="empty-icon" aria-hidden="true">🛒</div>
              <p>你的购物车还是空的</p>
              <p class="empty-tip">快去挑选心仪的好物吧~</p>
              <button class="btn btn-primary btn-sm" @click="cart.close()">继续逛逛</button>
            </div>

            <TransitionGroup name="cart-item" tag="div" v-else>
              <div class="cart-item" v-for="item in cart.state.items" :key="item.id">
                <div class="cart-item-image">
                  <img v-if="isImg(item.icon)" :src="item.icon" :alt="item.name">
                  <span v-else aria-hidden="true">{{ item.icon }}</span>
                </div>
                <div class="cart-item-info">
                  <div class="cart-item-name">{{ item.name }}</div>
                  <div class="cart-item-spec" v-if="item.spec">{{ item.spec }}</div>
                  <div class="cart-item-bottom">
                    <div class="cart-item-price">{{ fmt(item.price * item.qty) }}</div>
                    <div class="cart-item-qty">
                      <button class="qty-btn" @click="changeQty(item.id, -1)" aria-label="减少数量">−</button>
                      <span class="qty-value">{{ item.qty }}</span>
                      <button class="qty-btn" @click="changeQty(item.id, 1)" aria-label="增加数量">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div class="cart-footer">
            <div class="cart-summary-row"><span>商品小计</span><span>{{ fmt(cart.subtotal.value) }}</span></div>
            <div class="cart-summary-row"><span>运费</span><span>免运费</span></div>
            <div class="cart-total"><span>合计</span><span>{{ fmt(cart.subtotal.value) }}</span></div>
            <button class="btn btn-primary btn-block" @click="checkout">去结算</button>
          </div>
        </aside>
      </Transition>
    `
  };

  /* ------------------------------------------------------------
     Toast 容器
     ------------------------------------------------------------ */
  const ToastStack = {
    name: 'ToastStack',
    setup() {
      return {
        items: S.toast.state.items,
        icons: { success: '✓', error: '✕', warning: '!', info: 'i' },
        remove: S.toast.remove
      };
    },
    template: `
      <div class="toast-container" aria-live="polite" aria-atomic="true">
        <TransitionGroup name="toast">
          <div v-for="t in items" :key="t.id" class="toast" @click="remove(t.id)">
            <div :class="['toast-icon', t.type]">{{ icons[t.type] }}</div>
            <div class="toast-content">
              <div class="toast-title">{{ t.title }}</div>
              <div class="toast-message">{{ t.message }}</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    `
  };

  /* ------------------------------------------------------------
     商品卡片
     ------------------------------------------------------------ */
  const ProductCard = {
    name: 'ProductCard',
    props: {
      product: { type: Object, required: true },
      delay: { type: Number, default: 0 }
    },
    setup() {
      function detailHref(p) {
        return S.url('pages/product.html?id=' + encodeURIComponent(p.id));
      }
      function add(p, e) {
        const card = e.currentTarget.closest('.product-card');
        const src = card ? card.querySelector('.product-image') : null;
        S.actions.addToCart(p, 1, src);
      }
      return {
        fmt: S.formatPrice,
        isImg: S.isImageSrc,
        tag: S.tagLabel,
        cat: S.categoryLabel,
        detailHref,
        add
      };
    },
    template: `
      <article class="product-card" :data-aos="'fade-up'" :data-aos-delay="delay">
        <a :class="['product-image', { 'is-emoji': !isImg(product.icon) }]" :href="detailHref(product)" :aria-label="'查看 ' + product.name + ' 详情'">
          <span v-if="product.tag" :class="['product-tag', product.tag]">{{ tag(product.tag) }}</span>
          <img v-if="isImg(product.icon)" :src="product.icon" :alt="product.name" loading="lazy">
          <div v-else class="product-emoji" aria-hidden="true">{{ product.icon }}</div>
        </a>
        <div class="product-info">
          <div class="product-cat">{{ cat(product.category) }}</div>
          <h3 class="product-name">
            <a :href="detailHref(product)" style="color:inherit">{{ product.name }}</a>
          </h3>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-footer">
            <div class="product-price">
              <span v-if="product.originalPrice" class="price-original">{{ fmt(product.originalPrice) }}</span>
              {{ fmt(product.price) }}
            </div>
            <button class="btn btn-primary btn-sm" @click.prevent.stop="add(product, $event)">加入购物车</button>
          </div>
        </div>
      </article>
    `
  };

  /* ------------------------------------------------------------
     子页面页头
     ------------------------------------------------------------ */
  const PageHero = {
    name: 'PageHero',
    props: {
      title: String,
      desc: String,
      crumbs: { type: Array, default: () => [] }
    },
    setup() {
      return { link: S.url };
    },
    template: `
      <header class="page-hero">
        <div class="page-hero-inner">
          <nav class="breadcrumb" aria-label="面包屑" v-if="crumbs.length">
            <template v-for="(c, i) in crumbs" :key="i">
              <a v-if="c.href" :href="link(c.href)">{{ c.label }}</a>
              <span v-else>{{ c.label }}</span>
              <span class="sep" v-if="i < crumbs.length - 1">/</span>
            </template>
          </nav>
          <h1 data-aos="fade-up">{{ title }}</h1>
          <p data-aos="fade-up" data-aos-delay="80" v-if="desc">{{ desc }}</p>
          <slot></slot>
        </div>
      </header>
    `
  };

  S.components = { SiteNav, SiteFooter, CartDrawer, ToastStack, ProductCard, PageHero };
})(window.STAr);
