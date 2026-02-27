<h1>Github-profilemd-Generater</h1>
<h3>
<p align="center">
<a href="/docs/README.md"> English </a>|
<a href="/docs/README_ja.md"> 日本語 </a>|
<a href="/docs/README_zh-tw.md"> 繁體中文 </a>|
<a href="/docs/README_zh-ch.md"> 简体中文 </a>
</p>
</h3>


## Info

```Github-profilemd-Generate``` is a tool works on ```Github Action```,<br/>
To generate account info on Github as a profile card or resume.
___
## Feature

- Repositories Composition
- Tags Preference
- ...
- ...
- .etc
___
## How it works ?
Fetch data from [Github GraphQL](https://docs.github.com/en/graphql) → Generate .SVG files→ Bot will commit and push on <text style = "color: yellow;">"master"</text> branch.
___
## Usage
Before use this tool, make sure you found the [SPECIAL SECRET](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) of Github.
<br/>ex. [kwangsing3/kwangsing3](https://github.com/kwangsing3/kwangsing3)
<br/><br/>
### Github Action:
1. To use [Github GraphQL](https://docs.github.com/en/graphql) a token with account access is needed, follow the guide to know about [HOW TO MAKE A TOKEN FOR YOUR PROFILE](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
2. Add the token to your profile repo secret and name it ```MY_GITHUB_TOKEN```, see [Encrypted secrets for repositories](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

3. Insert steps below in your .yml file.
```yaml
 - uses: kwangsing3/github-profilemd-Generater@release
        env: 
          GITHUB_TOKEN: ${{ secrets.MY_GITHUB_TOKEN }}
        with:
          USERNAME: ${{ github.repository_owner }}
          GITHUB_REPO_NAME: ${{ github.event.repository.name }} 
    
```
### Local Launch:
Install dependencies and build the bundle, then run with your inputs.
```bash
npm install
npx ncc build src/index.js -o dist
node dist/index.js [username] [reponame] [MY_GITHUB_TOKEN]
``` 

* [arg1]: ``` username ```
* [arg2]: ``` reponame ```
* [arg3]: ``` MY_GITHUB_TOKEN```
___
## Development
```bash
$git clone https://github.com/kwangsing3/github-profilemd.Generater
```
___
## Others

&emsp;&emsp; To keep your profile md looking good, Github-profilemd-Genearater will NOT rewrite your `README.md`, it'll provide account info as svg cards and Dynamically update to the repo ```(./output/github-profilemd-generater/) as default``` , so make sure your `README.MD` using relative PATH to the file instead of hosting links.

*** Also leave a star,  hope this tool would give you a big help some day. ***

THANK YOU :)



Theme request.
any request are welcome.
