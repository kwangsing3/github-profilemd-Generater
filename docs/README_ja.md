<h1>Github-profilemd-Generater</h1>
<h3>
<p align="center">
<a href="/docs/README.md"> English </a>|
<a href="/docs/README_ja.md"> 日本語 </a>|
<a href="/docs/README_zh-tw.md"> 繁體中文 </a>|
<a href="/docs/README_zh-ch.md"> 简体中文 </a>
</p>
</h3>



## 情報

```Github-profilemd-Generate```は ```Github Action```で実行されツールです。<br/>
Githubユーザーの情報をカウントし、自己紹介用のカードを生成します。
___
## 特徴

- リポジトリ構成 - ライブラリの言語統計
- タグ設定 - タグ設定の好み
- ...
- ...
- その他
___
## 動作原理？
[Github GraphQL](https://docs.github.com/en/graphql) から情報を取得→ SVGファイルを生成→ ツールが倉庫の<text style ="color:yellow;"> "master" </text>ブランチをコミットします。
___
## 使用法
このツールを使用する前に [Github Hidden Secrets](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) を発見するこどをお確認でください，
<br/>(たとえば:[kwangsing3/kwangsing3](https://github.com/kwangsing3/kwangsing3))
<br/> <br/>
### Github Action：
1. [Github GraphQL](https://docs.github.com/en/graphql)を使用するため、データの取得と使用するトークンが必要です。[プロファイルを作成するためのキーの追加方法](this)をクリックし，トークンを追加して情報を取得する方法を学習します。

2.自己申告ウェアハウスのシークレットにトークンを追加し、「MY_GITHUB_TOKEN」という名前を付けます。 （詳細な手順[リポジトリに秘密を追加]()を表示）。

3.次のを .yml ファイルに挿入します。
```yaml
 - uses: kwangsing3/github-profilemd-Generater@release
        env: 
          GITHUB_TOKEN: ${{ secrets.MY_GITHUB_TOKEN }}
        with:
          USERNAME: ${{ github.repository_owner }}
          GITHUB_REPO_NAME: ${{ github.event.repository.name }} 
```
- ### または、ステップファイル[サンプルファイル]（サンプル）全体を ```/github/workflows/```にコピーします。

### ローカル実行：
コマンドの実行時にいくつかの係数を指定するか、便宜上.vscodeでlaunch.jsonを使用します。
```bash
$ npm run prod [arg1] [arg2] [arg3]
```

* [arg1]： ```ユーザー名```
* [arg2]： ```repo name```
* [arg3]： ```MY_GITHUB_TOKEN```
___
## 開發
```bash
$ git clone https://github.com/kwangsing3/github-profilemd.Generater
```
___
## その他

&emsp;&emsp; ```README.MD```を一貫性保つため，```Github-profilemd-Genearater```は` README.md`を上書きませずん，統計カードの作成それだけ ```(./output/github-profilemd-generater/)```。 <br/>
`README.MD`が別のアップロードされた画像を使用するのではなく，相対パスを使用してカードを取得していることを確認してください。

*** あなたのサポートを示すために星を残してください，そしてこのツールがいつかあなたを助けることをこのように祈るています ***

## ありがたい ：） 