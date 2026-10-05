# 網站開發合輯

使用者（個人，無公司）用來累積作品集、之後拿去接案與銷售課程的展示專案。所有頁面都是單檔 HTML，沒有建置流程。

- 線上網址（GitHub Pages）：https://chotk.github.io/-/
- 遠端：https://github.com/CHotk/-.git，分支 `main`

## 結構

```
index.html          總入口：卡片目錄、預覽視窗（手機／桌機）、更新歷史
pages/
  common.js         所有頁面共用：回首頁按鈕、滑鼠拖曳橫向捲動、手機模式上下拖曳
  awwwards-effects.html            特效圖鑑 I
  awwwards-effects-2.html          特效圖鑑 II
  awwwards-effects-3-mobile.html   特效圖鑑 III（手機版）
  nail-artist-site.html            美甲師
  florist-studio-site.html         花藝工作室
  game-trader-site.html            遊戲商人
  hair-salon-site.html             髮廊
  vending-me-site.html             創意作品：自動販賣機個人介紹
```

根目錄只放 `index.html` 與 `pages/`（外加 `.claude/`、`.gitignore`）。

## 每次更新的流程

1. 新頁面放進 `pages/`，結尾加上 `<script src="common.js"></script>`。
2. 在 `index.html` 的 `PAGES` 清單登錄（`grp`：1 特效、2 行業、3 創意），並補上縮圖樣式 `.aN` 與 `G`、`BG` 的顏色，更新頁首統計數字。
3. 在 `index.html` 的 `CHANGELOG` **最上方**新增一筆（版本號、日期、項目）。頁首版本標籤、預覽網址的版本參數、更新歷史都由它產生。
4. 用 `node` 對頁面內 `<script>` 做語法檢查。
5. commit 並 push 到 `main`，再用 curl 確認線上版本已更新（Pages 約需 1 分鐘）。

## 慣例

- **commit message 一律繁體中文**，結尾保留 Co-Authored-By 署名行。
- **手機支援要好**（包含入口頁）。使用 `100svh`/`dvh`、安全區域、至少 44px 的點擊區域；觸控互動要同時支援滑鼠。
- 範例內容（店名、價格、評價、成交數字）一律**虛構並標示「示意」**，不使用真實品牌與商標。
- 範例的預約或訂單目前只是產生訊息讓使用者複製，沒有後端。
- 頁面從 Google Fonts 載入字型；除字型外不使用外部函式庫。
- 設計上避開老套：每個頁面要有自己的視覺語言，不要彼此雷同。

## 待辦路線圖

1. 真手機驗收：使用者用手機走過每頁，回報卡頓或跑版再修。
2. 繼續累積行業範例：皮拉提斯教室（下一個）、咖啡店、調香師、刺青師、心理諮商。
3. 做使用者自己的接案官網：作品集加服務項目、報價方案、合作流程、聯絡表單。
4. 補強展示品質：入口頁卡片縮圖換成真實截圖；低階手機效能檢查與降級（WebGL、粒子）。
5. 讓範例真的能用：預約與訂花接真表單（Google 表單或 Formspree）。
6. 整理推銷素材：每個範例寫「行業痛點」與「功能如何幫店家賺錢」的簡短提案。

## 背景

網站特效不是成交關鍵，信任、受眾與真實案例才是。使用者目前最大的難題是**不知道怎麼找客戶**，所以優先順序偏向可以拿去談合作的素材（範例、提案、私訊範本、客戶追蹤表）。
