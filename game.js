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
const castButton = document.getElementById("castButton");
const sellButton = document.getElementById("sellButton");
const newRunButton = document.getElementById("newRunButton");
const summaryModal = document.getElementById("summaryModal");
const summaryBody = document.getElementById("summaryBody");
const summaryRestart = document.getElementById("summaryRestart");

const RUN_SECONDS = 300;
const shoreX = 185;
const waterTop = 235;
const reelTargetDistance = 20;

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
  { name: "小鲫鱼", rarity: 1, value: 18, size: 1, struggle: 0.55, bait: "面包饵", seasons: ["spring", "summer", "autumn", "winter"], dream: false, color: "#b7a16b" },
  { name: "银鲤鱼", rarity: 1, value: 28, size: 1.25, struggle: 0.72, bait: "面包饵", seasons: ["spring", "summer", "autumn"], dream: false, color: "#d4dce1" },
  { name: "黑鲈鱼", rarity: 2, value: 42, size: 1.45, struggle: 1.02, bait: "虫饵", seasons: ["summer", "autumn"], dream: false, color: "#35434a" },
  { name: "金鳟鱼", rarity: 3, value: 76, size: 1.2, struggle: 0.98, bait: "亮片饵", seasons: ["spring", "winter"], dream: false, color: "#e7b23d" },
  { name: "月光鱼", rarity: 3, value: 88, size: 1.1, struggle: 0.82, bait: "星糖饵", seasons: ["autumn"], dream: true, color: "#c8d8ff" },
  { name: "云朵鱼", rarity: 2, value: 54, size: 1, struggle: 0.58, bait: "星糖饵", seasons: ["spring"], dream: true, color: "#fff5f1" },
  { name: "琥珀鱼", rarity: 3, value: 96, size: 1.35, struggle: 1.05, bait: "亮片饵", seasons: ["autumn", "summer"], dream: true, color: "#f39a48" },
  { name: "星尘鱼", rarity: 4, value: 140, size: 0.9, struggle: 1.18, bait: "星糖饵", seasons: ["spring", "summer", "autumn", "winter"], dream: true, color: "#8f8cff" },
  { name: "雪铃鱼", rarity: 3, value: 90, size: 0.95, struggle: 0.66, bait: "星糖饵", seasons: ["winter"], dream: true, color: "#ecfbff" },
];

const upgradeDefs = {
  rod: { name: "鱼竿", desc: "收线效率", base: 45 },
  line: { name: "鱼线", desc: "最大张力", base: 40 },
  bait: { name: "鱼饵", desc: "上钩速度", base: 35 },
  luck: { name: "幸运值", desc: "稀有概率", base: 55 },
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
    if (fish.bait === currentBaitName()) weight *= 1.75;
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
  const level = state.upgrades.bait;
  if (level >= 4) return "星糖饵";
  if (level >= 3) return "亮片饵";
  if (level >= 2) return "虫饵";
  return "面包饵";
}

function hookFish() {
  state.currentFish = chooseFish();
  state.mode = "reeling";
  state.distance = 100;
  state.tension = 20;
  showToast(`${state.currentFish.name} 上钩了，拖拽控制力道。`, 1500);
  renderPanel();
}

function finishCatch() {
  const fish = state.currentFish;
  const sizeRoll = Math.round((fish.size * (0.75 + Math.random() * 0.6)) * 100) / 100;
  const value = Math.round(fish.value * (0.85 + sizeRoll * 0.25));
  const catchItem = { ...fish, sizeRoll, value };
  state.basket.push(catchItem);
  state.dex.add(fish.name);
  state.stats.caught += 1;
  state.stats.currentStreak += 1;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.currentStreak);
  if (fish.dream) state.stats.dreamCaught += 1;
  if (value > 80) state.stats.expensiveCaught = 1;
  if (!state.stats.biggest || sizeRoll > state.stats.biggest.sizeRoll) state.stats.biggest = catchItem;
  state.mode = "idle";
  state.currentFish = null;
  showToast(`钓到了 ${fish.name}，价值 ${value} 金币。`, 1800);
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
  showToast(`${upgradeDefs[key].name} 升到 ${state.upgrades[key]} 级。`, 1200);
  renderPanel();
}

function upgradeCost(key) {
  const def = upgradeDefs[key];
  const level = state.upgrades[key];
  return Math.round(def.base * Math.pow(1.55, level - 1));
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
  const unsold = state.basket.reduce((sum, fish) => sum + fish.value, 0);
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
    const rodPower = 10 + state.upgrades.rod * 5;
    const lineLimit = 68 + state.upgrades.line * 12;
    const fishFight = fish.struggle * (0.7 + Math.sin(state.wave * 5.5) * 0.3 + Math.random() * 0.15);
    const pull = pointer.down ? pointer.pull : 0;
    const sweetSpot = 0.34 + fish.struggle * 0.14;

    state.tension += (pull * 58 * fish.struggle - 13 - state.upgrades.line * 2) * dt;
    state.tension += Math.max(0, fishFight - 0.7) * 10 * dt;
    state.tension = Math.max(0, Math.min(110, state.tension));

    const progress = (pull - sweetSpot) * rodPower * dt - fishFight * 3.2 * dt;
    state.distance -= progress;
    state.distance = Math.max(0, Math.min(122, state.distance));
    state.fishX = shoreX + 110 + state.distance * 5.2;
    state.fishY += Math.sin(state.wave * 9) * fish.struggle * 0.8;

    if (state.distance <= reelTargetDistance) finishCatch();
    if (state.tension > lineLimit) failCatch("鱼线绷断了。");
    if (state.distance >= 121) failCatch("鱼挣脱了。");
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
    ctx.moveTo(i * 160 - 40, waterTop);
    ctx.lineTo(i * 160 + 70, 115 + (i % 3) * 25);
    ctx.lineTo(i * 160 + 210, waterTop);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = s.grass;
  ctx.fillRect(0, 205, canvas.width, 48);
  ctx.fillStyle = s.accent;
  for (let i = 0; i < 28; i++) {
    ctx.fillRect((i * 43) % canvas.width, 210 + (i % 5) * 7, 8, 8);
  }
}

function drawWater(s) {
  ctx.fillStyle = s.water;
  ctx.fillRect(0, waterTop, canvas.width, canvas.height - waterTop);
  ctx.fillStyle = s.waterDark;
  for (let y = waterTop + 24; y < canvas.height; y += 42) {
    for (let x = -80; x < canvas.width; x += 120) {
      const offset = Math.sin(state.wave * 1.8 + y * 0.03) * 22;
      ctx.fillRect(x + offset, y, 58, 5);
      ctx.fillRect(x + 72 + offset, y + 10, 34, 5);
    }
  }
}

function drawDockAndPlayer(s) {
  ctx.fillStyle = "#806143";
  ctx.fillRect(0, 300, 230, 34);
  ctx.fillRect(22, 334, 22, 120);
  ctx.fillRect(150, 334, 22, 120);
  ctx.fillStyle = "#5c432f";
  for (let x = 14; x < 215; x += 42) ctx.fillRect(x, 300, 6, 34);

  ctx.fillStyle = "#4f6d7a";
  ctx.fillRect(118, 244, 34, 46);
  ctx.fillStyle = "#f4c9a0";
  ctx.fillRect(121, 216, 28, 28);
  ctx.fillStyle = "#26312a";
  ctx.fillRect(118, 210, 34, 12);
  ctx.fillRect(139, 226, 5, 5);
  ctx.fillStyle = s.accent;
  ctx.fillRect(112, 288, 48, 9);

  ctx.strokeStyle = "#4c3628";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(150, 250);
  ctx.lineTo(275, 205);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawFishingLine() {
  if (state.mode === "idle") return;
  const lineEndX = state.mode === "reeling" ? state.fishX : 650;
  const lineEndY = state.mode === "reeling" ? state.fishY : 332;
  ctx.strokeStyle = "#f7f0cf";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(275, 205);
  ctx.lineTo(lineEndX, lineEndY);
  ctx.stroke();
  ctx.fillStyle = "#e85c48";
  ctx.fillRect(lineEndX - 4, lineEndY - 4, 8, 8);
}

function drawFishShadows() {
  if (state.mode === "waiting") {
    drawFish(state.fishX, state.fishY, "#2f6f83", 1.1, true);
  }
  if (state.mode === "reeling" && state.currentFish) {
    drawFish(state.fishX, state.fishY, state.currentFish.color, state.currentFish.size, false);
  }
  for (let i = 0; i < 7; i++) {
    const x = (i * 137 + state.wave * 18) % 990;
    const y = 288 + (i * 49) % 210;
    drawFish(x, y, "rgba(30,78,90,0.22)", 0.75, true);
  }
}

function drawFish(x, y, color, scale, shadow) {
  const w = 28 * scale;
  const h = 14 * scale;
  ctx.fillStyle = color;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.fillRect(x + w / 2 - 2, y - h / 4, 10 * scale, h / 2);
  if (!shadow) {
    ctx.fillStyle = "#26312a";
    ctx.fillRect(x - w / 2 + 5, y - 2, 3, 3);
  }
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
  const lineLimit = 68 + state.upgrades.line * 12;
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

function renderPanel() {
  timerEl.textContent = formatTime(state.timeLeft);
  coinsEl.textContent = `${state.coins} 金币`;
  seasonLabel.textContent = `${state.season.name} · 当前鱼饵：${currentBaitName()}`;
  castButton.disabled = state.mode !== "idle" || state.ended;
  sellButton.disabled = !state.basket.length || state.ended;

  basketEl.className = state.basket.length ? "basket" : "basket empty";
  basketEl.innerHTML = state.basket.length
    ? state.basket.map((fish) => `<span>${fish.name} · ${fish.sizeRoll} 尺</span><span class="fish-value">${fish.value}</span>`).join("")
    : "还没有鱼";

  upgradesEl.innerHTML = Object.entries(upgradeDefs).map(([key, def]) => {
    const level = state.upgrades[key];
    const cost = upgradeCost(key);
    const maxed = level >= 5;
    return `
      <div class="upgrade">
        <div><strong>${def.name} Lv.${level}</strong><span>${def.desc}</span></div>
        <button data-upgrade="${key}" ${maxed || state.coins < cost || state.ended ? "disabled" : ""}>${maxed ? "满级" : `${cost} 金`}</button>
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

  dexEl.innerHTML = fishCatalog.map((fish) => {
    const found = state.dex.has(fish.name);
    return `<div class="dex-card ${found ? "" : "locked"}">${found ? `${fish.name}<br>${fish.dream ? "梦幻鱼" : "普通鱼"} · ${fish.value} 金` : "未知鱼影"}</div>`;
  }).join("");
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
  const drag = Math.max(0, pointer.x - pos.x + (pos.y - pointer.y) * 0.35);
  pointer.pull = Math.max(0, Math.min(1, drag / 190));
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

castButton.addEventListener("click", castLine);
sellButton.addEventListener("click", sellBasket);
newRunButton.addEventListener("click", startRun);
summaryRestart.addEventListener("click", startRun);

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
  renderPanel();
  requestAnimationFrame(loop);
}

startRun();
requestAnimationFrame(loop);
