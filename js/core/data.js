/* ============================================================
   core/data.js — 站点数据（单一数据源）
   说明：真实业务内容尚未提供，凡涉及用户评价、社区内容、
        公司资质等不可编造的信息，统一使用「测试数据」占位。
   ============================================================ */

(function (S) {
  'use strict';

  /* ---------- 站点配置 ---------- */
  S.site = {
    name: 'STAr',
    tagline: '好物精选，一站购齐',
    nav: [
      { label: '首页', href: 'index.html' },
      { label: '产品', href: 'pages/products.html' },
      { label: '社区', href: 'pages/community.html' },
      { label: '关于', href: 'pages/about.html' }
    ],
    footer: {
      desc: 'STAr 是一个演示用的精选好物站点，页面结构与交互均可直接复用。',
      columns: [
        {
          title: '选购',
          links: [
            { label: '全部产品', href: 'pages/products.html' },
            { label: '手机', href: 'pages/products.html?category=phone' },
            { label: '电脑', href: 'pages/products.html?category=computer' },
            { label: '配件', href: 'pages/products.html?category=accessories' }
          ]
        },
        {
          title: '服务',
          links: [
            { label: '配送说明', href: 'pages/about.html#faq' },
            { label: '退换货政策', href: 'pages/about.html#faq' },
            { label: '保修与支持', href: 'pages/about.html#faq' },
            { label: '企业采购', href: 'pages/about.html#contact' }
          ]
        },
        {
          title: '关于',
          links: [
            { label: '品牌故事', href: 'pages/about.html' },
            { label: '社区', href: 'pages/community.html' },
            { label: '加入我们', href: 'pages/about.html#team' },
            { label: '联系我们', href: 'pages/about.html#contact' }
          ]
        }
      ],
      social: [
        { label: '微博', icon: '微', href: '#', title: '测试数据' },
        { label: '微信', icon: '信', href: '#', title: '测试数据' },
        { label: 'B站', icon: 'B', href: '#', title: '测试数据' },
        { label: 'GitHub', icon: 'G', href: '#', title: '测试数据' }
      ],
      legal: [
        { label: '用户协议', href: '#' },
        { label: '隐私政策', href: '#' },
        { label: '营业执照', href: '#' }
      ],
      note: '本站为演示站点，页面内数据均为测试数据。'
    }
  };

  /* ---------- 分类 ---------- */
  S.categories = [
    { key: 'all', name: '全部', icon: '✦', desc: '所有在售商品' },
    { key: 'phone', name: '手机', icon: '📱', desc: '轻薄直屏与长续航' },
    { key: 'computer', name: '电脑', icon: '💻', desc: '创作与移动办公' },
    { key: 'tablet', name: '平板', icon: '📲', desc: '手写与影音体验' },
    { key: 'accessories', name: '配件', icon: '🎧', desc: '屏幕、音频与周边' }
  ];

  /* ---------- 商品 ---------- */
  const IMG = S.url('assets/z1-ultra/');

  S.products = [
    {
      id: 'p-z1-ultra-14',
      name: 'Z1 Ultra 14 英寸便携屏',
      subtitle: '3:2 黄金比例 · 2K+ 分辨率 · 400nit 高亮度',
      description: '一块能塞进包里的第二块屏幕，插上就能用，随行随用不必迁就小屏幕。',
      price: 699,
      originalPrice: 899,
      tag: 'new',
      featured: true,
      category: 'accessories',
      spec: '14 英寸 · 2160×1440 · 3:2',
      icon: IMG + '01.webp',
      rating: 4.8,
      ratingCount: 1268,
      colors: [
        { name: '曜石黑', hex: '#2B2D2F' },
        { name: '月光银', hex: '#D9DCE1' }
      ],
      storages: [
        { size: '标准版', price: 699 },
        { size: '触控版', price: 899 }
      ],
      thumbnails: [IMG + '01.webp', IMG + '04.webp', IMG + '06.webp', IMG + '02.webp'],
      detailImages: [IMG + '03.webp', IMG + '04.webp', IMG + '05.webp', IMG + '06.webp', IMG + '07.webp', IMG + '02.webp'],
      highlights: [
        { icon: '🖥', title: '3:2 生产力比例', desc: '纵向多显示 12% 内容，文档与代码更少滚动' },
        { icon: '⚡', title: '一线直连', desc: '全功能 USB-C 供电与信号同传，无需额外电源' },
        { icon: '🎒', title: '轻至 640g', desc: '厚度 8.6mm，可放进大多数 14 英寸电脑包夹层' }
      ],
      specs: [
        { k: '屏幕尺寸', v: '14 英寸' },
        { k: '分辨率', v: '2160 × 1440（2K+）' },
        { k: '屏幕比例', v: '3:2' },
        { k: '亮度', v: '400 nit' },
        { k: '色域', v: '100% sRGB' },
        { k: '接口', v: 'USB-C ×2（全功能）、mini-HDMI ×1' },
        { k: '重量', v: '640g' },
        { k: '附件', v: '测试数据' }
      ]
    },
    {
      id: 'p-z1-pro-16',
      name: 'Z1 Pro 16 英寸便携屏',
      subtitle: '16 英寸 2.5K · 144Hz 高刷 · 内置支架',
      description: '更大的视野与更高的刷新率，接上主机就是一块随身的桌面主屏。',
      price: 1099,
      originalPrice: 1399,
      tag: 'sale',
      featured: true,
      category: 'accessories',
      spec: '16 英寸 · 2560×1600 · 144Hz',
      icon: IMG + '02.webp',
      rating: 4.7,
      ratingCount: 864,
      colors: [{ name: '曜石黑', hex: '#2B2D2F' }],
      storages: [
        { size: '标准版', price: 1099 },
        { size: '高刷版', price: 1399 }
      ],
      thumbnails: [IMG + '02.webp', IMG + '03.webp', IMG + '05.webp', IMG + '07.webp'],
      detailImages: [IMG + '02.webp', IMG + '03.webp', IMG + '04.webp', IMG + '05.webp'],
      highlights: [
        { icon: '🎮', title: '144Hz 高刷', desc: '游戏与剪辑预览更跟手，拖影明显减少' },
        { icon: '🧲', title: '磁吸支架', desc: '0–80° 无级调节，横竖屏随场景切换' },
        { icon: '🔊', title: '双扬声器', desc: '免耳机也能听清会议与影片对白' }
      ],
      specs: [
        { k: '屏幕尺寸', v: '16 英寸' },
        { k: '分辨率', v: '2560 × 1600' },
        { k: '刷新率', v: '144Hz' },
        { k: '亮度', v: '450 nit' },
        { k: '重量', v: '780g' },
        { k: '附件', v: '测试数据' }
      ]
    },
    {
      id: 'p-star-x1',
      name: 'STAr X1 手机',
      subtitle: '6.3 英寸直屏 · 轻薄机身 · 全天候续航',
      description: '把该有的都给到，把不该有的重量去掉，一整天不用惦记充电。',
      price: 3999,
      originalPrice: 4299,
      tag: 'hot',
      featured: true,
      category: 'phone',
      spec: '256GB · 星空黑',
      icon: '📱',
      rating: 4.6,
      ratingCount: 2130,
      colors: [
        { name: '星空黑', hex: '#1F2024' },
        { name: '云雾白', hex: '#EDEDF0' },
        { name: '海盐蓝', hex: '#8FB4CC' }
      ],
      storages: [
        { size: '128GB', price: 3599 },
        { size: '256GB', price: 3999 },
        { size: '512GB', price: 4599 }
      ],
      thumbnails: ['📱', '✨', '🔋'],
      detailImages: [],
      highlights: [
        { icon: '📐', title: '直屏手感', desc: '6.3 英寸单手可握，边缘不误触' },
        { icon: '🔋', title: '两天一充', desc: '大容量电池 + 智能调度，重度使用也够一天半' },
        { icon: '📷', title: '主摄稳定', desc: '日常记录、夜景与视频都能直接出片' }
      ],
      specs: [
        { k: '屏幕', v: '6.3 英寸 直屏' },
        { k: '存储', v: '128GB / 256GB / 512GB' },
        { k: '颜色', v: '星空黑 / 云雾白 / 海盐蓝' },
        { k: '充电', v: '测试数据' },
        { k: '重量', v: '测试数据' }
      ]
    },
    {
      id: 'p-star-x1-pro',
      name: 'STAr X1 Pro 手机',
      subtitle: '潜望长焦 · 2K 屏 · 卫星通信',
      description: '把长焦装进轻薄机身，远一点的东西也值得看清。',
      price: 5299,
      tag: 'new',
      featured: true,
      category: 'phone',
      spec: '512GB · 曜石黑',
      icon: '📱',
      rating: 4.7,
      ratingCount: 742,
      colors: [
        { name: '曜石黑', hex: '#1F2024' },
        { name: '砂金', hex: '#C9A882' }
      ],
      storages: [
        { size: '256GB', price: 4799 },
        { size: '512GB', price: 5299 }
      ],
      thumbnails: ['📱', '🔭'],
      detailImages: [],
      highlights: [
        { icon: '🔭', title: '潜望长焦', desc: '3.5 倍光学变焦，演唱会与远景更从容' },
        { icon: '🛰', title: '卫星消息', desc: '无信号时可发送求救与平安信息' },
        { icon: '🎨', title: '专业色彩', desc: '支持手动白平衡与 Log 视频录制' }
      ],
      specs: [
        { k: '屏幕', v: '6.7 英寸 2K' },
        { k: '影像', v: '主摄 + 潜望长焦 + 超广角' },
        { k: '存储', v: '256GB / 512GB' },
        { k: '重量', v: '测试数据' }
      ]
    },
    {
      id: 'p-star-book-14',
      name: 'STAr Book 14 笔记本',
      subtitle: '14 英寸 2.8K · 1.19kg · 长续航',
      description: '通勤包里最不占地方的一台生产力工具，开盖即用，合盖就走。',
      price: 5499,
      originalPrice: 5999,
      tag: 'hot',
      featured: true,
      category: 'computer',
      spec: '16GB + 512GB · 深空灰',
      icon: '💻',
      rating: 4.8,
      ratingCount: 1560,
      colors: [
        { name: '深空灰', hex: '#4A4D52' },
        { name: '银色', hex: '#D6D8DC' }
      ],
      storages: [
        { size: '16GB + 512GB', price: 5499 },
        { size: '32GB + 1TB', price: 6799 }
      ],
      thumbnails: ['💻', '⌨️'],
      detailImages: [],
      highlights: [
        { icon: '🍃', title: '1.19kg 轻量', desc: '航空级铝合金一体成型，单手可托' },
        { icon: '🔌', title: '全天续航', desc: '本地视频播放可达 18 小时，出门可不带电源' },
        { icon: '⌨️', title: '手感键盘', desc: '1.5mm 键程背光键盘，长时间码字不累' }
      ],
      specs: [
        { k: '屏幕', v: '14 英寸 2.8K' },
        { k: '内存 / 存储', v: '16GB + 512GB / 32GB + 1TB' },
        { k: '重量', v: '1.19kg' },
        { k: '接口', v: 'USB-C ×2、USB-A、HDMI、3.5mm' },
        { k: '续航', v: '测试数据' }
      ]
    },
    {
      id: 'p-star-book-16',
      name: 'STAr Book 16 创作者版',
      subtitle: '16 英寸 miniLED · 独显 · 出厂校色',
      description: '给剪辑、修图与三维工作准备的一块准色屏和一份稳定性能。',
      price: 7899,
      tag: 'new',
      featured: false,
      category: 'computer',
      spec: '32GB + 1TB · 深空灰',
      icon: '🖥',
      rating: 4.6,
      ratingCount: 432,
      colors: [{ name: '深空灰', hex: '#4A4D52' }],
      storages: [
        { size: '32GB + 1TB', price: 7899 },
        { size: '32GB + 2TB', price: 8899 }
      ],
      thumbnails: ['🖥'],
      detailImages: [],
      highlights: [
        { icon: '🎬', title: '创作加速', desc: '独立显卡加持，渲染与导出更快' },
        { icon: '🌈', title: '出厂校色', desc: 'ΔE < 1，开箱即可进入调色工作流' },
        { icon: '❄️', title: '静音散热', desc: '双风扇三热管，办公负载下几乎无感' }
      ],
      specs: [
        { k: '屏幕', v: '16 英寸 miniLED' },
        { k: '内存 / 存储', v: '32GB + 1TB / 2TB' },
        { k: '重量', v: '测试数据' }
      ]
    },
    {
      id: 'p-star-pad-11',
      name: 'STAr Pad 11 平板',
      subtitle: '11 英寸 120Hz · 手写笔 · 四扬声器',
      description: '看剧、记笔记、涂两笔都顺手的一块屏，横竖都好看。',
      price: 2499,
      originalPrice: 2799,
      tag: 'sale',
      featured: true,
      category: 'tablet',
      spec: '8GB + 256GB · 银色',
      icon: '📲',
      rating: 4.5,
      ratingCount: 980,
      colors: [
        { name: '银色', hex: '#D6D8DC' },
        { name: '深空灰', hex: '#4A4D52' }
      ],
      storages: [
        { size: '8GB + 128GB', price: 2199 },
        { size: '8GB + 256GB', price: 2499 }
      ],
      thumbnails: ['📲', '✍️'],
      detailImages: [],
      highlights: [
        { icon: '✍️', title: '低延迟手写', desc: '笔尖跟手，延迟低至 9ms（测试数据）' },
        { icon: '🎬', title: '四扬声器', desc: '横屏观影声场更宽，不必外接音箱' },
        { icon: '🔋', title: '长待机', desc: '闲置一周仍有余电，随时拿起来就用' }
      ],
      specs: [
        { k: '屏幕', v: '11 英寸 120Hz' },
        { k: '存储', v: '128GB / 256GB' },
        { k: '扬声器', v: '四扬声器' },
        { k: '重量', v: '测试数据' }
      ]
    },
    {
      id: 'p-star-buds-pro',
      name: 'STAr Buds Pro 无线耳机',
      subtitle: '自适应降噪 · 空间音频 · 30 小时续航',
      description: '通勤路上把噪音关掉，把想听的留下来。',
      price: 899,
      originalPrice: 1099,
      tag: 'sale',
      featured: false,
      category: 'accessories',
      spec: '入耳式 · 云雾白',
      icon: '🎧',
      rating: 4.4,
      ratingCount: 3204,
      colors: [
        { name: '云雾白', hex: '#EDEDF0' },
        { name: '曜石黑', hex: '#2B2D2F' }
      ],
      storages: [{ size: '标准版', price: 899 }],
      thumbnails: ['🎧', '🔇'],
      detailImages: [],
      highlights: [
        { icon: '🔇', title: '自适应降噪', desc: '根据环境实时调整降噪深度，地铁与办公室都合适' },
        { icon: '🎧', title: '空间音频', desc: '看电影时声场随头部变化，更有临场感' },
        { icon: '🔋', title: '30 小时续航', desc: '配合充电盒总续航可达 30 小时' }
      ],
      specs: [
        { k: '类型', v: '入耳式真无线' },
        { k: '降噪', v: '自适应主动降噪' },
        { k: '续航', v: '测试数据' },
        { k: '防护等级', v: '测试数据' }
      ]
    }
  ];

  /* ---------- 评价（内容为测试数据） ---------- */
  S.reviews = [
    { id: 'r1', author: '测试数据', avatar: '🙂', rating: 5, date: '2026-09-18', spec: '标准版 · 曜石黑', content: '测试数据：此处为占位评价内容，正式上线前请替换。', likes: 24 },
    { id: 'r2', author: '测试数据', avatar: '😀', rating: 4, date: '2026-09-02', spec: '触控版 · 月光银', content: '测试数据：此处为占位评价内容，正式上线前请替换。', likes: 11 },
    { id: 'r3', author: '测试数据', avatar: '🐧', rating: 5, date: '2026-08-21', spec: '标准版 · 曜石黑', content: '测试数据：此处为占位评价内容，正式上线前请替换。', likes: 8 }
  ];

  /* ---------- 社区 ---------- */
  S.community = {
    stats: [
      { label: '社区成员', value: 12800, suffix: '+' },
      { label: '讨论主题', value: 3260, suffix: '+' },
      { label: '本周新帖', value: 128, suffix: '' },
      { label: '活跃创作者', value: 460, suffix: '+' }
    ],
    topics: [
      { name: '产品体验', count: 862 },
      { name: '开箱晒单', count: 644 },
      { name: '使用教程', count: 512 },
      { name: '问题答疑', count: 438 },
      { name: '桌面搭建', count: 296 },
      { name: '二手交易', count: 128 }
    ],
    posts: [
      {
        id: 'c1',
        author: '测试数据',
        avatar: '🧑‍💻',
        role: '认证创作者',
        time: '2 小时前',
        title: '测试数据：这里是帖子标题占位',
        excerpt: '测试数据：这里是帖子摘要占位，正式上线前请替换为真实讨论内容。',
        tags: ['产品体验', '桌面搭建'],
        likes: 128,
        comments: 32,
        views: 1640,
        liked: false
      },
      {
        id: 'c2',
        author: '测试数据',
        avatar: '🧑‍🎨',
        time: '5 小时前',
        title: '测试数据：这里是帖子标题占位',
        excerpt: '测试数据：这里是帖子摘要占位，正式上线前请替换为真实讨论内容。',
        tags: ['开箱晒单'],
        likes: 86,
        comments: 12,
        views: 980,
        liked: false
      },
      {
        id: 'c3',
        author: '测试数据',
        avatar: '👩‍🔧',
        role: '版主',
        time: '昨天',
        title: '测试数据：这里是帖子标题占位',
        excerpt: '测试数据：这里是帖子摘要占位，正式上线前请替换为真实讨论内容。',
        tags: ['使用教程', '问题答疑'],
        likes: 210,
        comments: 45,
        views: 2860,
        liked: true
      },
      {
        id: 'c4',
        author: '测试数据',
        avatar: '🧑‍🚀',
        time: '2 天前',
        title: '测试数据：这里是帖子标题占位',
        excerpt: '测试数据：这里是帖子摘要占位，正式上线前请替换为真实讨论内容。',
        tags: ['产品体验'],
        likes: 47,
        comments: 9,
        views: 520,
        liked: false
      },
      {
        id: 'c5',
        author: '测试数据',
        avatar: '👨‍🍳',
        time: '3 天前',
        title: '测试数据：这里是帖子标题占位',
        excerpt: '测试数据：这里是帖子摘要占位，正式上线前请替换为真实讨论内容。',
        tags: ['开箱晒单', '桌面搭建'],
        likes: 65,
        comments: 18,
        views: 730,
        liked: false
      }
    ],
    events: [
      { title: '测试数据：线上分享会', date: '2026-11-08', place: '线上直播', tag: '活动' },
      { title: '测试数据：线下体验日', date: '2026-11-22', place: '测试数据', tag: '线下' }
    ]
  };

  /* ---------- 关于我们 ---------- */
  S.about = {
    hero: {
      title: '关于 STAr',
      desc: '我们希望把挑选好物这件事做得更简单一点：少一点参数噪音，多一点真实体验。'
    },
    story: {
      title: '从一个小的选品清单开始',
      paragraphs: [
        '测试数据。此处为品牌简介占位段落，正式上线前请替换为真实内容。',
        '测试数据。此处为发展背景占位段落，正式上线前请替换为真实内容。',
        '测试数据。此处为团队理念占位段落，正式上线前请替换为真实内容。'
      ],
      figure: IMG + '05.webp'
    },
    stats: [
      { label: '服务用户', value: 128000, suffix: '+' },
      { label: '合作品牌', value: 86, suffix: '+' },
      { label: '平均评分', value: 4.8, suffix: '', decimals: 1 },
      { label: '售后响应', value: 24, suffix: 'h' }
    ],
    timeline: [
      { year: '2021', title: '团队成立', desc: '测试数据：此处为占位说明' },
      { year: '2022', title: '第一款自研产品', desc: '测试数据：此处为占位说明' },
      { year: '2024', title: '社区上线', desc: '测试数据：此处为占位说明' },
      { year: '2026', title: '全品类拓展', desc: '测试数据：此处为占位说明' }
    ],
    values: [
      { icon: '🎯', title: '只推真的好物', desc: '测试数据：此处为占位说明' },
      { icon: '🔍', title: '信息透明', desc: '测试数据：此处为占位说明' },
      { icon: '🤝', title: '长期陪伴', desc: '测试数据：此处为占位说明' }
    ],
    team: [
      { name: '测试数据', role: '创始人 / 产品', avatar: '🧑‍💼' },
      { name: '测试数据', role: '设计负责人', avatar: '🧑‍🎨' },
      { name: '测试数据', role: '内容负责人', avatar: '👩‍💻' },
      { name: '测试数据', role: '客户成功', avatar: '🧑‍🔧' }
    ],
    faq: [
      { q: '下单后多久发货？', a: '测试数据。此处为占位回答，正式上线前请替换为真实的发货时效说明。' },
      { q: '支持哪些退换货方式？', a: '测试数据。此处为占位回答，正式上线前请替换为真实的退换货政策。' },
      { q: '保修期是多久？', a: '测试数据。此处为占位回答，正式上线前请替换为真实的保修条款。' },
      { q: '可以开企业发票吗？', a: '测试数据。此处为占位回答，正式上线前请替换为真实的开票说明。' },
      { q: '如何查询物流状态？', a: '测试数据。此处为占位回答，正式上线前请替换为真实的物流查询方式。' }
    ],
    contacts: [
      { label: '客服电话', value: '测试数据' },
      { label: '邮箱', value: '测试数据' },
      { label: '地址', value: '测试数据' }
    ]
  };
})(window.STAr);
