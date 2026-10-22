/* ============================================================
   core/motion.js — 动效引擎
   依赖（均可缺失，缺失时自动降级）：
     · anime.js        逐字入场 / 数字滚动 / 抛物线飞入
     · AOS             滚动进入视口动画
     · Lenis           惯性平滑滚动
   ============================================================ */

(function (S) {
  'use strict';

  const M = {};
  const reduce = S.reducedMotion();
  let lenis = null;

  /* ------------------------------------------------------------
     1. 平滑滚动（Lenis）
     ------------------------------------------------------------ */
  M.initSmoothScroll = function () {
    if (reduce || typeof window.Lenis !== 'function') return null;
    lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });
    const raf = time => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    /* 站内锚点交给 Lenis，缓动更自然 */
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.1 });
    });
    return lenis;
  };

  M.scrollTo = function (target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.1 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  /* ------------------------------------------------------------
     2. 滚动进入视口（AOS）
     ------------------------------------------------------------ */
  M.initScrollReveal = function () {
    if (typeof window.AOS !== 'function') return;
    document.documentElement.classList.add('js-aos');
    window.AOS.init({
      duration: 720,
      easing: 'ease-out-cubic',
      once: true,
      offset: 72,
      anchorPlacement: 'top-bottom',
      disable: reduce
    });
    /* 图片加载后高度变化，刷新一次定位 */
    window.addEventListener('load', () => window.AOS.refresh(), { once: true });
  };

  M.refreshScrollReveal = function () {
    if (window.AOS) window.AOS.refreshHard ? window.AOS.refreshHard() : window.AOS.refresh();
  };

  /* ------------------------------------------------------------
     3. 顶部滚动进度条 + 导航态
     ------------------------------------------------------------ */
  M.initScrollProgress = function () {
    const root = document.documentElement;
    let ticking = false;
    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? S.clamp(window.scrollY / max, 0, 1) : 0;
      root.style.setProperty('--scroll-progress', p.toFixed(4));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  };

  /* ------------------------------------------------------------
     4. 文字拆分 + 逐字入场（anime.js）
     ------------------------------------------------------------ */
  function splitChars(el) {
    if (!el || el.dataset.split === 'done') return [];
    const text = el.textContent;
    el.dataset.split = 'done';
    el.setAttribute('aria-label', text);
    el.textContent = '';

    const frag = document.createDocumentFragment();
    Array.from(text).forEach(ch => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.setAttribute('aria-hidden', 'true');
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return Array.from(el.querySelectorAll('.split-char'));
  }

  /**
   * 标题逐字上浮入场
   * @param {string|Element} target
   * @param {object} opts { delay, stagger }
   */
  M.textIn = function (target, opts) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (reduce || typeof window.anime !== 'function') return;
    const chars = splitChars(el);
    if (!chars.length) return;
    const o = opts || {};
    window.anime({
      targets: chars,
      translateY: ['110%', '0%'],
      rotate: [6, 0],
      opacity: [0, 1],
      duration: 900,
      delay: window.anime.stagger(o.stagger || 26, { start: o.delay || 0 }),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)'
    });
  };

  /* ------------------------------------------------------------
     5. 元素错峰入场（列表 / 卡片）
     ------------------------------------------------------------ */
  M.staggerIn = function (targets, opts) {
    if (reduce || typeof window.anime !== 'function') return;
    const els = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
    if (!els || !els.length) return;
    const o = opts || {};
    window.anime({
      targets: Array.from(els),
      translateY: [o.y === undefined ? 26 : o.y, 0],
      opacity: [0, 1],
      scale: [o.scale === undefined ? 0.98 : o.scale, 1],
      duration: o.duration || 760,
      delay: window.anime.stagger(o.stagger || 70, { start: o.delay || 0 }),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)'
    });
  };

  /* ------------------------------------------------------------
     6. 悬浮微交互：视差 / 磁吸 / 3D 倾斜
     ------------------------------------------------------------ */
  M.heroParallax = function (heroEl) {
    const hero = heroEl || document.querySelector('.hero');
    if (!hero || reduce) return;
    const layers = Array.from(hero.querySelectorAll('[data-depth]'));
    if (!layers.length) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach(el => {
        const d = parseFloat(el.dataset.depth) || 10;
        el.style.transform = `translate3d(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px, 0)`;
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    hero.addEventListener('mouseleave', () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  };

  /** 磁吸按钮：指针靠近时轻微吸附 */
  M.magnetic = function (selector, strength) {
    if (reduce) return;
    const els = document.querySelectorAll(selector || '[data-magnetic]');
    els.forEach(el => {
      if (el.dataset.magneticBound) return;
      el.dataset.magneticBound = '1';
      const k = strength || 0.22;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * k;
        const y = (e.clientY - r.top - r.height / 2) * k;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        el.style.transform = 'translate(0,0)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  };

  /** 卡片 3D 倾斜 */
  M.tilt = function (selector, max) {
    if (reduce) return;
    document.querySelectorAll(selector || '[data-tilt]').forEach(el => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = '1';
      const m = max || 6;
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * m).toFixed(2)}deg) rotateY(${(px * m).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 600);
      });
    });
  };

  /* ------------------------------------------------------------
     7. 数字滚动
     ------------------------------------------------------------ */
  M.countUp = function (el, value, opts) {
    if (!el) return;
    const o = opts || {};
    const decimals = o.decimals || 0;
    const suffix = o.suffix || '';
    if (reduce || typeof window.anime !== 'function') {
      el.textContent = Number(value).toFixed(decimals) + suffix;
      return;
    }
    const obj = { v: 0 };
    window.anime({
      targets: obj,
      v: value,
      round: decimals ? 0 : 1,
      duration: o.duration || 1500,
      easing: 'easeOutExpo',
      update: () => {
        const n = obj.v;
        el.textContent = (decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString('zh-CN')) + suffix;
      }
    });
  };

  /** 自动处理页面内所有 [data-count] 数字，进入视口时触发一次 */
  M.autoCount = function (scope) {
    const root = scope || document;
    const els = Array.from(root.querySelectorAll('[data-count]'));
    if (!els.length) return;
    const run = el => {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      M.countUp(el, parseFloat(el.dataset.count) || 0, {
        decimals: parseFloat(el.dataset.decimals) || 0,
        suffix: el.dataset.suffix || ''
      });
    };
    if (!('IntersectionObserver' in window)) {
      els.forEach(run);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          run(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  };

  /* ------------------------------------------------------------
     8. 购物车：飞入动画 + 角标弹跳
     ------------------------------------------------------------ */
  M.flyToCart = function (sourceEl) {
    if (reduce || !sourceEl) return;
    const target = document.querySelector('.cart-btn');
    if (!target) return;

    const img = sourceEl.tagName === 'IMG' ? sourceEl : sourceEl.querySelector('img');
    const origin = (img || sourceEl).getBoundingClientRect();
    if (!origin.width) return;

    let clone;
    if (img) {
      clone = img.cloneNode();
      clone.className = 'fly-clone';
      clone.style.cssText += `width:${origin.width}px;height:${origin.height}px;left:${origin.left}px;top:${origin.top}px;`;
    } else {
      clone = document.createElement('div');
      clone.className = 'fly-clone';
      clone.style.cssText += `display:flex;align-items:center;justify-content:center;font-size:32px;background:#eef1f6;width:${origin.width}px;height:${origin.height}px;left:${origin.left}px;top:${origin.top}px;`;
      clone.textContent = (sourceEl.textContent || '🛍').trim().slice(0, 2);
    }
    document.body.appendChild(clone);

    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (origin.left + origin.width / 2);
    const dy = to.top + to.height / 2 - (origin.top + origin.height / 2);

    if (typeof window.anime !== 'function') {
      clone.remove();
      M.bumpCart();
      return;
    }
    window.anime({
      targets: clone,
      keyframes: [
        { translateX: dx * 0.5, translateY: dy * 0.35 - 110, scale: 0.55, duration: 400 },
        { translateX: dx, translateY: dy, scale: 0.08, opacity: 0.2, duration: 380 }
      ],
      easing: 'easeInOutQuad',
      complete: () => {
        clone.remove();
        M.bumpCart();
      }
    });
  };

  M.bumpCart = function () {
    const btn = document.querySelector('.cart-btn');
    if (!btn) return;
    btn.classList.remove('is-bump');
    void btn.offsetWidth;
    btn.classList.add('is-bump');
    setTimeout(() => btn.classList.remove('is-bump'), 660);
  };

  /* ------------------------------------------------------------
     9. 点击涟漪
     ------------------------------------------------------------ */
  M.initRipple = function () {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn');
      if (!btn || reduce) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - r.left - size / 2) + 'px';
      span.style.top = (e.clientY - r.top - size / 2) + 'px';
      btn.appendChild(span);
      setTimeout(() => span.remove(), 640);
    });
  };

  /* ------------------------------------------------------------
     10. 页面切换过渡（MPA）
     ------------------------------------------------------------ */
  M.initPageTransition = function () {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || /^(#|https?:|mailto:|tel:)/.test(href) || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
      if (href.startsWith('#')) return;
      if (reduce) return;
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { location.href = href; }, 220);
    });

    /* 从缓存恢复时清掉过渡态 */
    window.addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));
  };

  /* ------------------------------------------------------------
     11. 首屏入场编排
     ------------------------------------------------------------ */
  M.heroEnter = function () {
    if (reduce) return;
    const title = document.querySelector('[data-hero-title]');
    if (title) M.textIn(title, { delay: 120, stagger: 28 });

    const items = document.querySelectorAll('[data-hero-fade]');
    if (items.length) {
      if (typeof window.anime === 'function') {
        window.anime({
          targets: Array.from(items),
          translateY: [24, 0],
          opacity: [0, 1],
          duration: 900,
          delay: (el, i) => 380 + i * 110,
          easing: 'cubicBezier(0.22, 1, 0.36, 1)'
        });
      } else {
        items.forEach(el => { el.style.opacity = 1; });
      }
    }

    /* 视觉层轻微上浮 + 常驻漂浮 */
    const visual = document.querySelector('[data-hero-visual]');
    if (visual) {
      if (typeof window.anime === 'function') {
        window.anime({
          targets: visual,
          opacity: [0, 1],
          scale: [0.94, 1],
          translateY: [30, 0],
          duration: 1100,
          delay: 260,
          easing: 'cubicBezier(0.22, 1, 0.36, 1)'
        });
        window.anime({
          targets: '[data-float]',
          translateY: [-6, 6],
          duration: 2800,
          direction: 'alternate',
          loop: true,
          delay: (el, i) => i * 320,
          easing: 'easeInOutSine'
        });
      } else {
        visual.style.opacity = 1;
      }
    }
  };

  /* ------------------------------------------------------------
     12. 统一初始化（由 app.js 在挂载后调用）
     ------------------------------------------------------------ */
  M.boot = function () {
    M.initScrollProgress();
    M.initSmoothScroll();
    M.initScrollReveal();
    M.initRipple();
    M.initPageTransition();
    M.magnetic('[data-magnetic]');
    M.autoCount();
  };

  S.motion = M;
})(window.STAr);
