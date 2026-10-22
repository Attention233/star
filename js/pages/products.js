/* ============================================================
   pages/products.js — 全部产品（分类 / 搜索 / 排序）
   ============================================================ */

(function (S) {
  'use strict';

  const { ref, computed, watch, nextTick, onMounted } = Vue;

  const ProductsPage = {
    setup() {
      const url = S.url;
      const all = S.products;

      const initCat = S.getQuery('category');
      const activeCat = ref(S.categories.some(c => c.key === initCat) ? initCat : 'all');
      const keyword = ref('');
      const sort = ref('recommend');

      const list = computed(() => {
        let arr = all.slice();
        if (activeCat.value !== 'all') arr = arr.filter(p => p.category === activeCat.value);
        const kw = keyword.value.trim().toLowerCase();
        if (kw) {
          arr = arr.filter(p =>
            (p.name + ' ' + p.description + ' ' + (p.spec || '')).toLowerCase().includes(kw)
          );
        }
        switch (sort.value) {
          case 'price-asc': arr.sort((a, b) => a.price - b.price); break;
          case 'price-desc': arr.sort((a, b) => b.price - a.price); break;
          case 'rating': arr.sort((a, b) => b.rating - a.rating); break;
          case 'new': arr.sort((a, b) => (b.tag === 'new' ? 1 : 0) - (a.tag === 'new' ? 1 : 0)); break;
          default: arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        return arr;
      });

      const sorting = ref(false);
      function reset() {
        activeCat.value = 'all';
        keyword.value = '';
        sort.value = 'recommend';
      }

      /* 切换筛选后刷新 AOS 定位，避免元素被留白 */
      watch([activeCat, sort], () => {
        nextTick(() => S.motion.refreshScrollReveal());
      });

      onMounted(() => {
        S.motion.staggerIn('.category-chip-strip .chip', { y: 14, stagger: 45, duration: 560 });
      });

      return {
        url, categories: S.categories, list, activeCat, keyword, sort, sorting,
        reset,
        total: computed(() => all.length),
        fmt: S.formatPrice,
        catLabel: S.categoryLabel
      };
    },

    template: `
      <SiteNav />

      <PageHero
        title="全部产品"
        desc="按分类、价格或评分挑一个顺手的排序，慢慢看。"
        :crumbs="[{ label: '首页', href: 'index.html' }, { label: '全部产品' }]"
      />

      <main class="products-layout">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="chip-group category-chip-strip">
            <button
              v-for="c in categories" :key="c.key"
              :class="['chip', { 'is-active': activeCat === c.key }]"
              @click="activeCat = c.key"
            >{{ c.name }}</button>
          </div>

          <div class="toolbar-right">
            <label class="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/>
              </svg>
              <input v-model="keyword" type="search" placeholder="搜索商品" aria-label="搜索商品">
            </label>

            <div class="select-wrap">
              <select v-model="sort" aria-label="排序方式">
                <option value="recommend">综合推荐</option>
                <option value="new">新品优先</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="rating">评分优先</option>
              </select>
            </div>
          </div>
        </div>

        <p class="result-count">
          共 <strong>{{ list.length }}</strong> 件商品
          <template v-if="activeCat !== 'all'"> · {{ catLabel(activeCat) }}</template>
          <template v-if="keyword"> · 关键词「{{ keyword }}」</template>
        </p>

        <!-- 列表 -->
        <TransitionGroup name="product-list" tag="div" class="product-grid" v-if="list.length">
          <ProductCard v-for="p in list" :key="p.id" :product="p" :delay="0" />
        </TransitionGroup>

        <div class="empty-state" v-else>
          <div class="empty-icon" aria-hidden="true">🔍</div>
          <p>没有找到符合条件的商品</p>
          <p class="empty-tip">试试换个关键词或清除筛选条件</p>
          <button class="btn btn-primary btn-sm" @click="reset">清除全部筛选</button>
        </div>
      </main>

      <SiteFooter />
      <CartDrawer />
      <ToastStack />
    `
  };

  S.mountPage(ProductsPage);
})(window.STAr);
