const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timerEl = document.getElementById("timer");
const coinsEl = document.getElementById("coins");
const seasonLabel = document.getElementById("seasonLabel");
const toastEl = document.getElementById("toast");
const basketEl = document.getElementById("basket");
const upgradesEl = document.getElementById("upgrades");
const questsEl = document.getElementById("quests");
const dexEl = document.getElementById("dex");
const dexSeasonFilter = document.getElementById("dexSeasonFilter");
const dexRarityFilter = document.getElementById("dexRarityFilter");
const castButton = document.getElementById("castButton");
const sellButton = document.getElementById("sellButton");
const newRunButton = document.getElementById("newRunButton");
const summaryModal = document.getElementById("summaryModal");
const summaryBody = document.getElementById("summaryBody");
const summaryRestart = document.getElementById("summaryRestart");
const catchResultModal = document.getElementById("catchResultModal");
const catchResultCard = document.getElementById("catchResultCard");
const catchResultBody = document.getElementById("catchResultBody");
const catchToBasketButton = document.getElementById("catchToBasketButton");
const catchSellButton = document.getElementById("catchSellButton");
const panelLayer = document.getElementById("panelLayer");
const panelButtons = document.querySelectorAll("[data-open-panel]");
const panelWindows = document.querySelectorAll("[data-panel]");
const panelCloseButtons = document.querySelectorAll("[data-close-panel]");

const RUN_SECONDS = 300;
const shoreX = 185;
const waterTop = 235;
const reelTargetDistance = 26;

const seasons = [
  {
    id: "spring",
    name: "春日湖畔",
    sky: "#bfe9e0",
    far: "#b5d58b",
    grass: "#7fba6b",
    water: "#76bdd0",
    waterDark: "#4d91aa",
    accent: "#f7b7c6",
    bonus: "云朵鱼",
  },
  {
    id: "summer",
    name: "夏夜萤湖",
    sky: "#243f60",
    far: "#3d755e",
    grass: "#4c9b63",
    water: "#326f8e",
    waterDark: "#1e4e71",
    accent: "#f5e87b",
    bonus: "黑鲈鱼",
  },
  {
    id: "autumn",
    name: "秋暮小湖",
    sky: "#f2b36f",
    far: "#c4824d",
    grass: "#9d8448",
    water: "#6ba9b3",
    waterDark: "#457985",
    accent: "#e66d4f",
    bonus: "月光鱼",
  },
  {
    id: "winter",
    name: "冬雪静湖",
    sky: "#d7edf2",
    far: "#bfcbd0",
    grass: "#e8eee9",
    water: "#89b9cf",
    waterDark: "#638ca3",
    accent: "#ffffff",
    bonus: "雪铃鱼",
  },
];

const fishCatalog = [
  { name: "小鲫鱼", rarity: 1, value: 18, size: 1, struggle: 0.55, bait: "面包饵", seasons: ["spring", "summer", "autumn", "winter"], dream: false, color: "#b7a16b", description: "最常见的小鱼，喜欢贴着码头阴影游动。" },
  { name: "银鲤鱼", rarity: 1, value: 28, size: 1.25, struggle: 0.72, bait: "面包饵", seasons: ["spring", "summer", "autumn"], dream: false, color: "#d4dce1", description: "鳞片像银叶一样闪亮，成群掠过浅水。" },
  { name: "青苔鳑鲏", rarity: 1, value: 20, size: 0.82, struggle: 0.48, bait: "面包饵", seasons: ["spring", "summer"], dream: false, color: "#7ab783", description: "小巧灵活，常在水草边啄食青苔。" },
  { name: "芦影鱼", rarity: 1, value: 24, size: 0.95, struggle: 0.62, bait: "虫饵", seasons: ["spring", "autumn"], dream: false, color: "#8e9b62", description: "背鳍像芦苇叶，黄昏时最容易靠岸。" },
  { name: "溪纹鳟", rarity: 1, value: 32, size: 1.18, struggle: 0.76, bait: "虫饵", seasons: ["spring", "winter"], dream: false, color: "#a4c5b1", description: "身上有细小水纹，喜欢清冷的入湖溪口。" },
  { name: "荷叶鳅", rarity: 1, value: 26, size: 0.88, struggle: 0.68, bait: "面包饵", seasons: ["summer"], dream: false, color: "#6e8f4f", description: "总躲在荷叶影子下，拉起来时会扭得很欢。" },
  { name: "红鳍鲫", rarity: 1, value: 30, size: 1.05, struggle: 0.7, bait: "虫饵", seasons: ["summer", "autumn"], dream: false, color: "#c27b5b", description: "红色鱼鳍很醒目，是夏秋交界的常客。" },
  { name: "霜背鲦", rarity: 1, value: 27, size: 0.92, struggle: 0.57, bait: "面包饵", seasons: ["winter"], dream: false, color: "#c7dbe2", description: "背部像落了一层薄霜，在冬季浅水中发亮。" },
  { name: "黑鲈鱼", rarity: 2, value: 42, size: 1.45, struggle: 1.02, bait: "虫饵", seasons: ["summer", "autumn"], dream: false, color: "#35434a", description: "力气很足，会突然向深水冲刺。" },
  { name: "云朵鱼", rarity: 2, value: 54, size: 1, struggle: 0.58, bait: "星糖饵", seasons: ["spring"], dream: true, color: "#fff5f1", seasonSpecial: true, description: "春天才会飘来的轻盈梦幻鱼，像云影落进水里。" },
  { name: "萤火鱼", rarity: 2, value: 58, size: 0.98, struggle: 0.7, bait: "星糖饵", seasons: ["summer"], dream: true, color: "#e6f47a", seasonSpecial: true, description: "夏夜会发出微光，靠近浮标时像一颗小灯。" },
  { name: "枫叶鲤", rarity: 2, value: 52, size: 1.22, struggle: 0.86, bait: "亮片饵", seasons: ["autumn"], dream: false, color: "#d66f3c", seasonSpecial: true, description: "鳞片像一枚枚枫叶，秋风起时更活跃。" },
  { name: "冰晶鳟", rarity: 2, value: 60, size: 1.12, struggle: 0.82, bait: "亮片饵", seasons: ["winter"], dream: false, color: "#9bd2ef", seasonSpecial: true, description: "透明鱼鳍像薄冰，冬季水面微亮时会出现。" },
  { name: "珍珠鲤", rarity: 2, value: 48, size: 1.3, struggle: 0.8, bait: "亮片饵", seasons: ["spring", "summer"], dream: false, color: "#f3d9b5", description: "腹侧有珍珠般的小斑点，卖相很好。" },
  { name: "松针鱼", rarity: 2, value: 46, size: 1.05, struggle: 0.78, bait: "虫饵", seasons: ["autumn", "winter"], dream: false, color: "#65784f", description: "细长安静，常藏在落叶和枯枝的阴影里。" },
  { name: "金鳟鱼", rarity: 3, value: 76, size: 1.2, struggle: 0.98, bait: "亮片饵", seasons: ["spring", "winter"], dream: false, color: "#e7b23d", description: "耀眼的金色鳞片让它很难被错过，也很难拉住。" },
  { name: "樱瓣鱼", rarity: 3, value: 84, size: 0.9, struggle: 0.74, bait: "星糖饵", seasons: ["spring"], dream: true, color: "#f5aac0", seasonSpecial: true, description: "春日限定，游动时像樱花瓣顺水打旋。" },
  { name: "雷纹鲈", rarity: 3, value: 92, size: 1.48, struggle: 1.15, bait: "亮片饵", seasons: ["summer"], dream: false, color: "#5967a7", seasonSpecial: true, description: "夏夜雷声后会躁动，鱼线张力很容易飙高。" },
  { name: "月光鱼", rarity: 3, value: 88, size: 1.1, struggle: 0.82, bait: "星糖饵", seasons: ["autumn"], dream: true, color: "#c8d8ff", seasonSpecial: true, description: "秋夜限定，鳞片会映出一轮小小的月亮。" },
  { name: "琥珀鱼", rarity: 3, value: 96, size: 1.35, struggle: 1.05, bait: "亮片饵", seasons: ["autumn", "summer"], dream: true, color: "#f39a48", description: "像被夕阳封进琥珀里的鱼，价值很高。" },
  { name: "雪铃鱼", rarity: 3, value: 90, size: 0.95, struggle: 0.66, bait: "星糖饵", seasons: ["winter"], dream: true, color: "#ecfbff", seasonSpecial: true, description: "冬雪中才会轻响的梦幻鱼，挣扎温柔但很罕见。" },
  { name: "极光鲑", rarity: 3, value: 104, size: 1.42, struggle: 1.08, bait: "星糖饵", seasons: ["winter"], dream: true, color: "#8fe6d5", seasonSpecial: true, description: "背上流动着极光色，常在寒夜深水处现身。" },
  { name: "星尘鱼", rarity: 4, value: 140, size: 0.9, struggle: 1.18, bait: "星糖饵", seasons: ["spring", "summer", "autumn", "winter"], dream: true, color: "#8f8cff", description: "全年都可能出现的传说鱼，鱼尾会洒下细碎星光。" },
  { name: "湖灵鱼", rarity: 4, value: 168, size: 1.05, struggle: 1.24, bait: "星糖饵", seasons: ["spring", "summer", "autumn", "winter"], dream: true, color: "#7ee7c8", description: "传说是湖水本身的化身，只回应最安静的等待。" },
];

const upgradeDefs = {
  rod: {
    name: "鱼竿",
    desc: "收线效率",
    base: 45,
    levels: ["旧木竿", "竹节竿", "铜轮竿", "月纹竿", "星尘竿"],
    effects: ["收线力度 +6.5", "收线力度 +13", "收线力度 +19.5", "收线力度 +26", "收线力度 +32.5"],
  },
  line: {
    name: "鱼线",
    desc: "最大张力",
    base: 40,
    levels: ["细麻线", "结实线", "银丝线", "月光线", "星绳"],
    effects: ["张力上限 +15", "张力上限 +30", "张力上限 +45", "张力上限 +60", "张力上限 +75"],
  },
  bait: {
    name: "鱼饵",
    desc: "上钩速度",
    base: 35,
    levels: ["面包饵", "虫饵", "亮片饵", "星糖饵", "梦萤饵"],
    effects: ["等待时间 -0.35 秒", "等待时间 -0.7 秒", "等待时间 -1.05 秒", "等待时间 -1.4 秒", "等待时间 -1.75 秒"],
  },
  luck: {
    name: "幸运值",
    desc: "稀有概率",
    base: 55,
    levels: ["普通铃", "绿玉铃", "月石铃", "星辉铃", "湖神铃"],
    effects: ["梦幻权重 +16%", "梦幻权重 +32%", "梦幻权重 +48%", "梦幻权重 +64%", "梦幻权重 +80%"],
  },
};

const questPool = [
  {
    text: "钓起 5 条鱼",
    goal: 5,
    progress: (s) => s.stats.caught,
    reward: 45,
  },
  {
    text: "钓到 1 条梦幻鱼",
    goal: 1,
    progress: (s) => s.stats.dreamCaught,
    reward: 80,
  },
  {
    text: "赚到 150 金币",
    goal: 150,
    progress: (s) => s.stats.earned,
    reward: 60,
  },
  {
    text: "连续成功 3 次",
    goal: 3,
    progress: (s) => s.stats.bestStreak,
    reward: 65,
  },
  {
    text: "钓到售价超过 80 的鱼",
    goal: 1,
    progress: (s) => s.stats.expensiveCaught,
    reward: 75,
  },
  {
    text: "发现 4 种鱼",
    goal: 4,
    progress: (s) => s.dex.size,
    reward: 55,
  },
];

let state;
let pointer = { down: false, x: 0, y: 0, pull: 0 };
let lastFrame = performance.now();
let toastTimer = 0;
let dexFilters = { season: "all", rarity: "all" };

function openPanel(panelName) {
  panelLayer.hidden = false;
  panelWindows.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== panelName;
  });
  renderPanel();
}

function closePanels() {
  panelLayer.hidden = true;
  panelWindows.forEach((panel) => {
    panel.hidden = true;
  });
}
function newState() {
  const season = seasons[Math.floor(Math.random() * seasons.length)];
  return {
    season,
    timeLeft: RUN_SECONDS,
    coins: 0,
    basket: [],
    dex: new Set(),
    upgrades: { rod: 1, line: 1, bait: 1, luck: 1 },
    quests: pickQuests(),
    mode: "idle",
    biteTimer: 0,
    currentFish: null,
    pendingCatch: null,
    distance: 100,
    tension: 0,
    fishX: 640,
    fishY: 355,
    wave: 0,
    ended: false,
    stats: {
      caught: 0,
      dreamCaught: 0,
      earned: 0,
      currentStreak: 0,
      bestStreak: 0,
      expensiveCaught: 0,
      biggest: null,
      failed: 0,
      rewardedQuests: new Set(),
    },
  };
}

function pickQuests() {
  return [...questPool].sort(() => Math.random() - 0.5).slice(0, 3);
}

function startRun() {
  state = newState();
  pointer = { down: false, x: 0, y: 0, pull: 0 };
  summaryModal.hidden = true;
  closeCatchResult();
  closePanels();
  showToast("点击抛竿，等鱼影靠近后拖拽收线。", 2200);
  renderPanel();
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const min = String(Math.floor(safe / 60)).padStart(2, "0");
  const sec = String(safe % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function castLine() {
  if (state.ended || state.mode !== "idle") return;
  state.mode = "waiting";
  const baitBonus = state.upgrades.bait * 0.35;
  state.biteTimer = Math.max(0.8, 3.4 - baitBonus + Math.random() * 2);
  state.fishX = 580 + Math.random() * 220;
  state.fishY = 320 + Math.random() * 92;
  showToast("水面很安静。", 900);
  renderPanel();
}

function chooseFish() {
  const luck = state.upgrades.luck;
  const choices = fishCatalog.filter((fish) => fish.seasons.includes(state.season.id) || fish.name === "星尘鱼");
  const weighted = choices.map((fish) => {
    let weight = 8 / Math.pow(fish.rarity, 1.45);
    if (baitMatches(fish)) weight *= 1.75;
    if (fish.name === state.season.bonus) weight *= 1.8;
    if (fish.dream) weight *= 0.55 + luck * 0.16;
    return { fish, weight };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.fish;
  }
  return weighted[0].fish;
}

function currentBaitName() {
  return upgradeLevelName("bait", state.upgrades.bait);
}

function baitMatches(fish) {
  const baitLevel = state.upgrades.bait;
  if (fish.bait === currentBaitName()) return true;
  return baitLevel >= 5 && (fish.dream || fish.bait === "星糖饵");
}

function hookFish() {
  state.currentFish = chooseFish();
  state.mode = "reeling";
  state.distance = 100;
  state.tension = 8;
  showToast(`${state.currentFish.name} 上钩了，拖拽控制力道。`, 1500);
  renderPanel();
}

function finishCatch() {
  const fish = state.currentFish;
  const sizeRoll = Math.round((fish.size * (0.75 + Math.random() * 0.6)) * 100) / 100;
  const value = Math.round(fish.value * (0.85 + sizeRoll * 0.25));
  const isNewDex = !state.dex.has(fish.name);
  const catchItem = { ...fish, sizeRoll, value, isNewDex };
  state.pendingCatch = catchItem;
  state.dex.add(fish.name);
  state.stats.caught += 1;
  state.stats.currentStreak += 1;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.currentStreak);
  if (fish.dream) state.stats.dreamCaught += 1;
  if (value > 80) state.stats.expensiveCaught = 1;
  if (!state.stats.biggest || sizeRoll > state.stats.biggest.sizeRoll) state.stats.biggest = catchItem;
  state.mode = "idle";
  state.currentFish = null;
  checkQuestRewards();
  openCatchResult(catchItem);
  renderPanel();
}

function rarityLabel(rarity) {
  return ["", "常见", "少见", "稀有", "传说"][rarity] || `稀有度 ${rarity}`;
}

function seasonShortName(seasonId) {
  return { spring: "春", summer: "夏", autumn: "秋", winter: "冬" }[seasonId] || seasonId;
}

function fishPatternType(fish) {
  if (fish.dream) return "sparkle";
  if (fish.seasonSpecial) return "crest";
  if (fish.name.includes("纹") || fish.name.includes("鲈")) return "stripes";
  if (fish.name.includes("珍珠") || fish.name.includes("星")) return "spots";
  if (fish.name.includes("鳟") || fish.name.includes("鲑")) return "bands";
  return fish.rarity >= 3 ? "spots" : "scales";
}

function openCatchResult(catchItem) {
  catchResultCard.className = `modal-card catch-card ${catchItem.dream ? "is-dream" : ""} ${catchItem.rarity >= 3 ? "is-rare" : ""}`;
  catchResultBody.innerHTML = `
    <div class="catch-fish-art" style="--fish-color: ${catchItem.color}">
      <span></span>
    </div>
    <div class="catch-main-info">
      <strong>${catchItem.name}</strong>
      <span>${rarityLabel(catchItem.rarity)}</span>
    </div>
    <dl class="catch-stat-grid">
      <div><dt>尺寸</dt><dd>${catchItem.sizeRoll} 尺</dd></div>
      <div><dt>价值</dt><dd>${catchItem.value} 金币</dd></div>
      <div><dt>梦幻鱼</dt><dd>${catchItem.dream ? "是" : "否"}</dd></div>
      <div><dt>新图鉴</dt><dd>${catchItem.isNewDex ? "首次发现" : "已发现"}</dd></div>
    </dl>
  `;
  catchResultModal.hidden = false;
}

function closeCatchResult() {
  catchResultModal.hidden = true;
  catchResultBody.innerHTML = "";
}

function acceptCatchToBasket() {
  if (!state.pendingCatch || state.ended) return;
  const catchItem = state.pendingCatch;
  state.basket.push(catchItem);
  state.pendingCatch = null;
  closeCatchResult();
  showToast(`${catchItem.name} 放入鱼篓。`, 1300);
  renderPanel();
}

function sellPendingCatch() {
  if (!state.pendingCatch || state.ended) return;
  const catchItem = state.pendingCatch;
  state.coins += catchItem.value;
  state.stats.earned += catchItem.value;
  state.pendingCatch = null;
  closeCatchResult();
  showToast(`卖掉 ${catchItem.name}，获得 ${catchItem.value} 金币。`, 1500);
  checkQuestRewards();
  renderPanel();
}

function failCatch(reason) {
  state.mode = "idle";
  state.currentFish = null;
  state.tension = 0;
  state.distance = 100;
  state.stats.failed += 1;
  state.stats.currentStreak = 0;
  showToast(reason, 1600);
  renderPanel();
}

function sellBasket() {
  if (!state.basket.length || state.ended) return;
  const value = state.basket.reduce((sum, fish) => sum + fish.value, 0);
  state.coins += value;
  state.stats.earned += value;
  state.basket = [];
  showToast(`卖出鱼篓，获得 ${value} 金币。`, 1500);
  checkQuestRewards();
  renderPanel();
}

function upgrade(key) {
  const level = state.upgrades[key];
  const cost = upgradeCost(key);
  if (state.coins < cost || level >= 5 || state.ended) return;
  state.coins -= cost;
  state.upgrades[key] += 1;
  const def = upgradeDefs[key];
  showToast(`${def.name} 升级为 ${upgradeLevelName(key, state.upgrades[key])}。`, 1500);
  renderPanel();
}

function upgradeCost(key) {
  const def = upgradeDefs[key];
  const level = state.upgrades[key];
  return Math.round(def.base * Math.pow(1.55, level - 1));
}

function upgradeLevelName(key, level) {
  return upgradeDefs[key].levels[level - 1] || `Lv.${level}`;
}

function upgradeEffect(key, level) {
  return upgradeDefs[key].effects[level - 1] || upgradeDefs[key].desc;
}

function checkQuestRewards() {
  state.quests.forEach((quest, index) => {
    if (state.stats.rewardedQuests.has(index)) return;
    if (quest.progress(state) >= quest.goal) {
      state.stats.rewardedQuests.add(index);
      state.coins += quest.reward;
      state.stats.earned += quest.reward;
      showToast(`任务完成：${quest.text}，奖励 ${quest.reward} 金币。`, 1800);
    }
  });
}

function endRun() {
  if (state.ended) return;
  state.ended = true;
  state.mode = "idle";
  const pendingValue = state.pendingCatch ? state.pendingCatch.value : 0;
  state.pendingCatch = null;
  closeCatchResult();
  const unsold = state.basket.reduce((sum, fish) => sum + fish.value, 0) + pendingValue;
  state.coins += unsold;
  state.stats.earned += unsold;
  state.basket = [];
  const completed = state.quests.filter((quest, index) => {
    return state.stats.rewardedQuests.has(index) || quest.progress(state) >= quest.goal;
  }).length;
  const biggest = state.stats.biggest ? `${state.stats.biggest.name} ${state.stats.biggest.sizeRoll} 尺` : "无";
  summaryBody.innerHTML = `
    <p>总收入：<strong>${state.stats.earned}</strong> 金币</p>
    <p>钓起鱼数：<strong>${state.stats.caught}</strong> 条</p>
    <p>完成任务：<strong>${completed} / ${state.quests.length}</strong></p>
    <p>最大鱼：<strong>${biggest}</strong></p>
    <p>图鉴发现：<strong>${state.dex.size} / ${fishCatalog.length}</strong></p>
  `;
  summaryModal.hidden = false;
  renderPanel();
}

function update(dt) {
  if (state.ended) return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    endRun();
    return;
  }

  state.wave += dt;

  if (state.mode === "waiting") {
    state.biteTimer -= dt;
    state.fishX += Math.sin(state.wave * 2.2) * 0.35;
    if (state.biteTimer <= 0) hookFish();
  }

  if (state.mode === "reeling") {
    const fish = state.currentFish;
    const rodPower = 17 + state.upgrades.rod * 6.5;
    const lineLimit = 86 + state.upgrades.line * 15;
    const fishFight = fish.struggle * (0.5 + Math.sin(state.wave * 4.7) * 0.18 + Math.random() * 0.08);
    const pull = pointer.down ? pointer.pull : 0;
    const sweetSpot = 0.26 + fish.struggle * 0.09;

    state.tension += (pull * 38 * fish.struggle - 19 - state.upgrades.line * 2.8) * dt;
    state.tension += Math.max(0, fishFight - 0.61) * 6 * dt;
    state.tension = Math.max(0, Math.min(110, state.tension));

    const progress = (pull - sweetSpot) * rodPower * dt - fishFight * 1.7 * dt;
    state.distance -= progress;
    state.distance = Math.max(0, Math.min(122, state.distance));
    state.fishX = shoreX + 110 + state.distance * 5.2;
    state.fishY += Math.sin(state.wave * 9) * fish.struggle * 0.8;

    if (state.distance <= reelTargetDistance) {
      finishCatch();
      return;
    }
    if (state.tension > lineLimit) {
      failCatch("鱼线绷断了。");
      return;
    }
    if (state.distance >= 121) {
      failCatch("鱼挣脱了。");
      return;
    }
  }

  checkQuestRewards();
}

function draw() {
  const s = state.season;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSky(s);
  drawLandscape(s);
  drawWater(s);
  drawDockAndPlayer(s);
  drawFishingLine();
  drawFishShadows();
  drawHud();
}

function drawSky(s) {
  ctx.fillStyle = s.sky;
  ctx.fillRect(0, 0, canvas.width, waterTop);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  pixelCloud(120, 70, 3);
  pixelCloud(720, 86, 2);
  if (s.id === "summer") {
    ctx.fillStyle = "#f7dd78";
    ctx.fillRect(790, 46, 28, 28);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = i % 2 ? "#f8ef9a" : "#bde785";
      ctx.fillRect(70 + i * 57, 170 + Math.sin(state.wave * 2 + i) * 18, 4, 4);
    }
  }
  if (s.id === "winter") {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (let i = 0; i < 40; i++) {
      const x = (i * 67 + state.wave * 18) % canvas.width;
      const y = (i * 31 + state.wave * 24) % waterTop;
      ctx.fillRect(x, y, 4, 4);
    }
  }
}

function pixelCloud(x, y, scale) {
  const p = 8 * scale;
  ctx.fillRect(x, y, p * 3, p);
  ctx.fillRect(x + p, y - p, p * 3, p);
  ctx.fillRect(x + p * 3, y, p * 3, p);
}

function drawLandscape(s) {
  ctx.fillStyle = s.far;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 160 - 48, waterTop);
    ctx.lineTo(i * 160 + 68, 118 + (i % 3) * 24);
    ctx.lineTo(i * 160 + 210, waterTop);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255, 246, 190, 0.12)";
    ctx.fillRect(i * 160 + 50, 150 + (i % 3) * 24, 28, 5);
    ctx.fillStyle = s.far;
  }

  ctx.fillStyle = "rgba(43, 60, 48, 0.18)";
  ctx.fillRect(0, 201, canvas.width, 7);
  ctx.fillStyle = s.grass;
  ctx.fillRect(0, 208, canvas.width, 45);
  ctx.fillStyle = "rgba(255, 240, 144, 0.45)";
  for (let i = 0; i < 34; i++) {
    ctx.fillRect((i * 53 + 15) % canvas.width, 219 + (i % 4) * 8, 7, 7);
  }
  ctx.fillStyle = s.accent;
  for (let i = 0; i < 24; i++) {
    ctx.fillRect((i * 47) % canvas.width, 213 + (i % 5) * 7, 6, 6);
  }
}

function drawWater(s) {
  const grd = ctx.createLinearGradient(0, waterTop, 0, canvas.height);
  grd.addColorStop(0, s.water);
  grd.addColorStop(1, s.waterDark);
  ctx.fillStyle = grd;
  ctx.fillRect(0, waterTop, canvas.width, canvas.height - waterTop);

  ctx.fillStyle = "rgba(255, 247, 204, 0.12)";
  ctx.fillRect(0, waterTop, canvas.width, 8);
  ctx.fillStyle = "rgba(25, 73, 91, 0.42)";
  for (let y = waterTop + 30; y < canvas.height; y += 39) {
    for (let x = -90; x < canvas.width; x += 118) {
      const offset = Math.sin(state.wave * 1.8 + y * 0.035) * 24;
      ctx.fillRect(x + offset, y, 56, 5);
      ctx.fillRect(x + 70 + offset, y + 11, 33, 5);
    }
  }
  ctx.fillStyle = "rgba(255, 245, 190, 0.18)";
  for (let i = 0; i < 8; i++) {
    const x = (i * 143 + state.wave * 16) % canvas.width;
    const y = waterTop + 62 + (i * 37) % 210;
    ctx.fillRect(x, y, 22, 4);
  }
}

function drawDockAndPlayer(s) {
  ctx.save();

  ctx.fillStyle = "#5c3c25";
  ctx.fillRect(0, 301, 242, 18);
  ctx.fillStyle = "#8f6841";
  ctx.fillRect(0, 319, 242, 28);
  for (let x = -10; x < 250; x += 42) {
    ctx.fillStyle = "#a87949";
    ctx.fillRect(x, 302, 36, 45);
    ctx.fillStyle = "rgba(255, 225, 166, 0.24)";
    ctx.fillRect(x + 6, 309, 20, 4);
    ctx.fillStyle = "rgba(58, 36, 22, 0.35)";
    ctx.fillRect(x + 30, 304, 4, 42);
  }
  ctx.fillStyle = "#5b4129";
  ctx.fillRect(22, 347, 25, 122);
  ctx.fillRect(154, 347, 25, 122);
  ctx.fillStyle = "rgba(255, 226, 171, 0.16)";
  ctx.fillRect(27, 353, 5, 112);
  ctx.fillRect(159, 353, 5, 112);

  const active = state.mode === "waiting" || state.mode === "reeling";
  const bob = Math.sin(state.wave * (active ? 4.2 : 2.1)) * (active ? 2.4 : 1.1);
  const reelLean = state.mode === "reeling" ? Math.sin(state.wave * 7.5) * 3.5 : 0;
  const px = 126;
  const py = 219 + bob;

  ctx.fillStyle = "rgba(30, 40, 34, 0.2)";
  ctx.fillRect(px - 30, py + 88, 74, 8);

  ctx.fillStyle = "#2f3a32";
  ctx.fillRect(px - 22, py + 96, 17, 8);
  ctx.fillRect(px + 20, py + 96, 17, 8);
  ctx.fillStyle = "#4c7180";
  ctx.fillRect(px - 18, py + 56, 18, 40);
  ctx.fillRect(px + 2, py + 56, 18, 40);
  ctx.fillStyle = "#314f5e";
  ctx.fillRect(px - 18, py + 86, 18, 10);
  ctx.fillRect(px + 2, py + 86, 18, 10);

  ctx.fillStyle = "#d9965e";
  ctx.fillRect(px - 24, py + 31, 14, 43);
  ctx.fillRect(px + 18, py + 33 + reelLean * 0.2, 12, 36);
  ctx.fillStyle = "#f0bd85";
  ctx.fillRect(px - 26, py + 67, 14, 12);
  ctx.fillRect(px + 24, py + 62 + reelLean * 0.2, 12, 12);

  ctx.fillStyle = "#799468";
  ctx.fillRect(px - 21, py + 40, 46, 50);
  ctx.fillStyle = "#3f605c";
  ctx.fillRect(px - 15, py + 43, 14, 44);
  ctx.fillRect(px + 5, py + 43, 14, 44);
  ctx.fillStyle = "#f1d26b";
  ctx.fillRect(px - 20, py + 52, 40, 4);
  ctx.fillStyle = s.accent;
  ctx.fillRect(px - 23, py + 87, 52, 8);

  ctx.fillStyle = "#f6c28a";
  ctx.fillRect(px - 16, py + 10, 34, 34);
  ctx.fillStyle = "#b97445";
  ctx.fillRect(px - 15, py + 37, 32, 6);
  ctx.fillStyle = "#26312a";
  ctx.fillRect(px - 6, py + 25, 5, 5);
  ctx.fillRect(px + 10, py + 25, 5, 5);
  ctx.fillRect(px + 3, py + 34, 8, 3);

  ctx.fillStyle = "#3b2a1b";
  ctx.fillRect(px - 19, py + 4, 40, 12);
  ctx.fillStyle = "#d6ad54";
  ctx.fillRect(px - 30, py - 2, 62, 10);
  ctx.fillRect(px - 18, py - 14, 39, 18);
  ctx.fillStyle = "#f3d77b";
  ctx.fillRect(px - 12, py - 10, 24, 5);
  ctx.fillStyle = "#7a4d24";
  ctx.fillRect(px - 18, py + 2, 39, 4);

  const tipX = 292 + (state.mode === "reeling" ? Math.sin(state.wave * 8) * 8 : Math.sin(state.wave * 2) * 2);
  const tipY = 205 + (state.mode === "reeling" ? Math.sin(state.wave * 6) * 5 : 0);
  drawFishingRod(px + 25, py + 62 + reelLean * 0.2, tipX, tipY);
  ctx.restore();
}

function drawFishingRod(baseX, baseY, tipX, tipY) {
  ctx.save();
  ctx.strokeStyle = "#2f2118";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  ctx.strokeStyle = "#8d5a2f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 214, 139, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(baseX + 3, baseY - 3);
  ctx.lineTo(tipX - 4, tipY + 2);
  ctx.stroke();

  ctx.fillStyle = "#2f2118";
  ctx.fillRect(baseX - 8, baseY - 6, 20, 12);
  ctx.fillStyle = "#d7a14e";
  ctx.fillRect(baseX - 5, baseY - 4, 14, 8);
  ctx.fillStyle = "#77c8ce";
  ctx.fillRect(baseX - 1, baseY - 2, 7, 4);
  ctx.fillStyle = "#f5d572";
  ctx.fillRect(tipX - 4, tipY - 4, 8, 8);
  ctx.restore();
}
function drawFishingLine() {
  if (state.mode === "idle") return;
  const rodTipX = 292 + (state.mode === "reeling" ? Math.sin(state.wave * 8) * 8 : Math.sin(state.wave * 2) * 2);
  const rodTipY = 205 + (state.mode === "reeling" ? Math.sin(state.wave * 6) * 5 : 0);
  const lineEndX = state.mode === "reeling" ? state.fishX : 650;
  const lineEndY = state.mode === "reeling" ? state.fishY : 332 + Math.sin(state.wave * 3.5) * 4;
  ctx.strokeStyle = "rgba(255, 249, 218, 0.92)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rodTipX, rodTipY);
  ctx.quadraticCurveTo((rodTipX + lineEndX) / 2, rodTipY + 18, lineEndX, lineEndY);
  ctx.stroke();

  ctx.fillStyle = "#26312a";
  ctx.fillRect(lineEndX - 5, lineEndY - 5, 10, 10);
  ctx.fillStyle = "#e85c48";
  ctx.fillRect(lineEndX - 3, lineEndY - 8, 6, 11);
  ctx.fillStyle = "#fff3aa";
  ctx.fillRect(lineEndX - 2, lineEndY - 6, 3, 3);
}

function drawFishShadows() {
  if (state.mode === "waiting") {
    drawFish(state.fishX + Math.sin(state.wave * 3) * 8, state.fishY + Math.cos(state.wave * 2.5) * 4, "#2f6f83", 1.1, true);
  }
  if (state.mode === "reeling" && state.currentFish) {
    drawFish(state.fishX, state.fishY, state.currentFish.color, state.currentFish.size, false, state.currentFish);
  }
  for (let i = 0; i < 7; i++) {
    const x = (i * 137 + state.wave * 18) % 990;
    const y = 288 + (i * 49) % 210 + Math.sin(state.wave * 2 + i) * 3;
    drawFish(x, y, "rgba(30,78,90,0.22)", 0.75, true);
  }
}

function drawFish(x, y, color, scale, shadow, fish = null) {
  const w = 32 * scale;
  const h = 17 * scale;
  const wiggle = Math.sin(state.wave * 8 + x * 0.02) * 2 * scale;
  const pattern = fish ? fishPatternType(fish) : "scales";
  ctx.save();
  ctx.translate(x, y + wiggle * 0.35);

  if (shadow) {
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillRect(w / 2 - 3 * scale, -h / 4 + wiggle * 0.2, 11 * scale, h / 2);
    ctx.fillRect(-w / 2 - 8 * scale, -h / 3 - wiggle * 0.2, 10 * scale, h / 1.5);
    ctx.restore();
    return;
  }

  ctx.fillStyle = "rgba(20, 34, 32, 0.28)";
  ctx.fillRect(-w / 2 - 4, h / 2 + 5, w + 14, 5 * scale);

  ctx.fillStyle = "#26312a";
  ctx.fillRect(-w / 2 - 9 * scale, -h / 2 - 2 * scale, w + 18 * scale, h + 4 * scale);
  ctx.fillRect(w / 2 - 2 * scale, -h / 3 + wiggle - 2 * scale, 13 * scale, h / 1.5 + 4 * scale);
  ctx.fillRect(-w / 2 - 13 * scale, -h / 3 - wiggle - 2 * scale, 13 * scale, h / 1.5 + 4 * scale);

  ctx.fillStyle = color;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillRect(w / 2 - 2 * scale, -h / 4 + wiggle, 11 * scale, h / 2);
  ctx.fillRect(-w / 2 - 10 * scale, -h / 3 - wiggle, 11 * scale, h / 1.5);

  ctx.fillStyle = "rgba(255, 236, 153, 0.52)";
  ctx.fillRect(-w / 2 + 5 * scale, -h / 2 - 5 * scale, 11 * scale, 5 * scale);
  ctx.fillRect(w / 2 - 9 * scale, -h / 2 - 4 * scale, 10 * scale, 4 * scale);
  ctx.fillStyle = "rgba(38, 49, 42, 0.35)";
  ctx.fillRect(-w / 2 + 4 * scale, h / 2, 12 * scale, 5 * scale);

  drawFishPattern(w, h, scale, pattern, fish);

  ctx.fillStyle = "rgba(255, 255, 255, 0.46)";
  ctx.fillRect(-w / 2 + 7 * scale, -h / 2 + 3 * scale, w * 0.42, 3 * scale);
  ctx.fillStyle = "rgba(255, 246, 184, 0.42)";
  ctx.fillRect(-w / 2 + 5 * scale, h / 2 - 4 * scale, w * 0.5, 2 * scale);

  ctx.fillStyle = "#26312a";
  ctx.fillRect(-w / 2 + 7 * scale, -3 * scale, 4 * scale, 4 * scale);
  ctx.fillStyle = "#fff7ce";
  ctx.fillRect(-w / 2 + 8 * scale, -2 * scale, 1.5 * scale, 1.5 * scale);

  if (fish?.dream || color === "#8f8cff" || color === "#c8d8ff" || color === "#ecfbff") {
    ctx.fillStyle = "rgba(255, 255, 210, 0.92)";
    ctx.fillRect(w / 2 + 9 * scale, -h / 2 - 5 * scale, 4 * scale, 4 * scale);
    ctx.fillRect(-w / 2 - 14 * scale, h / 2 + 2 * scale, 3 * scale, 3 * scale);
    ctx.fillRect(-w / 2 + 2 * scale, -h / 2 - 9 * scale, 3 * scale, 3 * scale);
  }

  ctx.restore();
}

function drawFishPattern(w, h, scale, pattern, fish) {
  ctx.save();
  ctx.fillStyle = "rgba(38, 49, 42, 0.32)";

  if (pattern === "stripes" || pattern === "bands") {
    const count = pattern === "bands" ? 4 : 3;
    for (let i = 0; i < count; i++) {
      const x = -w / 2 + (10 + i * 7) * scale;
      ctx.fillRect(x, -h / 2 + 4 * scale, 3 * scale, h - 7 * scale);
      ctx.fillRect(x + 3 * scale, -h / 2 + 7 * scale, 2 * scale, h - 11 * scale);
    }
  }

  if (pattern === "spots" || pattern === "sparkle") {
    for (let i = 0; i < 5; i++) {
      const x = -w / 2 + (9 + i * 6) * scale;
      const y = -h / 2 + (i % 2 ? 10 : 5) * scale;
      ctx.fillRect(x, y, 3 * scale, 3 * scale);
    }
  }

  if (pattern === "scales" || pattern === "crest") {
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-w / 2 + (10 + i * 6 + row * 3) * scale, -h / 2 + (5 + row * 6) * scale, 3 * scale, 2 * scale);
      }
    }
  }

  if (pattern === "crest") {
    ctx.fillStyle = "rgba(255, 245, 180, 0.72)";
    ctx.fillRect(-w / 2 + 12 * scale, -h / 2 - 8 * scale, 5 * scale, 5 * scale);
    ctx.fillRect(-w / 2 + 18 * scale, -h / 2 - 6 * scale, 4 * scale, 4 * scale);
  }

  if (pattern === "sparkle") {
    ctx.fillStyle = "rgba(255, 255, 210, 0.82)";
    ctx.fillRect(-w / 2 + 12 * scale, -h / 2 + 5 * scale, 4 * scale, 4 * scale);
    ctx.fillRect(w / 2 - 11 * scale, h / 2 - 7 * scale, 3 * scale, 3 * scale);
  }

  if (fish?.seasonSpecial) {
    ctx.fillStyle = "rgba(255, 247, 198, 0.65)";
    ctx.fillRect(-w / 2 + 4 * scale, -h / 2 + 2 * scale, 6 * scale, 2 * scale);
  }

  ctx.restore();
}

function drawHud() {
  if (state.mode !== "reeling") {
    ctx.fillStyle = "rgba(255,251,229,0.78)";
    ctx.fillRect(22, 22, 310, 44);
    ctx.fillStyle = "#26312a";
    ctx.font = "20px Microsoft YaHei";
    const text = state.mode === "waiting" ? "等待上钩..." : "点击抛竿开始";
    ctx.fillText(text, 42, 51);
    return;
  }

  drawBar(30, 28, 260, 22, 1 - state.distance / 120, "#77b57b", "距离");
  const lineLimit = 86 + state.upgrades.line * 15;
  drawBar(30, 62, 260, 22, state.tension / lineLimit, "#e66d4f", "张力");
  drawBar(30, 96, 260, 18, pointer.pull, "#e8b85b", "力道");
}

function drawBar(x, y, w, h, pct, color, label) {
  ctx.fillStyle = "rgba(255,251,229,0.86)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#26312a";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x + 3, y + 3, Math.max(0, Math.min(1, pct)) * (w - 6), h - 6);
  ctx.fillStyle = "#26312a";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText(label, x + 8, y + h - 6);
}

function renderLiveStats() {
  timerEl.textContent = formatTime(state.timeLeft);
  coinsEl.textContent = state.coins + " \u91d1\u5e01";
}

function renderPanel() {
  renderLiveStats();
  seasonLabel.textContent = `${state.season.name} · 当前鱼饵：${currentBaitName()}`;
  castButton.disabled = state.mode !== "idle" || state.ended;
  sellButton.disabled = !state.basket.length || state.ended;
  dexSeasonFilter.value = dexFilters.season;
  dexRarityFilter.value = dexFilters.rarity;

  basketEl.className = state.basket.length ? "basket" : "basket empty";
  basketEl.innerHTML = state.basket.length
    ? state.basket.map((fish) => `<span>${fish.name} · ${fish.sizeRoll} 尺</span><span class="fish-value">${fish.value}</span>`).join("")
    : "还没有鱼";

  upgradesEl.innerHTML = Object.entries(upgradeDefs).map(([key, def]) => {
    const level = state.upgrades[key];
    const cost = upgradeCost(key);
    const maxed = level >= 5;
    const shortfall = Math.max(0, cost - state.coins);
    const statusText = maxed ? "已满级" : shortfall > 0 ? `还差 ${shortfall} 金币` : `升级费用 ${cost} 金币`;
    const buttonText = maxed ? "满级" : shortfall > 0 ? `差 ${shortfall} 金` : `${cost} 金`;
    return `
      <div class="upgrade ${maxed ? "maxed" : ""} ${shortfall > 0 && !maxed ? "locked" : ""}">
        <div class="upgrade-icon" aria-hidden="true"></div>
        <div class="upgrade-info">
          <div class="upgrade-title">
            <strong>${def.name}</strong>
            <span>Lv.${level} · ${upgradeLevelName(key, level)}</span>
          </div>
          <p>${def.desc}：${upgradeEffect(key, level)}</p>
          <div class="upgrade-next">${maxed ? "已达到最高等级" : `下一级：${upgradeLevelName(key, level + 1)} · ${upgradeEffect(key, level + 1)}`}</div>
          <div class="upgrade-cost">${statusText}</div>
        </div>
        <button data-upgrade="${key}" ${maxed || shortfall > 0 || state.ended ? "disabled" : ""}>${buttonText}</button>
      </div>
    `;
  }).join("");

  questsEl.innerHTML = state.quests.map((quest, index) => {
    const progress = Math.min(quest.progress(state), quest.goal);
    const done = state.stats.rewardedQuests.has(index) || progress >= quest.goal;
    return `
      <div class="quest ${done ? "done" : ""}">
        <span>${done ? "完成" : "进行中"} · ${quest.text} · ${progress}/${quest.goal}</span>
        <div class="meter"><span style="width: ${(progress / quest.goal) * 100}%"></span></div>
      </div>
    `;
  }).join("");

  const filteredFish = fishCatalog.filter((fish) => {
    const seasonMatch = dexFilters.season === "all" || fish.seasons.includes(dexFilters.season);
    const rarityMatch = dexFilters.rarity === "all" || String(fish.rarity) === dexFilters.rarity;
    return seasonMatch && rarityMatch;
  });

  dexEl.innerHTML = filteredFish.map((fish) => {
    const found = state.dex.has(fish.name);
    const seasonNames = fish.seasons.map(seasonShortName).join(" / ");
    return `
      <div class="dex-card ${found ? "" : "locked"} ${fish.seasonSpecial ? "special" : ""}">
        ${found ? `
          <strong>${fish.name}</strong>
          <span>${rarityLabel(fish.rarity)} · ${fish.dream ? "梦幻鱼" : "普通鱼"} · ${fish.value} 金</span>
          <em>${seasonNames}${fish.seasonSpecial ? " · 季节特殊" : ""}</em>
          <p>${fish.description}</p>
        ` : `
          <strong>未知鱼影</strong>
          <span>${rarityLabel(fish.rarity)} · ${seasonNames}</span>
        `}
      </div>
    `;
  }).join("") || `<div class="dex-empty">没有符合筛选的鱼影</div>`;
}

function showToast(message, duration = 1200) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastTimer = duration;
}

function tickToast(deltaMs) {
  if (toastTimer <= 0) return;
  toastTimer -= deltaMs;
  if (toastTimer <= 0) toastEl.hidden = true;
}

function pointerFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  return { x, y };
}

canvas.addEventListener("pointerdown", (event) => {
  if (state.mode !== "reeling") return;
  pointer.down = true;
  const pos = pointerFromEvent(event);
  pointer.x = pos.x;
  pointer.y = pos.y;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!pointer.down) return;
  const pos = pointerFromEvent(event);
  const drag = Math.hypot(pos.x - pointer.x, pos.y - pointer.y);
  pointer.pull = Math.max(0, Math.min(0.95, drag / 180));
});

canvas.addEventListener("pointerup", (event) => {
  pointer.down = false;
  pointer.pull = 0;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  pointer.down = false;
  pointer.pull = 0;
});

panelButtons.forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.openPanel));
});

panelCloseButtons.forEach((button) => {
  button.addEventListener("click", closePanels);
});

panelLayer.addEventListener("click", (event) => {
  if (event.target === panelLayer) closePanels();
});

dexSeasonFilter.addEventListener("change", () => {
  dexFilters.season = dexSeasonFilter.value;
  renderPanel();
});

dexRarityFilter.addEventListener("change", () => {
  dexFilters.rarity = dexRarityFilter.value;
  renderPanel();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panelLayer.hidden) closePanels();
});
castButton.addEventListener("click", castLine);
sellButton.addEventListener("click", sellBasket);
newRunButton.addEventListener("click", startRun);
summaryRestart.addEventListener("click", startRun);
catchToBasketButton.addEventListener("click", acceptCatchToBasket);
catchSellButton.addEventListener("click", sellPendingCatch);

upgradesEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upgrade]");
  if (button) upgrade(button.dataset.upgrade);
});

function loop(now) {
  const deltaMs = Math.min(50, now - lastFrame);
  const dt = deltaMs / 1000;
  lastFrame = now;
  update(dt);
  tickToast(deltaMs);
  draw();
  renderLiveStats();
  requestAnimationFrame(loop);
}

startRun();
requestAnimationFrame(loop);
