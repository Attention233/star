# STAr · 精选好物站点

纯静态的多页面商城站点，使用 Vue 3 全局构建（浏览器内直接编译模板，无需打包）。
包含首页、全部产品、商品详情、社区、关于我们五个页面，共用一套导航 / 页脚 / 购物车 / 提示组件。

## 技术栈

| 能力 | 方案 | 来源 |
| --- | --- | --- |
| 视图层 | Vue 3（`vue.global.prod.js`） | https://github.com/vuejs/core |
| 滚动进入视口动画 | AOS 2.3.4 | https://github.com/michalsnik/aos |
| 时间轴 / 逐字 / 数字动画 | anime.js 3.2.2 | https://github.com/juliangarnier/anime |
| 惯性平滑滚动 | Lenis 1.1.18 | https://github.com/darkroomengineering/lenis |

三个动效库已下载到 `js/vendor/`、`css/vendor/`，不依赖线上 CDN，离线可用。
全部动画在 `prefers-reduced-motion: reduce` 下自动降级。

## 目录结构

```
.
├── index.html                  # 首页
├── pages/
│   ├── products.html           # 全部产品（分类 / 搜索 / 排序）
│   ├── product.html            # 商品详情 ?id=<产品ID>
│   ├── community.html          # 社区（话题 / 点赞 / 加载更多）
│   └── about.html              # 关于我们（故事 / 数据 / 历程 / FAQ）
├── css/
│   ├── style.css               # 入口，仅按序 @import 下面四层
│   ├── base.css                # 设计变量 / 重置 / 排版 / 工具类
│   ├── components.css          # 导航 / 按钮 / 卡片 / 购物车 / Toast / 页脚
│   ├── layout.css              # 页面级布局
│   ├── motion.css              # 关键帧 / 页面过渡 / Vue Transition
│   └── vendor/aos.css
├── js/
│   ├── core/
│   │   ├── utils.js            # 命名空间 STAr、路径与格式化工具
│   │   ├── data.js             # ★ 站点数据（商品 / 社区 / 关于）
│   │   ├── store.js            # 购物车 Store + Toast Store（单例）
│   │   ├── motion.js           # 动效引擎（Lenis / AOS / anime 封装）
│   │   ├── components.js       # SiteNav / SiteFooter / CartDrawer / ToastStack / ProductCard / PageHero
│   │   └── app.js              # mountPage：注册全局组件、挂载、启动动效
│   ├── pages/                  # 每个页面一个入口，只写页面自身逻辑与模板
│   └── vendor/                 # vue / anime / aos / lenis
└── scripts/build.mjs           # 按白名单把运行时文件收集到 dist/
```

约定：`css/` 只写样式，`js/core/` 只放跨页面能力，`js/pages/` 只放页面逻辑。
导航、页脚、购物车、Toast 只实现一次，各页面通过组件复用。

## 本地预览

```bash
# 任选一种，必须通过 http 访问
python -m http.server 5173
# 或
npx serve .
```

打开 http://127.0.0.1:5173/index.html

## 构建与部署

```bash
npm run build     # 输出 dist/（只包含白名单目录）
npm run deploy    # 热铁盒部署；push 到 main 也会触发 .github/workflows/deploy.yml
```

## 改内容

所有文案与商品数据集中在 `js/core/data.js`：

- `S.site`：导航、页脚、社交入口
- `S.products`：商品（价格、规格、图廊、参数表、卖点）
- `S.reviews` / `S.community` / `S.about`：评价、社区、关于页内容

新增商品后在数组里追加一项即可，首页、列表页、详情页会自动读取。

## 占位说明

真实的业务内容（品牌介绍、用户评价、社区帖子、团队成员、联系信息、部分规格数值）尚未提供，
统一使用 **「测试数据」** 占位，并在页面上有对应提示。上线前只需替换 `js/core/data.js` 中的对应字段。
