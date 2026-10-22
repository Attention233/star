/* ============================================================
   pages/product.js — 商品详情（画廊 / 规格 / 参数 / 评价 / 推荐）
   ============================================================ */

(function (S) {
  'use strict';

  const { ref, computed, onMounted } = Vue;

  const ProductPage = {
    setup() {
      const url = S.url;
      const id = S.getQuery('id');
      const product = S.products.find(p => p.id === id) || null;

      const activeThumb = ref(0);
      const activeColor = ref(0);
      const activeStorage = ref(0);
      const qty = ref(1);
      const tab = ref('detail');

      const gallery = computed(() => {
        if (!product) return [];
        const t = product.thumbnails && product.thumbnails.length ? product.thumbnails : [product.icon];
        return t;
      });

      const mainImage = computed(() => gallery.value[activeThumb.value] || (product ? product.icon : ''));

      const selectedColor = computed(() => {
        if (!product || !product.colors || !product.colors.length) return '';
        return product.colors[activeColor.value].name;
      });

      const selectedStorage = computed(() => {
        if (!product) return { size: '', price: 0 };
        if (!product.storages || !product.storages.length) return { size: product.spec || '', price: product.price };
        return product.storages[activeStorage.value];
      });

      const currentPrice = computed(() => selectedStorage.value.price || (product ? product.price : 0));

      const currentSpec = computed(() => {
        const parts = [selectedStorage.value.size, selectedColor.value].filter(Boolean);
        return parts.length ? parts.join(' · ') : (product ? product.spec : '');
      });

      const saving = computed(() =>
        product && product.originalPrice ? product.originalPrice - currentPrice.value : 0
      );

      const starText = computed(() => {
        const r = product && product.rating ? Math.round(product.rating) : 0;
        return '★'.repeat(r) + '☆'.repeat(Math.max(0, 5 - r));
      });

      const related = computed(() => {
        if (!product) return [];
        const same = S.products.filter(p => p.id !== product.id && p.category === product.category);
        const other = S.products.filter(p => p.id !== product.id && p.category !== product.category);
        return same.concat(other).slice(0, 3);
      });

      const reviews = S.reviews;
      const ratingAvg = computed(() => product && product.rating ? product.rating : 0);

      function changeQty(delta) {
        qty.value = S.clamp(qty.value + delta, 1, 99);
      }

      function addToCart(e) {
        if (!product) return;
        const src = document.querySelector('.main-image');
        S.actions.addToCart({
          id: product.id,
          name: product.name,
          price: currentPrice.value,
          icon: product.icon,
          spec: currentSpec.value
        }, qty.value, src);
      }

      function buyNow() {
        if (!product) return;
        S.actions.addToCart({
          id: product.id,
          name: product.name,
          price: currentPrice.value,
          icon: product.icon,
          spec: currentSpec.value
        }, qty.value);
        setTimeout(() => S.cart.open(), 220);
      }

      function previewImage(src) {
        if (!S.isImageSrc(src)) return;
        window.open(src, '_blank', 'noopener');
      }

      onMounted(() => {
        S.motion.heroParallax(document.querySelector('.product-detail'));
      });

      return {
        url, product, gallery, mainImage, activeThumb,
        colors: product ? product.colors || [] : [],
        storages: product ? product.storages || [] : [],
        activeColor, activeStorage, selectedColor, selectedStorage,
        currentPrice, currentSpec, saving, qty, changeQty,
        addToCart, buyNow, previewImage,
        starText, ratingAvg, reviews, related,
        tab,
        fmt: S.formatPrice,
        isImg: S.isImageSrc,
        catLabel: S.categoryLabel,
        productCount: S.products.length,
        totalReviews: computed(() => product ? Number(product.ratingCount || 0).toLocaleString('zh-CN') : 0)
      };
    },

    template: `
      <SiteNav />

      <!-- 商品不存在 -->
      <main class="product-detail" v-if="!product">
        <div class="product-detail-inner">
          <div class="empty-state" style="padding:6rem 0">
            <div class="empty-icon" aria-hidden="true">🔍</div>
            <p>商品不存在或暂未上架</p>
            <p class="empty-tip">链接可能已失效，去产品列表看看其他好物</p>
            <a :href="url('pages/products.html')" class="btn btn-primary btn-sm">返回全部产品</a>
          </div>
        </div>
      </main>

      <template v-else>
        <main class="product-detail">
          <div class="product-detail-inner">
            <nav class="breadcrumb" aria-label="面包屑">
              <a :href="url('index.html')">首页</a><span class="sep">/</span>
              <a :href="url('pages/products.html')">全部产品</a><span class="sep">/</span>
              <a :href="url('pages/products.html?category=' + product.category)">{{ catLabel(product.category) }}</a><span class="sep">/</span>
              <span>{{ product.name }}</span>
            </nav>

            <div class="product-detail-grid">
              <!-- 画廊 -->
              <div class="product-gallery">
                <div class="main-image" @click="previewImage(mainImage)">
                  <Transition name="gallery" mode="out-in">
                    <img v-if="isImg(mainImage)" :key="mainImage" :src="mainImage" :alt="product.name">
                    <span v-else :key="mainImage" class="hero-emoji" aria-hidden="true">{{ mainImage }}</span>
                  </Transition>
                </div>

                <div class="thumbnail-list" role="list" v-if="gallery.length > 1">
                  <button
                    v-for="(t, i) in gallery" :key="i" type="button" role="listitem"
                    :class="['thumbnail', { 'is-active': activeThumb === i }]"
                    :aria-label="'查看第 ' + (i + 1) + ' 张图片'"
                    @click="activeThumb = i"
                  >
                    <img v-if="isImg(t)" :src="t" :alt="product.name + ' 图 ' + (i + 1)">
                    <span v-else aria-hidden="true">{{ t }}</span>
                  </button>
                </div>
              </div>

              <!-- 信息 -->
              <div class="product-detail-info">
                <div class="detail-header">
                  <h1>{{ product.name }}</h1>
                  <p class="detail-subtitle">{{ product.subtitle }}</p>
                </div>

                <div class="rating-line mb-4" v-if="product.rating">
                  <span class="stars" aria-hidden="true">{{ starText }}</span>
                  <span>{{ product.rating }} · {{ totalReviews }} 条评价</span>
                </div>

                <div class="detail-price">
                  <span class="current">{{ fmt(currentPrice) }}</span>
                  <span v-if="product.originalPrice" class="original">{{ fmt(product.originalPrice) }}</span>
                  <span v-if="saving > 0" class="saving">立省 {{ fmt(saving) }}</span>
                </div>

                <!-- 颜色 -->
                <div class="spec-section" v-if="colors.length">
                  <div class="spec-title">颜色</div>
                  <div class="color-options" role="radiogroup" aria-label="颜色">
                    <button
                      v-for="(c, i) in colors" :key="c.name" type="button" role="radio"
                      :class="['color-swatch', { 'is-active': activeColor === i }]"
                      :style="{ background: c.hex }"
                      :aria-label="c.name" :aria-checked="activeColor === i"
                      @click="activeColor = i"
                    ></button>
                  </div>
                </div>

                <!-- 规格 -->
                <div class="spec-section" v-if="storages.length > 1">
                  <div class="spec-title">规格</div>
                  <div class="storage-options" role="radiogroup" aria-label="规格">
                    <button
                      v-for="(s, i) in storages" :key="s.size" type="button" role="radio"
                      :class="['storage-option', { 'is-active': activeStorage === i }]"
                      :aria-checked="activeStorage === i"
                      @click="activeStorage = i"
                    >
                      <div class="size">{{ s.size }}</div>
                      <div class="price">{{ fmt(s.price) }}</div>
                    </button>
                  </div>
                </div>

                <!-- 数量 -->
                <div class="qty-row">
                  <div class="spec-title" style="margin:0">数量</div>
                  <div class="qty-stepper">
                    <button @click="changeQty(-1)" aria-label="减少数量">−</button>
                    <span class="value">{{ qty }}</span>
                    <button @click="changeQty(1)" aria-label="增加数量">+</button>
                  </div>
                  <span class="stock-hint">现货充足</span>
                </div>

                <div class="detail-actions">
                  <div class="btn-row">
                    <button class="btn btn-primary btn-lg" @click="addToCart($event)">加入购物车</button>
                    <button class="btn btn-outline btn-lg" @click="buyNow">立即购买</button>
                  </div>
                  <p class="ship-note">预计 24 小时内发货 · 14 天无忧退换</p>
                </div>

                <div class="detail-features" v-if="product.highlights">
                  <div class="feature-list">
                    <div class="feature-item" v-for="f in product.highlights" :key="f.title">
                      <div class="feature-icon" aria-hidden="true">{{ f.icon }}</div>
                      <div class="feature-text">
                        <h5>{{ f.title }}</h5>
                        <p>{{ f.desc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="tabs">
            <div class="tab-nav">
              <button :class="['tab-btn', { 'is-active': tab === 'detail' }]" @click="tab = 'detail'">产品详情</button>
              <button :class="['tab-btn', { 'is-active': tab === 'spec' }]" @click="tab = 'spec'">规格参数</button>
              <button :class="['tab-btn', { 'is-active': tab === 'review' }]" @click="tab = 'review'">用户评价</button>
            </div>

            <div style="position:relative">
              <Transition name="tab-fade" mode="out-in">
                <div v-if="tab === 'detail'" key="detail">
                  <p class="muted" style="max-width:760px">{{ product.description }}</p>
                  <div class="detail-images-list mt-5" v-if="product.detailImages && product.detailImages.length">
                    <img v-for="(src, i) in product.detailImages" :key="i" :src="src"
                         :alt="product.name + ' 详情图 ' + (i + 1)" loading="lazy">
                  </div>
                  <div class="empty-state" v-else>
                    <div class="empty-icon" aria-hidden="true">🖼</div>
                    <p>暂无更多详情图</p>
                    <p class="empty-tip">图片素材为测试数据，可在 js/core/data.js 中补充</p>
                  </div>
                </div>

                <div v-else-if="tab === 'spec'" key="spec">
                  <table class="spec-table">
                    <tbody>
                      <tr v-for="s in product.specs" :key="s.k">
                        <th>{{ s.k }}</th><td>{{ s.v }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-else key="review">
                  <div class="rating-line mb-4">
                    <span class="stars" aria-hidden="true">{{ starText }}</span>
                    <strong style="font-size:1.25rem">{{ ratingAvg }}</strong>
                    <span>· 共 {{ totalReviews }} 条评价</span>
                  </div>
                  <div class="review-list">
                    <article class="review-item" v-for="r in reviews" :key="r.id">
                      <div class="review-head">
                        <div class="review-avatar" aria-hidden="true">{{ r.avatar }}</div>
                        <div class="review-meta">
                          <strong>{{ r.author }}</strong>
                          <span>{{ r.date }} · {{ r.spec }}</span>
                        </div>
                        <span class="stars" style="margin-left:auto" aria-hidden="true">
                          {{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}
                        </span>
                      </div>
                      <p class="review-body">{{ r.content }}</p>
                    </article>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </main>

        <!-- 相关推荐 -->
        <section class="related" v-if="related.length">
          <div class="section-header">
            <h2>你可能也喜欢</h2>
            <p>同分类的其他选择</p>
          </div>
          <div class="product-grid">
            <ProductCard v-for="(p, i) in related" :key="p.id" :product="p" :delay="i * 80" />
          </div>
        </section>
      </template>

      <SiteFooter />
      <CartDrawer />
      <ToastStack />
    `
  };

  S.mountPage(ProductPage);
})(window.STAr);
