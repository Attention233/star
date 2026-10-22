/* ============================================================
   pages/home.js — 首页
   ============================================================ */

(function (S) {
  'use strict';

  const { computed, onMounted } = Vue;

  const HomePage = {
    setup() {
      const url = S.url;

      const featured = S.products.filter(p => p.featured).slice(0, 6);
      const categories = S.categories.filter(c => c.key !== 'all');
      const posts = S.community.posts.slice(0, 3);

      const heroImage = url('assets/z1-ultra/01.webp');

      const stats = [
        { label: '精选商品', value: 8, suffix: '', decimals: 0 },
        { label: '服务用户', value: 128000, suffix: '+', decimals: 0, compact: true },
        { label: '平均评分', value: 4.8, suffix: '', decimals: 1 },
        { label: '现货仓发', value: 24, suffix: 'h 内', decimals: 0 }
      ];

      const values = [
        { icon: '🔍', title: '先体验，再推荐', desc: '每一件上架商品都经过实测，参数之外更看日常使用手感。' },
        { icon: '💬', title: '信息不绕弯', desc: '规格、价格与优惠写得清楚，不靠复杂的凑单规则制造惊喜。' },
        { icon: '🛠', title: '售后有人管', desc: '下单之后依然能找到人，退换与保修流程尽量一次说清。' }
      ];

      const catHref = key => url('pages/products.html?category=' + key);

      onMounted(() => {
        S.motion.heroEnter();
        S.motion.heroParallax();
        S.motion.magnetic('[data-magnetic]');
        S.motion.tilt('[data-tilt]', 5);
      });

      return {
        url, featured, categories, posts, stats, values, heroImage, catHref,
        tagLabel: S.tagLabel,
        formatCompact: v => S.formatCompact(v),
        formatPrice: S.formatPrice,
        isImageSrc: S.isImageSrc
      };
    },

    template: `
      <SiteNav />

      <!-- ==================== Hero ==================== -->
      <header class="hero">
        <div class="hero-orbs" aria-hidden="true"><span></span><span></span><span></span></div>

        <div class="hero-inner">
          <div class="hero-content">
            <span class="eyebrow" data-hero-fade style="opacity:0">
              <span class="dot" style="width:6px;height:6px;border-radius:50%;background:var(--color-primary);display:inline-block"></span>
              2026 精选上新
            </span>

            <h1 class="hero-title" data-hero-title>欢迎来到 STAr</h1>

            <p class="hero-subtitle" data-hero-fade style="opacity:0">好物精选，一站购齐</p>
            <p class="hero-desc" data-hero-fade style="opacity:0">
              不带货式吹捧，只把挑过的商品、真实的价格和清楚的信息摆在这里。
            </p>

            <div class="hero-actions" data-hero-fade style="opacity:0">
              <a :href="url('pages/products.html')" class="btn btn-primary btn-lg" data-magnetic>去逛逛</a>
              <a :href="url('pages/community.html')" class="btn btn-ghost btn-lg">看看大家在聊什么</a>
            </div>

            <div class="hero-meta" data-hero-fade style="opacity:0">
              <div><strong>8</strong><span>精选商品</span></div>
              <div><strong>4.8</strong><span>平均评分</span></div>
              <div><strong>24h</strong><span>现货发出</span></div>
            </div>
          </div>

          <div class="hero-visual" data-hero-visual style="opacity:0">
            <div class="hero-card" data-depth="18" data-tilt="4">
              <img :src="heroImage" alt="Z1 Ultra 14 英寸便携屏" fetchpriority="high">
            </div>
            <div class="hero-chip hero-chip--tl" data-depth="34" data-float>
              <span class="dot"></span> 新品上架
            </div>
            <div class="hero-chip hero-chip--br" data-depth="26" data-float>
              🔥 本周热销 1,200+
            </div>
            <div class="hero-chip hero-chip--bl" data-depth="42" data-float>
              🚚 全国包邮
            </div>
          </div>
        </div>
      </header>

      <!-- ==================== 分类 ==================== -->
      <section class="section">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>按分类逛逛</h2>
            <p>四类精选，覆盖日常所需</p>
          </div>

          <div class="category-strip">
            <a v-for="(c, i) in categories" :key="c.key" :href="catHref(c.key)"
               class="category-card" data-aos="fade-up" :data-aos-delay="i * 70">
              <span class="cat-icon" aria-hidden="true">{{ c.icon }}</span>
              <strong>{{ c.name }}</strong>
              <span>{{ c.desc }}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ==================== 精选产品 ==================== -->
      <section class="section section--muted" id="products">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>精选产品</h2>
            <p>用心挑选的好物都在这里</p>
          </div>

          <div class="product-grid">
            <ProductCard v-for="(p, i) in featured" :key="p.id" :product="p" :delay="(i % 3) * 90" />
          </div>

          <div class="text-center mt-6" data-aos="fade-up">
            <a :href="url('pages/products.html')" class="btn btn-outline" data-magnetic>查看全部产品</a>
          </div>
        </div>
      </section>

      <!-- ==================== 数据 ==================== -->
      <section class="section">
        <div class="section-inner">
          <div class="stats">
            <div class="stat-item" v-for="s in stats" :key="s.label" data-aos="fade-up">
              <div class="stat-value">
                <span :data-count="s.value" :data-decimals="s.decimals" :data-suffix="s.suffix">0</span>
              </div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
          <p class="stats-note">以上数据为测试数据</p>
        </div>
      </section>

      <!-- ==================== 为什么选我们 ==================== -->
      <section class="section section--muted">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>为什么是 STAr</h2>
            <p>把挑选的成本省下来，留给你真正在意的事</p>
          </div>

          <div class="grid grid-3">
            <div class="value-card" v-for="(v, i) in values" :key="v.title" data-aos="fade-up" :data-aos-delay="i * 90">
              <div class="value-icon" aria-hidden="true">{{ v.icon }}</div>
              <h4>{{ v.title }}</h4>
              <p>{{ v.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== 社区预览 ==================== -->
      <section class="section" id="community">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>社区正在聊</h2>
            <p>真实的体验与问题，都值得被认真回答</p>
          </div>

          <div class="post-list">
            <article class="post-card" v-for="(p, i) in posts" :key="p.id" data-aos="fade-up" :data-aos-delay="i * 80">
              <div class="post-avatar" aria-hidden="true">{{ p.avatar }}</div>
              <div class="post-main">
                <div class="post-meta">
                  <strong>{{ p.author }}</strong>
                  <span v-if="p.role" class="badge badge--primary">{{ p.role }}</span>
                  <span>· {{ p.time }}</span>
                </div>
                <h3 class="post-title">{{ p.title }}</h3>
                <p class="post-excerpt">{{ p.excerpt }}</p>
                <div class="post-tags">
                  <span class="badge" v-for="t in p.tags" :key="t">{{ t }}</span>
                </div>
                <div class="post-footer">
                  <span>♥ {{ p.likes }}</span>
                  <span>💬 {{ p.comments }}</span>
                  <span>👀 {{ p.views }}</span>
                </div>
              </div>
            </article>
          </div>

          <div class="text-center mt-6" data-aos="fade-up">
            <a :href="url('pages/community.html')" class="btn btn-outline">进入社区</a>
          </div>
        </div>
      </section>

      <!-- ==================== CTA ==================== -->
      <section class="section" style="padding-top:0">
        <div class="section-inner">
          <div class="cta-band" data-aos="zoom-in">
            <h2>挑一件，明天就能用上</h2>
            <p>现货仓发，24 小时内出库，14 天无忧退换。</p>
            <div class="cta-actions">
              <a :href="url('pages/products.html')" class="btn btn-primary btn-lg" data-magnetic>立即选购</a>
              <a :href="url('pages/about.html')" class="btn btn-outline btn-lg">了解我们</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <CartDrawer />
      <ToastStack />
    `
  };

  S.mountPage(HomePage);
})(window.STAr);
