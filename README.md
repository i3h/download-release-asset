# GitHub Action - Download Release Asset

This GitHub Action helps download release asset from a private repository with personal access token.

# Usage

```
- name: Download Release Asset
  id: download_release_asset
  uses: i3h/download-release-asset@v1
  with:
    owner: owner_of_repo
    repo: repo_name
    tag: tag_or_latest
    file: file_name
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```
