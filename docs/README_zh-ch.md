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

- Repositories Composition - 库的语言统计
- Tags Preference - 关于标籤的喜好
- ...
- ...
- .etc
___
## 工作原理 ?
从 [Github GraphQL](https://docs.github.com/en/graphql)上获取资料 → 绘製 .SVG 档案→ 工具会提交并推出到仓库的<text style = "color: yellow;">"master"</text> 分支.
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
 - uses: kwangsing3/github-profilemd-Generater@release
        env: 
          GITHUB_TOKEN: ${{ secrets.MY_GITHUB_TOKEN }}
        with:
          USERNAME: ${{ github.repository_owner }}
          GITHUB_REPO_NAME: ${{ github.event.repository.name }} 
    
```
- ### 或是複製整个步骤档 [范例档案](sample) 至 ```./github/workflows/```。
### 本地执行:
执行指令时指定一些係数, 或是在.vscode 中使用 launch.json 以方便使用.
```bash
$npm run prod [arg1] [arg2] [arg3]
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