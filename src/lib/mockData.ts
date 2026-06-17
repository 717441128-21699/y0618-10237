import type {
  Product,
  BoxPeriod,
  ProductReview,
  UnsubscribeRecord,
  UserProfile,
} from "./types";

const img = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=square_hd`;

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p_001",
    name: "冷感冰丝运动毛巾",
    image: img("premium charcoal cooling sports towel folded on dark stone surface, studio product photography, warm amber side light"),
    description: "冰丝速干材质，运动即时降温，附挂环设计。",
    category: "运动",
    tags: ["运动", "户外"],
    allergens: [],
    avgRating: 4.6,
    reviewCount: 128,
  },
  {
    id: "p_002",
    name: "黑松露海盐脆片",
    image: img("artisan black truffle sea salt crisps in kraft pouch on moody dark background, gourmet food photography"),
    description: "意大利黑松露与地中海海盐，手工慢烤脆片。",
    category: "美食",
    tags: ["美食"],
    allergens: ["麸质"],
    avgRating: 4.4,
    reviewCount: 96,
  },
  {
    id: "p_003",
    name: "玫瑰水修护护手霜",
    image: img("minimal amber glass hand cream tube with rose motif on dark velvet surface, luxury beauty product photography"),
    description: "大马士革玫瑰水，乳木果油深层修护，无香精配方。",
    category: "美妆",
    tags: ["美妆", "香氛"],
    allergens: ["香精"],
    avgRating: 4.7,
    reviewCount: 154,
  },
  {
    id: "p_004",
    name: "黄铜书签金属套件",
    image: img("set of brass bookmarks with geometric engravings on open notebook, warm golden light, editorial product photo"),
    description: "实心黄铜雕刻书签三件套，附收纳皮套。",
    category: "文创",
    tags: ["文创"],
    allergens: ["金属饰品"],
    avgRating: 4.5,
    reviewCount: 72,
  },
  {
    id: "p_005",
    name: "磁吸无线充电底座",
    image: img("sleek matte black magnetic wireless charger stand on dark desk, warm rim light, tech product photography"),
    description: "15W 磁吸快充，铝合金外壳，兼容主流设备。",
    category: "科技",
    tags: ["科技", "家居"],
    allergens: [],
    avgRating: 4.3,
    reviewCount: 203,
  },
  {
    id: "p_006",
    name: "手工香薰大豆蜡烛",
    image: img("amber glass soy candle with wooden wick glowing on dark surface, warm bokeh, cozy product photography"),
    description: "天然大豆蜡，雪松与琥珀香调，木质烛芯燃烧无烟。",
    category: "香氛",
    tags: ["香氛", "家居"],
    allergens: [],
    avgRating: 4.8,
    reviewCount: 187,
  },
  {
    id: "p_007",
    name: "火山岩透气运动短袖",
    image: img("folded charcoal athletic t-shirt with subtle texture on dark stone, activewear product photography, amber light"),
    description: "火山岩纤维速干透气，四面弹力，无缝拼接。",
    category: "运动",
    tags: ["运动"],
    allergens: [],
    avgRating: 4.4,
    reviewCount: 88,
  },
  {
    id: "p_008",
    name: "日式抹茶生巧克力",
    image: img("matcha green tea nama chocolate pieces on dark ceramic plate, gourmet dessert photography, moody lighting"),
    description: "宇治抹茶与北海道生乳，冷藏即食，低糖配方。",
    category: "美食",
    tags: ["美食"],
    allergens: ["乳制品"],
    avgRating: 4.6,
    reviewCount: 142,
  },
  {
    id: "p_009",
    name: "矿物泥清洁面膜",
    image: img("dark clay face mask in frosted jar with wooden spatula on dark stone, skincare product photography"),
    description: "死海矿物泥深层清洁，控油平衡，敏感肌可用。",
    category: "美妆",
    tags: ["美妆"],
    allergens: [],
    avgRating: 4.2,
    reviewCount: 110,
  },
  {
    id: "p_010",
    name: "复古牛皮手账本",
    image: img("vintage tan leather journal with brass clasp on dark wooden desk, warm light, editorial stationery photo"),
    description: "植鞣牛皮封面，100 克道林纸内页，附黄铜笔扣。",
    category: "文创",
    tags: ["文创"],
    allergens: [],
    avgRating: 4.7,
    reviewCount: 134,
  },
  {
    id: "p_011",
    name: "降噪蓝牙睡眠耳塞",
    image: img("small white bluetooth sleep earbuds in charging case on dark nightstand, soft amber glow, tech product photo"),
    description: "主动降噪，侧睡无感，白噪音助眠模式。",
    category: "科技",
    tags: ["科技"],
    allergens: [],
    avgRating: 4.1,
    reviewCount: 76,
  },
  {
    id: "p_012",
    name: "亚麻流苏桌旗",
    image: img("natural linen table runner with tassels draped on dark wooden table, warm ambient light, home decor product photo"),
    description: "100% 水洗亚麻，手工流苏，多种大地色系。",
    category: "家居",
    tags: ["家居"],
    allergens: [],
    avgRating: 4.5,
    reviewCount: 64,
  },
  {
    id: "p_013",
    name: "高弹瑜伽阻力带",
    image: img("rolled charcoal resistance band set on dark yoga mat, warm light, fitness product photography"),
    description: "天然乳胶三档阻力，防滑手柄，附训练图谱。",
    category: "运动",
    tags: ["运动", "家居"],
    allergens: [],
    avgRating: 4.3,
    reviewCount: 91,
  },
  {
    id: "p_014",
    name: "冷萃挂耳咖啡礼盒",
    image: img("drip coffee gift box with kraft sachets and amber cup on dark counter, moody coffee product photography"),
    description: "埃塞俄比亚单品豆，中浅烘焙，果酸明亮。",
    category: "美食",
    tags: ["美食"],
    allergens: [],
    avgRating: 4.6,
    reviewCount: 167,
  },
  {
    id: "p_015",
    name: "丝绸眼罩助眠套装",
    image: img("mulberry silk sleep mask in amber gift box on dark silk sheets, luxury product photography, soft glow"),
    description: "桑蚕丝双面，遮光透气，附蒸汽眼罩两片。",
    category: "美妆",
    tags: ["美妆", "家居"],
    allergens: [],
    avgRating: 4.7,
    reviewCount: 119,
  },
  {
    id: "p_016",
    name: "黄铜机械指针陀螺",
    image: img("brass mechanical fidget spinner with engraved details on dark slate, warm golden light, desk toy product photo"),
    description: "CNC 精雕黄铜，静音陶瓷轴承，减压把玩。",
    category: "文创",
    tags: ["文创", "科技"],
    allergens: ["金属饰品"],
    avgRating: 4.4,
    reviewCount: 58,
  },
  {
    id: "p_017",
    name: "迷你桌面加湿香薰机",
    image: img("compact black aroma diffuser with soft mist on dark desk, warm amber light, home tech product photography"),
    description: "超声波雾化，七色夜灯，静音运行，USB 供电。",
    category: "科技",
    tags: ["科技", "香氛", "家居"],
    allergens: [],
    avgRating: 4.2,
    reviewCount: 145,
  },
  {
    id: "p_018",
    name: "粗陶手作茶杯两件套",
    image: img("pair of rustic stoneware tea cups with glaze drips on dark wooden tray, warm light, ceramic product photography"),
    description: "景德镇手工拉胚，柴烧窑变釉，杯口防烫。",
    category: "家居",
    tags: ["家居", "文创"],
    allergens: [],
    avgRating: 4.8,
    reviewCount: 73,
  },
  {
    id: "p_019",
    name: "运动补水折叠软壶",
    image: img("collapsible charcoal silicone water bottle on dark stone, activewear product photography, amber rim light"),
    description: "食品级硅胶，可折叠收纳，一键弹开吸嘴。",
    category: "运动",
    tags: ["运动", "户外"],
    allergens: [],
    avgRating: 4.0,
    reviewCount: 49,
  },
  {
    id: "p_020",
    name: "海盐焦糖夹心饼干",
    image: img("sea salt caramel sandwich cookies on dark slate plate, gourmet snack product photography, warm light"),
    description: "法国黄油饼干，海盐焦糖夹心，独立小包装。",
    category: "美食",
    tags: ["美食"],
    allergens: ["麸质", "乳制品", "坚果"],
    avgRating: 4.5,
    reviewCount: 101,
  },
  {
    id: "p_021",
    name: "檀木气垫按摩梳",
    image: img("sandalwood cushion hair brush with brass pins on dark velvet, warm light, beauty accessory product photography"),
    description: "绿檀木柄，气囊梳垫，黄铜梳齿顺发不扯。",
    category: "美妆",
    tags: ["美妆"],
    allergens: [],
    avgRating: 4.6,
    reviewCount: 86,
  },
  {
    id: "p_022",
    name: "金属拼图建筑模型",
    image: img("intricate metal puzzle model of architecture in bronze finish on dark surface, warm golden light, hobby product photo"),
    description: "不锈钢激光切割，无需胶水，附组装工具。",
    category: "文创",
    tags: ["文创", "科技"],
    allergens: ["金属饰品"],
    avgRating: 4.3,
    reviewCount: 41,
  },
  {
    id: "p_023",
    name: "便携紫外线消毒盒",
    image: img("compact uv sterilizer box in matte black on dark desk, tech product photography, subtle purple glow"),
    description: "UV-C 紫外线杀菌，兼容手机耳机，自动定时。",
    category: "科技",
    tags: ["科技", "家居"],
    allergens: [],
    avgRating: 4.0,
    reviewCount: 62,
  },
  {
    id: "p_024",
    name: "山系户外应急毯",
    image: img("folded gold mylar emergency blanket on dark rocky surface, outdoor gear product photography, warm light"),
    description: "聚酯 Mylar 镀铝，保温防风，折叠仅掌心大小。",
    category: "户外",
    tags: ["户外", "运动"],
    allergens: [],
    avgRating: 4.2,
    reviewCount: 37,
  },
];

export const SEED_BOX_PERIODS: BoxPeriod[] = [
  {
    id: "bp_202604",
    periodLabel: "2026年4月期",
    theme: "春日苏醒",
    themeDescription: "破土而出的生命力，万物初醒的清新序章。",
    themeMoodImage: img("abstract spring awakening moodboard, soft green and amber light through leaves, editorial aesthetic"),
    keywords: ["清新", "复苏", "绿意"],
    products: ["p_013", "p_014", "p_018"],
    alternatives: ["p_019", "p_010"],
    shipDeadline: "2026-04-25T23:59:59",
    status: "delivered",
  },
  {
    id: "bp_202605",
    periodLabel: "2026年5月期",
    theme: "都市夜行",
    themeDescription: "霓虹与暗影之间，属于城市夜归人的隐秘时刻。",
    themeMoodImage: img("moody urban night cityscape with amber neon reflections, editorial moodboard aesthetic"),
    keywords: ["暗调", "都市", "沉浸"],
    products: ["p_005", "p_006", "p_011"],
    alternatives: ["p_017", "p_023"],
    shipDeadline: "2026-05-25T23:59:59",
    status: "delivered",
  },
  {
    id: "bp_202606",
    periodLabel: "2026年6月期",
    theme: "仲夏夜之谜",
    themeDescription: "暑气与凉风的交界，一场不剧透的盛夏盲选。",
    themeMoodImage: img("midsummer night mystery moodboard, warm amber and coral gradient over dark water, dreamy editorial aesthetic"),
    keywords: ["清凉", "夜行", "灵感"],
    products: ["p_001", "p_003", "p_008"],
    alternatives: ["p_002", "p_015"],
    shipDeadline: "2026-06-25T23:59:59",
    status: "preview",
  },
];

const demoUsernames = [
  "林溪", "周野", "陈一", "苏夏", "江屿", "许念", "沈川", "顾安",
  "宋禾", "唐宁", "何止", "杨柳", "秦霜", "韩屿", "楚河", "温野",
];
const comments = [
  "质感远超预期，开箱瞬间被治愈了。",
  "正好是我会喜欢但不会自己买的东西，惊喜满分。",
  "做工精致，包装也很用心，会继续订阅。",
  "这一期主题氛围拉满，很对我胃口。",
  "实用又好看，已经在期待下一期了。",
  "稍微有点超出我的舒适区，但体验不错。",
  "完美契合我的偏好，算法有点东西。",
  "颜值在线，日常使用频率很高。",
];

function seedReviews(): ProductReview[] {
  const reviews: ProductReview[] = [];
  let idx = 0;
  for (const period of SEED_BOX_PERIODS) {
    const pool = [...period.products, ...period.alternatives];
    for (const pid of pool) {
      const count = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const rating = Math.min(5, Math.max(3, Math.round(4 + Math.random() * 1.4)));
        reviews.push({
          id: `r_${idx++}`,
          userId: `u_seed_${idx}`,
          periodId: period.id,
          productId: pid,
          rating,
          likeScore: Math.round(55 + Math.random() * 45),
          comment: comments[idx % comments.length],
          createdAt: `${period.shipDeadline.slice(0, 10)}T12:00:00`,
        });
      }
    }
  }
  return reviews;
}

export const SEED_REVIEWS: ProductReview[] = seedReviews();

const reasonCats: UnsubscribeRecord["reasonCategory"][] = [
  "preference_mismatch",
  "allergy_conflict",
  "duplicate_item",
  "price",
  "low_value",
  "other",
];
const reasonTexts: Record<UnsubscribeRecord["reasonCategory"], string> = {
  preference_mismatch: "收到的商品类型和我的兴趣不太对口",
  allergy_conflict: "有一件商品含我的过敏成分，不敢用",
  duplicate_item: "里面有我已经有过的东西",
  price: "月费对目前的我来说略高",
  low_value: "整体性价比没达到预期",
  other: "暂时想休息一下，之后可能回来",
};

export const SEED_UNSUBSCRIBES: UnsubscribeRecord[] = Array.from(
  { length: 42 },
  (_, i) => {
    const cat = reasonCats[i % reasonCats.length];
    return {
      id: `un_${i}`,
      userId: `u_seed_${i + 50}`,
      reason: reasonTexts[cat],
      reasonCategory: cat,
      createdAt: `2026-0${(i % 6) + 1}-${10 + (i % 18)}T10:00:00`,
    };
  },
);

export const SEED_SUBSCRIBER_TREND = [
  { period: "1月", subscribers: 820, renewed: 690 },
  { period: "2月", subscribers: 960, renewed: 812 },
  { period: "3月", subscribers: 1120, renewed: 958 },
  { period: "4月", subscribers: 1280, renewed: 1104 },
  { period: "5月", subscribers: 1390, renewed: 1218 },
  { period: "6月", subscribers: 1520, renewed: 1342 },
];

export const SEED_USER: UserProfile = {
  id: "u_demo",
  name: "体验用户",
  email: "demo@blindbox.monthly",
  preferenceTags: ["运动", "美食", "文创"],
  allergies: ["坚果"],
  existingItems: ["手账本"],
  subscriptionPlan: "quarterly",
  address: "上海市黄浦区南京东路 100 号",
  subscribedAt: "2026-01-15T10:00:00",
  skippedPeriods: [],
  renewed: true,
};

export const SEED_TESTIMONIALS = [
  {
    name: "晚风来信",
    plan: "年度订阅 · 第 8 盒",
    text: "每次拆盒都像在拆礼物，算法越来越懂我，连我随口提的偏好都记住了。",
    avatar: "晚",
  },
  {
    name: "山下有风",
    plan: "季度订阅 · 第 3 盒",
    text: "过敏成分提醒救了我一命，之前别的平台完全不管这些，盲选盒子很贴心。",
    avatar: "山",
  },
  {
    name: "林间鹿",
    plan: "月度订阅 · 第 5 盒",
    text: "跳过本期这个功能太人性化了，忙的月份不浪费，闲的时候再续上。",
    avatar: "林",
  },
];
