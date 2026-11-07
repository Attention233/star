/* ============================================================
   pages/checkout.js — 订单支付（支付方式切换 / 二维码 / 倒计时）
   风格对齐整站设计 token；二维码为本地生成的占位码（测试数据）
   ============================================================ */

(function (S) {
  'use strict';

  const { ref, computed, onMounted, onUnmounted, nextTick } = Vue;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CheckoutPage = {
    setup() {
      const pay = S.payment;

      /* ---------- 订单数据：购物车为空时用示例订单兜底 ---------- */
      S.cart.load();
      const isDemo = computed(() => S.cart.state.items.length === 0);
      const items = computed(() =>
        isDemo.value ? pay.sampleOrder : S.cart.state.items
      );
      const subtotal = computed(() =>
        items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
      );
      const shipping = 0;
      const total = computed(() => subtotal.value + shipping);
      const totalText = computed(() => total.value.toFixed(2));

      const orderNo = 'D' + String(Date.now()).slice(-10);
      const isImg = S.isImageSrc;
      const resolveAsset = S.resolveAsset;

      /* ---------- 支付方式 ---------- */
      const activeId = ref(pay.methods[0].id);
      const method = computed(() => pay.methods.find(m => m.id === activeId.value));
      const methodDesc = m => '使用' + ({
        wechat: '微信', alipay: '支付宝', unionpay: '云闪付'
      }[m.id] || m.name) + '扫码付款';

      /* ---------- 二维码 ---------- */
      const qrBox = ref(null);

      function makeQrSvg() {
        if (typeof window.qrcode !== 'function') return '';
        const qr = window.qrcode(0, 'M');
        qr.addData(pay.qrPayload(orderNo, activeId.value, totalText.value));
        qr.make();
        try {
          return qr.createSvgTag({ cellSize: 7, margin: 0, scalable: true });
        } catch (e) {
          return qr.createSvgTag(7, 0);
        }
      }

      function renderQr() {
        if (qrBox.value) qrBox.value.innerHTML = makeQrSvg();
      }

      function swapQr() {
        const box = qrBox.value;
        if (!box) { renderQr(); return; }
        if (REDUCED || !window.anime) { renderQr(); return; }
        window.anime({
          targets: box,
          opacity: [1, 0],
          scale: [1, 0.88],
          duration: 200,
          easing: 'easeInQuad',
          complete() {
            renderQr();
            window.anime({
              targets: box,
              opacity: [0, 1],
              scale: [0.92, 1],
              duration: 420,
              easing: 'easeOutBack'
            });
          }
        });
      }

      function selectMethod(m) {
        if (paid.value || expired.value) return;
        if (m.id === activeId.value) return;
        activeId.value = m.id;
        swapQr();
      }

      /* ---------- 支付倒计时 ---------- */
      const remain = ref(pay.expireMinutes * 60);
      let timer = null;
      const expired = computed(() => remain.value <= 0 && !paid.value);
      const countdownText = computed(() => {
        const m = Math.floor(Math.max(remain.value, 0) / 60);
        const s = Math.max(remain.value, 0) % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      });
      const urgent = computed(() => remain.value > 0 && remain.value <= 120);

      function refreshQr() {
        remain.value = pay.expireMinutes * 60;
        swapQr();
        S.toast.show('info', '二维码已刷新', '支付剩余时间重新计时', 2200);
      }

      /* ---------- 模拟支付完成 ---------- */
      const paid = ref(false);
      const successCard = ref(null);

      function simulatePay() {
        if (paid.value || expired.value) return;
        paid.value = true;
        if (!isDemo.value) S.cart.clear();
        nextTick(() => {
          const card = successCard.value;
          if (!card || REDUCED || !window.anime) return;
          window.anime.timeline()
            .add({
              targets: card,
              opacity: [0, 1],
              translateY: [28, 0],
              scale: [0.94, 1],
              duration: 480,
              easing: 'easeOutCubic'
            })
            .add({
              targets: card.querySelectorAll('.success-ring'),
              strokeDashoffset: [window.anime.setDashoffset, 0],
              duration: 700,
              easing: 'easeInOutSine'
            }, '-=180')
            .add({
              targets: card.querySelectorAll('.success-tick'),
              strokeDashoffset: [window.anime.setDashoffset, 0],
              duration: 420,
              easing: 'easeInOutSine'
            }, '-=140');
        });
      }

      onMounted(() => {
        renderQr();
        timer = setInterval(() => { if (!paid.value && remain.value > 0) remain.value--; }, 1000);
      });
      onUnmounted(() => clearInterval(timer));

      return {
        pay, orderNo, isImg, resolveAsset,
        isDemo, items, subtotal, shipping, total, totalText,
        activeId, method, methodDesc, selectMethod,
        qrBox, remain, expired, countdownText, urgent, refreshQr,
        paid, successCard, simulatePay,
        url: S.url
      };
    },

    template: `
      <div>
        <site-nav></site-nav>

        <main class="checkout-page checkout-page--v2">
          <div class="container checkout-container">

            <ol class="checkout-steps" data-aos="fade-up">
              <li><span class="checkout-step-no">1</span>购物车</li>
              <li class="is-current"><span class="checkout-step-no">2</span>确认订单并支付</li>
              <li><span class="checkout-step-no">3</span>完成</li>
            </ol>

            <div class="checkout-stack">
              <!-- 顶部：订单摘要 -->
              <section class="card checkout-order" data-aos="fade-up" data-aos-delay="60">
                <div class="order-overview-head">
                  <div>
                    <p class="checkout-eyebrow">ORDER SUMMARY</p>
                    <h1 class="checkout-h">确认订单</h1>
                  </div>
                  <span class="order-count">共 {{ items.length }} 件商品</span>
                </div>

                <div class="order-overview-body">
                <div class="order-address">
                  <div class="order-address-badge">{{ pay.address.tag }}</div>
                  <div>
                    <p class="order-address-line">
                      <strong>{{ pay.address.name }}</strong>
                      <span class="order-address-phone">{{ pay.address.phone }}</span>
                    </p>
                    <p class="order-address-detail">{{ pay.address.region }}</p>
                  </div>
                </div>

                <ul class="order-items">
                  <li v-for="it in items" :key="it.id" class="order-item">
                    <span class="order-item-icon" aria-hidden="true">
                      <img v-if="isImg(it.icon)" :src="resolveAsset(it.icon)" :alt="it.name">
                      <span v-else>{{ it.icon }}</span>
                    </span>
                    <span class="order-item-info">
                      <span class="order-item-name">{{ it.name }}</span>
                      <span class="order-item-qty">数量 ×{{ it.qty }}</span>
                    </span>
                    <span class="order-item-price">{{ $price(it.price * it.qty) }}</span>
                  </li>
                </ul>

                <dl class="order-summary">
                  <div><dt>商品金额</dt><dd>{{ $price(subtotal) }}</dd></div>
                  <div><dt>运费</dt><dd>{{ shipping === 0 ? '免运费' : $price(shipping) }}</dd></div>
                  <div class="order-summary-total"><dt>合计</dt><dd>{{ $price(total) }}</dd></div>
                </dl>
                </div>

                <p v-if="isDemo" class="checkout-note">
                  当前购物车为空，展示的是示例订单（测试数据）。从商品页加入购物车后，这里会显示真实清单。
                </p>
              </section>

              <!-- 下方：整块收银台 -->
              <section class="card checkout-pay" data-aos="fade-up" data-aos-delay="140">
                <div class="pay-head">
                  <div>
                    <p class="checkout-eyebrow">PAYMENT</p>
                    <h2 class="checkout-h">选择支付方式</h2>
                  </div>
                  <div class="pay-amount-wrap">
                    <p class="pay-label">应付金额 <strong class="pay-amount">¥{{ totalText }}</strong></p>
                    <p class="pay-order-no">订单号 {{ orderNo }}</p>
                  </div>
                </div>

                <div class="pay-body">
                <div class="pay-methods" role="radiogroup" aria-label="支付方式">
                  <button
                    v-for="m in pay.methods"
                    :key="m.id"
                    type="button"
                    class="pay-method"
                    :class="{ 'is-active': m.id === activeId }"
                    :style="m.id === activeId ? { borderColor: m.color } : null"
                    role="radio"
                    :aria-checked="m.id === activeId"
                    @click="selectMethod(m)"
                  >
                    <span class="pay-method-icon" :style="{ background: m.color }">{{ m.icon }}</span>
                    <span class="pay-method-text">
                      <span class="pay-method-name">{{ m.name }}</span>
                      <span class="pay-method-desc">{{ methodDesc(m) }}</span>
                    </span>
                    <span v-if="m.recommend" class="pay-method-tag">推荐</span>
                    <span v-if="m.id === activeId" class="pay-method-check" :style="{ background: m.color }" aria-hidden="true">
                      <svg viewBox="0 0 12 12" width="10" height="10"><path d="M2 6.2 4.8 9 10 3.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span v-else class="pay-method-radio" aria-hidden="true"></span>
                  </button>
                </div>

                <div class="pay-qr pay-qr-panel">
                  <p class="pay-qr-tip">{{ method.tip }}</p>

                  <div class="pay-qr-frame" :style="{ '--pay-color': method.color }">
                    <div class="pay-qr-box" ref="qrBox" aria-label="支付二维码（测试数据）"></div>
                    <div v-if="expired" class="pay-qr-mask">
                      <p>二维码已过期</p>
                      <button type="button" class="btn btn-primary btn-sm" @click="refreshQr">点击刷新</button>
                    </div>
                  </div>

                  <p class="pay-countdown" :class="{ 'is-urgent': urgent, 'is-expired': expired }">
                    <template v-if="!expired">支付剩余时间 <strong>{{ countdownText }}</strong></template>
                    <template v-else>二维码已失效，请刷新后重新扫码</template>
                  </p>

                  <button
                    type="button"
                    class="btn btn-primary btn-block pay-done-btn"
                    :disabled="expired"
                    @click="simulatePay"
                  >
                    我已完成支付
                  </button>
                  <p class="pay-secure">二维码为本地生成的测试数据，不会发起真实扣款。</p>
                </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <site-footer></site-footer>
        <cart-drawer></cart-drawer>
        <toast-stack></toast-stack>

        <!-- 支付成功 -->
        <div v-if="paid" class="pay-success">
          <div class="pay-success-card" ref="successCard">
            <svg class="pay-success-icon" viewBox="0 0 72 72" width="72" height="72" aria-hidden="true">
              <circle class="success-ring" cx="36" cy="36" r="32" fill="none" stroke="var(--color-success, #34a853)" stroke-width="4" stroke-linecap="round"/>
              <path class="success-tick" d="M22 37.5 32 47 51 27" fill="none" stroke="var(--color-success, #34a853)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2>支付成功</h2>
            <p class="pay-success-no">订单号 {{ orderNo }}</p>
            <p class="pay-success-note">这是演示流程（测试数据），未发生真实扣款。</p>
            <div class="pay-success-actions">
              <a class="btn btn-primary" :href="url('index.html')">返回首页</a>
              <a class="btn btn-secondary" :href="url('pages/products.html')">继续逛逛</a>
            </div>
          </div>
        </div>
      </div>
    `
  };

  S.mountPage(CheckoutPage);
})(window.STAr);
