/* ============================================================
   pages/community.js — 社区（话题筛选 / 点赞 / 加载更多）
   ============================================================ */

(function (S) {
  'use strict';

  const { ref, computed, onMounted, nextTick } = Vue;

  const CommunityPage = {
    setup() {
      const url = S.url;
      const data = S.community;

      const posts = ref(data.posts.map(p => ({ ...p })));
      const activeTopic = ref('全部');
      const visible = ref(3);

      const topics = ['全部'].concat(data.topics.map(t => t.name));

      const filtered = computed(() => {
        if (activeTopic.value === '全部') return posts.value;
        return posts.value.filter(p => p.tags.includes(activeTopic.value));
      });

      const shown = computed(() => filtered.value.slice(0, visible.value));
      const hasMore = computed(() => filtered.value.length > visible.value);

      function pickTopic(t) {
        activeTopic.value = t;
        visible.value = 3;
        nextTick(() => S.motion.refreshScrollReveal());
      }

      function toggleLike(p) {
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        if (p.liked) S.toast.show('success', '已点赞', '感谢你的鼓励', 1800);
      }

      function loadMore() {
        visible.value += 3;
      }

      function createPost() {
        S.toast.show('info', '发帖功能待接入', '当前为演示页面，发布内容为测试数据', 2600);
      }

      /* 跑马灯内容：复制一份实现无缝滚动 */
      const marquee = data.topics.concat(data.topics).map((t, i) => ({ ...t, key: i }));

      onMounted(() => {
        S.motion.staggerIn('.post-card', { y: 28, stagger: 90, duration: 700 });
        S.motion.staggerIn('.side-card', { y: 20, stagger: 100, duration: 620, delay: 120 });
      });

      return {
        url, data, topics, activeTopic, pickTopic,
        shown, hasMore, loadMore, toggleLike, createPost,
        marquee,
        total: computed(() => filtered.value.length),
        fmtNum: S.formatCompact
      };
    },

    template: `
      <SiteNav />

      <PageHero
        title="社区"
        desc="聊聊手上的设备，晒晒桌面的搭配，也把踩过的坑留给下一个人。"
        :crumbs="[{ label: '首页', href: 'index.html' }, { label: '社区' }]"
      >
        <div class="hero-actions mt-6">
          <button class="btn btn-primary" data-magnetic @click="createPost">发一条新帖</button>
          <a :href="url('pages/products.html')" class="btn btn-ghost">去逛逛产品</a>
        </div>
      </PageHero>

      <!-- 话题跑马灯 -->
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          <span class="marquee-item" v-for="t in marquee" :key="t.key">
            <span>#</span>{{ t.name }} <span style="opacity:.5">{{ t.count }}</span>
          </span>
        </div>
      </div>

      <div class="community-layout">
        <div>
          <!-- 社区数据 -->
          <div class="stats" style="margin-bottom:var(--space-6)">
            <div class="stat-item" v-for="s in data.stats" :key="s.label" data-aos="fade-up">
              <div class="stat-value" style="font-size:clamp(1.5rem,3vw,2rem)">
                <span :data-count="s.value" :data-suffix="s.suffix">0</span>
              </div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
          <p class="stats-note" style="text-align:left;margin-top:calc(-1 * var(--space-4));margin-bottom:var(--space-6)">以上数据为测试数据</p>

          <!-- 话题筛选 -->
          <div class="chip-group mb-5">
            <button v-for="t in topics" :key="t"
                    :class="['chip', { 'is-active': activeTopic === t }]"
                    @click="pickTopic(t)">{{ t }}</button>
          </div>

          <p class="result-count">共 <strong>{{ total }}</strong> 条讨论 · 当前显示 {{ shown.length }} 条</p>

          <!-- 帖子 -->
          <TransitionGroup name="product-list" tag="div" class="post-list" v-if="shown.length">
            <article class="post-card" v-for="p in shown" :key="p.id">
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
                  <span class="badge" v-for="t in p.tags" :key="t">#{{ t }}</span>
                </div>
                <div class="post-footer">
                  <button :class="['post-action', { 'is-liked': p.liked }]" @click="toggleLike(p)" :aria-pressed="p.liked">
                    <span class="heart">{{ p.liked ? '♥' : '♡' }}</span>{{ p.likes }}
                  </button>
                  <span class="post-action">💬 {{ p.comments }}</span>
                  <span class="post-action">👀 {{ p.views }}</span>
                </div>
              </div>
            </article>
          </TransitionGroup>

          <div class="empty-state" v-else>
            <div class="empty-icon" aria-hidden="true">💬</div>
            <p>这个话题下还没有讨论</p>
            <p class="empty-tip">换个话题，或者来发第一条</p>
          </div>

          <div class="text-center mt-5">
            <button class="btn btn-outline" v-if="hasMore" @click="loadMore">加载更多讨论</button>
            <p class="tertiary" style="font-size:var(--font-size-sm);margin-top:var(--space-3)" v-else>
              已经到底啦 · 内容为测试数据
            </p>
          </div>
        </div>

        <!-- 侧栏 -->
        <aside>
          <div class="side-card" data-aos="fade-up">
            <h4>热门话题</h4>
            <div class="topic-list">
              <div class="topic-item" v-for="t in data.topics" :key="t.name">
                <span># {{ t.name }}</span>
                <span>{{ t.count }} 条</span>
              </div>
            </div>
          </div>

          <div class="side-card" data-aos="fade-up" data-aos-delay="80">
            <h4>活跃成员</h4>
            <div class="member-list">
              <div class="member-item" v-for="(m, i) in ['🧑‍💻','🧑‍🎨','👩‍🔧','🧑‍🚀','👨‍🍳']" :key="i">
                <div class="member-avatar" aria-hidden="true">{{ m }}</div>
                <span class="name">测试数据</span>
                <span class="rank">Lv.{{ 6 - i }}</span>
              </div>
            </div>
          </div>

          <div class="side-card" data-aos="fade-up" data-aos-delay="160">
            <h4>近期活动</h4>
            <div class="topic-list">
              <div class="topic-item" v-for="e in data.events" :key="e.title + e.date">
                <span>{{ e.title }}</span>
                <span>{{ e.date }}</span>
              </div>
            </div>
            <p class="tertiary mt-4" style="font-size:var(--font-size-xs);margin-bottom:0">活动信息为测试数据</p>
          </div>
        </aside>
      </div>

      <SiteFooter />
      <CartDrawer />
      <ToastStack />
    `
  };

  S.mountPage(CommunityPage);
})(window.STAr);
