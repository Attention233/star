/* ============================================================
   pages/about.js — 关于我们（故事 / 数据 / 历程 / 团队 / FAQ）
   ============================================================ */

(function (S) {
  'use strict';

  const { ref, onMounted } = Vue;

  const AboutPage = {
    setup() {
      const url = S.url;
      const d = S.about;
      const openFaq = ref(0);

      function toggleFaq(i) {
        openFaq.value = openFaq.value === i ? -1 : i;
      }

      function sayHi() {
        S.toast.show('info', '联系方式为测试数据', '正式上线前请替换为真实客服信息', 2800);
      }

      onMounted(() => {
        S.motion.staggerIn('.value-card', { y: 24, stagger: 90, duration: 680 });
        S.motion.staggerIn('.contact-card', { y: 18, stagger: 70, duration: 560 });
      });

      return {
        url, d, openFaq, toggleFaq, sayHi,
        fmtNum: S.formatCompact
      };
    },

    template: `
      <SiteNav />

      <PageHero
        :title="d.hero.title"
        :desc="d.hero.desc"
        :crumbs="[{ label: '首页', href: 'index.html' }, { label: '关于我们' }]"
      />

      <!-- 品牌故事 -->
      <section class="section">
        <div class="section-inner about-story">
          <div data-aos="fade-right">
            <span class="eyebrow">品牌故事</span>
            <h2>{{ d.story.title }}</h2>
            <p v-for="(p, i) in d.story.paragraphs" :key="i">{{ p }}</p>
            <p class="tertiary" style="font-size:var(--font-size-xs)">以上为占位文案（测试数据），正式上线前请替换。</p>
          </div>
          <div class="about-figure" data-aos="fade-left" data-tilt="4">
            <img :src="url(d.story.figure)" alt="品牌故事配图" loading="lazy">
          </div>
        </div>
      </section>

      <!-- 数据 -->
      <section class="section section--muted">
        <div class="section-inner">
          <div class="stats">
            <div class="stat-item" v-for="s in d.stats" :key="s.label" data-aos="fade-up">
              <div class="stat-value">
                <span :data-count="s.value" :data-decimals="s.decimals || 0" :data-suffix="s.suffix || ''">0</span>
              </div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
          <p class="stats-note">以上数据为测试数据</p>
        </div>
      </section>

      <!-- 发展历程 -->
      <section class="section">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>一路走来</h2>
            <p>从一份选品清单，到一个小小的社区</p>
          </div>

          <div class="grid grid-2" style="gap:var(--space-8)">
            <div class="timeline" data-aos="fade-up">
              <div class="timeline-item" v-for="(t, i) in d.timeline" :key="t.year"
                   data-aos="fade-up" :data-aos-delay="i * 90">
                <div class="timeline-year">{{ t.year }}</div>
                <h4>{{ t.title }}</h4>
                <p>{{ t.desc }}</p>
              </div>
            </div>

            <div class="grid" style="gap:var(--space-4);align-content:start">
              <div class="value-card" v-for="v in d.values" :key="v.title">
                <div class="value-icon" aria-hidden="true">{{ v.icon }}</div>
                <h4>{{ v.title }}</h4>
                <p>{{ v.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 团队 -->
      <section class="section section--muted" id="team">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>团队成员</h2>
            <p>名字先占位，人已经在岗</p>
          </div>

          <div class="team-grid">
            <div class="team-card" v-for="(m, i) in d.team" :key="i" data-aos="zoom-in" :data-aos-delay="i * 80">
              <div class="team-avatar" aria-hidden="true">{{ m.avatar }}</div>
              <strong>{{ m.name }}</strong>
              <span>{{ m.role }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="section" id="faq">
        <div class="container-narrow">
          <div class="section-header" data-aos="fade-up">
            <h2>常见问题</h2>
            <p>下单前最常被问到的几件事</p>
          </div>

          <div class="faq">
            <div class="faq-item" v-for="(f, i) in d.faq" :key="i"
                 :class="{ 'is-open': openFaq === i }" data-aos="fade-up" :data-aos-delay="i * 50">
              <button class="faq-q" :aria-expanded="openFaq === i" @click="toggleFaq(i)">
                <span>{{ f.q }}</span>
                <span class="faq-icon" aria-hidden="true">+</span>
              </button>
              <div class="faq-a" :class="{ 'is-open': openFaq === i }">
                <div><p class="faq-a-inner">{{ f.a }}</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系 -->
      <section class="section section--muted" id="contact">
        <div class="section-inner">
          <div class="section-header" data-aos="fade-up">
            <h2>联系我们</h2>
            <p>有问题随时找我们，工作日 24 小时内回复</p>
          </div>

          <div class="contact-grid">
            <div class="contact-card" v-for="c in d.contacts" :key="c.label">
              <span>{{ c.label }}</span>
              <strong>{{ c.value }}</strong>
            </div>
          </div>

          <div class="text-center mt-6">
            <button class="btn btn-outline" @click="sayHi">发送咨询</button>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section" style="padding-top:0">
        <div class="section-inner">
          <div class="cta-band" data-aos="zoom-in">
            <h2>想聊点具体的？</h2>
            <p>把你在挑的东西告诉我们，或者直接去社区看看别人怎么选。</p>
            <div class="cta-actions">
              <a :href="url('pages/community.html')" class="btn btn-primary btn-lg" data-magnetic>进入社区</a>
              <a :href="url('pages/products.html')" class="btn btn-outline btn-lg">浏览产品</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <CartDrawer />
      <ToastStack />
    `
  };

  S.mountPage(AboutPage);
})(window.STAr);
