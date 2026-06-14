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

```Github-profilemd-Generate``` 是在 ```Github Action```上运行的工具,<br/>
用来统计Github用户的资讯并生成卡片放在自介上。
___
## 特色

- Overview - 总览统计（Stars / Repos / Followers / Commits / PR / Issue）
- Repositories Composition - 语言组成（依实际程式码位元组数）
- Tags Preference - 标籤 / 主题喜好
- 可调整主题、显示数量(TOP_N)、排除语言(HIDE)、输出目录(OUTPUT_DIR)
___
## 工作原理 ?
从 [Github GraphQL](https://docs.github.com/en/graphql)上获取资料 → 绘製 .SVG 档案→ 工具会提交并推出到仓库的<text style = "color: yellow;">"release"</text>（预设）分支。执行于 GitHub Actions 的 <b>node24</b> runtime。
___
## 使用方法
在使用此工具之前, 确保你已经发现 [Github隐藏的秘密](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme).
<br/>例如 [kwangsing3/kwangsing3](https://github.com/kwangsing3/kwangsing3)
<br/><br/>
### Github Action:
1. 为了使用 [Github GraphQL](https://docs.github.com/en/graphql)，用来获取资料的Token是必须的, 点击 [如何新增金钥用以製作Profile](this) 以了解如何新增用来获得资讯的Token. 

2. 新增金钥(Token)至自介仓库的秘密(secret)裡，并取名叫做 ```MY_GITHUB_TOKEN```。 (查看详细教学[ADD SECRET TO REPO]()).

3. 插入以下的步骤至自己的.yml档案。
```yaml
permissions:
  contents: write          # 允许 bot 将卡片 commit 回仓库

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
          # 以下皆为选填
          THEME: 'all'        # 或逗号分隔，如 "nord_dark,dracula"
          TOP_N: '8'          # 语言 / 标籤显示数量
          HIDE: ''            # 排除语言，如 "HTML,CSS"
          OUTPUT_DIR: 'output'
```
> 🔒 正式环境请将 `@release` 钉选为 commit SHA，并只授予 workflow 必要的 `permissions`。

### 本地执行:
安装依赖并打包后，带入参数执行。
```bash
npm install
npm run build
node dist/index.js [arg1] [arg2] [arg3]
```

* [arg1]: ``` username ```
* [arg2]: ``` reponame ```
* [arg3]: ``` MY_GITHUB_TOKEN```
___
## 参与开发
```bash
$git clone https://github.com/kwangsing3/github-profilemd.Generater
```
___
## 其他

&emsp;&emsp; 为了保持```README.MD```美观, Github-profilemd-Genearater 不会复写你的 `README.md`, 它只负责生产统计卡片以及动态更新至程式库 ```预设情况下的位置 (./output/github-profilemd-generater/) ``` , 所以请确保你的 `README.MD` 使用相对路径来获得卡片，而不是使用另外上传的图片.

*** 请留下星星表示支持，也希望这个工具能够在某一天帮上你的忙 ***

## 感激不尽 :)