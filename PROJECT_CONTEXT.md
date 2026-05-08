# PROJECT_CONTEXT.md

## 项目名称和项目地址

- 项目名称：湖边五分钟
- 本地目录：`D:\coding data\Codex\fishing`
- GitHub 仓库：`https://github.com/LLSakura/lake-five-minutes`
- GitHub Pages：`https://llsakura.github.io/lake-five-minutes/`

## 当前项目是什么

这是一个纯静态网页小游戏，不依赖构建工具或前端框架。项目通过 `index.html`、`styles.css`、`game.js` 和一个可选的 `server.js` 运行。

游戏定位是治愈系像素风钓鱼小游戏。玩家在 5 分钟一局的时间内钓鱼、卖鱼、赚金币、升级装备，并尽量完成随机任务和发现更多鱼类。

当前没有 `package.json`。本地可以直接双击 `index.html` 打开，也可以运行：

```powershell
node server.js
```

然后访问：

```text
http://127.0.0.1:4173/
```

## 当前小游戏的核心玩法

- 一局固定 5 分钟，由 `RUN_SECONDS = 300` 控制。
- 玩家点击 `抛竿` 后进入等待状态。
- 鱼上钩后进入收线状态。
- 收线时玩家在 Canvas 上按住并拖拽，拖拽距离决定 `pointer.pull`。
- 游戏用三个核心量控制钓鱼成败：
  - `distance`：鱼离岸边的距离，降到 `reelTargetDistance` 以下即钓起。
  - `tension`：鱼线张力，超过 `lineLimit` 会断线。
  - `fishFight`：鱼挣扎强度，受鱼种 `struggle` 和时间波动影响。
- 钓到鱼后鱼会进入鱼篓。
- 玩家可在鱼篓中卖鱼换金币。
- 金币可在商店中升级鱼竿、鱼线、鱼饵、幸运值。
- 每局随机抽取 3 个任务，任务完成会自动奖励金币。

## 当前已实现功能

- 5 分钟倒计时。
- Canvas 钓鱼主画面。
- 四季随机背景：春、夏、秋、冬。
- 点击抛竿、等待上钩、拖拽收线。
- 距离条、张力条、力道条。
- 鱼类数据表，目前 9 种鱼：
  - 小鲫鱼
  - 银鲤鱼
  - 黑鲈鱼
  - 金鳟鱼
  - 月光鱼
  - 云朵鱼
  - 琥珀鱼
  - 星尘鱼
  - 雪铃鱼
- 鱼篓系统。
- 卖鱼获得金币。
- 商店升级：鱼竿、鱼线、鱼饵、幸运值。
- 随机任务系统。
- 图鉴发现系统。
- 本局结算弹窗。
- 主界面底部工具栏。
- 工具弹窗：鱼篓、商店、任务、图鉴。
- 弹窗支持关闭按钮、点击背景关闭、`Esc` 关闭。
- 像素风角色、鱼竿、鱼模型和轻微钓鱼动画。
- GitHub Pages 部署。

## 最近几次重要提交及其作用

- `8aeed29 Add modal tool windows`
  - 把右侧常驻面板改成底部工具栏加弹窗系统。
  - 新增鱼篓、商店、任务、图鉴四个工具窗口。

- `fe360c9 Upgrade fishing scene models and animation`
  - 升级 Canvas 画面里的角色、鱼竿、鱼和湖面细节。
  - 加入人物轻微浮动、鱼竿抖动、浮标晃动、鱼尾摆动等动画。

- `8a153ff Tune fishing balance and upgrade clicks`
  - 修复升级按钮点击丢失问题。
  - 原因是早期每帧 `renderPanel()` 重建按钮，导致 click 事件丢失。
  - 调整钓鱼难度到中下等。

- `8f74cd2 Ease fishing difficulty`
  - 修复拖拽方向问题。
  - 把“只有某个方向拖拽才算力道”改成任意方向拖开都算拉力。

- `ca328a0 Refine fantasy game UI`
  - 按参考图方向重做 UI 质感。
  - 加入木牌、石框、羊皮纸、宝石风格按钮和面板。

- `98bd9fb Fix hidden summary modal`
  - 修复结算弹窗一开始就显示的问题。
  - 原因是 `.modal { display: grid; }` 覆盖了 HTML `hidden` 属性。

- `156ef00 Initial fishing game`
  - 首次提交可玩原型。

## 当前 UI 结构

`index.html` 当前结构如下：

- `.app-shell`
  - `.game-area`
    - `.top-bar`
      - 游戏标题 `湖边五分钟`
      - `seasonLabel`
      - `timer`
      - `coins`
    - `.canvas-frame`
      - `canvas#gameCanvas`
      - `#toast`
    - `.action-row.primary-actions`
      - `#castButton` 抛竿
      - `data-open-panel="basket"` 鱼篓
      - `data-open-panel="shop"` 商店
      - `data-open-panel="quests"` 任务
      - `data-open-panel="dex"` 图鉴
      - `#newRunButton` 新一局

- `#panelLayer.panel-layer`
  - `#basketPanel[data-panel="basket"]`
    - `#basket`
    - `#sellButton`
  - `#shopPanel[data-panel="shop"]`
    - `#upgrades`
  - `#questsPanel[data-panel="quests"]`
    - `#quests`
  - `#dexPanel[data-panel="dex"]`
    - `#dex`

- `#summaryModal.modal`
  - `#summaryBody`
  - `#summaryRestart`

## 当前主要文件结构

- `README.md`
  - 项目简介、玩法、本地运行方式。

- `index.html`
  - 页面结构。
  - 定义 Canvas、底部工具栏、四个工具弹窗、结算弹窗。
  - 不包含业务逻辑。

- `styles.css`
  - 全部 UI 样式。
  - 包括木牌顶部栏、Canvas 外框、按钮、弹窗、鱼篓、商店、任务、图鉴、结算弹窗、响应式布局。
  - 后半段有“Window-system layout”相关覆盖样式，用于工具栏和弹窗。

- `game.js`
  - 游戏全部业务逻辑和 Canvas 绘制。
  - 负责数据、状态机、钓鱼公式、鱼类选择、任务、升级、渲染 DOM、Canvas 动画、事件监听。

- `server.js`
  - 简单 Node 静态服务器。
  - 默认监听 `127.0.0.1:4173`。

- `package.json`
  - 当前不存在。

## 当前状态管理和核心逻辑如何工作

`game.js` 使用一个全局 `state` 对象保存当前局状态。

`newState()` 创建新一局状态，主要字段：

- `season`：当前季节。
- `timeLeft`：剩余时间。
- `coins`：金币。
- `basket`：当前鱼篓。
- `dex`：已发现鱼类，使用 `Set`。
- `upgrades`：装备等级，包括 `rod`、`line`、`bait`、`luck`。
- `quests`：本局随机任务。
- `mode`：当前状态，主要是 `idle`、`waiting`、`reeling`。
- `biteTimer`：等待上钩倒计时。
- `currentFish`：当前上钩鱼。
- `distance`：鱼距岸边。
- `tension`：鱼线张力。
- `fishX`、`fishY`：当前鱼或鱼影位置。
- `wave`：动画时间。
- `ended`：本局是否结束。
- `stats`：本局统计。

核心状态流：

1. `startRun()`
   - 重置 `state`。
   - 关闭弹窗。
   - 显示开局提示。
   - 调用 `renderPanel()`。

2. `castLine()`
   - 仅在 `mode === "idle"` 时生效。
   - 切换到 `waiting`。
   - 设置 `biteTimer` 和鱼影位置。

3. `update(dt)`
   - 每帧扣时间。
   - `waiting` 时减少 `biteTimer`，倒计时结束调用 `hookFish()`。
   - `reeling` 时根据 `pointer.pull`、鱼挣扎和升级等级计算 `distance` 和 `tension`。
   - 成功调用 `finishCatch()`。
   - 失败调用 `failCatch()`。

4. `finishCatch()`
   - 计算鱼尺寸和价值。
   - 当前版本直接把鱼加入 `state.basket`。
   - 更新图鉴、统计和任务。
   - 显示 toast。

5. `sellBasket()`
   - 计算鱼篓总价值。
   - 增加金币和本局收入。
   - 清空鱼篓。
   - 更新任务和 UI。

6. `upgrade(key)`
   - 读取当前等级和升级价格。
   - 金币足够且未满级时扣钱并升级。
   - 更新 UI。

7. `endRun()`
   - 时间结束后自动卖出鱼篓剩余鱼。
   - 显示结算弹窗。

渲染循环：

- `loop(now)` 每帧运行。
- 调用 `update(dt)`、`tickToast(deltaMs)`、`draw()`、`renderLiveStats()`。
- 注意：不要在每帧调用 `renderPanel()`，否则会重建按钮，造成点击事件丢失。

## 当前弹窗、工具栏、鱼篓、商店、任务、图鉴逻辑如何工作

工具栏：

- `index.html` 中底部按钮通过 `data-open-panel` 标记目标窗口。
- 例如：`data-open-panel="shop"` 打开商店。

弹窗：

- `panelLayer` 是工具弹窗遮罩层。
- 每个窗口都有 `data-panel`。
- `openPanel(panelName)`：
  - 显示 `panelLayer`。
  - 遍历 `panelWindows`，只显示匹配 `panelName` 的窗口。
  - 调用 `renderPanel()` 刷新窗口内容。
- `closePanels()`：
  - 隐藏 `panelLayer`。
  - 隐藏所有 `data-panel` 窗口。
- 关闭方式：
  - 点击窗口右上角 `data-close-panel` 按钮。
  - 点击遮罩背景。
  - 按 `Esc`。

鱼篓：

- 容器是 `#basket`。
- 内容由 `renderPanel()` 根据 `state.basket` 生成。
- 当前鱼篓窗口里有 `#sellButton`。
- 点击 `#sellButton` 调用 `sellBasket()`。

商店：

- 容器是 `#upgrades`。
- 内容由 `upgradeDefs` 和 `state.upgrades` 生成。
- 升级按钮带 `data-upgrade="rod|line|bait|luck"`。
- 点击事件绑定在 `upgradesEl` 上，使用事件委托触发 `upgrade(key)`。

任务：

- 容器是 `#quests`。
- 当前任务从 `questPool` 随机抽 3 个。
- 任务进度由每个任务对象的 `progress(state)` 计算。
- `checkQuestRewards()` 会自动发放奖励，防止重复奖励依赖 `state.stats.rewardedQuests`。

图鉴：

- 容器是 `#dex`。
- `state.dex` 是一个 `Set`，存已发现鱼名。
- 已发现显示鱼名、类型和价值。
- 未发现显示“未知鱼影”。

## 当前仍存在的问题或容易踩坑的地方

- 当前没有 `package.json`，不要默认运行 `npm install` 或 `npm run`。
- 当前是纯静态网页，GitHub Pages 直接发布根目录。
- Node 在某些 Codex 提升权限环境里曾出现 `Access is denied`，但普通 `node --check game.js` 在最近一次窗口系统修改后成功过。
- Windows PowerShell 默认输出可能把中文显示成乱码。读取文件时使用 `-Encoding UTF8`。写文件后建议用 UTF-8 no BOM。
- 不要每帧调用 `renderPanel()`。每帧只应调用 `renderLiveStats()`。
- `renderPanel()` 会重建鱼篓、商店、任务、图鉴 DOM。如果在按钮按下/松开之间重建，会导致点击事件丢失。
- `finishCatch()` 当前直接把鱼放入鱼篓。下一阶段要改为先弹“钓到了！”鱼卡，再由玩家选择“放入鱼篓”或“直接卖掉”。
- `sellBasket()` 当前一次性卖出全部鱼篓。
- `endRun()` 会自动卖出鱼篓剩余鱼。
- 当前鱼类只有 9 种，还没有扩展到 24 种，也没有完整的“每季特殊鱼”数据。
- 当前图鉴没有筛选、详情描述、季节标签。
- 生成过三张概念图，但没有接入项目资源，仍保存在 Codex 生成图目录下。
- GitHub Pages 更新后可能需要等待几十秒，浏览器可能需要 `Ctrl + F5` 强刷。

## 新 Codex 对话继续开发时应该先阅读哪些文件

建议按顺序阅读：

1. `PROJECT_CONTEXT.md`
2. `TODO.md`
3. `README.md`
4. `index.html`
5. `game.js`
6. `styles.css`
7. `server.js`

重点阅读 `game.js` 中这些区域：

- 顶部 DOM 查询。
- `seasons`、`fishCatalog`、`upgradeDefs`、`questPool`。
- `openPanel()`、`closePanels()`。
- `newState()`、`startRun()`。
- `castLine()`、`chooseFish()`、`hookFish()`、`finishCatch()`。
- `sellBasket()`、`upgrade()`、`checkQuestRewards()`。
- `update(dt)`。
- `draw()` 和各个 `draw*` Canvas 绘制函数。
- `renderLiveStats()`、`renderPanel()`。
- 末尾事件监听。

## 继续开发时不要破坏的内容

- 不要删除 `panelLayer`、`data-open-panel`、`data-panel`、`data-close-panel` 这套工具窗口结构。
- 不要把鱼篓、商店、任务、图鉴重新做回右侧常驻面板。
- 不要恢复每帧 `renderPanel()`。
- 不要破坏 Canvas 的 `pointerdown`、`pointermove`、`pointerup` 拖拽逻辑。
- 不要把 `pointer.pull` 改回只认单方向拖拽。
- 不要删除 `renderLiveStats()`。
- 不要删除 `modal[hidden]` / `.panel-layer[hidden]` / `.game-window[hidden]` 的隐藏规则。
- 不要大幅改动钓鱼数值，除非专门做平衡调整。
- 不要直接覆盖中文文件时省略 UTF-8 编码。
- 不要提交未测试的乱码文件。
- 不要依赖外部图片资源，当前游戏仍是 Canvas 绘制为主。
