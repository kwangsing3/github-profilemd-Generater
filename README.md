# Github-profilemd-Generater

Generate GitHub profile summary cards with GitHub Actions. The action queries the GitHub GraphQL API, renders themeable SVGs, and commits them back to your repository so you can embed them in your profile README.

## What You Get
- Language composition card and tags/statistics card for each theme in `output/github-profilemd-generater/<theme>/`.
- An `output/README.md` snippet listing the generated cards you can include in your profile.
- Hands-free commits to the default branch when run inside GitHub Actions.

## Requirements
- A GitHub token (`MY_GITHUB_TOKEN`) with `read:user` and `repo` (for private data) scopes stored as a repository secret.
- Node.js 20+ if you want to run the generator locally.

## GitHub Actions Usage
```yaml
name: Generate profile cards
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * 1'
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
```
- Add the secret under **Settings → Secrets and variables → Actions** as `MY_GITHUB_TOKEN`.
- Reference the generated cards in your profile README using relative paths under `./output/github-profilemd-generater/`.

## Local Development
```bash
npm install
npx ncc build src/index.js -o dist
node dist/index.js <username> <repo> <MY_GITHUB_TOKEN>
```
- Generated assets and the snippet are written to `output/`.

## Additional Docs
- More details and translations are available in `docs/README.md` (English/Japanese/Traditional Chinese/Simplified Chinese).
