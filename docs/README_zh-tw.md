<h1>Github-profilemd-Generater</h1>
<h3>
<p align="center">
<a href="/docs/README.md"> English </a>|
<a href="/docs/README_ja.md"> 日本語 </a>|
<a href="/docs/README_zh-tw.md"> 繁體中文 </a>|
<a href="/docs/README_zh-ch.md"> 简体中文 </a>
</p>
</h3>


## 前言

```Github-profilemd-Generate``` 是在 ```Github Action```上運行的工具,<br/>
用來統計Github帳戶的資訊並製作成卡片放在自我介紹上。
___
## 功能

- Overview - 總覽統計（Stars / Repos / Followers / Commits / PR / Issue）
- Repositories Composition - 語言組成（依實際程式碼位元組數）
- Tags Preference - 標籤 / 主題喜好
- 可調整主題、顯示數量(TOP_N)、排除語言(HIDE)、輸出目錄(OUTPUT_DIR)
___
## 工作原理 ?
從 [Github GraphQL](https://docs.github.com/en/graphql)上獲取資料 → 繪製 .SVG 檔案→ 工具會提交並推出到倉庫的<text style = "color: yellow;">"release"</text>（預設）分支。執行於 GitHub Actions 的 <b>node24</b> runtime。
___
## 使用方法
在使用此工具之前, 確保你已經發現 [Github隱藏的秘密](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme).
<br/>例如 [kwangsing3/kwangsing3](https://github.com/kwangsing3/kwangsing3)
<br/><br/>
### Github Action:
1. 為了使用 [Github GraphQL](https://docs.github.com/en/graphql)，用來獲得資料的Token是必須的, 點擊 [如何新增金鑰用以製作Profile](this) 以了解如何新增用來獲得資訊的Token. 

2. 新增金鑰(Token)至自我介紹倉庫的秘密(secret)裡，並取名叫做 ```MY_GITHUB_TOKEN```。 (查看詳細教學[ADD SECRET TO REPO]()).

3. 插入以下的步驟至自己的.yml檔案。
```yaml
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
> 🔒 正式環境請將 `@release` 釘選為 commit SHA，並只授予 workflow 必要的 `permissions`。

### 本地執行:
安裝依賴並打包後，帶入參數執行。
```bash
npm install
npm run build
node dist/index.js [arg1] [arg2] [arg3]
```

* [arg1]: ``` username ```
* [arg2]: ``` reponame ```
* [arg3]: ``` MY_GITHUB_TOKEN```
___
## 參與開發
```bash
$git clone https://github.com/kwangsing3/github-profilemd.Generater
```
___
## 其他

&emsp;&emsp; 為了保持```README.MD```美觀, Github-profilemd-Genearater 不會覆寫你的 `README.md`, 它只負責生產統計卡片以及動態更新至程式庫 ```預設情況下的位置 (./output/github-profilemd-generater/) ``` , 所以請確保你的 `README.MD` 使用相對路徑來獲得卡片，而不是使用另外上傳圖片.

*** 請留下星星表示支持，也希望這個工具能夠在某一天幫上你的忙 ***

## 感激不盡 :)