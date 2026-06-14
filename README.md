# github-profilemd-Generater

GitHub Actions 工具，透過 **GitHub GraphQL API** 自動產生個人頁面統計卡片（SVG），並 commit 回儲存庫，讓你的 Profile README 保持最新狀態。

> 多語言文件：[English](docs/README.md) ｜ [日本語](docs/README_ja.md) ｜ [繁體中文](docs/README_zh-tw.md) ｜ [简体中文](docs/README_zh-ch.md)

## 產生的卡片

每次執行會在 `output/github-profilemd-generater/<theme>/` 輸出：

| 檔案 | 說明 |
|------|------|
| `overview.svg` | 總覽統計（Stars / Repos / Followers / Commits / PR / Issue） |
| `langcompos.svg` | 語言組成（依實際程式碼位元組數計算） |
| `tagsstat.svg` | 標籤 / 主題統計卡片 |

同時產生 `output/README.md` 片段，可直接嵌入你的 Profile README。

## 可用主題

`default` ｜ `solarized` ｜ `solarized_dark` ｜ `vue` ｜ `dracula` ｜ `monokai` ｜ `nord_bright` ｜ `nord_dark` ｜ `github` ｜ `github_dark`

## GitHub Actions 快速設定

### 1. 在目標儲存庫新增 Secret

前往 **Settings → Secrets and variables → Actions** 新增：

| Secret 名稱 | 說明 |
|---|---|
| `MY_GITHUB_TOKEN` | 具備 `read:user` 與 `repo` 權限的 Personal Access Token |

<details>
<summary>📷 如何建立 Personal Access Token（圖解步驟）</summary>

| 步驟 | 操作 | 畫面 |
|:---:|------|------|
| 1 | 右上頭像選單 → **Settings** | ![step1](wiki/step1.png) |
| 2 | **Developer settings → Personal access tokens** → 點 **Generate new token** | ![step2](wiki/step2.png) |
| 3 | 勾選 `repo` 與 `read:user` scopes，產生後複製 token 貼到上方 Secret | ![step3](wiki/step3.png) |

</details>

### 2. 新增 Workflow 檔案

```yaml
# .github/workflows/generate-profile.yml
name: Generate profile cards
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * 1'   # 每週一自動執行

permissions:
  contents: write          # 允許 bot 將卡片 commit 回儲存庫

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: kwangsing3/github-profilemd-Generater@release
        env:
          GITHUB_TOKEN: ${{ secrets.MY_GITHUB_TOKEN }}
        with:
          USERNAME: ${{ github.repository_owner }}
          GITHUB_REPO_NAME: ${{ github.event.repository.name }}
          # 以下皆為選填
          THEME: 'all'        # 或逗號分隔，如 "nord_dark,dracula"
          TOP_N: '8'          # 語言 / 標籤顯示數量
          HIDE: ''            # 排除語言，如 "HTML,CSS"
          OUTPUT_DIR: 'output'
```

> 🔒 **安全建議**：正式環境請將 `@release` 改為釘選 commit SHA（例如 `@<sha>`），並只授予 workflow 必要的 `permissions`。

### 可用輸入參數

| 輸入 | 必填 | 預設 | 說明 |
|------|:---:|------|------|
| `USERNAME` | ✅ | repo owner | 要分析的 GitHub 帳號 |
| `GITHUB_REPO_NAME` | ✅ | 當前 repo | 目標儲存庫名稱 |
| `THEME` | | `all` | `all` 或逗號分隔的主題清單 |
| `TOP_N` | | `8` | 每張卡顯示的語言 / 標籤數量 |
| `HIDE` | | （空） | 逗號分隔、要排除的語言 |
| `OUTPUT_DIR` | | `output` | 卡片輸出目錄 |

### 3. 將卡片嵌入 Profile README

```markdown
[![overview](./output/github-profilemd-generater/nord_dark/overview.svg)](https://github.com/kwangsing3/github-profilemd-Generater)
[![lang](./output/github-profilemd-generater/nord_dark/langcompos.svg)](https://github.com/kwangsing3/github-profilemd-Generater)
[![tags](./output/github-profilemd-generater/nord_dark/tagsstat.svg)](https://github.com/kwangsing3/github-profilemd-Generater)
```

## 本地執行

```bash
npm install
npm run build                 # 以 ncc 打包到 dist/
node dist/index.js <username> <repo_name> <github_token>
```

產生結果寫入 `OUTPUT_DIR`（預設 `output/`）；本地執行不會自動 git commit。

## 開發

```bash
npm test          # 執行單元測試（node:test）
npm run build     # 打包 dist/（提交前務必重新建置）
```

- 執行環境：**Node.js 24**（GitHub Actions `node24` runtime）。
- 程式碼為 ESM；`dist/` 由 `@vercel/ncc` 打包後一併提交，CI 會驗證其與源碼同步。

## 授權

MIT
